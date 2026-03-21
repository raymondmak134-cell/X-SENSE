import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  })
);

// Supabase client (service role for storage)
const supabase = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

const BUCKET_NAME = "make-69c33f4c-product-images";

// Idempotently create bucket on startup
(async () => {
  try {
    const sb = supabase();
    const { data: buckets } = await sb.storage.listBuckets();
    const bucketExists = buckets?.some(
      (bucket: any) => bucket.name === BUCKET_NAME
    );
    if (!bucketExists) {
      const { error } = await sb.storage.createBucket(BUCKET_NAME, {
        public: false,
      });
      if (error) {
        console.log(
          `Error creating storage bucket '${BUCKET_NAME}': ${error.message}`
        );
      } else {
        console.log(`Storage bucket '${BUCKET_NAME}' created successfully.`);
      }
    } else {
      console.log(`Storage bucket '${BUCKET_NAME}' already exists.`);
    }
  } catch (err) {
    console.log(`Failed to initialize storage bucket: ${err}`);
  }
})();

// Health check endpoint
app.get("/make-server-69c33f4c/health", (c) => {
  return c.json({ status: "ok", ts: Date.now() });
});

// ============ Image Upload ============

app.post("/make-server-69c33f4c/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return c.json({ error: "No file provided in form data" }, 400);
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const filePath = `products/${fileName}`;

    const sb = supabase();

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await sb.storage
      .from(BUCKET_NAME)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log(
        `Error uploading image '${fileName}': ${uploadError.message}`
      );
      return c.json(
        { error: `Failed to upload image: ${uploadError.message}` },
        500
      );
    }

    // Create signed URL (7 days)
    const { data: signedData, error: signedError } = await sb.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (signedError) {
      console.log(
        `Error creating signed URL for '${filePath}': ${signedError.message}`
      );
      return c.json(
        { error: `Failed to create signed URL: ${signedError.message}` },
        500
      );
    }

    return c.json({
      url: signedData.signedUrl,
      path: filePath,
    });
  } catch (err) {
    console.log(`Unexpected error during image upload: ${err}`);
    return c.json({ error: `Unexpected error during image upload: ${err}` }, 500);
  }
});

// Refresh signed URL for a stored image path
app.post("/make-server-69c33f4c/refresh-image-url", async (c) => {
  try {
    const { path: filePath } = await c.req.json();
    if (!filePath) {
      return c.json({ error: "No path provided" }, 400);
    }

    const sb = supabase();
    const { data, error } = await sb.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60 * 24 * 7);

    if (error) {
      console.log(
        `Error refreshing signed URL for '${filePath}': ${error.message}`
      );
      return c.json(
        { error: `Failed to refresh signed URL: ${error.message}` },
        500
      );
    }

    return c.json({ url: data.signedUrl });
  } catch (err) {
    console.log(`Unexpected error refreshing image URL: ${err}`);
    return c.json({ error: `Unexpected error: ${err}` }, 500);
  }
});

// Delete an image from storage
app.post("/make-server-69c33f4c/delete-image", async (c) => {
  try {
    const { path: filePath } = await c.req.json();
    if (!filePath) {
      return c.json({ error: "No path provided" }, 400);
    }

    const sb = supabase();
    const { error } = await sb.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      console.log(
        `Error deleting image '${filePath}': ${error.message}`
      );
      return c.json(
        { error: `Failed to delete image: ${error.message}` },
        500
      );
    }

    return c.json({ success: true });
  } catch (err) {
    console.log(`Unexpected error deleting image: ${err}`);
    return c.json({ error: `Unexpected error: ${err}` }, 500);
  }
});

// ============ Batch Signed URL Refresh Helper ============

/**
 * Collect all storage paths from an array of items, batch-refresh signed URLs,
 * and return items with fresh URLs. Each field mapping is { urlField, pathField }.
 */
