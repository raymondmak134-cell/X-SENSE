import { useState, useEffect, useCallback } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

export interface SkuOption {
  name: string;
  price: string;
  imageUrl: string;
  imagePath: string;
  hoverImageUrl: string;
  hoverImagePath: string;
  hoverImageUrlV2: string;
  hoverImagePathV2: string;
  packEnabled: boolean;
  packQty: string;
  discountEnabled: boolean;
  discountPercent: string;
  includeBaseStation: boolean;
  outOfStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  imagePath: string;
  imageUrlV2: string;
  imagePathV2: string;
  features: string[];
  options: SkuOption[];
  price: string;
  isHot: boolean;
  powerSource: string[];
  connectivity: string[];
  productFeatures: string[];
  spuId?: string;
  categoryId?: string;
}

/** Normalize legacy products where options was string[] */
export function normalizeProduct(raw: any): Product {
  const p = { ...raw };
  if (Array.isArray(p.options) && p.options.length > 0 && typeof p.options[0] === "string") {
    p.options = (p.options as string[]).map((name: string) => ({
      name,
      price: "",
      imageUrl: "",
      imagePath: "",
      hoverImageUrl: "",
      hoverImagePath: "",
      hoverImageUrlV2: "",
      hoverImagePathV2: "",
      packEnabled: false,
      packQty: "",
      discountEnabled: false,
      discountPercent: "",
      includeBaseStation: false,
      outOfStock: false,
    }));
  } else if (Array.isArray(p.options)) {
    // Ensure existing object SKUs have hover fields
    p.options = p.options.map((o: any) => ({
      hoverImageUrl: "",
      hoverImagePath: "",
      hoverImageUrlV2: "",
      hoverImagePathV2: "",
      packEnabled: false,
      packQty: "",
      discountEnabled: false,
      discountPercent: "",
      includeBaseStation: false,
      outOfStock: false,
      ...o,
    }));
  }
  return p as Product;
}

export interface CheckboxStates {
  battery10Year: boolean;
  batteryReplaceable: boolean;
  batteryACPlugIn: boolean;
  baseStation: boolean;
  wirelessInterconnected: boolean;
  wifi: boolean;
  standalone: boolean;
  waterLeak: boolean;
  heatAlarm: boolean;
  thermometerHygrometer: boolean;
  voiceAlarm: boolean;
  nightMode: boolean;
  magneticMount: boolean;
}

export const defaultCheckboxStates: CheckboxStates = {
  battery10Year: false,
  batteryReplaceable: false,
  batteryACPlugIn: false,
  baseStation: false,
  wirelessInterconnected: false,
  wifi: false,
  standalone: false,
  waterLeak: false,
  heatAlarm: false,
  thermometerHygrometer: false,
  voiceAlarm: false,
  nightMode: false,
  magneticMount: false,
};

// Maps checkbox state keys to the label strings used in product data
const POWER_SOURCE_MAP: Record<string, string> = {
  battery10Year: "10-Year Sealed Lithium Battery",
  batteryReplaceable: "Replaceable Battery (Included)",
  batteryACPlugIn: "AC Plug-in + Replaceable Battery Backup",
};

const CONNECTIVITY_MAP: Record<string, string> = {
  baseStation: "Base Station Interconnected (App)",
  wirelessInterconnected: "Wireless Interconnected",
  wifi: "Wi-Fi (App)",
  standalone: "Standalone",
};

const SENSOR_TYPE_MAP: Record<string, string> = {
  waterLeak: "Water Leak",
  heatAlarm: "Heat Alarm",
  thermometerHygrometer: "Thermometer & Hygrometer",
};

const FEATURES_MAP: Record<string, string> = {
  voiceAlarm: "Voice Alerts",
  nightMode: "Night Mode",
  magneticMount: "Magnetic Mount",
};

