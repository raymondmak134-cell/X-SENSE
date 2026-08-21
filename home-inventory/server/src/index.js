import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { db } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 3001);
const ACCESS_TOKEN = process.env.ACCESS_TOKEN || "";

app.use(cors());
app.use(express.json());

function requireAuth(req, res, next) {
  if (!ACCESS_TOKEN) return next();
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: "未授权，请先登录" });
  }
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "home-inventory" });
});

app.post("/api/auth/login", (req, res) => {
  const token = String(req.body?.token || "");
  if (!ACCESS_TOKEN) {
    return res.json({ ok: true, token: "open" });
  }
  if (token !== ACCESS_TOKEN) {
    return res.status(401).json({ error: "访问口令不正确" });
  }
  return res.json({ ok: true, token: ACCESS_TOKEN });
});

app.use("/api", requireAuth);

const itemSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(40).default("其他"),
  unit: z.string().trim().min(1).max(20).default("个"),
  location: z.string().trim().max(80).default(""),
  min_stock: z.coerce.number().min(0).default(0),
  note: z.string().trim().max(200).default(""),
});

const movementSchema = z.object({
  item_id: z.coerce.number().int().positive(),
  type: z.enum(["in", "out"]),
  quantity: z.coerce.number().positive(),
  operator: z.string().trim().min(1).max(40).default("家庭成员"),
  reason: z.string().trim().max(120).default(""),
});

app.get("/api/items", (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  const lowOnly = String(req.query.lowOnly || "") === "1";

  let sql = "SELECT * FROM items WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (name LIKE ? OR location LIKE ? OR note LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (lowOnly) {
    sql += " AND stock <= min_stock";
  }

  sql += " ORDER BY updated_at DESC, id DESC";
  const rows = db.prepare(sql).all(...params);
  res.json(rows);
});

app.get("/api/categories", (_req, res) => {
  const rows = db
    .prepare(
      "SELECT category, COUNT(*) AS count FROM items GROUP BY category ORDER BY count DESC, category ASC",
    )
    .all();
  res.json(rows);
});

app.post("/api/items", (req, res) => {
  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const data = parsed.data;
  const result = db
    .prepare(
      `INSERT INTO items (name, category, unit, location, min_stock, note)
       VALUES (@name, @category, @unit, @location, @min_stock, @note)`,
    )
    .run(data);

  const item = db
    .prepare("SELECT * FROM items WHERE id = ?")
    .get(result.lastInsertRowid);
  return res.status(201).json(item);
});

app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "物品不存在" });

  const parsed = itemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const data = { ...parsed.data, id };
  db.prepare(
    `UPDATE items
     SET name = @name,
         category = @category,
         unit = @unit,
         location = @location,
         min_stock = @min_stock,
         note = @note,
         updated_at = datetime('now', 'localtime')
     WHERE id = @id`,
  ).run(data);

  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(id);
  return res.json(item);
});

app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const result = db.prepare("DELETE FROM items WHERE id = ?").run(id);
  if (result.changes === 0) return res.status(404).json({ error: "物品不存在" });
  return res.json({ ok: true });
});

app.post("/api/movements", (req, res) => {
  const parsed = movementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const data = parsed.data;
  const item = db.prepare("SELECT * FROM items WHERE id = ?").get(data.item_id);
  if (!item) return res.status(404).json({ error: "物品不存在" });

  if (data.type === "out" && item.stock < data.quantity) {
    return res.status(400).json({
      error: `库存不足：当前 ${item.stock}${item.unit}，无法出库 ${data.quantity}${item.unit}`,
    });
  }

  const apply = db.transaction(() => {
    db.prepare(
      `INSERT INTO movements (item_id, type, quantity, operator, reason)
       VALUES (@item_id, @type, @quantity, @operator, @reason)`,
    ).run(data);

    const delta = data.type === "in" ? data.quantity : -data.quantity;
    db.prepare(
      `UPDATE items
       SET stock = stock + ?,
           updated_at = datetime('now', 'localtime')
       WHERE id = ?`,
    ).run(delta, data.item_id);

    return db
      .prepare(
        `SELECT m.*, i.name AS item_name, i.unit
         FROM movements m
         JOIN items i ON i.id = m.item_id
         WHERE m.id = last_insert_rowid()`,
      )
      .get();
  });

  return res.status(201).json(apply());
});

app.get("/api/movements", (req, res) => {
  const type = String(req.query.type || "").trim();
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const itemId = Number(req.query.item_id || 0);

  let sql = `
    SELECT m.*, i.name AS item_name, i.unit, i.category
    FROM movements m
    JOIN items i ON i.id = m.item_id
    WHERE 1=1
  `;
  const params = [];

  if (type === "in" || type === "out") {
    sql += " AND m.type = ?";
    params.push(type);
  }
  if (itemId > 0) {
    sql += " AND m.item_id = ?";
    params.push(itemId);
  }

  sql += " ORDER BY m.created_at DESC, m.id DESC LIMIT ?";
  params.push(limit);

  res.json(db.prepare(sql).all(...params));
});

app.get("/api/stats", (_req, res) => {
  const summary = db
    .prepare(
      `SELECT
         COUNT(*) AS item_count,
         COALESCE(SUM(stock), 0) AS total_stock,
         SUM(CASE WHEN stock <= min_stock THEN 1 ELSE 0 END) AS low_stock_count
       FROM items`,
    )
    .get();

  const today = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END), 0) AS in_qty,
         COALESCE(SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END), 0) AS out_qty,
         SUM(CASE WHEN type = 'in' THEN 1 ELSE 0 END) AS in_count,
         SUM(CASE WHEN type = 'out' THEN 1 ELSE 0 END) AS out_count
       FROM movements
       WHERE date(created_at) = date('now', 'localtime')`,
    )
    .get();

  const week = db
    .prepare(
      `SELECT
         date(created_at) AS day,
         SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) AS in_qty,
         SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) AS out_qty
       FROM movements
       WHERE date(created_at) >= date('now', 'localtime', '-6 day')
       GROUP BY date(created_at)
       ORDER BY day ASC`,
    )
    .all();

  const byCategory = db
    .prepare(
      `SELECT category, COUNT(*) AS item_count, COALESCE(SUM(stock), 0) AS stock
       FROM items
       GROUP BY category
       ORDER BY stock DESC`,
    )
    .all();

  const lowStock = db
    .prepare(
      `SELECT id, name, category, unit, location, stock, min_stock
       FROM items
       WHERE stock <= min_stock
       ORDER BY (stock - min_stock) ASC, name ASC
       LIMIT 10`,
    )
    .all();

  res.json({ summary, today, week, byCategory, lowStock });
});

const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) next();
  });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "服务器错误" });
});

app.listen(PORT, () => {
  console.log(`Home Inventory API listening on http://0.0.0.0:${PORT}`);
});