async function refreshSignedUrls<T extends Record<string, any>>(
  items: T[],
  fieldMappings: { urlField: string; pathField: string }[],
  optionsField?: string // optional: field name for SkuOption[] arrays (each has imageUrl/imagePath)
): Promise<T[]> {
  if (!items || items.length === 0) return items;

  const sb = supabase();
  // Collect all paths that need refreshing
  const entries: { itemIdx: number; urlField: string; optIdx?: number; path: string }[] = [];

  items.forEach((item, i) => {
    // Top-level fields
    for (const { urlField, pathField } of fieldMappings) {
      if (item[pathField]) {
        entries.push({ itemIdx: i, urlField, path: item[pathField] });
      }
    }
    // Nested options array (for products)
    if (optionsField && Array.isArray(item[optionsField])) {
      (item[optionsField] as any[]).forEach((opt: any, j: number) => {
        if (opt.imagePath) {
          entries.push({ itemIdx: i, urlField: "imageUrl", optIdx: j, path: opt.imagePath });
        }
      });
    }
  });

  if (entries.length === 0) return items;

  try {
    const paths = entries.map((e) => e.path);
    const { data, error } = await sb.storage
      .from(BUCKET_NAME)
      .createSignedUrls(paths, 60 * 60 * 24 * 7);

    if (error || !data) {
      console.log(`Error batch refreshing signed URLs: ${error?.message}`);
      return items;
    }

    // Deep-clone items and apply fresh URLs
    const result = items.map((item) => ({ ...item }));
    data.forEach((signed: any, idx: number) => {
      const entry = entries[idx];
      if (!signed.signedUrl) return;
      if (entry.optIdx !== undefined) {
        // Nested option image
        const item = result[entry.itemIdx];
        if (!Array.isArray(item[optionsField!])) return;
        item[optionsField!] = [...item[optionsField!]];
        item[optionsField!][entry.optIdx] = {
          ...item[optionsField!][entry.optIdx],
          imageUrl: signed.signedUrl,
        };
      } else {
        // Top-level field
        result[entry.itemIdx][entry.urlField] = signed.signedUrl;
      }
    });

    return result;
  } catch (err) {
    console.log(`Unexpected error in batch URL refresh: ${err}`);
    return items;
  }
}

/**
 * Refresh signed URLs for nested SPU fields:
 *  - setupInstallation.installationVideoCoverImage
 *  - setupInstallation.quickStartGuideImages[]
 *  - manuals[].coverImage
 */
async function refreshSpuNestedUrls(spus: any[]): Promise<any[]> {
  if (!spus || spus.length === 0) return spus;

  const sb = supabase();
  const pathList: string[] = [];
  const appliers: Array<(signedUrl: string) => void> = [];

  spus.forEach((spu) => {
    const cover = spu.setupInstallation?.installationVideoCoverImage;
    if (cover?.path) {
      pathList.push(cover.path);
      appliers.push((url) => { spu.setupInstallation.installationVideoCoverImage = { ...cover, url }; });
    }
    const guides = spu.setupInstallation?.quickStartGuideImages;
    if (Array.isArray(guides)) {
      guides.forEach((img: any, j: number) => {
        if (img.path) {
          pathList.push(img.path);
          appliers.push((url) => { guides[j] = { ...img, url }; });
        }
      });
    }
    const manuals = spu.manuals;
    if (Array.isArray(manuals)) {
      manuals.forEach((m: any, j: number) => {
        if (m.coverImage?.path) {
          pathList.push(m.coverImage.path);
          appliers.push((url) => { manuals[j] = { ...m, coverImage: { ...m.coverImage, url } }; });
        }
      });
    }
  });

  if (pathList.length === 0) return spus;

  try {
    const { data, error } = await sb.storage
      .from(BUCKET_NAME)
      .createSignedUrls(pathList, 60 * 60 * 24 * 7);
    if (error || !data) return spus;
    data.forEach((signed: any, idx: number) => {
      if (signed?.signedUrl) appliers[idx](signed.signedUrl);
    });
  } catch (err) {
    console.log(`Error refreshing SPU nested URLs: ${err}`);
  }
  return spus;
}

