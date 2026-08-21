import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "inventory.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '其他',
    unit TEXT NOT NULL DEFAULT '个',
    location TEXT NOT NULL DEFAULT '',
    min_stock REAL NOT NULL DEFAULT 0,
    stock REAL NOT NULL DEFAULT 0,
    note TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS movements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('in', 'out')),
    quantity REAL NOT NULL CHECK (quantity > 0),
    operator TEXT NOT NULL DEFAULT '家庭成员',
    reason TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_movements_item ON movements(item_id);
  CREATE INDEX IF NOT EXISTS idx_movements_created ON movements(created_at);
  CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
`);

const count = db.prepare("SELECT COUNT(*) AS c FROM items").get().c;
if (count === 0) {
  const insertItem = db.prepare(`
    INSERT INTO items (name, category, unit, location, min_stock, stock, note)
    VALUES (@name, @category, @unit, @location, @min_stock, @stock, @note)
  `);
  const insertMove = db.prepare(`
    INSERT INTO movements (item_id, type, quantity, operator, reason)
    VALUES (@item_id, @type, @quantity, @operator, @reason)
  `);

  const seed = db.transaction(() => {
    const samples = [
      {
        name: "抽纸",
        category: "日用品",
        unit: "提",
        location: "客厅储物柜",
        min_stock: 2,
        stock: 5,
        note: "满减活动常备",
      },
      {
        name: "洗衣液",
        category: "日用品",
        unit: "瓶",
        location: "阳台",
        min_stock: 1,
        stock: 2,
        note: "",
      },
      {
        name: "大米",
        category: "食品",
        unit: "袋",
        location: "厨房",
        min_stock: 1,
        stock: 3,
        note: "5kg/袋",
      },
      {
        name: "创可贴",
        category: "药品",
        unit: "盒",
        location: "药箱",
        min_stock: 1,
        stock: 1,
        note: "",
      },
      {
        name: "AA电池",
        category: "电子",
        unit: "节",
        location: "抽屉",
        min_stock: 4,
        stock: 8,
        note: "",
      },
    ];

    for (const row of samples) {
      const result = insertItem.run(row);
      insertMove.run({
        item_id: result.lastInsertRowid,
        type: "in",
        quantity: row.stock,
        operator: "系统",
        reason: "初始库存",
      });
    }
  });

  seed();
}
