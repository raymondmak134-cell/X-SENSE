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

function getPublicUrl(filePath: string): string {
  return `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`;
}

// Idempotently create/update bucket on startup (public so URLs never expire)
(async () => {
  try {
    const sb = supabase();
    const { data: buckets } = await sb.storage.listBuckets();
    const existing = buckets?.find(
      (bucket: any) => bucket.name === BUCKET_NAME
    );
    if (!existing) {
      const { error } = await sb.storage.createBucket(BUCKET_NAME, {
        public: true,
      });
      if (error) {
        console.log(
          `Error creating storage bucket '${BUCKET_NAME}': ${error.message}`
        );
      } else {
        console.log(`Storage bucket '${BUCKET_NAME}' created successfully (public).`);
      }
    } else if (!existing.public) {
      const { error } = await sb.storage.updateBucket(BUCKET_NAME, {
        public: true,
      });
      if (error) {
        console.log(`Error updating bucket to public: ${error.message}`);
      } else {
        console.log(`Storage bucket '${BUCKET_NAME}' updated to public.`);
      }
    } else {
      console.log(`Storage bucket '${BUCKET_NAME}' already exists (public).`);
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

    return c.json({
      url: getPublicUrl(filePath),
      path: filePath,
    });
  } catch (err) {
    console.log(`Unexpected error during image upload: ${err}`);
    return c.json({ error: `Unexpected error during image upload: ${err}` }, 500);
  }
});

// Refresh URL for a stored image path (returns public URL)
app.post("/make-server-69c33f4c/refresh-image-url", async (c) => {
  try {
    const { path: filePath } = await c.req.json();
    if (!filePath) {
      return c.json({ error: "No path provided" }, 400);
    }
    return c.json({ url: getPublicUrl(filePath) });
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

// ============ Public URL Refresh Helper ============

/**
 * Replace URL fields with stable public URLs derived from stored paths.
 * No API call needed — public URLs are deterministic and never expire.
 */
function refreshPublicUrls<T extends Record<string, any>>(
  items: T[],
  fieldMappings: { urlField: string; pathField: string }[],
  optionsConfig?: {
    field: string;
    fieldMappings: { urlField: string; pathField: string }[];
  }
): T[] {
  if (!items || items.length === 0) return items;

  return items.map((item) => {
    const clone: any = { ...item };

    for (const { urlField, pathField } of fieldMappings) {
      if (clone[pathField]) {
        clone[urlField] = getPublicUrl(clone[pathField]);
      }
    }

    if (optionsConfig && Array.isArray(clone[optionsConfig.field])) {
      clone[optionsConfig.field] = clone[optionsConfig.field].map((opt: any) => {
        const optClone = { ...opt };
        for (const { urlField, pathField } of optionsConfig.fieldMappings) {
          if (optClone[pathField]) {
            optClone[urlField] = getPublicUrl(optClone[pathField]);
          }
        }
        return optClone;
      });
    }

    return clone as T;
  });
}

/**
 * Refresh public URLs for nested SPU fields:
 *  - setupInstallation.installationVideoCoverImage
 *  - setupInstallation.quickStartGuideImages[]
 *  - manuals[].coverImage
 */
function refreshSpuNestedUrls(spus: any[]): any[] {
  if (!spus || spus.length === 0) return spus;

  return spus.map((spu) => {
    const clone = { ...spu };

    if (clone.setupInstallation) {
      clone.setupInstallation = { ...clone.setupInstallation };

      const cover = clone.setupInstallation.installationVideoCoverImage;
      if (cover?.path) {
        clone.setupInstallation.installationVideoCoverImage = { ...cover, url: getPublicUrl(cover.path) };
      }

      if (Array.isArray(clone.setupInstallation.quickStartGuideImages)) {
        clone.setupInstallation.quickStartGuideImages = clone.setupInstallation.quickStartGuideImages.map(
          (img: any) => img.path ? { ...img, url: getPublicUrl(img.path) } : img
        );
      }
    }

    if (Array.isArray(clone.manuals)) {
      clone.manuals = clone.manuals.map((m: any) =>
        m.coverImage?.path
          ? { ...m, coverImage: { ...m.coverImage, url: getPublicUrl(m.coverImage.path) } }
          : m
      );
    }

    return clone;
  });
}

// ============ Products CRUD ============

const PRODUCTS_PREFIX = "product:";

// GET all products
app.get("/make-server-69c33f4c/products", async (c) => {
  try {
    const products = await kv.getByPrefix(PRODUCTS_PREFIX);
    const refreshed = refreshPublicUrls(
      products || [],
      [
        { urlField: "imageUrl", pathField: "imagePath" },
        { urlField: "imageUrlV2", pathField: "imagePathV2" },
      ],
      {
        field: "options",
        fieldMappings: [
          { urlField: "imageUrl", pathField: "imagePath" },
          { urlField: "hoverImageUrl", pathField: "hoverImagePath" },
          { urlField: "hoverImageUrlV2", pathField: "hoverImagePathV2" },
        ],
      }
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
    const refreshed = refreshPublicUrls(
      spus || [],
      [{ urlField: "imageUrl", pathField: "imagePath" }]
    );
    const final = refreshSpuNestedUrls(refreshed);
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
    const refreshed = refreshPublicUrls(
      [spu],
      [{ urlField: "imageUrl", pathField: "imagePath" }]
    );
    const final = refreshSpuNestedUrls(refreshed);
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
    const refreshed = refreshPublicUrls(
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

// ──── Product Cards ────

const PRODUCT_CARD_PREFIX = "product-card:";

app.get("/make-server-69c33f4c/product-cards", async (c) => {
  try {
    const cards = await kv.getByPrefix(PRODUCT_CARD_PREFIX);
    const refreshed = refreshPublicUrls(
      cards || [],
      [{ urlField: "coverImageUrl", pathField: "coverImagePath" }]
    );
    return c.json({ productCards: refreshed });
  } catch (err) {
    console.log(`Error fetching product cards: ${err}`);
    return c.json({ error: `Error fetching product cards: ${err}` }, 500);
  }
});

app.post("/make-server-69c33f4c/product-cards", async (c) => {
  try {
    const card = await c.req.json();
    if (!card.id) {
      return c.json({ error: "Product card id is required" }, 400);
    }
    await kv.set(`${PRODUCT_CARD_PREFIX}${card.id}`, card);
    return c.json({ productCard: card });
  } catch (err) {
    console.log(`Error saving product card: ${err}`);
    return c.json({ error: `Error saving product card: ${err}` }, 500);
  }
});

app.delete("/make-server-69c33f4c/product-cards/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const card = await kv.get(`${PRODUCT_CARD_PREFIX}${id}`);
    if (card?.coverImagePath) {
      try {
        const sb = supabase();
        await sb.storage.from(BUCKET_NAME).remove([card.coverImagePath]);
      } catch (imgErr) {
        console.log(`Warning: failed to delete cover image for product card ${id}: ${imgErr}`);
      }
    }
    await kv.del(`${PRODUCT_CARD_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error deleting product card ${c.req.param("id")}: ${err}`);
    return c.json({ error: `Error deleting product card: ${err}` }, 500);
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
      const refreshed = refreshPublicUrls(
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
    data.items = data.items.map((item: any) => {
      if (item.answerImagePath) {
        return { ...item, answerImageUrl: getPublicUrl(item.answerImagePath) };
      }
      return item;
    });
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

// ──── Shopping Guides CRUD ────

const GUIDE_PREFIX = "guide:";

app.get("/make-server-69c33f4c/guides", async (c) => {
  try {
    const guides = await kv.getByPrefix(GUIDE_PREFIX);
    const refreshed = refreshPublicUrls(
      guides || [],
      [{ urlField: "coverImageUrl", pathField: "coverImagePath" }]
    );
    return c.json({ guides: refreshed });
  } catch (err) {
    console.log(`Error fetching guides: ${err}`);
    return c.json({ error: `Error fetching guides: ${err}` }, 500);
  }
});

app.post("/make-server-69c33f4c/guides", async (c) => {
  try {
    const guide = await c.req.json();
    if (!guide.id) {
      guide.id = Date.now().toString();
    }
    await kv.set(`${GUIDE_PREFIX}${guide.id}`, guide);
    return c.json({ guide });
  } catch (err) {
    console.log(`Error saving guide: ${err}`);
    return c.json({ error: `Error saving guide: ${err}` }, 500);
  }
});

app.delete("/make-server-69c33f4c/guides/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const guide = await kv.get(`${GUIDE_PREFIX}${id}`);
    if (guide?.coverImagePath) {
      try {
        const sb = supabase();
        await sb.storage.from(BUCKET_NAME).remove([guide.coverImagePath]);
      } catch (imgErr) {
        console.log(`Warning: failed to delete cover image for guide ${id}: ${imgErr}`);
      }
    }
    await kv.del(`${GUIDE_PREFIX}${id}`);
    return c.json({ success: true });
  } catch (err) {
    console.log(`Error deleting guide ${c.req.param("id")}: ${err}`);
    return c.json({ error: `Error deleting guide: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);