// ============ Products CRUD ============

const PRODUCTS_PREFIX = "product:";

// GET all products
app.get("/make-server-69c33f4c/products", async (c) => {
  try {
    const products = await kv.getByPrefix(PRODUCTS_PREFIX);
    const refreshed = await refreshSignedUrls(
      products || [],
      [{ urlField: "imageUrl", pathField: "imagePath" }],
      "options"
    );
    return c.json({ products: refreshed });
  } catch (err) {
    console.log(`Error fetching products: ${err}`);
    return c.json({ error: `Error fetching products: ${err}` }, 500);
  }
});

// POST create/update a product
app.post("/make-server-69c33f4c/products", async (c) => {
  try {
    const product = await c.req.json();
    if (!product.id) {
      product.id = Date.now().toString();
    }
    await kv.set(`${PRODUCTS_PREFIX}${product.id}`, product);
    return c.json({ product });
  } catch (err) {
    console.log(`Error saving product: ${err}`);
    return c.json({ error: `Error saving product: ${err}` }, 500);
  }
});

// POST bulk-clear old free-text features from all products
// Keeps only predefined feature labels
app.post("/make-server-69c33f4c/products/clear-features", async (c) => {
  try {
    const VALID_FEATURES = [
      "Voice Alarm with Location",
      "Easy Magnetic Mount",
      "10-Year Battery (NEVER-CHANGE)",
      "Replaceable Battery (Included)",
      "HARDWIRED+9V Battery Backup",
      "Plug-In",
    ];
    const products = await kv.getByPrefix(PRODUCTS_PREFIX);
    let updated = 0;
    for (const product of (products || [])) {
      const oldFeatures = product.features || [];
      const newFeatures = oldFeatures.filter((f: string) => VALID_FEATURES.includes(f));
      // Only update if something changed
      if (oldFeatures.length !== newFeatures.length) {
        product.features = newFeatures;
        await kv.set(`${PRODUCTS_PREFIX}${product.id}`, product);
        updated++;
      }
    }
    return c.json({ success: true, updated, total: (products || []).length });
  } catch (err) {
    console.log(`Error clearing product features: ${err}`);
    return c.json({ error: `Error clearing product features: ${err}` }, 500);
  }
});

// DELETE a product
app.delete("/make-server-69c33f4c/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // Get product first to clean up image
    const product = await kv.get(`${PRODUCTS_PREFIX}${id}`);
    if (product?.imagePath) {
      try {
        const sb = supabase();
        await sb.storage.from(BUCKET_NAME).remove([product.imagePath]);
      } catch (imgErr) {
        console.log(`Warning: failed to delete image for product ${id}: ${imgErr}`);
      }
    }
    await kv.del(`${PRODUCTS_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error deleting product ${c.req.param("id")}: ${err}`);
    return c.json({ error: `Error deleting product: ${err}` }, 500);
  }
});

// ============ SPU CRUD ============

const SPU_PREFIX = "spu:";

// GET all SPUs
app.get("/make-server-69c33f4c/spus", async (c) => {
  try {
    const spus = await kv.getByPrefix(SPU_PREFIX);
    const refreshed = await refreshSignedUrls(
      spus || [],
      [{ urlField: "imageUrl", pathField: "imagePath" }]
    );
    const final = await refreshSpuNestedUrls(refreshed);
    return c.json({ spus: final });
  } catch (err) {
    console.log(`Error fetching SPUs: ${err}`);
    return c.json({ error: `Error fetching SPUs: ${err}` }, 500);
  }
});

