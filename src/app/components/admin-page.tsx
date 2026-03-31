import type { SkuOption } from "./use-products";
import { normalizeProduct } from "./use-products";
import { FeatureItem, ALL_FEATURES } from "./feature-icons";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  LogOut,
  Package,
  X,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Search,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  RefreshCw,
  Pencil,
  Layers,
  Check,
  FolderOpen,
  ChevronRight,
  Settings,
  Monitor,
  Smartphone,
  FileText,
  Wrench,
  BookOpen,
  ClipboardList,
  Link2,
  Video,
  Image as ImageIcon,
  LifeBuoy,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

/* ========== API helpers ========== */

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1500): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries) throw err;
      console.log(`Fetch attempt ${i + 1} failed for ${url}, retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

async function apiGet<T = any>(path: string): Promise<T> {
  const res = await fetchWithRetry(`${API_BASE}${path}`, { headers: AUTH_HEADER });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET ${path} failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function apiPost<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetchWithRetry(`${API_BASE}${path}`, {
    method: "POST",
    headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function apiPut<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetchWithRetry(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PUT ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function apiDelete(path: string): Promise<void> {
  const res = await fetchWithRetry(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: AUTH_HEADER,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`DELETE ${path} failed (${res.status}): ${text}`);
  }
}

async function uploadImage(file: File): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetchWithRetry(`${API_BASE}/upload-image`, {
    method: "POST",
    headers: AUTH_HEADER,
    body: formData,
  }, 3, 2000);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }
  return res.json();
}

/* ========== 类型定义 ========== */

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  imagePath: string; // storage path for cleanup
  imageUrlV2: string;
  imagePathV2: string;
  features: string[];
  options: SkuOption[];
  price: string;
  isHot: boolean;
  powerSource: string[];
  connectivity: string[];
  productFeatures: string[];
  spuId?: string; // linked SPU id
  categoryId?: string; // product category
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

export interface ProductCardItem {
  id: string;
  name: string;
  spuIds: string[];
  coverImageUrl: string;
  coverImagePath: string;
  sellingPoint: string;
}

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
  createdAt?: number;
}

const POWER_SOURCE_OPTIONS = [
  "10-Year Sealed Lithium Battery",
  "Replaceable Battery (Included)",
];

const POWER_SOURCE_BY_CATEGORY: Record<string, string[]> = {
  "co-alarms": [
    "Replaceable Battery (Included)",
    "AC Plug-in + Replaceable Battery Backup",
  ],
};

/** Return the power-source option list for a given category */
const getPowerSourceOptions = (categoryId: string) =>
  POWER_SOURCE_BY_CATEGORY[categoryId] ?? POWER_SOURCE_OPTIONS;

const CONNECTIVITY_OPTIONS = [
  "Base Station Interconnected (App)",
  "Wireless Interconnected",
  "Wi-Fi (App)",
  "Standalone",
];

const SENSOR_TYPE_OPTIONS = [
  "Water Leak",
  "Heat Alarm",
  "Thermometer & Hygrometer",
];

const getConnectivityOptions = (categoryId: string) =>
  categoryId === "home-alarms" ? SENSOR_TYPE_OPTIONS : CONNECTIVITY_OPTIONS;

const getConnectivityLabel = (categoryId: string) =>
  categoryId === "home-alarms" ? "Sensor Type" : "Connectivity";

const FEATURES_OPTIONS = ["Voice Alerts", "Night Mode", "Magnetic Mount"];

/* ========== 口令验证页 ========== */

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin2026") {
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="size-16 rounded-2xl bg-[#ba0020] flex items-center justify-center mb-4">
              <ShieldCheck className="size-8 text-white" />
            </div>
            <h1 className="text-[22px] text-[#1a1a1a] mb-1">Product Admin</h1>
            <p className="text-[14px] text-[#888]">
              Enter access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#aaa]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Code"
                autoFocus
                className={`w-full h-[48px] pl-10 pr-10 rounded-xl border ${error ? "border-[#ba0020] bg-red-50" : "border-[#e0e0e0]"} text-[15px] outline-none transition-all focus:border-[#ba0020] focus:shadow-[0_0_0_3px_rgba(186,0,32,0.08)]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#666]"
              >
                {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>

            {error && (
              <p className="text-[13px] text-[#ba0020] text-center -mt-1">
                Incorrect access code. Please try again.
              </p>
            )}

            <button
              type="submit"
              className="h-[48px] bg-[#ba0020] hover:bg-[#a0001b] text-white rounded-xl text-[15px] transition-colors cursor-pointer"
            >
              Enter Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ========== 图片上传组件 ========== */

function ImageUploader({
  imageUrl,
  imagePath,
  onUploaded,
  onRemove,
  label = "Product Image",
}: {
  imageUrl: string;
  imagePath: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    // reset so same file can be re-selected
    e.target.value = "";
  };

  if (imageUrl) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[13px] text-[#555]">{label}</label>
        <div className="relative w-[160px] h-[160px] rounded-xl overflow-hidden border border-[#e0e0e0] group">
          <img
            src={imageUrl}
            alt="Product"
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">{label}</label>
      <div
        className={`relative w-full h-[140px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          dragOver
            ? "border-[#ba0020] bg-red-50/50"
            : "border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa]"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {uploading ? (
          <>
            <Loader2 className="size-6 text-[#ba0020] animate-spin" />
            <p className="text-[13px] text-[#999]">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="size-6 text-[#ccc]" />
            <p className="text-[13px] text-[#999]">
              Click or drag image here
            </p>
            <p className="text-[11px] text-[#ccc]">PNG, JPG up to 5MB</p>
          </>
        )}
      </div>
      {error && (
        <p className="text-[12px] text-[#ba0020]">{error}</p>
      )}
    </div>
  );
}

/* ========== 多选标签选择器 ========== */

function TagSelector({
  label,
  allOptions,
  selected,
  onChange,
}: {
  label: string;
  allOptions: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {allOptions.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`px-3 py-[6px] rounded-lg text-[13px] border transition-all cursor-pointer ${
                active
                  ? "bg-[#ba0020] text-white border-[#ba0020]"
                  : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ========== 动态列表输入 ========== */

function ListInput({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [inputVal, setInputVal] = useState("");

  const add = () => {
    const v = inputVal.trim();
    if (v && !items.includes(v)) {
      onChange([...items, v]);
      setInputVal("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">{label}</label>
      <div className="flex gap-2">
        <input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 h-[36px] px-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020]"
        />
        <button
          type="button"
          onClick={add}
          className="h-[36px] px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#eee] text-[13px] text-[#555] border border-[#e0e0e0] transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mt-1">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-[#f5f5f5] text-[12px] text-[#444] rounded-md"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="hover:text-[#ba0020] transition-colors cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========== SKU Options Editor ========== */

function SkuImageUploader({
  imageUrl,
  onUploaded,
  onRemove,
  label,
}: {
  imageUrl: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("SKU image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <div className="relative size-[60px] rounded-lg overflow-hidden border border-[#e0e0e0] group shrink-0">
          <img src={imageUrl} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="size-5 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] cursor-pointer"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
        {label && <span className="text-[10px] text-[#aaa] leading-tight">{label}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className="size-[60px] rounded-lg border-2 border-dashed border-[#e0e0e0] flex items-center justify-center cursor-pointer hover:border-[#ba0020] transition-colors shrink-0"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) doUpload(f);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <Loader2 className="size-4 text-[#ba0020] animate-spin" />
        ) : (
          <ImagePlus className="size-4 text-[#ccc]" />
        )}
      </div>
      {label && <span className="text-[10px] text-[#aaa] leading-tight">{label}</span>}
    </div>
  );
}

function SkuOptionsEditor({
  options,
  onChange,
}: {
  options: SkuOption[];
  onChange: (options: SkuOption[]) => void;
}) {
  const [newName, setNewName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const addSku = () => {
    const name = newName.trim();
    if (!name) return;
    onChange([...options, { name, price: "", imageUrl: "", imagePath: "", hoverImageUrl: "", hoverImagePath: "", hoverImageUrlV2: "", hoverImagePathV2: "", packEnabled: false, packQty: "", discountEnabled: false, discountPercent: "", includeBaseStation: false }]);
    setNewName("");
  };

  const updateSku = (index: number, patch: Partial<SkuOption>) => {
    const updated = options.map((o, i) => (i === index ? { ...o, ...patch } : o));
    onChange(updated);
  };

  const removeSku = (index: number) => {
    onChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">SKU Options (dropdown on card)</label>
      <p className="text-[11px] text-[#aaa] -mt-1">Each SKU has its own price and image. The first SKU is used as the default display on the product card.</p>

      {/* Add new SKU */}
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSku())}
          placeholder="e.g. 6*Alarm+1*SBS50 Base Station (XS0B-MR61)"
          className="flex-1 h-[36px] px-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020]"
        />
        <button
          type="button"
          onClick={addSku}
          className="h-[36px] px-3 rounded-lg bg-[#f5f5f5] hover:bg-[#eee] text-[13px] text-[#555] border border-[#e0e0e0] transition-colors cursor-pointer"
        >
          Add
        </button>
      </div>

      {/* SKU list */}
      {options.length > 0 && (
        <div className="flex flex-col gap-3 mt-1">
          {options.map((sku, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-3 rounded-xl bg-[#fafafa] border border-[#f0f0f0]"
            >
              {/* SKU hover images */}
              <div className="shrink-0 flex gap-2">
                <SkuImageUploader
                  imageUrl={sku.hoverImageUrl}
                  onUploaded={(url, path) => updateSku(i, { hoverImageUrl: url, hoverImagePath: path })}
                  onRemove={() => updateSku(i, { hoverImageUrl: "", hoverImagePath: "" })}
                  label="Hover"
                />
                <SkuImageUploader
                  imageUrl={sku.hoverImageUrlV2}
                  onUploaded={(url, path) => updateSku(i, { hoverImageUrlV2: url, hoverImagePathV2: path })}
                  onRemove={() => updateSku(i, { hoverImageUrlV2: "", hoverImagePathV2: "" })}
                  label="Hover V2"
                />
              </div>

              {/* Name + Price */}
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {editingIndex === i ? (
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const trimmed = editingName.trim();
                          if (trimmed) updateSku(i, { name: trimmed });
                          setEditingIndex(null);
                        } else if (e.key === "Escape") {
                          setEditingIndex(null);
                        }
                      }}
                      onBlur={() => {
                        const trimmed = editingName.trim();
                        if (trimmed) updateSku(i, { name: trimmed });
                        setEditingIndex(null);
                      }}
                      className="flex-1 min-w-0 h-[26px] px-2 rounded-md border border-[#ba0020] text-[13px] text-[#333] outline-none"
                    />
                  ) : (
                    <span
                      className="flex-1 min-w-0 text-[13px] text-[#333] truncate cursor-pointer hover:text-[#ba0020] transition-colors"
                      title={sku.name}
                      onClick={() => { setEditingIndex(i); setEditingName(sku.name); }}
                    >
                      {sku.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => { setEditingIndex(i); setEditingName(sku.name); }}
                    className="shrink-0 text-[#ccc] hover:text-[#ba0020] transition-colors cursor-pointer"
                    title="Rename SKU"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSku(i)}
                    className="shrink-0 text-[#ccc] hover:text-[#ba0020] transition-colors cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#999] shrink-0">Price $</span>
                  <input
                    value={sku.price}
                    onChange={(e) => updateSku(i, { price: e.target.value })}
                    placeholder="e.g. 169.99"
                    className="flex-1 h-[28px] px-2 rounded-md border border-[#e0e0e0] text-[12px] outline-none focus:border-[#ba0020]"
                  />
                </div>
                {/* Pack quantity toggle + input */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={!!sku.packEnabled}
                      onChange={(e) => updateSku(i, { packEnabled: e.target.checked, packQty: e.target.checked ? (sku.packQty || "1") : "" })}
                      className="accent-[#ba0020] size-3.5 cursor-pointer"
                    />
                    <span className="text-[12px] text-[#999]">Pack</span>
                  </label>
                  {sku.packEnabled && (
                    <input
                      value={sku.packQty || ""}
                      onChange={(e) => updateSku(i, { packQty: e.target.value.replace(/[^0-9]/g, "") })}
                      placeholder="Qty"
                      className="w-[60px] h-[28px] px-2 rounded-md border border-[#e0e0e0] text-[12px] outline-none focus:border-[#ba0020] text-center"
                    />
                  )}
                </div>
                {/* Discount toggle + percentage input */}
                <div className="flex items-center gap-2 flex-wrap">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={!!sku.discountEnabled}
                      onChange={(e) => updateSku(i, { discountEnabled: e.target.checked, discountPercent: e.target.checked ? (sku.discountPercent || "10") : "" })}
                      className="accent-[#ba0020] size-3.5 cursor-pointer"
                    />
                    <span className="text-[12px] text-[#999]">Discount</span>
                  </label>
                  {sku.discountEnabled && (
                    <>
                      <div className="flex items-center gap-1">
                        <input
                          value={sku.discountPercent || ""}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            const num = parseInt(raw, 10);
                            const clamped = raw === "" ? "" : String(Math.min(Math.max(num || 0, 1), 100));
                            updateSku(i, { discountPercent: clamped });
                          }}
                          placeholder="%"
                          className="w-[48px] h-[28px] px-1 rounded-md border border-[#e0e0e0] text-[12px] outline-none focus:border-[#ba0020] text-center"
                        />
                        <span className="text-[12px] text-[#999]">%</span>
                      </div>
                      {sku.price && sku.discountPercent && (
                        <span className="text-[12px] text-[#ba0020] font-medium">
                          → ${(parseFloat(sku.price) * (1 - parseInt(sku.discountPercent, 10) / 100)).toFixed(2)}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {/* Include Base Station toggle */}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={!!sku.includeBaseStation}
                      onChange={(e) => updateSku(i, { includeBaseStation: e.target.checked })}
                      className="accent-[#ba0020] size-3.5 cursor-pointer"
                    />
                    <span className="text-[12px] text-[#999]">Include Base Station</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========== 商品编辑表单 ========== */

function ProductForm({
  product,
  onSave,
  onCancel,
  saving,
  spus,
  categories,
  defaultCategoryId,
}: {
  product?: Product;
  onSave: (p: Omit<Product, "id">) => void;
  onCancel: () => void;
  saving: boolean;
  spus: Spu[];
  categories: Category[];
  defaultCategoryId?: string;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: product?.name ?? "",
    imageUrl: product?.imageUrl ?? "",
    imagePath: product?.imagePath ?? "",
    imageUrlV2: product?.imageUrlV2 ?? "",
    imagePathV2: product?.imagePathV2 ?? "",
    features: product?.features ?? [],
    options: product?.options ?? [],
    price: product?.price ?? "",
    isHot: product?.isHot ?? false,
    powerSource: product?.powerSource ?? [],
    connectivity: product?.connectivity ?? [],
    productFeatures: product?.productFeatures ?? [],
    spuId: product?.spuId ?? "",
    categoryId: product?.categoryId ?? defaultCategoryId ?? "smoke-alarms",
  });

  const [spuDropdownOpen, setSpuDropdownOpen] = useState(false);
  const spuDropdownRef = useRef<HTMLDivElement>(null);

  // Close SPU dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (spuDropdownRef.current && !spuDropdownRef.current.contains(e.target as Node)) {
        setSpuDropdownOpen(false);
      }
    };
    if (spuDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [spuDropdownOpen]);

  const linkedSpu = spus.find((s) => s.id === form.spuId);

  // Filter SPUs to only show ones matching the current category
  const filteredSpus = form.categoryId
    ? spus.filter((s) => (s.categoryId || "smoke-alarms") === form.categoryId)
    : spus;

  // Derive powerSource & connectivity & SPU-driven features from linked SPU
  const derivedPowerSource = linkedSpu?.powerSource ? [linkedSpu.powerSource] : [];
  const derivedConnectivity = linkedSpu?.connectivity ? [linkedSpu.connectivity] : [];
  // Features derived from SPU capabilities (readonly when linked)
  const SPU_DRIVEN_FEATURES: { capKey: keyof SpuCapabilities; featureLabel: string }[] = [
    { capKey: "voiceAlerts", featureLabel: "Voice Alerts" },
    { capKey: "nightMode", featureLabel: "Night Mode" },
    { capKey: "magneticMount", featureLabel: "Magnetic Mount" },
  ];
  const derivedFeatureLabels = SPU_DRIVEN_FEATURES
    .filter(({ capKey }) => linkedSpu?.capabilities?.[capKey])
    .map(({ featureLabel }) => featureLabel);
  const allSpuDrivenLabels = SPU_DRIVEN_FEATURES.map(({ featureLabel }) => featureLabel);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSelectSpu = (spu: Spu | null) => {
    if (spu) {
      const spuDrivenLabels = ["Voice Alerts", "Night Mode", "Magnetic Mount"];
      const spuFeatures: string[] = [];
      if (spu.capabilities?.voiceAlerts) spuFeatures.push("Voice Alerts");
      if (spu.capabilities?.nightMode) spuFeatures.push("Night Mode");
      if (spu.capabilities?.magneticMount) spuFeatures.push("Magnetic Mount");
      setForm((prev) => ({
        ...prev,
        spuId: spu.id,
        powerSource: spu.powerSource ? [spu.powerSource] : [],
        connectivity: spu.connectivity ? [spu.connectivity] : [],
        productFeatures: [...prev.productFeatures.filter((f) => !spuDrivenLabels.includes(f)), ...spuFeatures],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        spuId: "",
        powerSource: [],
        connectivity: [],
      }));
    }
    setSpuDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    // At least one SKU with a price is required
    const firstSkuWithPrice = form.options.find((o) => o.price.trim());
    if (!firstSkuWithPrice && form.options.length === 0) return;
    // Auto-derive top-level price from first SKU
    const firstSku = form.options[0];
    const derivedPrice = firstSku?.price || "";
    // Always use SPU-derived values for powerSource/connectivity/features if linked
    const finalProductFeatures = form.spuId
      ? [...form.productFeatures.filter((f) => !allSpuDrivenLabels.includes(f)), ...derivedFeatureLabels]
      : form.productFeatures;
    onSave({
      ...form,
      price: derivedPrice,
      powerSource: form.spuId ? derivedPowerSource : form.powerSource,
      connectivity: form.spuId ? derivedConnectivity : form.connectivity,
      productFeatures: finalProductFeatures,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#fafafa]">
        <h3 className="text-[16px] text-[#1a1a1a]">
          {product ? "Edit Product" : "Add New Product"}
        </h3>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* 基础信息 */}
        <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">
              Product Name <span className="text-[#ba0020]">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. XS0B-MR Interconnected Smart Smoke Alarm"
              className="h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">Hot Tag</label>
            <div className="h-[40px] flex items-center">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <div
                  className={`relative w-[40px] h-[22px] rounded-full transition-colors ${form.isHot ? "bg-[#ba0020]" : "bg-[#ddd]"}`}
                  onClick={() => set("isHot", !form.isHot)}
                >
                  <div
                    className={`absolute top-[2px] size-[18px] rounded-full bg-white shadow transition-transform ${form.isHot ? "translate-x-[20px]" : "translate-x-[2px]"}`}
                  />
                </div>
                <span className="text-[13px] text-[#666]">
                  {form.isHot ? "Displayed as Hot" : "Not displayed"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Product Main Image */}
        <ImageUploader
          imageUrl={form.imageUrl}
          imagePath={form.imagePath}
          onUploaded={(url, path) => setForm((prev) => ({ ...prev, imageUrl: url, imagePath: path }))}
          onRemove={() => setForm((prev) => ({ ...prev, imageUrl: "", imagePath: "" }))}
        />

        {/* Product Image V2 – for new product card style */}
        <ImageUploader
          label="Product Image V2"
          imageUrl={form.imageUrlV2}
          imagePath={form.imagePathV2}
          onUploaded={(url, path) => setForm((prev) => ({ ...prev, imageUrlV2: url, imagePathV2: path }))}
          onRemove={() => setForm((prev) => ({ ...prev, imageUrlV2: "", imagePathV2: "" }))}
        />

        {/* Category selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#555]">
            Category <span className="text-[#ba0020]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = form.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    const newOpts = getPowerSourceOptions(cat.id);
                    const newConnOpts = getConnectivityOptions(cat.id);
                    // Check if currently linked SPU belongs to the new category
                    const currentSpuBelongs = form.spuId
                      ? spus.some((s) => s.id === form.spuId && s.categoryId === cat.id)
                      : true;
                    setForm((prev) => ({
                      ...prev,
                      categoryId: cat.id,
                      powerSource: prev.powerSource.filter((v) => newOpts.includes(v)),
                      connectivity: prev.connectivity.filter((v) => newConnOpts.includes(v)),
                      // Clear spuId if current SPU doesn't belong to new category
                      ...(currentSpuBelongs ? {} : { spuId: "", connectivity: [], productFeatures: prev.productFeatures.filter((f) => !["Voice Alerts", "Night Mode", "Magnetic Mount"].includes(f)) }),
                    }));
                  }}
                  className={`px-3 py-[6px] rounded-lg text-[13px] border transition-all cursor-pointer ${
                    active
                      ? "bg-[#ba0020] text-white border-[#ba0020]"
                      : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 关联 SPU */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#555]">
            Linked SPU
            <span className="text-[11px] text-[#aaa] ml-2">Power Source, {getConnectivityLabel(form.categoryId)} & Features (Voice Alerts / Night Mode / Magnetic Mount) derived from SPU</span>
          </label>
          <div className="relative" ref={spuDropdownRef}>
            <button
              type="button"
              onClick={() => setSpuDropdownOpen(!spuDropdownOpen)}
              className={`w-full h-[40px] px-3 rounded-xl border text-[14px] text-left flex items-center justify-between transition-colors cursor-pointer ${
                spuDropdownOpen ? "border-[#ba0020]" : "border-[#e0e0e0]"
              }`}
            >
              {linkedSpu ? (
                <div className="flex items-center gap-2 min-w-0">
                  {linkedSpu.imageUrl && (
                    <img src={linkedSpu.imageUrl} alt="" className="size-6 rounded object-cover shrink-0 border border-[#e0e0e0]" />
                  )}
                  <span className="truncate text-[#1a1a1a]">{linkedSpu.name}</span>
                  <span className="text-[11px] text-[#aaa] shrink-0">
                    {linkedSpu.connectivity && `· ${linkedSpu.connectivity}`}
                  </span>
                </div>
              ) : (
                <span className="text-[#aaa]">Select an SPU (optional)...</span>
              )}
              <ChevronDown className={`size-4 text-[#999] shrink-0 transition-transform ${spuDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {spuDropdownOpen && (
              <div className="absolute z-30 top-[44px] left-0 w-full bg-white rounded-xl border border-[#e0e0e0] shadow-lg max-h-[240px] overflow-y-auto">
                {/* Clear option */}
                <div
                  onClick={() => handleSelectSpu(null)}
                  className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors text-[13px] ${
                    !form.spuId ? "text-[#ba0020]" : "text-[#888]"
                  }`}
                >
                  <X className="size-3.5" />
                  <span>No linked SPU</span>
                </div>
                {filteredSpus.length === 0 && (
                  <div className="px-3 py-4 text-center text-[12px] text-[#ccc]">
                    {spus.length === 0
                      ? "No SPUs created yet. Go to the SPUs tab to add one."
                      : "No SPUs in this category. Create one in the SPUs tab first."}
                  </div>
                )}
                {filteredSpus.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSpu(s)}
                    className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-[#fafafa] transition-colors ${
                      form.spuId === s.id ? "bg-red-50/60" : ""
                    }`}
                  >
                    <div className="size-7 rounded bg-[#f5f5f5] flex items-center justify-center overflow-hidden shrink-0">
                      {s.imageUrl ? (
                        <img src={s.imageUrl} alt="" className="size-full object-cover" />
                      ) : (
                        <Layers className="size-3.5 text-[#ccc]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#333] truncate">{s.name}</p>
                      <p className="text-[11px] text-[#aaa] truncate">
                        {[s.connectivity, s.powerSource, s.batteryLife].filter(Boolean).join(" · ") || "No attributes"}
                      </p>
                    </div>
                    {form.spuId === s.id && <Check className="size-4 text-[#ba0020] shrink-0" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 产品特性 & SKU 选项 */}
        {/* Product Features — predefined checkbox/radio selector */}
        <div className="flex flex-col gap-3">
          <label className="text-[13px] text-[#555] font-medium">Product Features (displayed on card)</label>

          {/* Multi-select: Voice Alarm with Location & Easy Magnetic Mount */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[#999] mb-1">Additional Features (multi-select)</p>
            {(["Voice Alarm with Location", "Easy Magnetic Mount"] as const).map((feat) => {
              const checked = form.features.includes(feat);
              return (
                <label key={feat} className="flex items-center gap-[10px] cursor-pointer py-[5px] px-2 rounded-lg hover:bg-[#fafafa] transition-colors select-none">
                  <span className={`flex items-center justify-center size-[18px] rounded border-[1.5px] transition-colors shrink-0 ${checked ? "bg-[#ba0020] border-[#ba0020]" : "border-[#ccc] bg-white"}`}>
                    {checked && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        set("features", [...form.features, feat]);
                      } else {
                        set("features", form.features.filter((f) => f !== feat));
                      }
                    }}
                  />
                  <span className="text-[13px] text-[#333]">{feat}</span>
                </label>
              );
            })}
          </div>

          {/* Single-select: Power source features */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[#999] mb-1">Power Source (single-select)</p>
            {(["10-Year Battery (NEVER-CHANGE)", "Replaceable Battery (Included)", "HARDWIRED+9V Battery Backup", "Plug-In"] as const).map((feat) => {
              const POWER_FEATURES = ["10-Year Battery (NEVER-CHANGE)", "Replaceable Battery (Included)", "HARDWIRED+9V Battery Backup", "Plug-In"];
              const checked = form.features.includes(feat);
              return (
                <label key={feat} className="flex items-center gap-[10px] cursor-pointer py-[5px] px-2 rounded-lg hover:bg-[#fafafa] transition-colors select-none">
                  <span className={`flex items-center justify-center size-[18px] rounded-full border-[1.5px] transition-colors shrink-0 ${checked ? "border-[#ba0020]" : "border-[#ccc]"}`}>
                    {checked && <span className="size-[10px] rounded-full bg-[#ba0020]" />}
                  </span>
                  <input
                    type="radio"
                    name="power-feature"
                    className="sr-only"
                    checked={checked}
                    onChange={() => {
                      const filtered = form.features.filter((f) => !POWER_FEATURES.includes(f));
                      set("features", [...filtered, feat]);
                    }}
                  />
                  <span className="text-[13px] text-[#333]">{feat}</span>
                </label>
              );
            })}
            {/* Allow deselection of power source */}
            {form.features.some((f) => ["10-Year Battery (NEVER-CHANGE)", "Replaceable Battery (Included)", "HARDWIRED+9V Battery Backup", "Plug-In"].includes(f)) && (
              <button
                type="button"
                className="text-[11px] text-[#999] hover:text-[#ba0020] self-start ml-2 mt-1 transition-colors"
                onClick={() => {
                  const POWER_FEATURES = ["10-Year Battery (NEVER-CHANGE)", "Replaceable Battery (Included)", "HARDWIRED+9V Battery Backup", "Plug-In"];
                  set("features", form.features.filter((f) => !POWER_FEATURES.includes(f)));
                }}
              >
                Clear power source selection
              </button>
            )}
          </div>
        </div>
        <SkuOptionsEditor
          options={form.options}
          onChange={(v) => set("options", v)}
        />

        {/* 筛选属性 */}
        <div className="border-t border-dashed border-[#e0e0e0] pt-4">
          <p className="text-[13px] text-[#999] mb-3">
            Filter Attributes — used for filtering on the product listing page
          </p>
          <div className="flex flex-col gap-4">
            {/* Power Source — readonly if SPU linked */}
            {form.spuId ? (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-[#555]">
                  Power Source
                  <span className="text-[11px] text-[#aaa] ml-2">· from SPU</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {derivedPowerSource.length > 0 ? derivedPowerSource.map((v) => (
                    <span key={v} className="px-3 py-[6px] rounded-lg text-[13px] border bg-[#ba0020] text-white border-[#ba0020] opacity-80">{v}</span>
                  )) : (
                    <span className="text-[12px] text-[#ccc] italic">Not set in SPU</span>
                  )}
                </div>
              </div>
            ) : (
              <TagSelector
                label="Power Source"
                allOptions={getPowerSourceOptions(form.categoryId)}
                selected={form.powerSource}
                onChange={(v) => set("powerSource", v)}
              />
            )}

            {/* Connectivity / Sensor Type — readonly if SPU linked */}
            {form.spuId ? (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-[#555]">
                  {getConnectivityLabel(form.categoryId)}
                  <span className="text-[11px] text-[#aaa] ml-2">· from SPU</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {derivedConnectivity.length > 0 ? derivedConnectivity.map((v) => (
                    <span key={v} className="px-3 py-[6px] rounded-lg text-[13px] border bg-[#ba0020] text-white border-[#ba0020] opacity-80">{v}</span>
                  )) : (
                    <span className="text-[12px] text-[#ccc] italic">Not set in SPU</span>
                  )}
                </div>
              </div>
            ) : (
              <TagSelector
                label={getConnectivityLabel(form.categoryId)}
                allOptions={getConnectivityOptions(form.categoryId)}
                selected={form.connectivity}
                onChange={(v) => set("connectivity", v)}
              />
            )}

            {/* Features — Voice Alerts / Night Mode / Magnetic Mount readonly if SPU linked */}
            {form.spuId ? (
              <div className="flex flex-col gap-2">
                <label className="text-[13px] text-[#555]">
                  Features
                  <span className="text-[11px] text-[#aaa] ml-2">· Voice Alerts, Night Mode, Magnetic Mount from SPU</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {/* SPU-driven features — readonly */}
                  {SPU_DRIVEN_FEATURES.map(({ capKey, featureLabel }) => {
                    const active = linkedSpu?.capabilities?.[capKey];
                    return active ? (
                      <span key={featureLabel} className="px-3 py-[6px] rounded-lg text-[13px] border bg-[#ba0020] text-white border-[#ba0020] opacity-80">
                        {featureLabel}
                        <span className="text-[11px] ml-1 opacity-70">· from SPU</span>
                      </span>
                    ) : (
                      <span key={featureLabel} className="px-3 py-[6px] rounded-lg text-[13px] border border-[#e0e0e0] text-[#ccc] cursor-not-allowed opacity-60">
                        {featureLabel}
                      </span>
                    );
                  })}
                  {/* Non-SPU-driven features remain selectable */}
                  {FEATURES_OPTIONS.filter((f) => !allSpuDrivenLabels.includes(f)).map((opt) => {
                    const active = form.productFeatures.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          set(
                            "productFeatures",
                            active
                              ? form.productFeatures.filter((s) => s !== opt)
                              : [...form.productFeatures, opt]
                          )
                        }
                        className={`px-3 py-[6px] rounded-lg text-[13px] border transition-all cursor-pointer ${
                          active
                            ? "bg-[#ba0020] text-white border-[#ba0020]"
                            : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <TagSelector
                label="Features"
                allOptions={FEATURES_OPTIONS}
                selected={form.productFeatures}
                onChange={(v) => set("productFeatures", v)}
              />
            )}
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="h-[38px] px-5 rounded-xl border border-[#e0e0e0] text-[14px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="h-[38px] px-5 rounded-xl bg-[#ba0020] text-white text-[14px] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {product ? "Save Changes" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

/* ========== 商品表格行 ========== */

function ProductRow({
  product,
  onDelete,
  onEdit,
  expanded,
  onToggle,
  spuName,
  linkedSpu,
  categoryName,
}: {
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
  expanded: boolean;
  onToggle: () => void;
  spuName?: string;
  linkedSpu?: Spu;
  categoryName?: string;
}) {
  return (
    <div className="border-b border-[#f0f0f0] last:border-b-0">
      <div
        className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
        onClick={onToggle}
      >
        <div className="shrink-0 text-[#bbb]">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>

        <div className="shrink-0 size-[48px] rounded-xl bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <Package className="size-5 text-[#ccc]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[14px] text-[#1a1a1a] truncate">{product.name}</p>
            {product.isHot && (
              <span className="shrink-0 px-2 py-[2px] text-[11px] bg-[#ba0020] text-white rounded-md">Hot</span>
            )}
            {spuName && (
              <span className="shrink-0 px-2 py-[2px] text-[11px] bg-purple-50 text-purple-600 rounded-md flex items-center gap-1">
                <Layers className="size-3" />
                {spuName}
              </span>
            )}
          </div>
          <p className="text-[12px] text-[#999] mt-[2px]">
            {product.features.length} feature{product.features.length !== 1 ? "s" : ""} ·{" "}
            {product.options.length} option{product.options.length !== 1 ? "s" : ""}
          </p>
        </div>

        <p className="shrink-0 text-[15px] text-[#1a1a1a] w-[90px] text-right">
          ${product.price}
        </p>

        <div className="shrink-0 w-[100px] text-right">
          <p className="text-[12px] text-[#999]">
            {product.powerSource.length + product.connectivity.length + product.productFeatures.length} filter tag
            {product.powerSource.length + product.connectivity.length + product.productFeatures.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="size-[32px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:bg-orange-50 transition-colors cursor-pointer"
          >
            <Pencil className="size-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="size-[32px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-6 pb-5 pt-1 ml-[28px] flex flex-col gap-3 text-[13px]">
          {/* Linked SPU */}
          {spuName && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50/60 border border-purple-100">
              <Layers className="size-3.5 text-purple-500 shrink-0" />
              <span className="text-[12px] text-purple-600">Linked SPU: <span className="font-medium">{spuName}</span></span>
            </div>
          )}
          <div className="grid grid-cols-3 gap-x-6 gap-y-3">
          <div>
            <p className="text-[#aaa] mb-1">Product Features</p>
            {product.features.filter((f) => ALL_FEATURES.includes(f as any)).length > 0 ? (
              <div className="flex flex-col gap-[4px]">
                {ALL_FEATURES.filter((f) => product.features.includes(f)).map((f) => (
                  <FeatureItem key={f} feature={f} />
                ))}
              </div>
            ) : (
              <p className="text-[#ccc] italic">None</p>
            )}
          </div>
          <div>
            <p className="text-[#aaa] mb-1">SKU Options</p>
            {product.options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {product.options.map((o, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {o.imageUrl && (
                      <img src={o.imageUrl} alt="" className="size-[28px] rounded object-cover shrink-0 border border-[#e0e0e0]" />
                    )}
                    <span className="text-[#555] truncate">{o.name}</span>
                    {o.price && (
                      <span className="shrink-0 text-[#999]">${o.price}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#ccc] italic">None</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-[#aaa] mb-1">Power Source</p>
              <div className="flex flex-wrap gap-1">
                {product.powerSource.length > 0
                  ? product.powerSource.map((s) => (
                      <span key={s} className="px-2 py-[2px] bg-blue-50 text-blue-600 rounded text-[12px]">{s}</span>
                    ))
                  : <p className="text-[#ccc] italic">None</p>}
              </div>
            </div>
            <div>
              <p className="text-[#aaa] mb-1">{product.categoryId === "home-alarms" ? "Sensor Type" : "Connectivity"}</p>
              <div className="flex flex-wrap gap-1">
                {product.connectivity.length > 0
                  ? product.connectivity.map((s) => (
                      <span key={s} className="px-2 py-[2px] bg-green-50 text-green-600 rounded text-[12px]">{s}</span>
                    ))
                  : <p className="text-[#ccc] italic">None</p>}
              </div>
            </div>
            <div>
              <p className="text-[#aaa] mb-1">Features</p>
              <div className="flex flex-wrap gap-1">
                {(() => {
                  const SPU_FEATURE_MAP: { capKey: keyof SpuCapabilities; label: string }[] = [
                    { capKey: "voiceAlerts", label: "Voice Alerts" },
                    { capKey: "nightMode", label: "Night Mode" },
                    { capKey: "magneticMount", label: "Magnetic Mount" },
                  ];
                  const spuDrivenLabels = linkedSpu
                    ? SPU_FEATURE_MAP.filter(({ capKey }) => linkedSpu.capabilities?.[capKey]).map(({ label }) => label)
                    : [];
                  const allSpuLabels = SPU_FEATURE_MAP.map(({ label }) => label);
                  const manualFeatures = product.productFeatures.filter((f) => !allSpuLabels.includes(f) && f !== "Voice Alarm");
                  const effectiveFeatures = [...manualFeatures, ...spuDrivenLabels.filter((l) => !manualFeatures.includes(l))];
                  return effectiveFeatures.length > 0
                    ? effectiveFeatures.map((s) => {
                        const fromSpu = spuDrivenLabels.includes(s);
                        return (
                          <span
                            key={s}
                            className={`px-2 py-[2px] rounded text-[12px] ${
                              fromSpu
                                ? "bg-[#ba0020]/10 text-[#ba0020] border border-[#ba0020]/30"
                                : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {s}
                            {fromSpu && <span className="text-[10px] ml-1 opacity-60">· from SPU</span>}
                          </span>
                        );
                      })
                    : <p className="text-[#ccc] italic">None</p>;
                })()}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== 删除确认弹窗 ========== */

function DeleteConfirmDialog({
  productName,
  onConfirm,
  onCancel,
  deleting,
}: {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl w-[420px] overflow-hidden shadow-2xl">
        <div className="p-6 flex flex-col items-center gap-3">
          <div className="size-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="size-5 text-[#ba0020]" />
          </div>
          <h3 className="text-[16px] text-[#1a1a1a]">Delete Product</h3>
          <p className="text-[14px] text-[#888] text-center">
            Are you sure you want to delete{" "}
            <span className="text-[#1a1a1a]">"{productName}"</span>? This action cannot be undone.
          </p>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 h-[40px] rounded-xl border border-[#e0e0e0] text-[14px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-[40px] rounded-xl bg-[#ba0020] text-white text-[14px] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting && <Loader2 className="size-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== Toast 提示 ========== */

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg text-[14px] text-white animate-[fadeInDown_300ms_ease-out] ${
        type === "success" ? "bg-[#22c55e]" : "bg-[#ba0020]"
      }`}
    >
      {message}
    </div>
  );
}

/* ========== SPU 类型定义 ========== */

export interface SpuCapabilities {
  appPushAlerts: boolean;
  directWifiConnection: boolean;
  connectsToSBS50: boolean;
  customizableWirelessNetwork: boolean;
  voiceAlerts: boolean;
  replaceableBattery: boolean;
  fireDispatchSubscription: boolean;
  nightMode: boolean;
  magneticMount: boolean;
}

export interface SetupInstallationData {
  installationVideoUrl?: string;
  installationVideoCoverImage?: { url: string; path: string };
  quickStartGuideImages?: Array<{ url: string; path: string }>;
}

export interface SpecsData {
  itemModelNumber?: string;
  alarmLoudness?: string;
  operatingLife?: string;
  silenceDuration?: string;
  batteryLife?: string;
  color?: string;
  powerSource?: string;
  maxInterconnectedUnits?: string;
  sensorType?: string;
  indicatorLight?: string;
  standbyCurrent?: string;
  installationMethod?: string;
  alarmCurrent?: string;
  usage?: string;
  operatingTemperature?: string;
  productWeight?: string;
  operatingRelativeHumidity?: string;
  productDimensions?: string;
}

export interface ManualItem {
  name?: string;
  coverImage: { url: string; path: string };
  pdfUrl: string;
}

export interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  imagePath: string;
  connectivity: string;
  capabilities: SpuCapabilities;
  powerSource: string;
  batteryLife: string;
  categoryId?: string;
  setupInstallation?: SetupInstallationData;
  specs?: SpecsData;
  manuals?: ManualItem[];
}

const SPU_CONNECTIVITY_OPTIONS = [
  "Base Station Interconnected (App)",
  "Wireless Interconnected",
  "Wi-Fi (App)",
  "Standalone",
];

const SPU_SENSOR_TYPE_OPTIONS = [
  "Water Leak",
  "Heat Alarm",
  "Thermometer & Hygrometer",
];

const getSpuConnectivityOptions = (categoryId?: string) =>
  categoryId === "home-alarms" ? SPU_SENSOR_TYPE_OPTIONS : SPU_CONNECTIVITY_OPTIONS;

const SPU_CAPABILITY_OPTIONS: { key: keyof SpuCapabilities; label: string }[] = [
  { key: "appPushAlerts", label: "App Push Alerts" },
  { key: "directWifiConnection", label: "Direct Wi-Fi Connection" },
  { key: "connectsToSBS50", label: "Connects to SBS50 Base Station" },
  { key: "customizableWirelessNetwork", label: "Customizable Wireless Network" },
  { key: "voiceAlerts", label: "Voice Alerts" },
  { key: "replaceableBattery", label: "Replaceable Battery" },
  { key: "fireDispatchSubscription", label: "Fire Dispatch subscription" },
  { key: "nightMode", label: "Night Mode" },
  { key: "magneticMount", label: "Magnetic Mount" },
];

const SPU_BATTERY_LIFE_OPTIONS = ["1 year", "5 years", "10 years"];

const defaultCapabilities: SpuCapabilities = {
  appPushAlerts: false,
  directWifiConnection: false,
  connectsToSBS50: false,
  customizableWirelessNetwork: false,
  voiceAlerts: false,
  replaceableBattery: false,
  fireDispatchSubscription: false,
  nightMode: false,
  magneticMount: false,
};

const DEFAULT_SETUP_INSTALLATION: SetupInstallationData = {
  quickStartGuideImages: [
    { url: "/images/placeholder-quick-start-1.png", path: "" },
    { url: "/images/placeholder-quick-start-2.png", path: "" },
  ],
};

const DEFAULT_SPECS: SpecsData = {
  itemModelNumber: "—",
  alarmLoudness: "≥85dB at 3m/10ft",
  operatingLife: "10 Years",
  silenceDuration: "≥9min",
  batteryLife: "10 Years (built-in lithium battery)",
  color: "White",
  powerSource: "Built-in 3V Lithium Battery",
  maxInterconnectedUnits: "24",
  sensorType: "Photoelectric",
  indicatorLight: "Green LED (standby) / Red LED (alarm)",
  standbyCurrent: "<6μA",
  installationMethod: "Magnetic Mount / Screw Mount",
  alarmCurrent: "<150mA",
  usage: "Indoor",
  operatingTemperature: "40°F–100°F (4.4°C–37.8°C)",
  productWeight: "180g / 6.35oz",
  operatingRelativeHumidity: "≤85% RH (non-condensing)",
  productDimensions: "3.15\" × 3.15\" × 1.85\" (80 × 80 × 47mm)",
};

const DEFAULT_MANUALS: ManualItem[] = [
  { name: "User Manual", coverImage: { url: "/images/placeholder-manual-cover.png", path: "" }, pdfUrl: "#" },
];

/* ========== 单选选择器 ========== */

function RadioSelector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(active ? "" : opt)}
              className={`px-3 py-[6px] rounded-lg text-[13px] border transition-all cursor-pointer ${
                active
                  ? "bg-[#ba0020] text-white border-[#ba0020]"
                  : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020]"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ========== SPU 图片上传 ========== */

function SpuImageUploader({
  imageUrl,
  onUploaded,
  onRemove,
}: {
  imageUrl: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB."); return; }
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  };

  if (imageUrl) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-[13px] text-[#555]">Product Image <span className="text-[#ba0020]">*</span></label>
        <div className="relative w-[160px] h-[160px] rounded-xl overflow-hidden border border-[#e0e0e0] group">
          <img src={imageUrl} alt="SPU" className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={onRemove} className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] text-[#555]">Product Image <span className="text-[#ba0020]">*</span></label>
      <div
        className={`relative w-full h-[140px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
          dragOver ? "border-[#ba0020] bg-red-50/50" : "border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa]"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }} />
        {uploading ? (
          <><Loader2 className="size-6 text-[#ba0020] animate-spin" /><p className="text-[13px] text-[#999]">Uploading...</p></>
        ) : (
          <><Upload className="size-6 text-[#ccc]" /><p className="text-[13px] text-[#999]">Click or drag image here</p><p className="text-[11px] text-[#ccc]">PNG, JPG up to 5MB</p></>
        )}
      </div>
      {error && <p className="text-[12px] text-[#ba0020]">{error}</p>}
    </div>
  );
}

/* ========== Setup & Installation 编辑器 ========== */

function SetupInstallationEditor({
  data,
  onSave,
  onClose,
}: {
  data?: SetupInstallationData;
  onSave: (data: SetupInstallationData) => void;
  onClose: () => void;
}) {
  const [videoUrl, setVideoUrl] = useState(data?.installationVideoUrl ?? "");
  const [videoCover, setVideoCover] = useState<{ url: string; path: string }>(
    data?.installationVideoCoverImage ?? { url: "", path: "" }
  );
  const [coverUploading, setCoverUploading] = useState(false);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<Array<{ url: string; path: string }>>(
    data?.quickStartGuideImages ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const doUpload = async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    if (fileArr.length === 0) {
      setError("Please select valid image files (PNG/JPG, under 5MB).");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const results = await Promise.all(fileArr.map((f) => uploadImage(f)));
      setImages((prev) => [...prev, ...results]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const doCoverUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Please select a valid image file (PNG/JPG, under 5MB).");
      return;
    }
    setError("");
    setCoverUploading(true);
    try {
      const result = await uploadImage(file);
      setVideoCover(result);
    } catch (err: any) {
      console.error("Cover upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSave = () => {
    const result: SetupInstallationData = {};
    if (videoUrl.trim()) result.installationVideoUrl = videoUrl.trim();
    if (videoCover.url) result.installationVideoCoverImage = videoCover;
    if (images.length > 0) result.quickStartGuideImages = images;
    onSave(Object.keys(result).length > 0 ? result : undefined as any);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-[32px] rounded-lg bg-amber-50 flex items-center justify-center">
              <Wrench className="size-4 text-amber-600" />
            </div>
            <h3 className="text-[16px] text-[#1a1a1a]">Setup & Installation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-lg flex items-center justify-center text-[#bbb] hover:text-[#666] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Installation Video URL */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555] flex items-center gap-2">
              <Video className="size-4 text-[#999]" />
              Installation Video
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#bbb]" />
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste video URL (e.g. https://youtube.com/watch?v=...)"
                  className="w-full h-[40px] pl-9 pr-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
              {videoUrl && (
                <button
                  type="button"
                  onClick={() => setVideoUrl("")}
                  className="size-[40px] shrink-0 rounded-xl border border-[#e0e0e0] flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:border-[#ba0020] transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
            {videoUrl && (
              <div className="mt-1 px-3 py-2 bg-[#f8f8f8] rounded-lg border border-[#eee]">
                <p className="text-[12px] text-[#999] truncate">
                  <span className="text-[#aaa]">URL:</span> {videoUrl}
                </p>
              </div>
            )}

            {/* Video Cover Image */}
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[12px] text-[#888]">Video Cover Image</label>
              <input
                ref={coverFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) doCoverUpload(f);
                  e.target.value = "";
                }}
              />
              {videoCover.url ? (
                <div className="relative w-full h-[160px] rounded-lg overflow-hidden border border-[#e0e0e0] group bg-[#f5f5f5]">
                  <img src={videoCover.url} alt="Video cover" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => coverFileRef.current?.click()}
                      className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#555] hover:bg-white transition-colors cursor-pointer"
                    >
                      <ImagePlus className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoCover({ url: "", path: "" })}
                      className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  disabled={coverUploading}
                  className="w-full h-[80px] rounded-lg border-2 border-dashed border-[#e0e0e0] flex items-center justify-center gap-2 text-[13px] text-[#bbb] hover:border-[#ba0020] hover:text-[#ba0020] transition-colors cursor-pointer bg-transparent disabled:opacity-50"
                >
                  {coverUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                  {coverUploading ? "Uploading..." : "Upload cover image"}
                </button>
              )}
              <p className="text-[11px] text-[#ccc]">Displayed as the video thumbnail in Download Center</p>
            </div>
          </div>

          {/* Quick Start Guide Images */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555] flex items-center gap-2">
              <ImageIcon className="size-4 text-[#999]" />
              Quick Start Guide
            </label>
            <p className="text-[11px] text-[#bbb] -mt-1">Upload multiple images for the quick start guide</p>

            {/* Uploaded images grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#e0e0e0] group bg-[#f5f5f5]">
                    <img src={img.url} alt={`Guide ${idx + 1}`} className="size-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px]">
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload area */}
            <div
              className={`relative w-full h-[100px] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${
                dragOver
                  ? "border-[#ba0020] bg-red-50/50"
                  : "border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa]"
              }`}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files.length > 0) doUpload(e.dataTransfer.files);
              }}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) doUpload(e.target.files);
                  e.target.value = "";
                }}
              />
              {uploading ? (
                <>
                  <Loader2 className="size-5 text-[#ba0020] animate-spin" />
                  <p className="text-[12px] text-[#999]">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="size-5 text-[#ccc]" />
                  <p className="text-[12px] text-[#999]">Click or drag images here</p>
                  <p className="text-[10px] text-[#ccc]">PNG, JPG up to 5MB · Multiple files supported</p>
                </>
              )}
            </div>
            {error && <p className="text-[12px] text-[#ba0020]">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <p className="text-[12px] text-[#bbb]">
            {videoUrl ? "1 video" : "No video"}
            {" · "}
            {images.length > 0 ? `${images.length} image${images.length > 1 ? "s" : ""}` : "No images"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-4 rounded-xl border border-[#e0e0e0] text-[13px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-[36px] px-5 rounded-xl bg-[#ba0020] text-white text-[13px] hover:bg-[#a0001b] transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Specs 编辑器 ========== */

const SPECS_FIELDS: { key: keyof SpecsData; label: string }[] = [
  { key: "itemModelNumber", label: "Item Model Number" },
  { key: "alarmLoudness", label: "Alarm Loudness" },
  { key: "operatingLife", label: "Operating Life" },
  { key: "silenceDuration", label: "Silence Duration" },
  { key: "batteryLife", label: "Battery Life" },
  { key: "color", label: "Color" },
  { key: "powerSource", label: "Power Source" },
  { key: "maxInterconnectedUnits", label: "Maximum Number of Interconnected Units" },
  { key: "sensorType", label: "Sensor Type" },
  { key: "indicatorLight", label: "Indicator Light" },
  { key: "standbyCurrent", label: "Standby Current" },
  { key: "installationMethod", label: "Installation Method" },
  { key: "alarmCurrent", label: "Alarm Current" },
  { key: "usage", label: "Usage" },
  { key: "operatingTemperature", label: "Operating Temperature" },
  { key: "productWeight", label: "Product Weight" },
  { key: "operatingRelativeHumidity", label: "Operating Relative Humidity" },
  { key: "productDimensions", label: "Product Dimensions" },
];

function SpecsEditor({
  data,
  onSave,
  onClose,
}: {
  data?: SpecsData;
  onSave: (data: SpecsData | undefined) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SpecsData>(() => {
    const init: SpecsData = {};
    for (const { key } of SPECS_FIELDS) init[key] = data?.[key] ?? "";
    return init;
  });

  const filledCount = SPECS_FIELDS.filter(({ key }) => form[key]?.trim()).length;

  const handleSave = () => {
    const result: SpecsData = {};
    let hasAny = false;
    for (const { key } of SPECS_FIELDS) {
      const v = form[key]?.trim();
      if (v) { result[key] = v; hasAny = true; }
    }
    onSave(hasAny ? result : undefined);
  };

  const handleClearAll = () => {
    const cleared: SpecsData = {};
    for (const { key } of SPECS_FIELDS) cleared[key] = "";
    setForm(cleared);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[680px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-[32px] rounded-lg bg-violet-50 flex items-center justify-center">
              <ClipboardList className="size-4 text-violet-600" />
            </div>
            <div>
              <h3 className="text-[16px] text-[#1a1a1a]">Specs</h3>
              <p className="text-[11px] text-[#bbb]">{filledCount} of {SPECS_FIELDS.length} fields filled</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-lg flex items-center justify-center text-[#bbb] hover:text-[#666] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            {SPECS_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-[12px] text-[#888]">{label}</label>
                <input
                  value={form[key] ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="h-[36px] px-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[12px] text-[#bbb] hover:text-[#ba0020] transition-colors cursor-pointer"
          >
            Clear all
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-4 rounded-xl border border-[#e0e0e0] text-[13px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-[36px] px-5 rounded-xl bg-[#ba0020] text-white text-[13px] hover:bg-[#a0001b] transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Manuals 编辑器 ========== */

function ManualItemEditor({
  item,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  item: ManualItem;
  index: number;
  onChange: (updated: ManualItem) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const doUploadCover = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Please select an image file (PNG/JPG, under 5MB).");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange({ ...item, coverImage: result });
    } catch (err: any) {
      console.error("Cover upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e8e8e8] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#f0f0f0]">
        <p className="text-[13px] text-[#555]">Manual {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="size-[28px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
      <div className="p-4 flex gap-4">
        {/* Cover Image */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-[12px] text-[#888]">Cover Image</label>
          {item.coverImage.url ? (
            <div className="relative w-[120px] h-[160px] rounded-lg overflow-hidden border border-[#e0e0e0] group bg-[#f5f5f5]">
              <img src={item.coverImage.url} alt="Cover" className="size-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onChange({ ...item, coverImage: { url: "", path: "" } })}
                  className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="w-[120px] h-[160px] rounded-lg border-2 border-dashed border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) doUploadCover(f);
                  e.target.value = "";
                }}
              />
              {uploading ? (
                <Loader2 className="size-5 text-[#ba0020] animate-spin" />
              ) : (
                <>
                  <Upload className="size-4 text-[#ccc]" />
                  <p className="text-[10px] text-[#bbb] text-center px-2">Upload cover</p>
                </>
              )}
            </div>
          )}
          {error && <p className="text-[11px] text-[#ba0020] max-w-[120px]">{error}</p>}
        </div>

        {/* Name & PDF URL */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#888]">Manual Name</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#bbb]" />
              <input
                value={item.name ?? ""}
                onChange={(e) => onChange({ ...item, name: e.target.value })}
                placeholder="e.g. Quick Start Guide"
                className="w-full h-[36px] pl-9 pr-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020] transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] text-[#888]">PDF URL</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#bbb]" />
                <input
                  value={item.pdfUrl}
                  onChange={(e) => onChange({ ...item, pdfUrl: e.target.value })}
                  placeholder="Paste PDF URL..."
                  className="w-full h-[36px] pl-9 pr-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
              {item.pdfUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ ...item, pdfUrl: "" })}
                  className="size-[36px] shrink-0 rounded-lg border border-[#e0e0e0] flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:border-[#ba0020] transition-colors cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
            {item.pdfUrl && (
              <div className="mt-1 px-3 py-1.5 bg-[#f8f8f8] rounded-lg border border-[#eee]">
                <p className="text-[11px] text-[#999] truncate">
                  <span className="text-[#aaa]">URL:</span> {item.pdfUrl}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualsEditor({
  data,
  onSave,
  onClose,
}: {
  data?: ManualItem[];
  onSave: (data: ManualItem[] | undefined) => void;
  onClose: () => void;
}) {
  const emptyManual = (): ManualItem => ({
    name: "",
    coverImage: { url: "", path: "" },
    pdfUrl: "",
  });

  const [manuals, setManuals] = useState<ManualItem[]>(
    data && data.length > 0 ? data : [emptyManual()]
  );

  const updateManual = (idx: number, updated: ManualItem) => {
    setManuals((prev) => prev.map((m, i) => (i === idx ? updated : m)));
  };

  const removeManual = (idx: number) => {
    setManuals((prev) => prev.filter((_, i) => i !== idx));
  };

  const addManual = () => {
    setManuals((prev) => [...prev, emptyManual()]);
  };

  const handleSave = () => {
    const valid = manuals.filter((m) => m.coverImage.url || m.pdfUrl);
    onSave(valid.length > 0 ? valid : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-[640px] max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-[32px] rounded-lg bg-emerald-50 flex items-center justify-center">
              <BookOpen className="size-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[16px] text-[#1a1a1a]">Manuals</h3>
              <p className="text-[11px] text-[#bbb]">{manuals.length} manual{manuals.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-[32px] rounded-lg flex items-center justify-center text-[#bbb] hover:text-[#666] hover:bg-[#f0f0f0] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {manuals.map((manual, idx) => (
            <ManualItemEditor
              key={idx}
              item={manual}
              index={idx}
              onChange={(updated) => updateManual(idx, updated)}
              onRemove={() => removeManual(idx)}
              canRemove={manuals.length > 1}
            />
          ))}

          <button
            type="button"
            onClick={addManual}
            className="flex items-center justify-center gap-2 h-[40px] rounded-xl border-2 border-dashed border-[#e0e0e0] text-[13px] text-[#999] hover:border-[#ba0020] hover:text-[#ba0020] transition-colors cursor-pointer"
          >
            <Plus className="size-4" />
            Add Manual
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex items-center justify-between shrink-0">
          <p className="text-[12px] text-[#bbb]">
            {manuals.filter((m) => m.coverImage.url || m.pdfUrl).length} manual{manuals.filter((m) => m.coverImage.url || m.pdfUrl).length !== 1 ? "s" : ""} with content
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[36px] px-4 rounded-xl border border-[#e0e0e0] text-[13px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-[36px] px-5 rounded-xl bg-[#ba0020] text-white text-[13px] hover:bg-[#a0001b] transition-colors cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== SPU 编辑表单 ========== */

function SpuForm({
  spu,
  onSave,
  onCancel,
  saving,
  categories,
  defaultCategoryId,
}: {
  spu?: Spu;
  onSave: (s: Omit<Spu, "id">) => void;
  onCancel: () => void;
  saving: boolean;
  categories: Category[];
  defaultCategoryId?: string;
}) {
  const [form, setForm] = useState<Omit<Spu, "id">>({
    name: spu?.name ?? "",
    imageUrl: spu?.imageUrl ?? "",
    imagePath: spu?.imagePath ?? "",
    connectivity: spu?.connectivity ?? "",
    capabilities: spu?.capabilities ?? { ...defaultCapabilities },
    powerSource: spu?.powerSource ?? "",
    batteryLife: spu?.batteryLife ?? "",
    categoryId: spu?.categoryId ?? defaultCategoryId ?? "smoke-alarms",
    setupInstallation: spu?.setupInstallation ?? { ...DEFAULT_SETUP_INSTALLATION, quickStartGuideImages: DEFAULT_SETUP_INSTALLATION.quickStartGuideImages?.map(img => ({ ...img })) },
    specs: spu?.specs ?? { ...DEFAULT_SPECS },
    manuals: spu?.manuals ?? DEFAULT_MANUALS.map(m => ({ ...m, coverImage: { ...m.coverImage } })),
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const [openEditor, setOpenEditor] = useState<string | null>(null);

  const toggleCapability = (key: keyof SpuCapabilities) => {
    setForm((prev) => ({
      ...prev,
      capabilities: { ...prev.capabilities, [key]: !prev.capabilities[key] },
    }));
  };

  const getSetupInstallationSummary = (): string | null => {
    const d = form.setupInstallation;
    if (!d) return null;
    const parts: string[] = [];
    if (d.installationVideoUrl) parts.push("1 video");
    if (d.quickStartGuideImages?.length) parts.push(`${d.quickStartGuideImages.length} image${d.quickStartGuideImages.length > 1 ? "s" : ""}`);
    return parts.length > 0 ? parts.join(" · ") : null;
  };

  const getSpecsSummary = (): string | null => {
    const d = form.specs;
    if (!d) return null;
    const count = SPECS_FIELDS.filter(({ key }) => d[key]?.trim()).length;
    return count > 0 ? `${count} of ${SPECS_FIELDS.length} fields` : null;
  };

  const getManualsSummary = (): string | null => {
    const d = form.manuals;
    if (!d || d.length === 0) return null;
    const valid = d.filter((m) => m.coverImage?.url || m.pdfUrl);
    return valid.length > 0 ? `${valid.length} manual${valid.length !== 1 ? "s" : ""}` : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.imageUrl) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden">
      <div className="px-6 py-4 border-b border-[#f0f0f0] bg-[#fafafa]">
        <h3 className="text-[16px] text-[#1a1a1a]">{spu ? "Edit SPU" : "Add New SPU"}</h3>
      </div>

      <div className="p-6 flex flex-col gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#555]">SPU Name <span className="text-[#ba0020]">*</span></label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. XS0B-MR"
            className="h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
            required
          />
        </div>

        {/* Category selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#555]">
            Category <span className="text-[#ba0020]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = form.categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    const newOpts = getPowerSourceOptions(cat.id);
                    const newConnOpts = getSpuConnectivityOptions(cat.id);
                    setForm((prev) => ({
                      ...prev,
                      categoryId: cat.id,
                      powerSource: prev.powerSource && !newOpts.includes(prev.powerSource) ? "" : prev.powerSource,
                      connectivity: prev.connectivity && !newConnOpts.includes(prev.connectivity) ? "" : prev.connectivity,
                    }));
                  }}
                  className={`px-3 py-[6px] rounded-lg text-[13px] border transition-all cursor-pointer ${
                    active
                      ? "bg-[#ba0020] text-white border-[#ba0020]"
                      : "bg-white text-[#555] border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image */}
        <SpuImageUploader
          imageUrl={form.imageUrl}
          onUploaded={(url, path) => { set("imageUrl", url); set("imagePath", path); }}
          onRemove={() => { set("imageUrl", ""); set("imagePath", ""); }}
        />

        {form.categoryId !== "hub-base-station" && (<>
          {/* Connectivity / Sensor Type (single select) */}
          <RadioSelector
            label={getConnectivityLabel(form.categoryId || "")}
            options={getSpuConnectivityOptions(form.categoryId)}
            value={form.connectivity}
            onChange={(v) => set("connectivity", v)}
          />

          {/* Capabilities (checkbox grid) */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">Capabilities</label>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {SPU_CAPABILITY_OPTIONS.map(({ key, label }) => {
                const checked = form.capabilities[key];
                return (
                  <label key={key} className="inline-flex items-center gap-2 cursor-pointer select-none group">
                    <div
                      className={`size-[18px] rounded flex items-center justify-center border transition-colors shrink-0 ${
                        checked ? "bg-[#ba0020] border-[#ba0020]" : "border-[#d0d0d0] bg-white group-hover:border-[#ba0020]"
                      }`}
                      onClick={() => toggleCapability(key)}
                    >
                      {checked && <Check className="size-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-[13px] text-[#444]" onClick={() => toggleCapability(key)}>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Power Source & Battery Life */}
          <div className="border-t border-dashed border-[#e0e0e0] pt-4">
            <p className="text-[13px] text-[#999] mb-3">Attributes</p>
            <div className="flex flex-col gap-4">
              <RadioSelector label="Power Source" options={getPowerSourceOptions(form.categoryId)} value={form.powerSource} onChange={(v) => set("powerSource", v)} />
              <RadioSelector label="Battery Life" options={SPU_BATTERY_LIFE_OPTIONS} value={form.batteryLife} onChange={(v) => set("batteryLife", v)} />
            </div>
          </div>
        </>)}

        {/* Support & Documentation */}
        <div className="border-t border-dashed border-[#e0e0e0] pt-4">
          <p className="text-[13px] text-[#999] mb-3">Support & Documentation</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: "setupInstallation" as const, label: "Setup & Installation", icon: Wrench, color: "text-amber-600 bg-amber-50", getSummary: getSetupInstallationSummary },
              { key: "specs" as const, label: "Specs", icon: ClipboardList, color: "text-violet-600 bg-violet-50", getSummary: getSpecsSummary },
              { key: "manuals" as const, label: "Manuals", icon: BookOpen, color: "text-emerald-600 bg-emerald-50", getSummary: getManualsSummary },
            ] as const).map(({ key, label, icon: Icon, color, getSummary }) => {
              const summary = getSummary();
              const hasContent = !!summary;
              return (
                <div
                  key={key}
                  onClick={() => setOpenEditor(key)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#e8e8e8] hover:border-[#ba0020] hover:bg-red-50/30 transition-all cursor-pointer group"
                >
                  <div className={`size-[36px] rounded-lg flex items-center justify-center shrink-0 ${hasContent ? color : "bg-[#f5f5f5]"}`}>
                    <Icon className={`size-4 ${hasContent ? "" : "text-[#bbb]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[#333] group-hover:text-[#ba0020] leading-tight">{label}</p>
                    <p className={`text-[11px] mt-[2px] ${hasContent ? "text-green-500" : "text-[#ccc]"}`}>
                      {hasContent ? summary : "Not configured"}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[#ccc] group-hover:text-[#ba0020] shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Setup & Installation Editor Modal */}
      {openEditor === "setupInstallation" && (
        <SetupInstallationEditor
          data={form.setupInstallation}
          onSave={(data) => {
            set("setupInstallation", data);
            setOpenEditor(null);
          }}
          onClose={() => setOpenEditor(null)}
        />
      )}

      {/* Specs Editor Modal */}
      {openEditor === "specs" && (
        <SpecsEditor
          data={form.specs}
          onSave={(data) => {
            set("specs", data as any);
            setOpenEditor(null);
          }}
          onClose={() => setOpenEditor(null)}
        />
      )}

      {/* Manuals Editor Modal */}
      {openEditor === "manuals" && (
        <ManualsEditor
          data={form.manuals}
          onSave={(data) => {
            set("manuals", data as any);
            setOpenEditor(null);
          }}
          onClose={() => setOpenEditor(null)}
        />
      )}

      {/* Actions */}
      <div className="px-6 py-4 border-t border-[#f0f0f0] bg-[#fafafa] flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="h-[38px] px-5 rounded-xl border border-[#e0e0e0] text-[14px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer" disabled={saving}>Cancel</button>
        <button type="submit" disabled={saving} className="h-[38px] px-5 rounded-xl bg-[#ba0020] text-white text-[14px] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2">
          {saving && <Loader2 className="size-4 animate-spin" />}
          {spu ? "Save Changes" : "Add SPU"}
        </button>
      </div>
    </form>
  );
}

/* ========== SPU 行 ========== */

function SpuRow({
  spu, onDelete, onEdit, expanded, onToggle,
}: {
  spu: Spu; onDelete: () => void; onEdit: () => void; expanded: boolean; onToggle: () => void;
}) {
  const capCount = Object.values(spu.capabilities || {}).filter(Boolean).length;

  return (
    <div className="border-b border-[#f0f0f0] last:border-b-0">
      <div className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors" onClick={onToggle}>
        <div className="shrink-0 text-[#bbb]">
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
        <div className="shrink-0 size-[48px] rounded-xl bg-[#f5f5f5] flex items-center justify-center overflow-hidden">
          {spu.imageUrl ? <img src={spu.imageUrl} alt="" className="size-full object-cover" /> : <Layers className="size-5 text-[#ccc]" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-[#1a1a1a] truncate">{spu.name}</p>
          <p className="text-[12px] text-[#999] mt-[2px]">{spu.connectivity || "No connectivity"} · {capCount} capabilit{capCount !== 1 ? "ies" : "y"}</p>
        </div>
        <div className="shrink-0 w-[120px] text-right">
          <p className="text-[12px] text-[#999]">{spu.powerSource || "—"}</p>
        </div>
        <div className="shrink-0 w-[80px] text-right">
          <p className="text-[12px] text-[#999]">{spu.batteryLife || "—"}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="size-[32px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:bg-orange-50 transition-colors cursor-pointer"><Pencil className="size-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="size-[32px] rounded-lg flex items-center justify-center text-[#ccc] hover:text-[#ba0020] hover:bg-red-50 transition-colors cursor-pointer"><Trash2 className="size-4" /></button>
        </div>
      </div>
      {expanded && (
        <div className="px-6 pb-5 pt-1 ml-[28px] grid grid-cols-3 gap-x-6 gap-y-3 text-[13px]">
          <div>
            <p className="text-[#aaa] mb-1">{spu.categoryId === "home-alarms" ? "Sensor Type" : "Connectivity"}</p>
            {spu.connectivity ? <span className="px-2 py-[2px] bg-green-50 text-green-600 rounded text-[12px]">{spu.connectivity}</span> : <p className="text-[#ccc] italic">None</p>}
          </div>
          <div>
            <p className="text-[#aaa] mb-1">Capabilities</p>
            {capCount > 0 ? (
              <div className="flex flex-wrap gap-1">
                {SPU_CAPABILITY_OPTIONS.filter(({ key }) => spu.capabilities?.[key]).map(({ key, label }) => (
                  <span key={key} className="px-2 py-[2px] bg-blue-50 text-blue-600 rounded text-[12px]">{label}</span>
                ))}
              </div>
            ) : <p className="text-[#ccc] italic">None</p>}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <p className="text-[#aaa] mb-1">Power Source</p>
              {spu.powerSource ? <span className="px-2 py-[2px] bg-purple-50 text-purple-600 rounded text-[12px]">{spu.powerSource}</span> : <p className="text-[#ccc] italic">None</p>}
            </div>
            <div>
              <p className="text-[#aaa] mb-1">Battery Life</p>
              {spu.batteryLife ? <span className="px-2 py-[2px] bg-orange-50 text-orange-600 rounded text-[12px]">{spu.batteryLife}</span> : <p className="text-[#ccc] italic">None</p>}
            </div>
          </div>
          <div className="col-span-3 border-t border-dashed border-[#f0f0f0] pt-3 mt-1">
            <p className="text-[#aaa] mb-2">Support & Documentation</p>
            <div className="flex flex-wrap gap-2">
              {([
                {
                  key: "setupInstallation",
                  label: "Setup & Installation",
                  check: () => {
                    const d = spu.setupInstallation;
                    return !!(d?.installationVideoUrl || d?.quickStartGuideImages?.length);
                  },
                },
                { key: "specs", label: "Specs", check: () => !!spu.specs && SPECS_FIELDS.some(({ key }) => spu.specs?.[key]?.trim()) },
                { key: "manuals", label: "Manuals", check: () => !!spu.manuals?.length && spu.manuals.some((m) => m.coverImage?.url || m.pdfUrl) },
              ]).map(({ key, label, check }) => {
                const hasContent = check();
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1 px-2 py-[2px] rounded text-[12px] ${
                      hasContent ? "bg-green-50 text-green-600" : "bg-gray-50 text-[#bbb]"
                    }`}
                  >
                    {hasContent ? <Check className="size-3" /> : null}
                    {label}
                    {!hasContent && <span className="ml-0.5">—</span>}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== SPU 管理面板 ========== */

function SpuPanel({ showToast, categories, selectedCategoryId }: { showToast: (msg: string, type?: "success" | "error") => void; categories: Category[]; selectedCategoryId: string }) {
  const [spus, setSpus] = useState<Spu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSpu, setEditingSpu] = useState<Spu | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingSpu, setDeletingSpu] = useState<Spu | null>(null);
  const [search, setSearch] = useState("");

  const loadSpus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet<{ spus: Spu[] }>("/spus");
      setSpus(data.spus || []);
    } catch (err: any) {
      console.error("Failed to load SPUs:", err);
      showToast(err.message || "Failed to load SPUs", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadSpus(); }, [loadSpus]);

  const filteredSpus = spus
    .filter((s) => (s.categoryId || "smoke-alarms") === selectedCategoryId)
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = useCallback(async (data: Omit<Spu, "id">) => {
    setSaving(true);
    try {
      const result = await apiPost<{ spu: Spu }>("/spus", { ...data, id: Date.now().toString() });
      setSpus((prev) => [result.spu, ...prev]);
      setShowForm(false);
      showToast("SPU added successfully!");
    } catch (err: any) {
      console.error("Failed to add SPU:", err);
      showToast(err.message || "Failed to add SPU", "error");
    } finally { setSaving(false); }
  }, [showToast]);

  const handleEdit = useCallback(async (data: Omit<Spu, "id">) => {
    if (!editingSpu) return;
    setSaving(true);
    try {
      const result = await apiPost<{ spu: Spu }>("/spus", { ...data, id: editingSpu.id });
      setSpus((prev) => prev.map((s) => (s.id === editingSpu.id ? result.spu : s)));
      setEditingSpu(null);
      showToast("SPU updated successfully!");
    } catch (err: any) {
      console.error("Failed to update SPU:", err);
      showToast(err.message || "Failed to update SPU", "error");
    } finally { setSaving(false); }
  }, [editingSpu, showToast]);

  const handleDelete = useCallback(async (spu: Spu) => {
    setDeleting(true);
    try {
      await apiDelete(`/spus/${spu.id}`);
      setSpus((prev) => prev.filter((s) => s.id !== spu.id));
      setDeletingSpu(null);
      setExpandedId(null);
      showToast("SPU deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete SPU:", err);
      showToast(err.message || "Failed to delete SPU", "error");
    } finally { setDeleting(false); }
  }, [showToast]);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-[#eee]">
          <p className="text-[12px] text-[#aaa] mb-1">SPUs in Category</p>
          <p className="text-[28px] text-[#1a1a1a] leading-tight">{loading ? "—" : filteredSpus.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#eee]">
          <p className="text-[12px] text-[#aaa] mb-1">With Wi-Fi</p>
          <p className="text-[28px] text-[#1a1a1a] leading-tight">{loading ? "—" : filteredSpus.filter((s) => s.connectivity === "Wi-Fi (App)").length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-[#eee]">
          <p className="text-[12px] text-[#aaa] mb-1">Base Station</p>
          <p className="text-[28px] text-[#1a1a1a] leading-tight">{loading ? "—" : filteredSpus.filter((s) => s.connectivity === "Base Station Interconnected (App)").length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#bbb]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search SPUs..." className="h-[40px] w-full max-w-[300px] pl-9 pr-3 rounded-xl border border-[#e0e0e0] bg-white text-[14px] outline-none focus:border-[#ba0020] transition-colors" />
        </div>
        <button
          onClick={() => { if (showForm || editingSpu) { setShowForm(false); setEditingSpu(null); } else { setShowForm(true); setEditingSpu(null); } }}
          className={`flex items-center gap-2 h-[40px] px-5 rounded-xl text-[14px] transition-colors cursor-pointer ${showForm || editingSpu ? "bg-[#f5f5f5] text-[#666] border border-[#e0e0e0]" : "bg-[#ba0020] text-white hover:bg-[#a0001b]"}`}
        >
          {showForm || editingSpu ? <><X className="size-4" /> Close Form</> : <><Plus className="size-4" /> Add SPU</>}
        </button>
      </div>

      {/* Forms */}
      {showForm && !editingSpu && <div className="mb-6"><SpuForm onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} categories={categories} defaultCategoryId={selectedCategoryId} /></div>}
      {editingSpu && <div className="mb-6"><SpuForm key={editingSpu.id} spu={editingSpu} onSave={handleEdit} onCancel={() => setEditingSpu(null)} saving={saving} categories={categories} defaultCategoryId={selectedCategoryId} /></div>}

      {/* SPU list */}
      <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-[#f0f0f0] bg-[#fafafa] text-[12px] text-[#aaa]">
          <div className="shrink-0 w-4" />
          <div className="shrink-0 w-[48px]">Image</div>
          <div className="flex-1">SPU Name</div>
          <div className="shrink-0 w-[120px] text-right">Power Source</div>
          <div className="shrink-0 w-[80px] text-right">Battery</div>
          <div className="shrink-0 w-[68px] text-right">Actions</div>
        </div>
        {loading ? (
          <div className="py-16 flex flex-col items-center text-[#ccc]">
            <Loader2 className="size-8 animate-spin mb-3 text-[#ba0020]" />
            <p className="text-[14px] text-[#999]">Loading SPUs...</p>
          </div>
        ) : filteredSpus.length > 0 ? (
          filteredSpus.map((spu) => (
            <SpuRow key={spu.id} spu={spu} onDelete={() => setDeletingSpu(spu)} onEdit={() => { setEditingSpu(spu); setShowForm(false); }} expanded={expandedId === spu.id} onToggle={() => setExpandedId((prev) => (prev === spu.id ? null : spu.id))} />
          ))
        ) : (
          <div className="py-16 flex flex-col items-center text-[#ccc]">
            <Layers className="size-10 mb-3" />
            <p className="text-[14px]">{search ? "No SPUs found" : "No SPUs yet"}</p>
            {!search && <p className="text-[12px] mt-1">Click "Add SPU" to get started</p>}
          </div>
        )}
      </div>

      {/* Delete dialog */}
      {deletingSpu && (
        <DeleteConfirmDialog productName={deletingSpu.name} onConfirm={() => handleDelete(deletingSpu)} onCancel={() => setDeletingSpu(null)} deleting={deleting} />
      )}
    </>
  );
}

/* ========== 分类管理面板 ========== */

function CategoryCoverUploader({
  imageUrl,
  onUploaded,
  onRemove,
}: {
  imageUrl: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("Cover image upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative w-full h-[120px] rounded-xl overflow-hidden border border-[#e0e0e0] group">
        <img src={imageUrl} alt="Cover" className="size-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#555] hover:bg-white transition-colors cursor-pointer"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }}
        />
      </div>
    );
  }

  return (
    <div
      className="w-full h-[120px] rounded-xl border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#ba0020] hover:bg-[#fafafa] transition-colors"
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }}
      />
      {uploading ? (
        <Loader2 className="size-5 text-[#ba0020] animate-spin" />
      ) : (
        <>
          <Upload className="size-5 text-[#ccc]" />
          <p className="text-[12px] text-[#999]">Upload Cover</p>
        </>
      )}
    </div>
  );
}

function CategoryBannerUploader({
  label,
  icon,
  imageUrl,
  onUploaded,
  onRemove,
}: {
  label: string;
  icon: React.ReactNode;
  imageUrl: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch (err: any) {
      console.error("Banner upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <p className="text-[12px] text-[#888] font-medium">{label}</p>
      </div>
      {imageUrl ? (
        <div className="relative w-full h-[80px] rounded-lg overflow-hidden border border-[#e0e0e0] group">
          <img src={imageUrl} alt={label} className="size-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="size-7 rounded-full bg-white/90 flex items-center justify-center text-[#555] hover:bg-white transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="size-7 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }}
          />
        </div>
      ) : (
        <div
          className="w-full h-[80px] rounded-lg border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#ba0020] hover:bg-[#fafafa] transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) doUpload(f); e.target.value = ""; }}
          />
          {uploading ? (
            <Loader2 className="size-4 text-[#ba0020] animate-spin" />
          ) : (
            <>
              <Upload className="size-4 text-[#ccc]" />
              <p className="text-[11px] text-[#999]">Upload</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryPanel({
  categories,
  onUpdate,
  showToast,
}: {
  categories: Category[];
  onUpdate: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [saving, setSaving] = useState<string | null>(null);
  const [editingDesc, setEditingDesc] = useState<Record<string, string>>({});

  const saveCategoryField = async (cat: Category, patch: Partial<Category>) => {
    setSaving(cat.id);
    try {
      await apiPost("/categories", { ...cat, ...patch });
      onUpdate();
    } catch (err: any) {
      console.error("Failed to update category:", err);
      showToast(err.message || "Failed to update category", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleCoverUploaded = async (cat: Category, url: string, path: string) => {
    await saveCategoryField(cat, { coverImageUrl: url, coverImagePath: path });
    showToast(`Cover image for "${cat.name}" updated!`);
  };

  const handleCoverRemove = async (cat: Category) => {
    setSaving(cat.id);
    try {
      if (cat.coverImagePath) {
        try { await apiPost("/delete-image", { path: cat.coverImagePath }); } catch {}
      }
      await apiPost("/categories", { ...cat, coverImageUrl: "", coverImagePath: "" });
      onUpdate();
      showToast(`Cover image for "${cat.name}" removed.`);
    } catch (err: any) {
      console.error("Failed to remove category cover:", err);
      showToast(err.message || "Failed to remove cover", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleBannerUploaded = async (cat: Category, field: "bannerPc" | "bannerMobile", url: string, path: string) => {
    const urlKey = `${field}Url` as keyof Category;
    const pathKey = `${field}Path` as keyof Category;
    await saveCategoryField(cat, { [urlKey]: url, [pathKey]: path } as any);
    showToast(`${field === "bannerPc" ? "PC" : "Mobile"} banner for "${cat.name}" updated!`);
  };

  const handleBannerRemove = async (cat: Category, field: "bannerPc" | "bannerMobile") => {
    const urlKey = `${field}Url` as keyof Category;
    const pathKey = `${field}Path` as keyof Category;
    setSaving(cat.id);
    try {
      const oldPath = cat[pathKey] as string;
      if (oldPath) {
        try { await apiPost("/delete-image", { path: oldPath }); } catch {}
      }
      await apiPost("/categories", { ...cat, [urlKey]: "", [pathKey]: "" });
      onUpdate();
      showToast(`${field === "bannerPc" ? "PC" : "Mobile"} banner for "${cat.name}" removed.`);
    } catch (err: any) {
      console.error("Failed to remove banner:", err);
      showToast(err.message || "Failed to remove banner", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleDescBlur = async (cat: Category) => {
    const newDesc = editingDesc[cat.id];
    if (newDesc === undefined || newDesc === (cat.description || "")) return;
    await saveCategoryField(cat, { description: newDesc });
    showToast(`Description for "${cat.name}" updated!`);
  };

  return (
    <>
      <div className="mb-6">
        <p className="text-[14px] text-[#888] mb-1">
          Manage product categories. Configure cover images, descriptions, and banners for PC and mobile.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-[#eee] overflow-hidden"
          >
            {/* Header row: cover + name */}
            <div className="flex items-stretch">
              <div className="w-[200px] shrink-0 p-4">
                <CategoryCoverUploader
                  imageUrl={cat.coverImageUrl}
                  onUploaded={(url, path) => handleCoverUploaded(cat, url, path)}
                  onRemove={() => handleCoverRemove(cat)}
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                {/* Name & slug */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="size-[32px] rounded-lg bg-[#f5f5f5] flex items-center justify-center shrink-0">
                      <FolderOpen className="size-4 text-[#999]" />
                    </div>
                    <div>
                      <p className="text-[14px] text-[#1a1a1a] font-medium">{cat.name}</p>
                      <p className="text-[11px] text-[#bbb]">/{cat.slug}</p>
                    </div>
                  </div>
                  {saving === cat.id && (
                    <Loader2 className="size-4 text-[#ba0020] animate-spin" />
                  )}
                </div>
                {/* Description textarea */}
                <div className="mt-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FileText className="size-3.5 text-[#999]" />
                    <p className="text-[12px] text-[#888] font-medium">描述文案</p>
                  </div>
                  <textarea
                    className="w-full text-[13px] text-[#333] bg-[#fafafa] border border-[#e5e5e5] rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[#ba0020] transition-colors placeholder:text-[#ccc]"
                    rows={2}
                    placeholder="输入分类描述文案…"
                    value={editingDesc[cat.id] ?? (cat.description || "")}
                    onChange={(e) => setEditingDesc((prev) => ({ ...prev, [cat.id]: e.target.value }))}
                    onBlur={() => handleDescBlur(cat)}
                  />
                </div>
              </div>
            </div>
            {/* Banner uploaders row */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-4 border-t border-[#f0f0f0] pt-3 mx-4">
              <CategoryBannerUploader
                label="Banner（PC端）"
                icon={<Monitor className="size-3.5 text-[#999]" />}
                imageUrl={cat.bannerPcUrl || ""}
                onUploaded={(url, path) => handleBannerUploaded(cat, "bannerPc", url, path)}
                onRemove={() => handleBannerRemove(cat, "bannerPc")}
              />
              <CategoryBannerUploader
                label="Banner（移动端）"
                icon={<Smartphone className="size-3.5 text-[#999]" />}
                imageUrl={cat.bannerMobileUrl || ""}
                onUploaded={(url, path) => handleBannerUploaded(cat, "bannerMobile", url, path)}
                onRemove={() => handleBannerRemove(cat, "bannerMobile")}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ========== Support - App 面板 ========== */

interface SupportAppData {
  iconUrl?: string;
  iconPath?: string;
  appName?: string;
  appDescription?: string;
  iosVersion?: string;
  androidVersion?: string;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  answerImageUrl?: string;
  answerImagePath?: string;
}

interface FaqCategoryData {
  items: FaqItem[];
}

function SupportAppPanel({ showToast }: { showToast: (msg: string, type?: "success" | "error") => void }) {
  const [data, setData] = useState<SupportAppData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiGet<{ data: SupportAppData | null }>("/support/app");
      if (result.data) setData(result.data);
    } catch (err: any) {
      if (err.message?.includes("404")) {
        console.log("Support app config not found, starting fresh.");
      } else {
        console.error("Failed to load app config:", err);
        showToastRef.current(err.message || "Failed to load app config", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/support/app", data);
      showToast("App config saved successfully!");
    } catch (err: any) {
      console.error("Failed to save app config:", err);
      showToast(err.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleIconUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setData((prev) => ({ ...prev, iconUrl: result.url, iconPath: result.path }));
    } catch (err: any) {
      console.error("Icon upload error:", err);
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-[#ba0020] mb-3" />
        <p className="text-[14px] text-[#999]">Loading app config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[640px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] text-[#1a1a1a]">App Configuration</h2>
          <p className="text-[13px] text-[#999] mt-1">Manage your app's information displayed on the support page</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="h-[38px] px-5 rounded-xl bg-[#ba0020] text-white text-[14px] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden">
        <div className="p-6 flex flex-col gap-6">
          {/* App Icon */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">App Icon</label>
            <div className="flex items-center gap-4">
              {data.iconUrl ? (
                <div className="relative size-[80px] rounded-2xl overflow-hidden border border-[#e0e0e0] group bg-[#f5f5f5] shrink-0">
                  <img src={data.iconUrl} alt="App Icon" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, iconUrl: "", iconPath: "" }))}
                      className="size-8 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="size-[80px] rounded-2xl border-2 border-dashed border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleIconUpload(f);
                      e.target.value = "";
                    }}
                  />
                  {uploading ? (
                    <Loader2 className="size-5 text-[#ba0020] animate-spin" />
                  ) : (
                    <>
                      <Upload className="size-4 text-[#ccc]" />
                      <p className="text-[10px] text-[#bbb]">Upload</p>
                    </>
                  )}
                </div>
              )}
              <div className="text-[12px] text-[#bbb]">
                <p>Recommended: 512×512px</p>
                <p>PNG or JPG, up to 5MB</p>
              </div>
            </div>
          </div>

          {/* App Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">App Name</label>
            <input
              value={data.appName ?? ""}
              onChange={(e) => setData((prev) => ({ ...prev, appName: e.target.value }))}
              placeholder="e.g. X-Sense Home Security"
              className="h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
            />
          </div>

          {/* App Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">App Description</label>
            <textarea
              value={data.appDescription ?? ""}
              onChange={(e) => setData((prev) => ({ ...prev, appDescription: e.target.value }))}
              placeholder="Brief description of what the app does..."
              rows={3}
              className="px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* App Versions */}
          <div className="flex flex-col gap-2">
            <label className="text-[13px] text-[#555]">App Version</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-[20px] rounded bg-[#f5f5f5] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="size-3 text-[#999]" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.99 2.97 12.5 4.7 9.56C5.55 8.09 7.13 7.18 8.82 7.15C10.1 7.13 11.32 8.01 12.11 8.01C12.89 8.01 14.37 6.95 15.92 7.12C16.57 7.14 18.39 7.38 19.56 9.07C19.47 9.13 17.29 10.38 17.31 13.01C17.34 16.16 20.07 17.19 20.1 17.2C20.07 17.27 19.63 18.76 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
                  </div>
                  <span className="text-[12px] text-[#888]">iOS</span>
                </div>
                <input
                  value={data.iosVersion ?? ""}
                  onChange={(e) => setData((prev) => ({ ...prev, iosVersion: e.target.value }))}
                  placeholder="e.g. 3.2.1"
                  className="h-[36px] px-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="size-[20px] rounded bg-[#f5f5f5] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="size-3 text-[#999]" fill="currentColor"><path d="M6 18C6 18.55.45 19 1 19H2V22.5C2 23.33 2.67 24 3.5 24S5 23.33 5 22.5V19H7V22.5C7 23.33 7.67 24 8.5 24S10 23.33 10 22.5V19H11C11.55 19 12 18.55 12 18V8H6V18ZM3.5 8C2.67 8 2 8.67 2 9.5V16.5C2 17.33 2.67 18 3.5 18S5 17.33 5 16.5V9.5C5 8.67 4.33 8 3.5 8ZM14.5 8C13.67 8 13 8.67 13 9.5V16.5C13 17.33 13.67 18 14.5 18S16 17.33 16 16.5V9.5C16 8.67 15.33 8 14.5 8ZM11.5 1.29L12.79.01C12.89-.04 12.89-.15 12.79-.25L12.5-.54C12.4-.64 12.29-.64 12.19-.54L10.72.94C10.08.68 9.36.54 8.6.54S7.12.68 6.48.94L5.01-.54C4.91-.64 4.8-.64 4.71-.54L4.41-.25C4.31-.15 4.31-.04 4.41.01L5.7 1.29C4.17 2.13 3.14 3.69 3.03 5.5H14.17C14.06 3.69 13.03 2.13 11.5 1.29ZM7 4.5C6.72 4.5 6.5 4.28 6.5 4S6.72 3.5 7 3.5 7.5 3.72 7.5 4 7.28 4.5 7 4.5ZM11 4.5C10.72 4.5 10.5 4.28 10.5 4S10.72 3.5 11 3.5 11.5 3.72 11.5 4 11.28 4.5 11 4.5Z" transform="translate(3,0)"/></svg>
                  </div>
                  <span className="text-[12px] text-[#888]">Android</span>
                </div>
                <input
                  value={data.androidVersion ?? ""}
                  onChange={(e) => setData((prev) => ({ ...prev, androidVersion: e.target.value }))}
                  placeholder="e.g. 3.2.0"
                  className="h-[36px] px-3 rounded-lg border border-[#e0e0e0] text-[13px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Support - FAQs 面板 ========== */

function FaqAnswerImageUploader({
  imageUrl,
  onUploaded,
  onRemove,
}: {
  imageUrl?: string;
  onUploaded: (url: string, path: string) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const doUpload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return;
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onUploaded(result.url, result.path);
    } catch {
      /* handled by caller */
    } finally {
      setUploading(false);
    }
  };

  if (imageUrl) {
    return (
      <div className="relative w-[120px] h-[90px] rounded-lg overflow-hidden border border-[#e0e0e0] group shrink-0">
        <img src={imageUrl} alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="size-7 rounded-full bg-white/90 flex items-center justify-center text-[#ba0020] hover:bg-white transition-colors cursor-pointer"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[120px] h-[90px] rounded-lg border-2 border-dashed border-[#e0e0e0] hover:border-[#ba0020] hover:bg-[#fafafa] flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) doUpload(f);
          e.target.value = "";
        }}
      />
      {uploading ? (
        <Loader2 className="size-4 text-[#ba0020] animate-spin" />
      ) : (
        <>
          <ImagePlus className="size-4 text-[#ccc]" />
          <p className="text-[10px] text-[#bbb]">Add Image</p>
        </>
      )}
    </div>
  );
}

function SupportFaqsPanel({
  showToast,
  categories,
}: {
  showToast: (msg: string, type?: "success" | "error") => void;
  categories: Category[];
}) {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id ?? "");
  const [faqData, setFaqData] = useState<FaqCategoryData>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImagePath, setNewImagePath] = useState("");
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const loadFaqs = useCallback(async (catId: string) => {
    try {
      setLoading(true);
      const result = await apiGet<{ data: FaqCategoryData | null }>(`/faqs/${catId}`);
      setFaqData(result.data ?? { items: [] });
    } catch (err: any) {
      if (!err.message?.includes("404")) {
        showToastRef.current(err.message || "Failed to load FAQs", "error");
      }
      setFaqData({ items: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCatId) loadFaqs(selectedCatId);
  }, [selectedCatId, loadFaqs]);

  useEffect(() => {
    if (categories.length > 0 && !categories.find((c) => c.id === selectedCatId)) {
      setSelectedCatId(categories[0].id);
    }
  }, [categories, selectedCatId]);

  const saveFaqs = async (items: FaqItem[]) => {
    setSaving(true);
    try {
      await apiPost(`/faqs/${selectedCatId}`, { items });
      setFaqData({ items });
      showToast("FAQs saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save FAQs", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddFaq = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      showToast("Question and Answer are required", "error");
      return;
    }
    const item: FaqItem = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      answerImageUrl: newImageUrl || undefined,
      answerImagePath: newImagePath || undefined,
    };
    const newItems = [...faqData.items, item];
    await saveFaqs(newItems);
    setNewQuestion("");
    setNewAnswer("");
    setNewImageUrl("");
    setNewImagePath("");
    setShowAddForm(false);
  };

  const handleUpdateFaq = async (id: string, updates: Partial<FaqItem>) => {
    const newItems = faqData.items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    await saveFaqs(newItems);
    setEditingId(null);
  };

  const handleDeleteFaq = async (id: string) => {
    const newItems = faqData.items.filter((item) => item.id !== id);
    await saveFaqs(newItems);
  };

  const handleMoveFaq = async (id: string, direction: "up" | "down") => {
    const idx = faqData.items.findIndex((item) => item.id === id);
    if (idx < 0) return;
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= faqData.items.length) return;
    const newItems = [...faqData.items];
    [newItems[idx], newItems[target]] = [newItems[target], newItems[idx]];
    await saveFaqs(newItems);
  };

  const selectedCat = categories.find((c) => c.id === selectedCatId);

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] text-[#1a1a1a]">FAQs Management</h2>
          <p className="text-[13px] text-[#999] mt-1">
            Manage frequently asked questions for each product category
          </p>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#f5f5f5] rounded-xl p-[3px] mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCatId(cat.id);
              setShowAddForm(false);
              setEditingId(null);
            }}
            className={`px-4 py-[7px] rounded-lg text-[13px] transition-all cursor-pointer whitespace-nowrap ${
              selectedCatId === cat.id
                ? "bg-white text-[#1a1a1a] shadow-sm"
                : "text-[#888] hover:text-[#555]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-[#ba0020]" />
          <span className="text-[14px] text-[#1a1a1a]">{selectedCat?.name ?? ""}</span>
          {!loading && (
            <span className="text-[12px] text-[#aaa] ml-1">
              ({faqData.items.length} {faqData.items.length === 1 ? "item" : "items"})
            </span>
          )}
        </div>
        <button
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setNewQuestion("");
              setNewAnswer("");
              setNewImageUrl("");
              setNewImagePath("");
            } else {
              setShowAddForm(true);
              setEditingId(null);
            }
          }}
          className={`flex items-center gap-2 h-[38px] px-4 rounded-xl text-[13px] transition-colors cursor-pointer ${
            showAddForm
              ? "bg-[#f5f5f5] text-[#666] border border-[#e0e0e0]"
              : "bg-[#ba0020] text-white hover:bg-[#a0001b]"
          }`}
        >
          {showAddForm ? (
            <>
              <X className="size-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              Add FAQ
            </>
          )}
        </button>
      </div>

      {/* Add FAQ form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-[#e8e8e8] p-6 mb-4">
          <h3 className="text-[15px] text-[#1a1a1a] mb-4">New FAQ</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#555]">Question <span className="text-[#ba0020]">*</span></label>
              <input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter the question..."
                className="h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#555]">Answer <span className="text-[#ba0020]">*</span></label>
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Enter the answer..."
                rows={4}
                className="px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-none leading-relaxed"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#555]">Answer Image <span className="text-[11px] text-[#bbb]">(optional)</span></label>
              <FaqAnswerImageUploader
                imageUrl={newImageUrl}
                onUploaded={(url, path) => {
                  setNewImageUrl(url);
                  setNewImagePath(path);
                }}
                onRemove={() => {
                  setNewImageUrl("");
                  setNewImagePath("");
                }}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewQuestion("");
                  setNewAnswer("");
                  setNewImageUrl("");
                  setNewImagePath("");
                }}
                className="h-[36px] px-4 rounded-lg text-[13px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFaq}
                disabled={saving || !newQuestion.trim() || !newAnswer.trim()}
                className="h-[36px] px-5 rounded-lg text-[13px] bg-[#ba0020] text-white hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                Add FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#ba0020] mb-3" />
          <p className="text-[14px] text-[#999]">Loading FAQs...</p>
        </div>
      ) : faqData.items.length === 0 && !showAddForm ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-[56px] rounded-2xl bg-[#f5f5f5] flex items-center justify-center mb-4">
            <MessageSquare className="size-6 text-[#ccc]" />
          </div>
          <p className="text-[14px] text-[#999]">No FAQs yet for {selectedCat?.name ?? "this category"}</p>
          <p className="text-[12px] text-[#ccc] mt-1">Click "Add FAQ" to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {faqData.items.map((item, idx) => {
            const isEditing = editingId === item.id;
            return (
              <FaqItemCard
                key={item.id}
                item={item}
                index={idx}
                total={faqData.items.length}
                isEditing={isEditing}
                saving={saving}
                onEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
                onSave={(updates) => handleUpdateFaq(item.id, updates)}
                onDelete={() => handleDeleteFaq(item.id)}
                onMove={(dir) => handleMoveFaq(item.id, dir)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function FaqItemCard({
  item,
  index,
  total,
  isEditing,
  saving,
  onEdit,
  onCancelEdit,
  onSave,
  onDelete,
  onMove,
}: {
  item: FaqItem;
  index: number;
  total: number;
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (updates: Partial<FaqItem>) => void;
  onDelete: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const [q, setQ] = useState(item.question);
  const [a, setA] = useState(item.answer);
  const [imgUrl, setImgUrl] = useState(item.answerImageUrl ?? "");
  const [imgPath, setImgPath] = useState(item.answerImagePath ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setQ(item.question);
      setA(item.answer);
      setImgUrl(item.answerImageUrl ?? "");
      setImgPath(item.answerImagePath ?? "");
    }
  }, [isEditing, item]);

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl border-2 border-[#ba0020]/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[14px] text-[#1a1a1a]">Edit FAQ #{index + 1}</h4>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-[#555]">Question</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-[#555]">Answer</label>
            <textarea
              value={a}
              onChange={(e) => setA(e.target.value)}
              rows={4}
              className="px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-none leading-relaxed"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-[#555]">Answer Image <span className="text-[11px] text-[#bbb]">(optional)</span></label>
            <FaqAnswerImageUploader
              imageUrl={imgUrl}
              onUploaded={(url, path) => {
                setImgUrl(url);
                setImgPath(path);
              }}
              onRemove={() => {
                setImgUrl("");
                setImgPath("");
              }}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onCancelEdit}
              className="h-[36px] px-4 rounded-lg text-[13px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  question: q.trim(),
                  answer: a.trim(),
                  answerImageUrl: imgUrl || undefined,
                  answerImagePath: imgPath || undefined,
                })
              }
              disabled={saving || !q.trim() || !a.trim()}
              className="h-[36px] px-5 rounded-lg text-[13px] bg-[#ba0020] text-white hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e8e8e8] hover:border-[#d0d0d0] transition-colors overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <span className="text-[12px] text-[#bbb] mt-0.5 shrink-0 w-[20px] text-right tabular-nums">{index + 1}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] text-[#1a1a1a] leading-snug mb-2">{item.question}</h4>
            <p className="text-[13px] text-[#666] leading-relaxed whitespace-pre-wrap">{item.answer}</p>
            {item.answerImageUrl && (
              <div className="mt-3">
                <img
                  src={item.answerImageUrl}
                  alt=""
                  className="max-w-[200px] max-h-[150px] rounded-lg border border-[#e0e0e0] object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onMove("up")}
              disabled={index === 0 || saving}
              className="size-7 rounded-lg flex items-center justify-center text-[#aaa] hover:bg-[#f5f5f5] hover:text-[#555] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
              title="Move up"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              onClick={() => onMove("down")}
              disabled={index === total - 1 || saving}
              className="size-7 rounded-lg flex items-center justify-center text-[#aaa] hover:bg-[#f5f5f5] hover:text-[#555] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
              title="Move down"
            >
              <ChevronDown className="size-3.5" />
            </button>
            <button
              onClick={onEdit}
              className="size-7 rounded-lg flex items-center justify-center text-[#aaa] hover:bg-[#f5f5f5] hover:text-[#ba0020] transition-colors cursor-pointer"
              title="Edit"
            >
              <Pencil className="size-3.5" />
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => {
                    onDelete();
                    setConfirmDelete(false);
                  }}
                  disabled={saving}
                  className="h-7 px-2.5 rounded-lg text-[11px] bg-[#ba0020] text-white hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="h-7 px-2 rounded-lg text-[11px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="size-7 rounded-lg flex items-center justify-center text-[#aaa] hover:bg-[#fef2f2] hover:text-[#ba0020] transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Product Card Panel ========== */

function ProductCardPanel({
  cards,
  spus,
  saving,
  onAdd,
  onSave,
  showModal,
  onCloseModal,
  showToast,
  selectedCategoryId,
}: {
  cards: ProductCardItem[];
  spus: Spu[];
  saving: boolean;
  onAdd: () => void;
  onSave: (card: Omit<ProductCardItem, "id">) => void;
  showModal: boolean;
  onCloseModal: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
  selectedCategoryId: string;
}) {
  const [cardName, setCardName] = useState("");
  const [selectedSpuIds, setSelectedSpuIds] = useState<string[]>([]);
  const [spuDropdownOpen, setSpuDropdownOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [sellingPoint, setSellingPoint] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showModal) {
      setCardName("");
      setSelectedSpuIds([]);
      setCoverFile(null);
      setCoverPreview("");
      setSellingPoint("");
    }
  }, [showModal]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSpuDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleSpu = (id: string) => {
    setSelectedSpuIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!cardName.trim()) { showToast("Please enter a Card name", "error"); return; }
    if (selectedSpuIds.length === 0) { showToast("Please select at least one SPU", "error"); return; }
    if (!coverFile) { showToast("Please upload a cover image", "error"); return; }
    if (!sellingPoint.trim()) { showToast("Please enter a selling point", "error"); return; }

    setUploading(true);
    try {
      const imgResult = await uploadImage(coverFile);
      onSave({
        name: cardName.trim(),
        spuIds: selectedSpuIds,
        coverImageUrl: imgResult.url,
        coverImagePath: imgResult.path,
        sellingPoint: sellingPoint.trim(),
      });
    } catch (err: any) {
      showToast(err.message || "Image upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const filteredCards = cards.filter((c) =>
    c.spuIds.some((sid) => {
      const spu = spus.find((s) => s.id === sid);
      return spu && (spu.categoryId || "smoke-alarms") === selectedCategoryId;
    })
  );

  return (
    <>
      {/* Header + Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] text-[#1a1a1a]">Product Cards</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 h-[40px] px-5 rounded-xl text-[14px] bg-[#ba0020] text-white hover:bg-[#a0001b] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Add Product Card
        </button>
      </div>

      {/* Card list or empty state */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#eee] py-24 flex flex-col items-center text-[#ccc]">
          <CreditCard className="size-12 mb-4" />
          <p className="text-[15px] text-[#999]">No product cards in this category</p>
          <p className="text-[13px] text-[#bbb] mt-1">Click &quot;Add Product Card&quot; to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
              {card.coverImageUrl && (
                <div className="h-[160px] bg-[#f5f5f5]">
                  <img src={card.coverImageUrl} alt={card.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-[15px] text-[#1a1a1a] font-medium mb-1">{card.name}</h3>
                <p className="text-[13px] text-[#666] mb-2">{card.sellingPoint}</p>
                <p className="text-[11px] text-[#aaa]">
                  {card.spuIds.length} SPU{card.spuIds.length !== 1 ? "s" : ""} linked
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseModal} />
          <div className="relative bg-white rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0f0]">
              <h3 className="text-[16px] text-[#1a1a1a] font-medium">Add Product Card</h3>
              <button onClick={onCloseModal} className="size-8 rounded-lg flex items-center justify-center text-[#999] hover:bg-[#f5f5f5] transition-colors cursor-pointer">
                <X className="size-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* 1. Card Name */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Card Name</label>
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Enter card name"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>

              {/* 2. SPU multi-select */}
              <div ref={dropdownRef}>
                <label className="block text-[13px] text-[#555] mb-1.5">Linked SPUs</label>
                <div
                  onClick={() => setSpuDropdownOpen(!spuDropdownOpen)}
                  className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-[#e0e0e0] text-[14px] cursor-pointer flex flex-wrap gap-1.5 items-center hover:border-[#ba0020] transition-colors"
                >
                  {selectedSpuIds.length === 0 ? (
                    <span className="text-[#bbb]">Select SPUs...</span>
                  ) : (
                    selectedSpuIds.map((sid) => {
                      const spu = spus.find((s) => s.id === sid);
                      return (
                        <span
                          key={sid}
                          className="inline-flex items-center gap-1 bg-[#fef2f2] text-[#ba0020] text-[12px] px-2 py-0.5 rounded-lg"
                        >
                          {spu?.name || sid}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSpu(sid); }}
                            className="hover:text-[#800] cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
                {spuDropdownOpen && (() => {
                  const categorySpus = spus.filter((s) => (s.categoryId || "smoke-alarms") === selectedCategoryId);
                  return (
                  <div className="mt-1 border border-[#e0e0e0] rounded-xl bg-white shadow-lg max-h-[200px] overflow-y-auto z-10 relative">
                    {categorySpus.length === 0 ? (
                      <div className="px-3 py-3 text-[13px] text-[#aaa] text-center">No SPUs in this category</div>
                    ) : (
                      categorySpus.map((spu) => {
                        const checked = selectedSpuIds.includes(spu.id);
                        return (
                          <button
                            key={spu.id}
                            onClick={() => toggleSpu(spu.id)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[13px] text-left hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          >
                            <div className={`size-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-[#ba0020] border-[#ba0020]" : "border-[#ccc]"}`}>
                              {checked && <Check className="size-3 text-white" />}
                            </div>
                            {spu.imageUrl && (
                              <img src={spu.imageUrl} alt="" className="size-6 rounded object-cover shrink-0" />
                            )}
                            <span className="truncate">{spu.name}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                  );
                })()}
              </div>

              {/* 3. Cover Image */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Cover Image</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {coverPreview ? (
                  <div className="relative w-full h-[180px] rounded-xl overflow-hidden border border-[#e0e0e0] group">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setCoverFile(null); setCoverPreview(""); }}
                      className="absolute top-2 right-2 size-7 rounded-lg bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[120px] rounded-xl border-2 border-dashed border-[#ddd] flex flex-col items-center justify-center text-[#aaa] hover:border-[#ba0020] hover:text-[#ba0020] transition-colors cursor-pointer"
                  >
                    <ImagePlus className="size-6 mb-2" />
                    <span className="text-[13px]">Click to upload cover</span>
                  </button>
                )}
              </div>

              {/* 4. Selling Point */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Selling Point</label>
                <textarea
                  value={sellingPoint}
                  onChange={(e) => setSellingPoint(e.target.value)}
                  placeholder="Enter a selling point for this product card"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#f0f0f0] flex items-center justify-end gap-3">
              <button
                onClick={onCloseModal}
                className="h-[38px] px-4 rounded-xl text-[13px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || uploading}
                className="h-[38px] px-5 rounded-xl text-[13px] text-white bg-[#ba0020] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {(saving || uploading) && <Loader2 className="size-3.5 animate-spin" />}
                {uploading ? "Uploading..." : saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ========== Shopping Guides Panel ========== */

function GuidesPanel({
  guides,
  categories,
  saving,
  showModal,
  onAdd,
  onCloseModal,
  onSave,
  onEdit,
  onDelete,
  showToast,
}: {
  guides: GuideItem[];
  categories: Category[];
  saving: boolean;
  showModal: boolean;
  onAdd: () => void;
  onCloseModal: () => void;
  onSave: (guide: Omit<GuideItem, "id">) => void;
  onEdit: (guide: GuideItem) => void;
  onDelete: (id: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImagePath, setCoverImagePath] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [bodyTitle, setBodyTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");
  const [tableOfContents, setTableOfContents] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [editingGuide, setEditingGuide] = useState<GuideItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const openEditModal = (guide: GuideItem) => {
    setEditingGuide(guide);
    setTag(guide.tag);
    setTitle(guide.title);
    setCoverImageUrl(guide.coverImageUrl);
    setCoverImagePath(guide.coverImagePath);
    setSelectedCategoryIds([...guide.categoryIds]);
    setBodyTitle(guide.bodyTitle ?? "");
    setBodyContent(guide.bodyContent ?? "");
    setTableOfContents(guide.tableOfContents ?? "");
    setLinkText(guide.linkText ?? "");
    setLinkUrl(guide.linkUrl ?? "");
    onAdd();
  };

  useEffect(() => {
    if (!showModal) {
      setTag("");
      setTitle("");
      setCoverImageUrl("");
      setCoverImagePath("");
      setSelectedCategoryIds([]);
      setBodyTitle("");
      setBodyContent("");
      setTableOfContents("");
      setLinkText("");
      setLinkUrl("");
      setEditingGuide(null);
    }
  }, [showModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadImage(file);
      setCoverImageUrl(result.url);
      setCoverImagePath(result.path);
    } catch (err: any) {
      showToast(err.message || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = () => {
    if (!tag.trim()) { showToast("Please enter a tag", "error"); return; }
    if (!title.trim()) { showToast("Please enter a title", "error"); return; }
    const commonFields = {
      tag: tag.trim(),
      title: title.trim(),
      coverImageUrl,
      coverImagePath,
      categoryIds: selectedCategoryIds,
      bodyTitle: bodyTitle.trim(),
      bodyContent: bodyContent.trim(),
      tableOfContents: tableOfContents.trim(),
      linkText: linkText.trim(),
      linkUrl: linkUrl.trim(),
    };
    if (editingGuide) {
      onEdit({ ...editingGuide, ...commonFields });
    } else {
      onSave({ ...commonFields, createdAt: Date.now() });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] text-[#1a1a1a]">Shopping Guides</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 h-[40px] px-5 rounded-xl text-[14px] bg-[#ba0020] text-white hover:bg-[#a0001b] transition-colors cursor-pointer"
        >
          <Plus className="size-4" />
          Add Guide
        </button>
      </div>

      {/* Guides list */}
      <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
        <div className="flex items-center gap-4 px-6 py-3 border-b border-[#f0f0f0] bg-[#fafafa] text-[12px] text-[#aaa]">
          <div className="shrink-0 w-[64px]">Cover</div>
          <div className="shrink-0 w-[100px]">Tag</div>
          <div className="flex-1">Title</div>
          <div className="shrink-0 w-[200px]">Categories</div>
          <div className="shrink-0 w-[80px] text-right">Actions</div>
        </div>

        {guides.length > 0 ? (
          guides.map((guide) => (
            <div key={guide.id} className="flex items-center gap-4 px-6 py-3 border-b border-[#f0f0f0] hover:bg-[#fafafa] transition-colors">
              <div className="shrink-0 w-[64px] h-[48px] rounded-lg overflow-hidden bg-[#f5f5f5]">
                {guide.coverImageUrl ? (
                  <img src={guide.coverImageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                    <ImageIcon className="size-5" />
                  </div>
                )}
              </div>
              <div className="shrink-0 w-[100px]">
                <span className="inline-block px-2 py-0.5 rounded-md bg-[#f0f0f0] text-[12px] text-[#666] truncate max-w-full">
                  {guide.tag}
                </span>
              </div>
              <div className="flex-1 text-[14px] text-[#1a1a1a] truncate">{guide.title}</div>
              <div className="shrink-0 w-[200px] flex flex-wrap gap-1">
                {guide.categoryIds.map((cid) => {
                  const cat = categories.find((c) => c.id === cid);
                  return cat ? (
                    <span key={cid} className="inline-block px-1.5 py-0.5 rounded bg-[#fef2f2] text-[11px] text-[#ba0020]">
                      {cat.name}
                    </span>
                  ) : null;
                })}
              </div>
              <div className="shrink-0 w-[80px] flex justify-end gap-1">
                <button
                  onClick={() => openEditModal(guide)}
                  className="size-8 flex items-center justify-center rounded-lg text-[#bbb] hover:text-[#067ad9] hover:bg-[#eef6fd] transition-colors cursor-pointer"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => setDeletingGuideId(guide.id)}
                  className="size-8 flex items-center justify-center rounded-lg text-[#bbb] hover:text-[#ba0020] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 flex flex-col items-center text-[#ccc]">
            <BookOpen className="size-10 mb-3" />
            <p className="text-[14px]">No guides yet</p>
            <p className="text-[12px] mt-1">Click "Add Guide" to get started</p>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deletingGuideId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setDeletingGuideId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-[400px] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5">
              <h3 className="text-[16px] text-[#1a1a1a] mb-2">Delete Guide</h3>
              <p className="text-[14px] text-[#666]">Are you sure you want to delete this guide? This action cannot be undone.</p>
            </div>
            <div className="px-6 py-4 border-t border-[#f0f0f0] flex justify-end gap-3">
              <button onClick={() => setDeletingGuideId(null)} className="h-[38px] px-4 rounded-xl text-[13px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                onClick={() => { onDelete(deletingGuideId); setDeletingGuideId(null); }}
                className="h-[38px] px-5 rounded-xl text-[13px] text-white bg-[#ba0020] hover:bg-[#a0001b] transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onCloseModal}>
          <div className="bg-white rounded-2xl shadow-xl w-[520px] max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-[#f0f0f0]">
              <h3 className="text-[18px] text-[#1a1a1a]">{editingGuide ? "Edit Shopping Guide" : "Add Shopping Guide"}</h3>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* Tag */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Tag</label>
                <input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Buying Guide, Installation, Tips"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter guide title"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Cover Image</label>
                {coverImageUrl ? (
                  <div className="relative group w-full h-[160px] rounded-xl overflow-hidden border border-[#e0e0e0]">
                    <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg text-[12px] text-white bg-white/20 hover:bg-white/30 transition-colors cursor-pointer">
                        <RefreshCw className="size-3.5" />
                        Replace
                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-[120px] rounded-xl border-2 border-dashed border-[#e0e0e0] hover:border-[#ba0020] transition-colors cursor-pointer">
                    {uploading ? (
                      <Loader2 className="size-6 animate-spin text-[#ba0020]" />
                    ) : (
                      <>
                        <Upload className="size-6 text-[#ccc] mb-2" />
                        <span className="text-[13px] text-[#aaa]">Click to upload cover image</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  </label>
                )}
              </div>

              {/* Category Multi-select */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Product Categories</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                    className="w-full min-h-[40px] px-3 py-2 rounded-xl border border-[#e0e0e0] text-[14px] text-left flex items-center gap-2 flex-wrap cursor-pointer hover:border-[#ba0020] transition-colors"
                  >
                    {selectedCategoryIds.length === 0 ? (
                      <span className="text-[#aaa]">Select categories...</span>
                    ) : (
                      selectedCategoryIds.map((cid) => {
                        const cat = categories.find((c) => c.id === cid);
                        return cat ? (
                          <span key={cid} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#fef2f2] text-[12px] text-[#ba0020]">
                            {cat.name}
                            <X
                              className="size-3 cursor-pointer hover:text-[#800016]"
                              onClick={(e) => { e.stopPropagation(); toggleCategory(cid); }}
                            />
                          </span>
                        ) : null;
                      })
                    )}
                    <ChevronDown className={`size-4 text-[#aaa] ml-auto shrink-0 transition-transform ${catDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {catDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#e0e0e0] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                      {categories.map((cat) => {
                        const selected = selectedCategoryIds.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-[13px] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          >
                            <div className={`size-4 rounded border flex items-center justify-center shrink-0 ${selected ? "bg-[#ba0020] border-[#ba0020]" : "border-[#ddd]"}`}>
                              {selected && <Check className="size-3 text-white" />}
                            </div>
                            <span className="text-[#333]">{cat.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Body Title */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Body Title</label>
                <input
                  value={bodyTitle}
                  onChange={(e) => setBodyTitle(e.target.value)}
                  placeholder="输入正文标题"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>

              {/* Body Content */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Body Content</label>
                <textarea
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  placeholder="输入正文"
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-y"
                />
              </div>

              {/* Table of Contents */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Table of Contents</label>
                <textarea
                  value={tableOfContents}
                  onChange={(e) => setTableOfContents(e.target.value)}
                  placeholder="Table of Contents 信息"
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors resize-y"
                />
              </div>

              {/* Link Text */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Link Text</label>
                <input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link Text 文案"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-[13px] text-[#555] mb-1.5">Link URL</label>
                <input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="输入跳转链接，如 https://example.com"
                  className="w-full h-[40px] px-3 rounded-xl border border-[#e0e0e0] text-[14px] outline-none focus:border-[#ba0020] transition-colors"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-[#f0f0f0] flex items-center justify-end gap-3">
              <button
                onClick={onCloseModal}
                className="h-[38px] px-4 rounded-xl text-[13px] text-[#666] bg-[#f5f5f5] hover:bg-[#eee] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || uploading}
                className="h-[38px] px-5 rounded-xl text-[13px] text-white bg-[#ba0020] hover:bg-[#a0001b] transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-2"
              >
                {(saving || uploading) && <Loader2 className="size-3.5 animate-spin" />}
                {uploading ? "Uploading..." : saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ========== 管理后台主体 ========== */

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  // Sidebar: which category selected & sub-tab
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("smoke-alarms");
  const [subTab, setSubTab] = useState<"products" | "spus" | "product-cards" | "guides">("products");
  const [spuExpanded, setSpuExpanded] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(true);
  const [productCardExpanded, setProductCardExpanded] = useState(false);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const isManageCategories = selectedCategoryId === "__manage__";
  const isSupportSection = selectedCategoryId.startsWith("__support_");
  const supportSubTab = isSupportSection ? selectedCategoryId.replace("__support_", "") as "app" | "faqs" : null;
  const isSpuSection = subTab === "spus" && !isManageCategories && !isSupportSection;
  const isProductCardSection = subTab === "product-cards" && !isManageCategories && !isSupportSection;
  const isGuidesSection = selectedCategoryId === "__guides__";

  const [products, setProducts] = useState<Product[]>([]);
  const [allSpus, setAllSpus] = useState<Spu[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Product Card states
  const [productCards, setProductCards] = useState<ProductCardItem[]>([]);
  const [showProductCardModal, setShowProductCardModal] = useState(false);

  // Shopping Guides states
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load products, SPUs and categories from Supabase
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [prodData, spuData, catData] = await Promise.all([
        apiGet<{ products: Product[] }>("/products"),
        apiGet<{ spus: Spu[] }>("/spus"),
        apiGet<{ categories: Category[] }>("/categories"),
      ]);
      setProducts((prodData.products || []).map(normalizeProduct) as Product[]);
      setAllSpus(spuData.spus || []);
      setAllCategories(catData.categories || []);
    } catch (err: any) {
      console.error("Failed to load data:", err);
      showToast(err.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProductCards = useCallback(async () => {
    try {
      const data = await apiGet<{ productCards: ProductCardItem[] }>("/product-cards");
      setProductCards(data.productCards || []);
    } catch {
      // endpoint may not exist yet — silently ignore
    }
  }, []);

  const loadGuides = useCallback(async () => {
    try {
      const data = await apiGet<{ guides: GuideItem[] }>("/guides");
      setGuides(data.guides || []);
    } catch {
      // endpoint may not exist yet — silently ignore
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadProductCards();
    loadGuides();
  }, [loadProducts, loadProductCards, loadGuides]);

  const filteredProducts = products
    .filter((p) => (p.categoryId || "smoke-alarms") === selectedCategoryId)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = useCallback(async (data: Omit<Product, "id">) => {
    setSaving(true);
    try {
      const result = await apiPost<{ product: Product }>("/products", {
        ...data,
        id: Date.now().toString(),
      });
      setProducts((prev) => [result.product, ...prev]);
      setShowForm(false);
      showToast("Product added successfully!");
    } catch (err: any) {
      console.error("Failed to add product:", err);
      showToast(err.message || "Failed to add product", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleEdit = useCallback(async (data: Omit<Product, "id">) => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      const result = await apiPost<{ product: Product }>("/products", {
        ...data,
        id: editingProduct.id,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? result.product : p))
      );
      setEditingProduct(null);
      showToast("Product updated successfully!");
    } catch (err: any) {
      console.error("Failed to update product:", err);
      showToast(err.message || "Failed to update product", "error");
    } finally {
      setSaving(false);
    }
  }, [editingProduct]);

  const handleDelete = useCallback(async (product: Product) => {
    setDeleting(true);
    try {
      await apiDelete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setDeletingProduct(null);
      setExpandedId(null);
      showToast("Product deleted successfully!");
    } catch (err: any) {
      console.error("Failed to delete product:", err);
      showToast(err.message || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  }, []);

  const handleSaveProductCard = useCallback(async (card: Omit<ProductCardItem, "id">) => {
    setSaving(true);
    try {
      const newCard: ProductCardItem = { ...card, id: Date.now().toString() };
      await apiPost("/product-cards", newCard);
      setProductCards((prev) => [newCard, ...prev]);
      setShowProductCardModal(false);
      showToast("Product Card saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save Product Card", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleSaveGuide = useCallback(async (guide: Omit<GuideItem, "id">) => {
    setSaving(true);
    try {
      const newGuide: GuideItem = { ...guide, id: Date.now().toString() };
      await apiPost("/guides", newGuide);
      setGuides((prev) => [newGuide, ...prev]);
      setShowGuideModal(false);
      showToast("Guide saved successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to save guide", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleEditGuide = useCallback(async (guide: GuideItem) => {
    setSaving(true);
    try {
      await apiPost("/guides", guide);
      setGuides((prev) => prev.map((g) => (g.id === guide.id ? guide : g)));
      setShowGuideModal(false);
      showToast("Guide updated successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to update guide", "error");
    } finally {
      setSaving(false);
    }
  }, []);

  const handleDeleteGuide = useCallback(async (id: string) => {
    try {
      await apiDelete(`/guides/${id}`);
      setGuides((prev) => prev.filter((g) => g.id !== id));
      showToast("Guide deleted successfully!");
    } catch (err: any) {
      showToast(err.message || "Failed to delete guide", "error");
    }
  }, []);

  const currentCategory = allCategories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex w-full overflow-x-hidden">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* ========== 左侧导航栏 ========== */}
      <aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-white border-r border-[#eee] flex flex-col z-20">
        {/* Logo */}
        <div className="h-[64px] flex items-center gap-3 px-5 border-b border-[#f0f0f0] shrink-0">
          <div className="size-[32px] rounded-xl bg-[#ba0020] flex items-center justify-center shrink-0">
            <Package className="size-[16px] text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[15px] text-[#1a1a1a] leading-tight truncate">Product Admin</h1>
            <p className="text-[11px] text-[#aaa] leading-tight">Management Console</p>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
          {/* ── SPUs 一级导航（可折叠） ── */}
          <button
            onClick={() => setSpuExpanded(!spuExpanded)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              isSpuSection
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <Layers className="size-4 shrink-0" />
            <span className="flex-1 text-left">SPUs</span>
            <ChevronDown className={`size-3.5 shrink-0 transition-transform ${spuExpanded ? "" : "-rotate-90"}`} />
          </button>

          {spuExpanded && (
            <div className="ml-3 border-l border-[#f0f0f0] flex flex-col gap-0.5 py-1">
              {allCategories.map((cat) => {
                const active = isSpuSection && selectedCategoryId === cat.id;
                const spuCount = allSpus.filter((s: any) => (s.categoryId || "smoke-alarms") === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSubTab("spus");
                      setShowForm(false);
                      setEditingProduct(null);
                      setSearch("");
                    }}
                    className={`flex items-center gap-2 w-full pl-4 pr-2 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                      active
                        ? "bg-[#ba0020] text-white"
                        : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#333]"
                    }`}
                  >
                    <span className="flex-1 text-left truncate">{cat.name}</span>
                    {!loading && (
                      <span className={`text-[11px] shrink-0 tabular-nums ${active ? "text-white/60" : "text-[#ccc]"}`}>
                        {spuCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 分隔线 */}
          <div className="h-px bg-[#f0f0f0] my-2" />

          {/* ── Products 一级导航（可折叠） ── */}
          <button
            onClick={() => setProductsExpanded(!productsExpanded)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              !isManageCategories && !isSupportSection && !isSpuSection && !isProductCardSection && !isGuidesSection
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <Package className="size-4 shrink-0" />
            <span className="flex-1 text-left">Products (SKU)</span>
            <ChevronDown className={`size-3.5 shrink-0 transition-transform ${productsExpanded ? "" : "-rotate-90"}`} />
          </button>

          {/* 二级分类列表 */}
          {productsExpanded && (
            <div className="ml-3 border-l border-[#f0f0f0] flex flex-col gap-0.5 py-1">
              {allCategories.map((cat) => {
                const active = !isSpuSection && !isProductCardSection && !isGuidesSection && selectedCategoryId === cat.id && !isManageCategories && !isSupportSection;
                const prodCount = products.filter((p) => (p.categoryId || "smoke-alarms") === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSubTab("products");
                      setShowForm(false);
                      setEditingProduct(null);
                      setSearch("");
                    }}
                    className={`flex items-center gap-2 w-full pl-4 pr-2 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                      active
                        ? "bg-[#ba0020] text-white"
                        : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#333]"
                    }`}
                  >
                    <span className="flex-1 text-left truncate">{cat.name}</span>
                    {!loading && (
                      <span className={`text-[11px] shrink-0 tabular-nums ${active ? "text-white/60" : "text-[#ccc]"}`}>
                        {prodCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 分隔线 */}
          <div className="h-px bg-[#f0f0f0] my-2" />

          {/* ── Product Card 一级导航（可折叠） ── */}
          <button
            onClick={() => setProductCardExpanded(!productCardExpanded)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              isProductCardSection
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <CreditCard className="size-4 shrink-0" />
            <span className="flex-1 text-left">Product Card</span>
            <ChevronDown className={`size-3.5 shrink-0 transition-transform ${productCardExpanded ? "" : "-rotate-90"}`} />
          </button>

          {/* Product Card 二级分类列表 */}
          {productCardExpanded && (
            <div className="ml-3 border-l border-[#f0f0f0] flex flex-col gap-0.5 py-1">
              {allCategories.map((cat) => {
                const active = isProductCardSection && selectedCategoryId === cat.id;
                const cardCount = productCards.filter((c) => c.spuIds.some((sid) => {
                  const spu = allSpus.find((s) => s.id === sid);
                  return spu && (spu.categoryId || "smoke-alarms") === cat.id;
                })).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSubTab("product-cards");
                      setShowForm(false);
                      setEditingProduct(null);
                      setSearch("");
                    }}
                    className={`flex items-center gap-2 w-full pl-4 pr-2 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                      active
                        ? "bg-[#ba0020] text-white"
                        : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#333]"
                    }`}
                  >
                    <span className="flex-1 text-left truncate">{cat.name}</span>
                    {!loading && (
                      <span className={`text-[11px] shrink-0 tabular-nums ${active ? "text-white/60" : "text-[#ccc]"}`}>
                        {cardCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 分隔线 */}
          <div className="h-px bg-[#f0f0f0] my-2" />

          {/* ── Support 一级导航（可折叠） ── */}
          <button
            onClick={() => setSupportExpanded(!supportExpanded)}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              isSupportSection
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <LifeBuoy className="size-4 shrink-0" />
            <span className="flex-1 text-left">Support</span>
            <ChevronDown className={`size-3.5 shrink-0 transition-transform ${supportExpanded ? "" : "-rotate-90"}`} />
          </button>

          {/* Support 二级列表 */}
          {supportExpanded && (
            <div className="ml-3 border-l border-[#f0f0f0] flex flex-col gap-0.5 py-1">
              {([
                { id: "__support_app", label: "App", icon: Smartphone },
                { id: "__support_faqs", label: "FAQs", icon: MessageSquare },
              ] as const).map(({ id, label, icon: Icon }) => {
                const active = selectedCategoryId === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedCategoryId(id);
                      setShowForm(false);
                      setEditingProduct(null);
                      setSearch("");
                    }}
                    className={`flex items-center gap-2 w-full pl-4 pr-2 py-2 rounded-lg text-[13px] transition-colors cursor-pointer ${
                      active
                        ? "bg-[#ba0020] text-white"
                        : "text-[#666] hover:bg-[#f5f5f5] hover:text-[#333]"
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0" />
                    <span className="flex-1 text-left">{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 分隔线 */}
          <div className="h-px bg-[#f0f0f0] my-2" />

          {/* ── Shopping Guides ── */}
          <button
            onClick={() => {
              setSelectedCategoryId("__guides__");
              setShowForm(false);
              setEditingProduct(null);
              setSearch("");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              isGuidesSection
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <BookOpen className="size-4 shrink-0" />
            <span className="flex-1 text-left">Shopping Guides</span>
            {!loading && (
              <span className={`text-[11px] shrink-0 tabular-nums ${isGuidesSection ? "text-[#ba0020]/60" : "text-[#ccc]"}`}>
                {guides.length}
              </span>
            )}
          </button>

          {/* 分隔线 */}
          <div className="h-px bg-[#f0f0f0] my-2" />

          {/* ── 分类管理入口 ── */}
          <button
            onClick={() => {
              setSelectedCategoryId("__manage__");
              setShowForm(false);
              setEditingProduct(null);
              setSearch("");
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[14px] transition-colors cursor-pointer ${
              isManageCategories
                ? "bg-[#fef2f2] text-[#ba0020]"
                : "text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            <Settings className="size-4 shrink-0" />
            <span className="flex-1 text-left">Manage Categories</span>
          </button>
        </nav>

        {/* 底部操作 */}
        <div className="border-t border-[#f0f0f0] p-3 flex flex-col gap-1.5 shrink-0">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[13px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[13px] text-[#666] hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ========== 右侧主内容区 ========== */}
      <main className="flex-1 ml-[240px] min-h-screen min-w-0 overflow-x-hidden flex flex-col">
        {/* 顶部面包屑 */}
        <div className="h-[56px] bg-white border-b border-[#eee] flex items-center px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-2 text-[14px]">
            {isManageCategories ? (
              <>
                <Settings className="size-4 text-[#ba0020]" />
                <span className="text-[#1a1a1a]">Manage Categories</span>
              </>
            ) : isProductCardSection ? (
              <>
                <span className="text-[#aaa]">Product Card</span>
                <ChevronRight className="size-3.5 text-[#ccc]" />
                <span className="text-[#1a1a1a]">{currentCategory?.name ?? selectedCategoryId}</span>
              </>
            ) : isSupportSection ? (
              <>
                <span className="text-[#aaa]">Support</span>
                <ChevronRight className="size-3.5 text-[#ccc]" />
                <span className="text-[#1a1a1a]">{supportSubTab === "app" ? "App" : "FAQs"}</span>
              </>
            ) : isGuidesSection ? (
              <>
                <BookOpen className="size-4 text-[#ba0020]" />
                <span className="text-[#1a1a1a]">Shopping Guides</span>
              </>
            ) : (
              <>
                <span className="text-[#aaa]">{isSpuSection ? "SPUs" : "Products"}</span>
                <ChevronRight className="size-3.5 text-[#ccc]" />
                <span className="text-[#1a1a1a]">{currentCategory?.name ?? selectedCategoryId}</span>
              </>
            )}
          </div>
        </div>

        {/* 主内容 */}
        <div className="flex-1 p-8 min-w-0">
          {isManageCategories ? (
            <CategoryPanel categories={allCategories} onUpdate={loadProducts} showToast={showToast} />
          ) : isGuidesSection ? (
            <GuidesPanel
              guides={guides}
              categories={allCategories}
              saving={saving}
              showModal={showGuideModal}
              onAdd={() => setShowGuideModal(true)}
              onCloseModal={() => setShowGuideModal(false)}
              onSave={handleSaveGuide}
              onEdit={handleEditGuide}
              onDelete={handleDeleteGuide}
              showToast={showToast}
            />
          ) : isProductCardSection ? (
            <ProductCardPanel
              cards={productCards}
              spus={allSpus}
              saving={saving}
              onAdd={() => setShowProductCardModal(true)}
              onSave={handleSaveProductCard}
              showModal={showProductCardModal}
              onCloseModal={() => setShowProductCardModal(false)}
              showToast={showToast}
              selectedCategoryId={selectedCategoryId}
            />
          ) : isSupportSection ? (
            supportSubTab === "app" ? (
              <SupportAppPanel showToast={showToast} />
            ) : (
              <SupportFaqsPanel showToast={showToast} categories={allCategories} />
            )
          ) : isSpuSection ? (
            <SpuPanel showToast={showToast} categories={allCategories} selectedCategoryId={selectedCategoryId} />
          ) : (
          <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-[#eee]">
              <p className="text-[12px] text-[#aaa] mb-1">Products in Category</p>
              <p className="text-[28px] text-[#1a1a1a] leading-tight">
                {loading ? "—" : filteredProducts.length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#eee]">
              <p className="text-[12px] text-[#aaa] mb-1">Hot Products</p>
              <p className="text-[28px] text-[#ba0020] leading-tight">
                {loading ? "—" : filteredProducts.filter((p) => p.isHot).length}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-[#eee]">
              <p className="text-[12px] text-[#aaa] mb-1">Avg. Price</p>
              <p className="text-[28px] text-[#1a1a1a] leading-tight">
                {loading
                  ? "—"
                  : filteredProducts.length > 0
                    ? `$${(filteredProducts.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / filteredProducts.length).toFixed(2)}`
                    : "$0.00"}
              </p>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#bbb]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-[40px] w-full max-w-[300px] pl-9 pr-3 rounded-xl border border-[#e0e0e0] bg-white text-[14px] outline-none focus:border-[#ba0020] transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                if (!confirm("This will remove all manually-entered features from ALL products, keeping only the 6 predefined options. Continue?")) return;
                try {
                  const res = await fetchWithRetry(`${API_BASE}/products/clear-features`, { method: "POST", headers: AUTH_HEADER }, 2, 1500);
                  const data = await res.json();
                  if (data.success) {
                    showToast(`Cleared old features from ${data.updated} of ${data.total} products`);
                    loadProducts();
                  } else {
                    showToast(data.error || "Failed to clear features", "error");
                  }
                } catch (err: any) {
                  showToast(`Error: ${err.message}`, "error");
                }
              }}
              className="flex items-center gap-1.5 h-[40px] px-4 rounded-xl text-[13px] bg-[#f5f5f5] text-[#888] border border-[#e0e0e0] hover:border-[#ba0020] hover:text-[#ba0020] transition-colors cursor-pointer"
              title="Remove all manually-entered features, keep only predefined options"
            >
              <Trash2 className="size-3.5" />
              Clear Old Features
            </button>
            <button
              onClick={() => {
                if (showForm || editingProduct) {
                  setShowForm(false);
                  setEditingProduct(null);
                } else {
                  setShowForm(true);
                  setEditingProduct(null);
                }
              }}
              className={`flex items-center gap-2 h-[40px] px-5 rounded-xl text-[14px] transition-colors cursor-pointer ${
                showForm || editingProduct
                  ? "bg-[#f5f5f5] text-[#666] border border-[#e0e0e0]"
                  : "bg-[#ba0020] text-white hover:bg-[#a0001b]"
              }`}
            >
              {showForm || editingProduct ? (
                <>
                  <X className="size-4" />
                  Close Form
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Add Product
                </>
              )}
            </button>
            </div>
          </div>

          {/* 新增表单 */}
          {showForm && !editingProduct && (
            <div className="mb-6">
              <ProductForm
                onSave={handleAdd}
                onCancel={() => setShowForm(false)}
                saving={saving}
                spus={allSpus}
                categories={allCategories}
                defaultCategoryId={selectedCategoryId}
              />
            </div>
          )}

          {/* 编辑表单 */}
          {editingProduct && (
            <div className="mb-6">
              <ProductForm
                key={editingProduct.id}
                product={editingProduct}
                onSave={handleEdit}
                onCancel={() => setEditingProduct(null)}
                saving={saving}
                spus={allSpus}
                categories={allCategories}
                defaultCategoryId={selectedCategoryId}
              />
            </div>
          )}

          {/* 商品列表 */}
          <div className="bg-white rounded-2xl border border-[#eee] overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-3 border-b border-[#f0f0f0] bg-[#fafafa] text-[12px] text-[#aaa]">
              <div className="shrink-0 w-4" />
              <div className="shrink-0 w-[48px]">Image</div>
              <div className="flex-1">Product Name</div>
              <div className="shrink-0 w-[90px] text-right">Price</div>
              <div className="shrink-0 w-[100px] text-right">Filters</div>
              <div className="shrink-0 w-[68px] text-right">Actions</div>
            </div>

            {loading ? (
              <div className="py-16 flex flex-col items-center text-[#ccc]">
                <Loader2 className="size-8 animate-spin mb-3 text-[#ba0020]" />
                <p className="text-[14px] text-[#999]">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onDelete={() => setDeletingProduct(product)}
                  onEdit={() => {
                    setEditingProduct(product);
                    setShowForm(false);
                  }}
                  expanded={expandedId === product.id}
                  onToggle={() => setExpandedId((prev) => (prev === product.id ? null : product.id))}
                  spuName={product.spuId ? allSpus.find((s) => s.id === product.spuId)?.name : undefined}
                  linkedSpu={product.spuId ? allSpus.find((s) => s.id === product.spuId) : undefined}
                  categoryName={allCategories.find((c) => c.id === (product.categoryId || "smoke-alarms"))?.name}
                />
              ))
            ) : (
              <div className="py-16 flex flex-col items-center text-[#ccc]">
                <Package className="size-10 mb-3" />
                <p className="text-[14px]">{search ? "No products found" : "No products yet"}</p>
                {!search && (
                  <p className="text-[12px] mt-1">Click "Add Product" to get started</p>
                )}
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </main>

      {/* 删除确认弹窗 */}
      {deletingProduct && (
        <DeleteConfirmDialog
          productName={deletingProduct.name}
          onConfirm={() => handleDelete(deletingProduct)}
          onCancel={() => setDeletingProduct(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}

/* ========== 导出入口 ========== */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  return authed ? (
    <AdminDashboard onLogout={() => setAuthed(false)} />
  ) : (
    <LoginGate onAuth={() => setAuthed(true)} />
  );
}