export function filterProducts(products: Product[], checkboxStates: CheckboxStates): Product[] {
  // Gather active filters per category
  const activePower = Object.entries(POWER_SOURCE_MAP)
    .filter(([key]) => checkboxStates[key as keyof CheckboxStates])
    .map(([, label]) => label);

  const activeConnectivity = Object.entries(CONNECTIVITY_MAP)
    .filter(([key]) => checkboxStates[key as keyof CheckboxStates])
    .map(([, label]) => label);

  const activeSensorType = Object.entries(SENSOR_TYPE_MAP)
    .filter(([key]) => checkboxStates[key as keyof CheckboxStates])
    .map(([, label]) => label);

  const activeFeatures = Object.entries(FEATURES_MAP)
    .filter(([key]) => checkboxStates[key as keyof CheckboxStates])
    .map(([, label]) => label);

  return products.filter((product) => {
    // If a category has active filters, product must match at least one
    if (activePower.length > 0 && !activePower.some((f) => product.powerSource?.includes(f))) {
      return false;
    }
    if (activeConnectivity.length > 0 && !activeConnectivity.some((f) => product.connectivity?.includes(f))) {
      return false;
    }
    if (activeSensorType.length > 0 && !activeSensorType.some((f) => product.connectivity?.includes(f))) {
      return false;
    }
    if (activeFeatures.length > 0 && !activeFeatures.some((f) => product.productFeatures?.includes(f))) {
      return false;
    }
    return true;
  });
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1500): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries) throw err;
      console.log(`Fetch attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithRetry(`${API_BASE}/products`, { headers: AUTH_HEADER });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch products (${res.status}): ${text}`);
      }
      const data = await res.json();
      const raw = data.products || data || [];
      setProducts(raw.map(normalizeProduct));
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  coverImageUrl: string;
  coverImagePath: string;
  description?: string;
  bannerPcUrl?: string;
  bannerPcPath?: string;
  bannerMobileUrl?: string;
  bannerMobilePath?: string;
  order: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/categories`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch categories (${res.status})`);
        const data = await res.json();
        setCategories((data.categories || []).sort((a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0)));
      } catch (err: any) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { categories, loading };
}

/* ========== Product Cards ========== */

export interface ProductCardItem {
  id: string;
  name: string;
  spuIds: string[];
  coverImageUrl: string;
  coverImagePath: string;
  sellingPoint1: string;
  sellingPoint2: string;
}

export function useProductCards() {
  const [cards, setCards] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/product-cards`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch product cards (${res.status})`);
        const data = await res.json();
        setCards(data.productCards || []);
      } catch (err: any) {
        console.error("Error fetching product cards:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { cards, loading };
}

/* ========== Shopping Guides ========== */

export interface GuideItem {
  id: string;
  tag: string;
  title: string;
  coverImageUrl: string;
  coverImagePath: string;
  categoryIds: string[];
  bodyTitle?: string;
  bodyContent?: string;
  tableOfContents?: string;
  linkText?: string;
  linkUrl?: string;
  sortOrder?: number;
  createdAt?: number;
  updatedAt?: number;
}

export function useGuides(categoryId?: string) {
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/guides`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch guides (${res.status})`);
        const data = await res.json();
        const all: GuideItem[] = data.guides || [];
        let filtered = categoryId
          ? all.filter((g) => g.categoryIds?.includes(categoryId))
          : all;
        filtered = filtered
          .filter((g) => {
            const order = g.sortOrder ?? 0;
            return order >= 1 && order <= 4;
          })
          .sort((a, b) => {
            const oa = a.sortOrder ?? 0;
            const ob = b.sortOrder ?? 0;
            if (oa !== ob) return oa - ob;
            return (a.updatedAt ?? a.createdAt ?? 0) - (b.updatedAt ?? b.createdAt ?? 0);
          });
        setGuides(filtered);
      } catch (err: any) {
        console.error("Error fetching guides:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  return { guides, loading };
}

/* ========== SPUs ========== */

export interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  imagePath: string;
  connectivity: string;
  powerSource: string;
}

export function useSpus() {
  const [spus, setSpus] = useState<Spu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/spus`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch SPUs (${res.status})`);
        const data = await res.json();
        setSpus(data.spus || []);
      } catch (err: any) {
        console.error("Error fetching SPUs:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { spus, loading };
}

/** Calculate the minimum SKU price across all products linked to a product card's SPUs */
export function getMinPriceForCard(card: ProductCardItem, products: Product[]): string {
  const linked = products.filter((p) => p.spuId && card.spuIds.includes(p.spuId));
  let min = Infinity;
  for (const p of linked) {
    for (const opt of p.options) {
      const v = parseFloat(opt.price);
      if (!isNaN(v) && v > 0 && v < min) min = v;
    }
    if (p.price) {
      const v = parseFloat(p.price.replace("$", ""));
      if (!isNaN(v) && v > 0 && v < min) min = v;
    }
  }
  return min === Infinity ? "" : `$${min.toFixed(2)}`;
}