// GET single SPU by ID
app.get("/make-server-69c33f4c/spus/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const spu = await kv.get(`${SPU_PREFIX}${id}`);
    if (!spu) {
      return c.json({ error: `SPU not found: ${id}` }, 404);
    }
    const refreshed = await refreshSignedUrls(
      [spu],
      [{ urlField: "imageUrl", pathField: "imagePath" }]
    );
    const final = await refreshSpuNestedUrls(refreshed);
    return c.json({ spu: final[0] });
  } catch (err) {
    console.log(`Error fetching SPU by id: ${err}`);
    return c.json({ error: `Error fetching SPU: ${err}` }, 500);
  }
});

// POST create/update an SPU
app.post("/make-server-69c33f4c/spus", async (c) => {
  try {
    const spu = await c.req.json();
    if (!spu.id) {
      spu.id = Date.now().toString();
    }
    await kv.set(`${SPU_PREFIX}${spu.id}`, spu);
    return c.json({ spu });
  } catch (err) {
    console.log(`Error saving SPU: ${err}`);
    return c.json({ error: `Error saving SPU: ${err}` }, 500);
  }
});

// DELETE an SPU
app.delete("/make-server-69c33f4c/spus/:id", async (c) => {
  try {
    const id = c.req.param("id");
    // Get SPU first to clean up image
    const spu = await kv.get(`${SPU_PREFIX}${id}`);
    if (spu?.imagePath) {
      try {
        const sb = supabase();
        await sb.storage.from(BUCKET_NAME).remove([spu.imagePath]);
      } catch (imgErr) {
        console.log(`Warning: failed to delete image for SPU ${id}: ${imgErr}`);
      }
    }
    await kv.del(`${SPU_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error deleting SPU ${c.req.param("id")}: ${err}`);
    return c.json({ error: `Error deleting SPU: ${err}` }, 500);
  }
});

// ============ Categories CRUD ============

const CATEGORY_PREFIX = "category:";

const DEFAULT_CATEGORIES = [
  { id: "smoke-alarms", name: "Smoke Alarms", slug: "smoke-alarms", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 0 },
  { id: "co-alarms", name: "CO Alarms", slug: "co-alarms", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 1 },
  { id: "combination-alarms", name: "Combination Alarms", slug: "combination-alarms", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 2 },
  { id: "home-alarms", name: "Home Alarms", slug: "home-alarms", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 3 },
  { id: "hub-base-station", name: "Hub / Base Station", slug: "hub-base-station", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 4 },
  { id: "accessories", name: "Accessories", slug: "accessories", coverImageUrl: "", coverImagePath: "", description: "", bannerPcUrl: "", bannerPcPath: "", bannerMobileUrl: "", bannerMobilePath: "", order: 5 },
];

// Seed default categories on startup
(async () => {
  try {
    const existing = await kv.getByPrefix(CATEGORY_PREFIX);
    if (!existing || existing.length === 0) {
      for (const cat of DEFAULT_CATEGORIES) {
        await kv.set(`${CATEGORY_PREFIX}${cat.id}`, cat);
      }
      console.log("Default categories seeded successfully.");
    } else {
      console.log(`Categories already exist (${existing.length} found).`);
    }
  } catch (err) {
    console.log(`Failed to seed categories: ${err}`);
  }
})();

// GET all categories
app.get("/make-server-69c33f4c/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix(CATEGORY_PREFIX);
    const sorted = (categories || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    const refreshed = await refreshSignedUrls(
      sorted,
      [
        { urlField: "coverImageUrl", pathField: "coverImagePath" },
        { urlField: "bannerPcUrl", pathField: "bannerPcPath" },
        { urlField: "bannerMobileUrl", pathField: "bannerMobilePath" },
      ]
    );
    return c.json({ categories: refreshed });
  } catch (err) {
    console.log(`Error fetching categories: ${err}`);
    return c.json({ error: `Error fetching categories: ${err}` }, 500);
  }
});

