import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router";
import svgClose from "../../imports/svg-eq26t96ixf";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { useCategories, type Category } from "./use-products";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import { FooterSection } from "./support-page";
import Footer from "../../imports/Footer";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

interface SpecsData {
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

interface ManualItem {
  name?: string;
  coverImage: { url: string; path: string };
  pdfUrl: string;
}

interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  categoryId?: string;
  connectivity?: string;
  setupInstallation?: {
    installationVideoUrl?: string;
    installationVideoCoverImage?: { url: string; path: string };
    quickStartGuideImages?: Array<{ url: string; path: string }>;
  };
  specs?: SpecsData;
  manuals?: ManualItem[];
}

interface SupportAppData {
  iconUrl?: string;
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

interface CategoryWithSpus extends Category {
  spus: Spu[];
}

const TABS = ["Setup & Installation", "App", "FAQs", "Specs", "Manuals"];

/* ==================== Sliding Tab Bar ==================== */

function SlidingTabBar({
  tabs,
  activeTab,
  onTabChange,
  containerClassName,
  tabClassName,
  textClassName,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  containerClassName: string;
  tabClassName: string;
  textClassName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  const measure = useCallback(() => {
    const el = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (el && container) {
      const cr = container.getBoundingClientRect();
      const tr = el.getBoundingClientRect();
      setIndicator({
        left: tr.left - cr.left + container.scrollLeft,
        width: tr.width,
        ready: true,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    measure();
    const el = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (el && container) {
      const cr = container.getBoundingClientRect();
      const tr = el.getBoundingClientRect();
      const scrollPadding = 20;
      if (tr.left < cr.left + scrollPadding) {
        container.scrollBy({ left: tr.left - cr.left - scrollPadding, behavior: "smooth" });
      } else if (tr.right > cr.right - scrollPadding) {
        container.scrollBy({ left: tr.right - cr.right + scrollPadding, behavior: "smooth" });
      }
    }
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div ref={containerRef} className={containerClassName}>
      {tabs.map((tab) => (
        <div key={tab} className="flex flex-row items-center self-stretch shrink-0">
          <div
            ref={(el) => { if (el) tabRefs.current.set(tab, el); }}
            className={tabClassName}
            onClick={() => onTabChange(tab)}
          >
            <p className={textClassName}>
              {tab}
            </p>
          </div>
        </div>
      ))}
      <div
        className="absolute bg-[#ba0020] bottom-0 h-[2px] transition-all duration-300 ease-in-out"
        style={{
          left: indicator.left,
          width: indicator.width,
          opacity: indicator.ready ? 1 : 0,
        }}
      />
    </div>
  );
}

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1500): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

/* ==================== SPU Sort ==================== */

const VARIANT_ORDER: Record<string, number> = { pro: 0, "wi-fi": 1, "+": 2, "": 3 };

function parseSpuName(name: string): { base: string; variant: string } {
  const trimmed = name.trim();
  const plusMatch = trimmed.match(/^([A-Za-z]+\d+)\+$/);
  if (plusMatch) return { base: plusMatch[1].toUpperCase(), variant: "+" };
  const spaceMatch = trimmed.match(/^([A-Za-z]+\d+)\s+(.+)$/);
  if (spaceMatch) return { base: spaceMatch[1].toUpperCase(), variant: spaceMatch[2].toLowerCase() };
  const baseMatch = trimmed.match(/^([A-Za-z]+\d+)/);
  if (baseMatch) return { base: baseMatch[1].toUpperCase(), variant: "" };
  return { base: trimmed.toUpperCase(), variant: "" };
}

function sortSpus(spus: Spu[]): Spu[] {
  return [...spus].sort((a, b) => {
    const pa = parseSpuName(a.name);
    const pb = parseSpuName(b.name);
    if (pa.base !== pb.base) return pa.base.localeCompare(pb.base, undefined, { numeric: true });
    const va = VARIANT_ORDER[pa.variant] ?? 2.5;
    const vb = VARIANT_ORDER[pb.variant] ?? 2.5;
    if (va !== vb) return va - vb;
    return a.name.localeCompare(b.name);
  });
}

/* ==================== Data Hook ==================== */

function useDownloadCenterData() {
  const { categories, loading: catLoading } = useCategories();
  const [spus, setSpus] = useState<Spu[]>([]);
  const [spuLoading, setSpuLoading] = useState(true);

  const fetchSpus = useCallback(async () => {
    try {
      setSpuLoading(true);
      const res = await fetchWithRetry(`${API_BASE}/spus`, { headers: AUTH_HEADER });
      if (!res.ok) throw new Error(`Failed to fetch SPUs (${res.status})`);
      const data = await res.json();
      setSpus(data.spus || []);
    } catch (err) {
      console.error("Error fetching SPUs:", err);
    } finally {
      setSpuLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpus();
  }, [fetchSpus]);

  const categoriesWithSpus: CategoryWithSpus[] = categories.map((cat) => ({
    ...cat,
    spus: sortSpus(spus.filter((spu) => spu.categoryId === cat.id)),
  }));

  return {
    categoriesWithSpus,
    loading: catLoading || spuLoading,
  };
}

/* ==================== Support App Hook ==================== */

function useSupportApp() {
  const [appData, setAppData] = useState<SupportAppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/support/app`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch support app (${res.status})`);
        const json = await res.json();
        setAppData(json.data || null);
      } catch (err) {
        console.error("Error fetching support app:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { appData, loading };
}

/* ==================== FAQs Hook ==================== */

function useFaqs(categoryId: string | undefined) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setFaqs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/faqs/${categoryId}`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error(`Failed to fetch FAQs (${res.status})`);
        const json = await res.json();
        if (!cancelled) setFaqs(json.data?.items || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        if (!cancelled) setFaqs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [categoryId]);

  return { faqs, loading };
}

/* ==================== View Supported Devices Dialog ==================== */

function stripConnectivitySuffix(name: string): string {
  return name.replace(/\s+(Pro|Wi-Fi|Wi-fi|\+)$/i, "").replace(/\s*\(base\)\s*$/i, "").trim();
}

function ViewSupportedDevicesDialog({ open, onClose, spuName }: { open: boolean; onClose: () => void; spuName?: string }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(false);
        });
      });
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, handleClose]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-center justify-center px-[16px] md:px-0 transition-all duration-300 ease-in-out ${
        open && !animating ? "bg-[rgba(0,0,0,0.2)] opacity-100" : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        className={`bg-white flex flex-col items-center w-full md:w-[720px] gap-[12px] md:gap-0 overflow-hidden rounded-[32px] transition-all duration-300 ease-in-out ${
          open && !animating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="content-stretch flex gap-[24px] items-start justify-center px-[24px] py-[16px] md:p-[24px] relative shrink-0 w-full">
          <div className="hidden md:block opacity-40 shrink-0 size-[40px]" />
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative self-stretch">
            <p className="font-['Inter:Semi_Bold',sans-serif] md:font-['Inter:Bold',sans-serif] font-semibold md:font-bold leading-[24px] md:leading-[34px] not-italic text-[18px] md:text-[24px] text-[#101820] md:text-center w-full">
              View Supported Devices
            </p>
          </div>
          <button
            onClick={handleClose}
            className="opacity-40 overflow-clip relative shrink-0 size-[32px] md:size-[40px] cursor-pointer hover:opacity-60 transition-opacity border-none bg-transparent"
          >
            <div className="absolute inset-[8.33%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 33.3333 33.3333">
                <path
                  clipRule="evenodd"
                  d={svgClose.p24650100}
                  fill="black"
                  fillOpacity="0.54"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex md:hidden items-center justify-center pb-[32px] px-[16px] shrink-0 w-full">
          <div className="flex flex-1 flex-col gap-[16px] items-end w-full">
            <div className="flex gap-[8px] items-start w-full">
              <div className="flex gap-[4px] items-start font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] w-[136px] shrink-0">
                <p className="text-[rgba(0,0,0,0.3)] whitespace-nowrap shrink-0">{spuName ? stripConnectivitySuffix(spuName) : "Smoke S1"}</p>
                <div className="flex flex-col gap-[4px] text-[#16dd00] w-[47px] shrink-0">
                  <p>Pro</p>
                  <p>Wi-Fi</p>
                </div>
              </div>
              <div className="bg-[rgba(22,221,0,0.1)] flex flex-1 gap-[4px] items-start p-[8px] rounded-[5px]">
                <div className="flex h-[20px] items-center shrink-0">
                  <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334zm3.138-8.195a.667.667 0 00-.943-.943L7.333 8.39 5.805 6.862a.667.667 0 10-.943.943l2 2a.667.667 0 00.943 0l3.333-3.333z" fill="#16dd00"/>
                  </svg>
                </div>
                <p className="flex-1 font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[14px] text-black">
                  Devices with the suffix &ldquo;Pro&rdquo; or &ldquo;Wi-Fi&rdquo; support connection to the X-SENSE App.
                </p>
              </div>
            </div>
            <div className="w-full h-0 border-t border-dashed border-[rgba(0,0,0,0.15)]" />
            <div className="flex gap-[8px] items-start justify-end w-full">
              <div className="flex flex-col gap-[4px] items-end font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-[#ff3b3b] text-right w-[136px] shrink-0">
                <p>+</p>
                <p>(base)</p>
              </div>
              <div className="bg-[rgba(221,0,0,0.1)] flex flex-1 gap-[4px] items-start p-[8px] rounded-[5px]">
                <div className="flex h-[20px] items-center shrink-0">
                  <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334zM6.862 5.919a.667.667 0 00-.943.943L7.057 8l-1.138 1.138a.667.667 0 10.943.943L8 8.943l1.138 1.138a.667.667 0 10.943-.943L8.943 8l1.138-1.138a.667.667 0 10-.943-.943L8 7.057 6.862 5.919z" fill="#ff3b3b"/>
                  </svg>
                </div>
                <p className="flex-1 font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[14px] text-black">
                  Devices with the suffix &ldquo;+&rdquo; or no suffix (base models) do not support connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="hidden md:flex content-stretch items-start pb-[32px] px-[32px] relative shrink-0 w-full">
          <div className="flex-[1_0_0] h-[196px] min-h-px min-w-px relative">
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[75px] not-italic text-[18px] text-[rgba(0,0,0,0.3)] top-[28px] whitespace-nowrap">
              {spuName ? stripConnectivitySuffix(spuName) : "Smoke S1"}
            </p>
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[164px] not-italic text-[18px] text-[#16dd00] top-[28px] whitespace-nowrap">
              Pro
            </p>
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[164px] not-italic text-[18px] text-[#16dd00] top-[56px] whitespace-nowrap">
              Wi-Fi
            </p>
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[164px] not-italic text-[18px] text-[#ff3b3b] top-[102px] whitespace-nowrap">
              +
            </p>
            <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-[164px] not-italic text-[18px] text-[#ff3b3b] top-[130px] whitespace-nowrap">
              (base)
            </p>
            <div className="absolute bg-[rgba(22,221,0,0.1)] content-stretch flex gap-[4px] items-start left-[229px] p-[8px] rounded-[5px] top-[26px]">
              <div className="content-stretch flex h-[20px] items-center relative shrink-0">
                <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334zm3.138-8.195a.667.667 0 00-.943-.943L7.333 8.39 5.805 6.862a.667.667 0 10-.943.943l2 2a.667.667 0 00.943 0l3.333-3.333z" fill="#16dd00"/>
                </svg>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black w-[315px]">
                Devices with the suffix "Pro" or "Wi-Fi" support connection to the X-SENSE App.
              </p>
            </div>
            <div className="absolute bg-[rgba(221,0,0,0.1)] content-stretch flex gap-[4px] items-start left-[229px] p-[8px] rounded-[5px] top-[98px]">
              <div className="content-stretch flex h-[20px] items-center relative shrink-0">
                <svg className="shrink-0 size-[16px]" viewBox="0 0 16 16" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334zM6.862 5.919a.667.667 0 00-.943.943L7.057 8l-1.138 1.138a.667.667 0 10.943.943L8 8.943l1.138 1.138a.667.667 0 10.943-.943L8.943 8l1.138-1.138a.667.667 0 10-.943-.943L8 7.057 6.862 5.919z" fill="#ff3b3b"/>
                </svg>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black w-[315px]">
                Devices with the suffix "+" or no suffix (base models) do not support connection.
              </p>
            </div>
            <div className="-translate-x-1/2 absolute h-0 left-1/2 top-[90px] w-[584px] border-t border-dashed border-[rgba(0,0,0,0.15)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== App Tab Content ==================== */

function InfoIcon() {
  return (
    <svg className="shrink-0 size-[20px]" viewBox="0 0 20 20" fill="none">
      <path d="M10 18a8 8 0 100-16 8 8 0 000 16z" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" />
      <path d="M10 9v4M10 7h.01" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AppTabContent({ spu, appData }: { spu: Spu | null; appData: SupportAppData | null }) {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [showSupportedDevices, setShowSupportedDevices] = useState(false);

  const needsBaseStation = spu?.connectivity === "Base Station Interconnected (App)";
  const isNotAppSupported = spu?.connectivity === "Standalone" || spu?.connectivity === "Wireless Interconnected";
  const version = platform === "ios" ? appData?.iosVersion : appData?.androidVersion;

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
        {/* App Icon */}
        <div className="shrink-0 size-[80px] overflow-hidden">
          {appData?.iconUrl && (
            <img alt="App Icon" className="size-full object-cover" src={appData.iconUrl} />
          )}
        </div>

        {/* Right Column: Name + Description + Tabs + Panel */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] w-full">
            {appData?.appName || "X-SENSE Home Security"}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
            {appData?.appDescription || ""}
          </p>

          {/* Not App Supported Notice (red) */}
          {isNotAppSupported && (
            <div className="bg-[rgba(255,0,0,0.15)] content-stretch flex gap-[10px] items-center justify-center p-[8px] relative shrink-0 w-full">
              <InfoIcon />
              <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.54)]">
                This device cannot be connected to the X-SENSE App.
              </p>
              <button
                type="button"
                onClick={() => setShowSupportedDevices(true)}
                className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[#ba0020] whitespace-nowrap hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                View Supported Devices
              </button>
            </div>
          )}

          {/* Base Station Notice (orange) */}
          {needsBaseStation && (
            <div className="bg-[rgba(255,161,0,0.1)] content-stretch flex gap-[10px] items-center justify-center p-[8px] relative shrink-0 w-full">
              <InfoIcon />
              <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.54)]">
                This device must be connected to a Base Station before it can be used with the X-SENSE App.
              </p>
            </div>
          )}

          {/* Tabs + Version Info (hidden when device doesn't support app) */}
          {!isNotAppSupported && (
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {/* Platform Tabs: iOS / Android */}
            <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[34px] h-[40px] items-center relative shrink-0 w-full">
              {(["ios", "android"] as const).map((p) => (
                <div key={p} className="flex flex-row items-center self-stretch">
                  <div
                    className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer"
                    onClick={() => setPlatform(p)}
                  >
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                      {p === "ios" ? "iOS" : "Android"}
                    </p>
                    {platform === p && (
                      <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Version Info Panel */}
            <div className="bg-[#f6f6f6] content-stretch flex flex-col gap-[16px] items-start overflow-clip px-[32px] py-[24px] relative shrink-0 w-full">
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative self-stretch shrink-0 w-[413px]">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[18px] text-black w-full">
                    {version || "—"}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                    {platform === "ios"
                      ? "Requires iOS 13.0 or later; we recommend using an iPhone 11 or newer."
                      : "Requires Android 8.0 or later."}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                    The following models have been tested and are recommended for use:
                  </p>
                </div>
                {/* QR Code */}
                <div className="bg-white rounded-[4px] shrink-0 size-[80px] flex items-center justify-center overflow-hidden">
                  <img
                    alt={platform === "android" ? "Android QR Code" : "iOS QR Code"}
                    className="size-full object-contain"
                    src={platform === "android" ? "/images/android-qr.svg" : "/images/ios-qr.svg"}
                  />
                </div>
              </div>
              {/* Recommended Models */}
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[4px] items-start leading-[20px] not-italic relative shrink-0 text-[14px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    Recommended Models:
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[rgba(0,0,0,0.54)]">
                    {platform === "ios"
                      ? "Compatible with: iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17, iPhone 16E, iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15, iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14, iPhone 13 Pro Max, iPhone 13 Pro, iPhone 13, iPhone 13 mini, iPhone 12 Pro Max, iPhone 12 Pro, iPhone 12, iPhone 12 mini, iPhone 11 Pro Max, iPhone 11 Pro, iPhone 11, iPhone SE 3, iPhone SE 2"
                      : "Compatible with: Samsung Galaxy S25 Ultra, Galaxy S25+, Galaxy S25, Galaxy S24 Ultra, Galaxy S24+, Galaxy S24, Galaxy S23 Ultra, Galaxy S23+, Galaxy S23, Google Pixel 9 Pro, Pixel 9, Pixel 8 Pro, Pixel 8, Pixel 7 Pro, Pixel 7, OnePlus 13, OnePlus 12, Xiaomi 15, Xiaomi 14"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      <ViewSupportedDevicesDialog open={showSupportedDevices} onClose={() => setShowSupportedDevices(false)} spuName={spu?.name} />
    </div>
  );
}

/* ==================== FAQ Accordion Icon ==================== */

function FaqAccordionIcon({ expanded }: { expanded: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        viewBox="0 0 24 24"
        fill="none"
        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
      >
        <path d="M6 9L12 15L18 9" stroke="rgba(0,0,0,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ==================== Animated Collapse ==================== */

function AnimatedCollapse({ expanded, children }: { expanded: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  useEffect(() => {
    if (expanded && contentRef.current) {
      const raf = requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [expanded, children]);

  return (
    <div style={{ height, overflow: "hidden", transition: "height 300ms ease-in-out" }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

/* ==================== FAQs Tab Content ==================== */

function FaqsTabContent({ faqs, loading }: { faqs: FaqItem[]; loading: boolean }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#f6f6f6] rounded-[16px] h-[62px] w-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[40px] relative shrink-0 w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[rgba(0,0,0,0.38)]">
          No FAQs available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      {faqs.map((faq) => {
        const isExpanded = expandedIds.has(faq.id);
        return (
          <div key={faq.id} className="bg-[#f6f6f6] content-stretch flex flex-col items-start relative shrink-0 w-full rounded-none">
            <div
              className={`content-stretch flex gap-[8px] items-center px-[16px] py-[20px] relative shrink-0 w-full cursor-pointer ${
                isExpanded ? "border-[rgba(0,0,0,0.1)] border-b-[0.33px] border-solid" : ""
              }`}
              onClick={() => setExpandedIds((prev) => { const next = new Set(prev); if (next.has(faq.id)) next.delete(faq.id); else next.add(faq.id); return next; })}
            >
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-h-px min-w-px relative">
                <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(0,0,0,0.9)]">
                  <p className="leading-[22px]">{faq.question}</p>
                </div>
                <FaqAccordionIcon expanded={isExpanded} />
              </div>
            </div>
            <AnimatedCollapse expanded={isExpanded}>
              <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[20px] relative shrink-0 w-full">
                <div className="flex flex-[1_0_0] flex-col gap-[12px] min-h-px min-w-px relative">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] whitespace-pre-line">
                    {faq.answer}
                  </p>
                  {faq.answerImageUrl && (
                    <img alt="" className="max-w-full rounded-[8px]" src={faq.answerImageUrl} />
                  )}
                </div>
              </div>
            </AnimatedCollapse>
          </div>
        );
      })}
    </div>
  );
}

/* ==================== Mobile FAQs Tab Content ==================== */

function MobileFaqsTabContent({ faqs, loading }: { faqs: FaqItem[]; loading: boolean }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full mt-[16px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#f6f6f6] rounded-[12px] h-[54px] w-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[32px] relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] text-[13px] text-[rgba(0,0,0,0.38)]">
          No FAQs available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full mt-[16px]">
      {faqs.map((faq) => {
        const isExpanded = expandedIds.has(faq.id);
        return (
          <div key={faq.id} className="bg-[#f6f6f6] content-stretch flex flex-col items-start relative shrink-0 w-full rounded-[12px]">
            <div
              className={`content-stretch flex gap-[8px] items-center px-[12px] py-[16px] relative shrink-0 w-full cursor-pointer ${
                isExpanded ? "border-[rgba(0,0,0,0.1)] border-b-[0.33px] border-solid rounded-tl-[12px] rounded-tr-[12px]" : "rounded-[12px]"
              }`}
              onClick={() => setExpandedIds((prev) => { const next = new Set(prev); if (next.has(faq.id)) next.delete(faq.id); else next.add(faq.id); return next; })}
            >
              <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.9)]">
                  <p className="leading-[20px]">{faq.question}</p>
                </div>
                <FaqAccordionIcon expanded={isExpanded} />
              </div>
            </div>
            <AnimatedCollapse expanded={isExpanded}>
              <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[16px] relative rounded-bl-[12px] rounded-br-[12px] shrink-0 w-full">
                <div className="flex flex-[1_0_0] flex-col gap-[8px] min-h-px min-w-px relative">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic text-[13px] text-[rgba(0,0,0,0.9)] whitespace-pre-line">
                    {faq.answer}
                  </p>
                  {faq.answerImageUrl && (
                    <img alt="" className="max-w-full rounded-[8px]" src={faq.answerImageUrl} />
                  )}
                </div>
              </div>
            </AnimatedCollapse>
          </div>
        );
      })}
    </div>
  );
}

/* ==================== Specs Tab Content ==================== */

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

function SpecsTabContent({ specs }: { specs?: SpecsData }) {
  const filledFields = SPECS_FIELDS.filter(({ key }) => specs?.[key]?.trim());

  if (!specs || filledFields.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[40px] relative shrink-0 w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[rgba(0,0,0,0.38)]">
          No specs available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] content-start flex flex-wrap gap-0 items-start leading-[20px] not-italic px-[16px] relative shrink-0 w-full text-[14px] rounded-none">
      {filledFields.map(({ key, label }, idx) => {
        const isLastRow = idx >= filledFields.length - (filledFields.length % 2 === 0 ? 2 : 1);
        return (
          <div
            key={key}
            className={`content-stretch flex flex-[1_0_0] h-[70px] items-center min-h-px min-w-[454px] relative ${
              isLastRow ? "" : "border-[rgba(0,0,0,0.1)] border-b border-solid"
            }`}
          >
            <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[rgba(0,0,0,0.9)]">
              {label}
            </p>
            <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[rgba(0,0,0,0.54)]">
              {specs[key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function MobileSpecsTabContent({ specs }: { specs?: SpecsData }) {
  const filledFields = SPECS_FIELDS.filter(({ key }) => specs?.[key]?.trim());

  if (!specs || filledFields.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[32px] relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] text-[13px] text-[rgba(0,0,0,0.38)]">
          No specs available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col items-start leading-[18px] not-italic px-[12px] relative shrink-0 w-full text-[13px] rounded-[12px] mt-[16px]">
      {filledFields.map(({ key, label }, idx) => (
        <div
          key={key}
          className={`content-stretch flex h-[56px] items-center relative shrink-0 w-full ${
            idx < filledFields.length - 1 ? "border-[rgba(0,0,0,0.1)] border-b border-solid" : ""
          }`}
        >
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium min-h-px min-w-px relative text-[rgba(0,0,0,0.9)]">
            {label}
          </p>
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal min-h-px min-w-px relative text-[rgba(0,0,0,0.54)]">
            {specs[key]}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ==================== PDF Icon ==================== */

function PdfIcon() {
  return (
    <svg className="shrink-0 size-[24px]" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6Z"
        stroke="rgba(0,0,0,0.7)"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M14 2V8H20" stroke="rgba(0,0,0,0.7)" strokeWidth="1.2" fill="none" />
      <text x="7" y="17.5" fontSize="6.5" fontWeight="700" fontFamily="Inter, sans-serif" fill="#BA0020">
        PDF
      </text>
    </svg>
  );
}

/* ==================== Download Arrow Icon ==================== */

function DownloadArrowIcon() {
  return (
    <svg className="shrink-0 size-[24px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 4V16M12 16L7 11M12 16L17 11" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 20H19" stroke="rgba(0,0,0,0.54)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ==================== Manuals Tab Content ==================== */

function ManualsTabContent({ manuals }: { manuals?: ManualItem[] }) {
  const items = manuals?.filter((m) => m.coverImage?.url || m.pdfUrl) || [];

  if (items.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[40px] relative shrink-0 w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] text-[14px] text-[rgba(0,0,0,0.38)]">
          No manuals available for this product.
        </p>
      </div>
    );
  }

  const placeholders = items.length % 3 === 0 ? 0 : 3 - (items.length % 3);

  return (
    <div className="content-stretch flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
      {items.map((manual, idx) => (
        <a
          key={idx}
          href={manual.pdfUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#f6f6f6] content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative no-underline"
          style={{ maxWidth: `calc((100% - 32px) / 3)` }}
        >
          <div className="aspect-[1046/1125] relative shrink-0 w-full overflow-hidden">
            {manual.coverImage?.url ? (
              <img
                alt={manual.name || "Manual cover"}
                className="absolute inset-0 object-cover pointer-events-none size-full"
                src={manual.coverImage.url}
              />
            ) : (
              <div className="absolute inset-0 bg-[#e8e8e8] flex items-center justify-center">
                <PdfIcon />
              </div>
            )}
          </div>
          <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[20px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-h-px min-w-px relative">
              <PdfIcon />
              <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(0,0,0,0.9)]">
                <p className="leading-[22px]">{manual.name || "Manual"}</p>
              </div>
              <DownloadArrowIcon />
            </div>
          </div>
        </a>
      ))}
      {Array.from({ length: placeholders }).map((_, i) => (
        <div key={`ph-${i}`} className="flex-[1_0_0] min-h-px min-w-px" style={{ maxWidth: `calc((100% - 32px) / 3)` }} />
      ))}
    </div>
  );
}

function MobileManualsTabContent({ manuals }: { manuals?: ManualItem[] }) {
  const items = manuals?.filter((m) => m.coverImage?.url || m.pdfUrl) || [];

  if (items.length === 0) {
    return (
      <div className="content-stretch flex items-center justify-center py-[32px] relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] text-[13px] text-[rgba(0,0,0,0.38)]">
          No manuals available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full mt-[16px]">
      {items.map((manual, idx) => (
        <a
          key={idx}
          href={manual.pdfUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#f6f6f6] content-stretch flex flex-col items-start relative shrink-0 w-full rounded-[8px] overflow-hidden no-underline"
        >
          <div className="aspect-[1046/1125] relative shrink-0 w-full overflow-hidden">
            {manual.coverImage?.url ? (
              <img
                alt={manual.name || "Manual cover"}
                className="absolute inset-0 object-cover pointer-events-none size-full"
                src={manual.coverImage.url}
              />
            ) : (
              <div className="absolute inset-0 bg-[#e8e8e8] flex items-center justify-center">
                <PdfIcon />
              </div>
            )}
          </div>
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[16px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
              <PdfIcon />
              <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.9)]">
                <p className="leading-[20px]">{manual.name || "Manual"}</p>
              </div>
              <DownloadArrowIcon />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ==================== Chevron Icon ==================== */

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
        <svg
          className="block"
          width="8.333"
          height="15"
          viewBox="0 0 8.333 15"
          fill="none"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(-90deg)", transition: "transform 0.2s ease" }}
        >
          <path d="M1 1L7 7.5L1 14" stroke="rgba(0,0,0,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ==================== Video Helpers ==================== */

function parseYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

function PlayButtonOverlay({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10" onClick={onClick}>
      <div className="relative size-[56px]">
        <svg className="absolute block size-full" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="28" fill="#BA0020" />
          <path d="M22 16L40 28L22 40V16Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}

function VideoPlayer({ url, coverImage }: { url?: string; coverImage?: string }) {
  const [playing, setPlaying] = useState(false);

  if (!url) {
    return (
      <div className="aspect-video bg-[#f6f6f6] overflow-clip relative rounded-[16px] shrink-0 w-full flex items-center justify-center">
        <div className="relative size-[56px] opacity-30">
          <svg className="absolute block size-full" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#999" />
            <path d="M22 16L40 28L22 40V16Z" fill="white" />
          </svg>
        </div>
      </div>
    );
  }

  const youtubeId = parseYouTubeId(url);

  if (youtubeId) {
    const thumbnailUrl = coverImage || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    return (
      <div className="aspect-video bg-[#f6f6f6] overflow-clip relative rounded-[16px] shrink-0 w-full">
        {playing ? (
          <iframe
            className="absolute inset-0 size-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            title="Installation video"
          />
        ) : (
          <>
            <img
              alt="Video thumbnail"
              className="absolute inset-0 size-full object-cover"
              src={thumbnailUrl}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <PlayButtonOverlay onClick={() => setPlaying(true)} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="aspect-video bg-[#f6f6f6] overflow-clip relative rounded-[16px] shrink-0 w-full">
      {playing ? (
        <video className="absolute inset-0 size-full object-contain" src={url} controls autoPlay />
      ) : (
        <>
          {coverImage ? (
            <img alt="Video cover" className="absolute inset-0 size-full object-cover pointer-events-none" src={coverImage} />
          ) : (
            <video className="absolute inset-0 size-full object-contain pointer-events-none" src={url} preload="metadata" />
          )}
          <PlayButtonOverlay onClick={() => setPlaying(true)} />
        </>
      )}
    </div>
  );
}

/* ==================== Animated SPU List ==================== */

function AnimatedSpuList({
  expanded,
  spus,
  selectedSpuId,
  setSelectedSpuId,
  itemClassName,
  textClassName,
}: {
  expanded: boolean;
  spus: Spu[];
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
  itemClassName: (isSelected: boolean) => string;
  textClassName: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [showItems, setShowItems] = useState(false);
  const prevExpanded = useRef(expanded);

  useEffect(() => {
    if (expanded) {
      requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
      setShowItems(true);
    } else {
      setShowItems(false);
      const fadeOutDuration = prevExpanded.current ? Math.min(spus.length * 30 + 100, 200) : 0;
      setTimeout(() => setHeight(0), fadeOutDuration);
    }
    prevExpanded.current = expanded;
  }, [expanded, spus.length]);

  useEffect(() => {
    if (expanded && contentRef.current) {
      const raf = requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [expanded, spus]);

  return (
    <div
      style={{ height, overflow: "hidden", transition: "height 300ms ease-in-out" }}
    >
      <div ref={contentRef}>
        {spus.map((spu, index) => (
          <div
            key={spu.id}
            className={itemClassName(selectedSpuId === spu.id)}
            style={{
              opacity: showItems ? 1 : 0,
              transform: showItems ? "translateY(0)" : "translateY(-8px)",
              transition: showItems
                ? `opacity 180ms ease-out ${index * 40}ms, transform 180ms ease-out ${index * 40}ms`
                : `opacity 100ms ease-in ${(spus.length - 1 - index) * 30}ms, transform 100ms ease-in ${(spus.length - 1 - index) * 30}ms`,
            }}
            onClick={() => setSelectedSpuId(spu.id)}
          >
            <div className="content-stretch flex flex-col items-start relative shrink-0">
              <p className={textClassName}>
                {spu.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== Sidebar ==================== */

function Sidebar({
  categoriesWithSpus,
  expandedCategories,
  toggleCategory,
  selectedSpuId,
  setSelectedSpuId,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[340px]">
      {categoriesWithSpus.map((cat) => {
        const isExpanded = expandedCategories.has(cat.id);
        const hasSelectedSpu = cat.spus.some((spu) => spu.id === selectedSpuId);
        return (
          <div key={cat.id} className="w-full">
            <div
              className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                <p
                  className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                    hasSelectedSpu ? "text-[#ba0020]" : "text-[#333]"
                  }`}
                >
                  {cat.name}
                </p>
              </div>
              <ChevronIcon expanded={isExpanded} />
            </div>
            <AnimatedSpuList
              expanded={isExpanded}
              spus={cat.spus}
              selectedSpuId={selectedSpuId}
              setSelectedSpuId={setSelectedSpuId}
              itemClassName={(isSelected) =>
                `content-stretch flex items-center justify-between pl-[24px] py-[20px] relative shrink-0 w-full cursor-pointer transition-colors duration-150 ${
                  isSelected ? "bg-[rgba(0,0,0,0.05)]" : "hover:bg-[rgba(0,0,0,0.03)]"
                }`
              }
              textClassName="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[16px] whitespace-nowrap"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ==================== Image Lightbox ==================== */

function ImageLightbox({
  images,
  currentIndex,
  onChangeIndex,
  open,
  onClose,
}: {
  images: { url: string }[];
  currentIndex: number;
  onChangeIndex: (idx: number) => void;
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(false));
      });
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      onClose();
    }, 250);
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && hasPrev) onChangeIndex(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onChangeIndex(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, handleClose, hasPrev, hasNext, currentIndex, onChangeIndex]);

  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  const show = open && !animating;
  const src = images[currentIndex]?.url || "";

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-center justify-center p-[24px] transition-all duration-250 ease-in-out ${
        show ? "bg-[rgba(0,0,0,0.75)] opacity-100" : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-[24px] right-[24px] z-10 size-[40px] cursor-pointer border-none bg-[rgba(0,0,0,0.3)] rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.5)] transition-colors"
      >
        <svg className="size-[20px]" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onChangeIndex(currentIndex - 1); }}
          className="absolute left-[24px] z-10 size-[48px] cursor-pointer border-none bg-[rgba(0,0,0,0.3)] rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.5)] transition-colors"
        >
          <svg className="size-[24px]" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onChangeIndex(currentIndex + 1); }}
          className="absolute right-[24px] z-10 size-[48px] cursor-pointer border-none bg-[rgba(0,0,0,0.3)] rounded-full flex items-center justify-center hover:bg-[rgba(0,0,0,0.5)] transition-colors"
        >
          <svg className="size-[24px]" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-[24px] left-1/2 -translate-x-1/2 z-10 bg-[rgba(0,0,0,0.4)] rounded-full px-[16px] py-[6px]">
          <p className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white leading-[20px] whitespace-nowrap">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}

      {/* Image */}
      <img
        key={currentIndex}
        alt={`Step ${currentIndex + 1}`}
        src={src}
        className={`max-w-full max-h-full object-contain rounded-[8px] transition-all duration-250 ease-in-out ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      />
    </div>
  );
}

/* ==================== Product Detail ==================== */

function SetupTabContent({ spu }: { spu: Spu | null }) {
  const videoUrl = spu?.setupInstallation?.installationVideoUrl;
  const videoCoverUrl = spu?.setupInstallation?.installationVideoCoverImage?.url;
  const guideImages = spu?.setupInstallation?.quickStartGuideImages || [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">
          Installation video
        </p>
        <VideoPlayer key={spu?.id} url={videoUrl} coverImage={videoCoverUrl} />
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">
          Quick Start Guide
        </p>
        <div className="content-stretch flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
          {guideImages.length > 0
            ? guideImages.map((img, i) => (
                <div
                  key={i}
                  className="aspect-[2492/4096] bg-[#f6f6f6] rounded-[12px] overflow-hidden cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ width: "calc(25% - 12px)" }}
                  onClick={() => setLightboxIdx(i)}
                >
                  <img alt={`Step ${i + 1}`} className="size-full object-cover" src={img.url} />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] rounded-[12px]" style={{ width: "calc(25% - 12px)" }} />
              ))}
        </div>
      </div>
      {lightboxIdx !== null && guideImages[lightboxIdx] && (
        <ImageLightbox
          images={guideImages}
          currentIndex={lightboxIdx}
          onChangeIndex={setLightboxIdx}
          open={lightboxIdx !== null}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

function ProductDetail({
  spu,
  appData,
  faqs,
  faqsLoading,
  activeTab,
  setActiveTab,
}: {
  spu: Spu | null;
  appData: SupportAppData | null;
  faqs: FaqItem[];
  faqsLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      {/* Product Title */}
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
        <div className="bg-[#f6f6f6] rounded-[12px] shrink-0 size-[192px] overflow-hidden">
          {spu?.imageUrl && (
            <img alt={spu.name} className="size-full object-contain" src={spu.imageUrl} />
          )}
        </div>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-black whitespace-nowrap">
          {spu?.name || ""}
        </p>
      </div>

      {/* Tabs + Content */}
      <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
        {/* Tab Bar */}
        <SlidingTabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          containerClassName="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[34px] h-[40px] items-center relative shrink-0 w-full"
          tabClassName="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer"
          textClassName="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] whitespace-nowrap"
        />

        {/* Tab Content */}
        {activeTab === "Setup & Installation" && <SetupTabContent spu={spu} />}
        {activeTab === "App" && <AppTabContent spu={spu} appData={appData} />}
        {activeTab === "FAQs" && <FaqsTabContent faqs={faqs} loading={faqsLoading} />}
        {activeTab === "Specs" && <SpecsTabContent specs={spu?.specs} />}
        {activeTab === "Manuals" && <ManualsTabContent manuals={spu?.manuals} />}
      </div>
    </div>
  );
}

/* ==================== Mobile Sidebar ==================== */

function MobileSidebar({
  categoriesWithSpus,
  expandedCategories,
  toggleCategory,
  selectedSpuId,
  setSelectedSpuId,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {categoriesWithSpus.map((cat) => {
        const isExpanded = expandedCategories.has(cat.id);
        const hasSelectedSpu = cat.spus.some((spu) => spu.id === selectedSpuId);
        return (
          <div key={cat.id} className="w-full">
            <div
              className="content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full cursor-pointer"
              onClick={() => toggleCategory(cat.id)}
            >
              <p
                className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                  hasSelectedSpu ? "text-[#ba0020]" : "text-[#333]"
                }`}
              >
                {cat.name}
              </p>
              <ChevronIcon expanded={isExpanded} />
            </div>
            <AnimatedSpuList
              expanded={isExpanded}
              spus={cat.spus}
              selectedSpuId={selectedSpuId}
              setSelectedSpuId={setSelectedSpuId}
              itemClassName={(isSelected) =>
                `content-stretch flex items-center pl-[16px] py-[12px] relative shrink-0 w-full cursor-pointer transition-colors duration-150 ${
                  isSelected ? "bg-[rgba(0,0,0,0.05)]" : "hover:bg-[rgba(0,0,0,0.03)]"
                }`
              }
              textClassName="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[14px] whitespace-nowrap"
            />
          </div>
        );
      })}
    </div>
  );
}

/* ==================== Mobile Product Detail ==================== */

function MobileSetupTabContent({ spu }: { spu: Spu | null }) {
  const videoUrl = spu?.setupInstallation?.installationVideoUrl;
  const videoCoverUrl = spu?.setupInstallation?.installationVideoCoverImage?.url;
  const guideImages = spu?.setupInstallation?.quickStartGuideImages || [];
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black text-center w-full">
          Installation video
        </p>
        <VideoPlayer key={spu?.id} url={videoUrl} coverImage={videoCoverUrl} />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black text-center w-full">
          Quick Start Guide
        </p>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
          {guideImages.length > 0
            ? guideImages.map((img, i) => (
                <div
                  key={i}
                  className="bg-[#f6f6f6] rounded-[8px] overflow-hidden cursor-pointer active:opacity-70 transition-opacity w-full"
                  onClick={() => setLightboxIdx(i)}
                >
                  <img alt={`Step ${i + 1}`} className="w-full h-auto object-contain" src={img.url} />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] rounded-[8px] w-full" />
              ))}
        </div>
      </div>
      {lightboxIdx !== null && guideImages[lightboxIdx] && (
        <ImageLightbox
          images={guideImages}
          currentIndex={lightboxIdx}
          onChangeIndex={setLightboxIdx}
          open={lightboxIdx !== null}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

function MobileAppTabContent({ spu, appData }: { spu: Spu | null; appData: SupportAppData | null }) {
  const [showSupportedDevices, setShowSupportedDevices] = useState(false);

  const isAndroid = /android/i.test(navigator.userAgent);
  const platform: "ios" | "android" = isAndroid ? "android" : "ios";

  const needsBaseStation = spu?.connectivity === "Base Station Interconnected (App)";
  const isNotAppSupported = spu?.connectivity === "Standalone" || spu?.connectivity === "Wireless Interconnected";
  const version = platform === "ios" ? appData?.iosVersion : appData?.androidVersion;

  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full mt-[16px]">
      {/* App Icon */}
      <div className="shrink-0 size-[48px] overflow-hidden">
        {appData?.iconUrl && (
          <img alt="App Icon" className="size-full object-cover" src={appData.iconUrl} />
        )}
      </div>

      {/* Right Column */}
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
        {/* Top Section */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-full">
            {appData?.appName || "X-SENSE Home Security"}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
            {appData?.appDescription || ""}
          </p>

          {/* Not App Supported Notice (red) */}
          {isNotAppSupported && (
            <div className="bg-[rgba(255,0,0,0.15)] content-stretch flex gap-[8px] items-start p-[8px] relative shrink-0 w-full">
              <InfoIcon />
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center leading-[16px] not-italic relative min-w-0 text-[12px]">
                <p className="font-['Inter:Medium',sans-serif] font-medium relative shrink-0 text-[rgba(0,0,0,0.54)]">
                  This device cannot be connected to the X-SENSE App.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSupportedDevices(true)}
                  className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#ba0020] whitespace-nowrap cursor-pointer bg-transparent border-none p-0 leading-[16px] text-[12px]"
                >
                  View Supported Devices
                </button>
              </div>
            </div>
          )}

          {/* Base Station Notice (orange) */}
          {needsBaseStation && (
            <div className="bg-[rgba(255,161,0,0.1)] content-stretch flex gap-[10px] items-center justify-center p-[8px] relative shrink-0 w-full">
              <InfoIcon />
              <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.54)]">
                This device must be connected to a Base Station before it can be used with the X-SENSE App.
              </p>
            </div>
          )}

          {/* Download App Button */}
          {!isNotAppSupported && (
            <button
              type="button"
              className="bg-[#ba0020] flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] rounded-[50px] shrink-0 cursor-pointer border-none"
              onClick={() => {
                const url = platform === "android"
                  ? "https://play.google.com/store/apps/details?id=com.xsense.security"
                  : "https://apps.apple.com/us/app/x-sense-home-security/id1568666708";
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic text-[14px] text-white text-center whitespace-nowrap">
                Download App
              </p>
            </button>
          )}
        </div>

        {/* Divider + Version Info */}
        {!isNotAppSupported && (
        <>
          <div className="h-0 relative shrink-0 w-full border-t border-solid border-[rgba(0,0,0,0.1)]" />

          <div className="bg-[#f6f6f6] content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[12px] relative shrink-0 w-full">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">
              {version || "—"}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
              {platform === "ios"
                ? "Requires iOS 13.0 or later; we recommend using an iPhone 11 or newer."
                : "Requires Android 8.0 or later."}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
              The following models have been tested and are recommended for use:
            </p>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                Recommended Models:
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
                {platform === "ios"
                  ? "Compatible with: iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17, iPhone 16E, iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15, iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14, iPhone 13 Pro Max, iPhone 13 Pro, iPhone 13, iPhone 13 mini, iPhone 12 Pro Max, iPhone 12 Pro, iPhone 12, iPhone 12 mini, iPhone 11 Pro Max, iPhone 11 Pro, iPhone 11, iPhone SE 3, iPhone SE 2"
                  : "Compatible with: Samsung Galaxy S25 Ultra, Galaxy S25+, Galaxy S25, Galaxy S24 Ultra, Galaxy S24+, Galaxy S24, Galaxy S23 Ultra, Galaxy S23+, Galaxy S23, Google Pixel 9 Pro, Pixel 9, Pixel 8 Pro, Pixel 8, Pixel 7 Pro, Pixel 7, OnePlus 13, OnePlus 12, Xiaomi 15, Xiaomi 14"}
              </p>
            </div>
          </div>
        </>
        )}
      </div>
      <ViewSupportedDevicesDialog open={showSupportedDevices} onClose={() => setShowSupportedDevices(false)} spuName={spu?.name} />
    </div>
  );
}

function MobileProductDetail({
  spu,
  appData,
  faqs,
  faqsLoading,
  activeTab,
  setActiveTab,
}: {
  spu: Spu | null;
  appData: SupportAppData | null;
  faqs: FaqItem[];
  faqsLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {/* Product Title */}
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
        <div className="bg-[#f6f6f6] rounded-[8px] shrink-0 size-[80px] overflow-hidden">
          {spu?.imageUrl && (
            <img alt={spu.name} className="size-full object-contain" src={spu.imageUrl} />
          )}
        </div>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black">
          {spu?.name || ""}
        </p>
      </div>

      {/* Tabs */}
      <SlidingTabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        containerClassName="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-[calc(100%+40px)] -ml-[20px] px-[20px] overflow-x-auto scrollbar-hide mt-[12px]"
        tabClassName="content-stretch flex h-full items-center justify-center px-[8px] py-[10px] relative shrink-0 cursor-pointer"
        textClassName="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.9)] whitespace-nowrap"
      />

      {/* Tab Content */}
      {activeTab === "Setup & Installation" && <MobileSetupTabContent spu={spu} />}
      {activeTab === "App" && <MobileAppTabContent spu={spu} appData={appData} />}
      {activeTab === "FAQs" && <MobileFaqsTabContent faqs={faqs} loading={faqsLoading} />}
      {activeTab === "Specs" && <MobileSpecsTabContent specs={spu?.specs} />}
      {activeTab === "Manuals" && <MobileManualsTabContent manuals={spu?.manuals} />}
    </div>
  );
}

/* ==================== Sidebar Skeleton ==================== */

function SidebarSkeleton() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[340px]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full">
          <div className="h-[22px] w-[120px] rounded-[4px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
          <div className="size-[20px] rounded bg-[rgba(0,0,0,0.05)] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px relative">
      <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
        <div className="bg-[rgba(0,0,0,0.05)] rounded-[12px] shrink-0 size-[192px] animate-pulse" />
        <div className="h-[36px] w-[180px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
      </div>
      <div className="h-[40px] w-full rounded bg-[rgba(0,0,0,0.03)] animate-pulse" />
      <div className="h-[34px] w-[200px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse mx-auto" />
      <div className="aspect-video bg-[rgba(0,0,0,0.03)] rounded-[16px] w-full animate-pulse" />
    </div>
  );
}

/* ==================== Main Page ==================== */

export default function DownloadCenterPage() {
  const [searchParams] = useSearchParams();
  const urlSpuId = searchParams.get("spuId");
  const urlTab = searchParams.get("tab");

  const [isMobile, setIsMobile] = useState(false);
  const { categoriesWithSpus, loading } = useDownloadCenterData();
  const { appData } = useSupportApp();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedSpuId, setSelectedSpuId] = useState("");
  const [activeTab, setActiveTab] = useState(
    urlTab && TABS.includes(urlTab) ? urlTab : "Setup & Installation"
  );

  const toggleCategory = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const initialized = useRef(false);
  useEffect(() => {
    if (!loading && categoriesWithSpus.length > 0 && !initialized.current) {
      initialized.current = true;

      const allSpus = categoriesWithSpus.flatMap((c) => c.spus);
      const targetSpu = urlSpuId ? allSpus.find((s) => s.id === urlSpuId) : null;

      if (targetSpu) {
        const ownerCat = categoriesWithSpus.find((c) => c.spus.some((s) => s.id === targetSpu.id));
        if (ownerCat) setExpandedCategories(new Set([ownerCat.id]));
        setSelectedSpuId(targetSpu.id);
      } else {
        const firstCatWithSpus = categoriesWithSpus.find((c) => c.spus.length > 0);
        if (firstCatWithSpus) {
          setExpandedCategories(new Set([firstCatWithSpus.id]));
          if (firstCatWithSpus.spus.length > 0) {
            setSelectedSpuId(firstCatWithSpus.spus[0].id);
          }
        }
      }
    }
  }, [loading, categoriesWithSpus, urlSpuId]);

  const allSpus = categoriesWithSpus.flatMap((c) => c.spus);
  const selectedSpu = allSpus.find((s) => s.id === selectedSpuId) || null;
  const { faqs, loading: faqsLoading } = useFaqs(selectedSpu?.categoryId);

  if (isMobile) {
    return (
      <>
        <MobileNav />
        <div className="bg-white relative min-h-screen w-full overflow-x-clip">
          <div className="h-[48px] w-full shrink-0" />

          {/* Navigation Bar */}
          <div className="bg-[#101820] content-stretch flex flex-col items-center justify-center overflow-clip px-[20px] relative shrink-0 w-full">
            <div className="content-stretch flex items-center py-[10px] relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-center text-white whitespace-nowrap">
                Download Center
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="content-stretch flex flex-col gap-[24px] items-start px-[20px] py-[24px] relative w-full">
            {loading ? (
              <div className="w-full flex flex-col gap-[16px]">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[54px] w-full rounded-[4px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
                ))}
              </div>
            ) : (
              <MobileProductDetail
                spu={selectedSpu}
                appData={appData}
                faqs={faqs}
                faqsLoading={faqsLoading}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
          </div>

          <Footer />
        </div>
      </>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <GlobalNav />
      <div className="pt-[104px]">
        {/* Navigation Bar */}
        <div
          className="bg-[#101820] content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 w-full"
          style={{ padding: "0 clamp(24px, 8vw, 120px)" }}
        >
          <div className="content-stretch flex items-center max-w-[1312px] py-[10px] relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-center text-white whitespace-nowrap">
              Download Center
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="bg-white content-stretch flex items-start justify-center relative shrink-0 w-full"
          style={{ padding: "40px clamp(24px, 8vw, 120px)" }}
        >
          <div className="content-stretch flex flex-[1_0_0] gap-[32px] items-start max-w-[1312px] min-h-px min-w-px relative">
            {loading ? (
              <>
                <SidebarSkeleton />
                <DetailSkeleton />
              </>
            ) : (
              <>
                <Sidebar
                  categoriesWithSpus={categoriesWithSpus}
                  expandedCategories={expandedCategories}
                  toggleCategory={toggleCategory}
                  selectedSpuId={selectedSpuId}
                  setSelectedSpuId={setSelectedSpuId}
                />
                <ProductDetail
                  spu={selectedSpu}
                  appData={appData}
                  faqs={faqs}
                  faqsLoading={faqsLoading}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
}