// POST create/update a category
app.post("/make-server-69c33f4c/categories", async (c) => {
  try {
    const category = await c.req.json();
    if (!category.id) {
      return c.json({ error: "Category id is required" }, 400);
    }
    await kv.set(`${CATEGORY_PREFIX}${category.id}`, category);
    return c.json({ category });
  } catch (err) {
    console.log(`Error saving category: ${err}`);
    return c.json({ error: `Error saving category: ${err}` }, 500);
  }
});

// DELETE a category
app.delete("/make-server-69c33f4c/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const category = await kv.get(`${CATEGORY_PREFIX}${id}`);
    // Clean up all associated images
    const pathsToDelete = [category?.coverImagePath, category?.bannerPcPath, category?.bannerMobilePath].filter(Boolean);
    if (pathsToDelete.length > 0) {
      try {
        const sb = supabase();
        await sb.storage.from(BUCKET_NAME).remove(pathsToDelete);
      } catch (imgErr) {
        console.log(`Warning: failed to delete images for category ${id}: ${imgErr}`);
      }
    }
    await kv.del(`${CATEGORY_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error deleting category ${c.req.param("id")}: ${err}`);
    return c.json({ error: `Error deleting category: ${err}` }, 500);
  }
});

// ──── Support Config ────

const SUPPORT_PREFIX = "support:";

app.get("/make-server-69c33f4c/support/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const data = await kv.get(`${SUPPORT_PREFIX}${key}`);
    if (!data) return c.json({ data: null });
    if (data.iconPath) {
      const refreshed = await refreshSignedUrls(
        [data],
        [{ urlField: "iconUrl", pathField: "iconPath" }]
      );
      return c.json({ data: refreshed[0] });
    }
    return c.json({ data });
  } catch (err) {
    console.log(`Error fetching support config ${c.req.param("key")}: ${err}`);
    return c.json({ error: `Error fetching support config: ${err}` }, 500);
  }
});

app.post("/make-server-69c33f4c/support/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const data = await c.req.json();
    await kv.set(`${SUPPORT_PREFIX}${key}`, data);
    return c.json({ data });
  } catch (err) {
    console.log(`Error saving support config ${c.req.param("key")}: ${err}`);
    return c.json({ error: `Error saving support config: ${err}` }, 500);
  }
});

// ──── FAQs CRUD (per category) ────

const FAQ_PREFIX = "faq:";

app.get("/make-server-69c33f4c/faqs/:categoryId", async (c) => {
  try {
    const categoryId = c.req.param("categoryId");
    const data = await kv.get(`${FAQ_PREFIX}${categoryId}`);
    if (!data || !data.items || data.items.length === 0) {
      return c.json({ data: { items: [] } });
    }
    const sb = supabase();
    const entries: { idx: number; path: string }[] = [];
    data.items.forEach((item: any, i: number) => {
      if (item.answerImagePath) {
        entries.push({ idx: i, path: item.answerImagePath });
      }
    });
    if (entries.length > 0) {
      const paths = entries.map((e) => e.path);
      const { data: signed, error } = await sb.storage
        .from(BUCKET_NAME)
        .createSignedUrls(paths, 60 * 60 * 24 * 7);
      if (!error && signed) {
        signed.forEach((s: any, j: number) => {
          if (s.signedUrl) {
            data.items[entries[j].idx].answerImageUrl = s.signedUrl;
          }
        });
      }
    }
    return c.json({ data });
  } catch (err) {
    console.log(`Error fetching FAQs for ${c.req.param("categoryId")}: ${err}`);
    return c.json({ error: `Error fetching FAQs: ${err}` }, 500);
  }
});

app.post("/make-server-69c33f4c/faqs/:categoryId", async (c) => {
  try {
    const categoryId = c.req.param("categoryId");
    const data = await c.req.json();
    await kv.set(`${FAQ_PREFIX}${categoryId}`, data);
    return c.json({ data });
  } catch (err) {
    console.log(`Error saving FAQs for ${c.req.param("categoryId")}: ${err}`);
    return c.json({ error: `Error saving FAQs: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);