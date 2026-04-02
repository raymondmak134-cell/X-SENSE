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
    if (!expanded) {
      setHeight(0);
      return;
    }
    const el = contentRef.current;
    if (!el) return;
    setHeight(el.scrollHeight);

    const ro = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

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
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }

    if (expanded) {
      setShowItems(true);
      requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
    } else {
      setShowItems(false);
      const fadeOutDuration = Math.min(spus.length * 30 + 100, 200);
      collapseTimer.current = setTimeout(() => {
        setHeight(0);
        collapseTimer.current = null;
      }, fadeOutDuration);
    }

    return () => {
      if (collapseTimer.current) {
        clearTimeout(collapseTimer.current);
        collapseTimer.current = null;
      }
    };
  }, [expanded, spus.length]);

  useEffect(() => {
    if (!expanded) return;
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setHeight(el.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
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

/* ==================== Static Help Sections ==================== */

interface StaticSubItem {
  id: string;
  label: string;
}

interface StaticSection {
  id: string;
  label: string;
  subItems: StaticSubItem[];
}

const STATIC_SECTIONS: StaticSection[] = [
  {
    id: "alarm-triggered",
    label: "Alarm Triggered",
    subItems: [
      { id: "alarm-sound-meaning", label: "Alarm Sound Meaning" },
      { id: "alarm-triggered-unexpectedly", label: "Alarm triggered unexpectedly" },
    ],
  },
  {
    id: "battery",
    label: "Battery",
    subItems: [
      { id: "drains-too-quickly", label: "Drains too Quickly" },
    ],
  },
];

/* ==================== Sidebar ==================== */

function Sidebar({
  categoriesWithSpus,
  expandedCategories,
  toggleCategory,
  selectedSpuId,
  setSelectedSpuId,
  expandedTopLevel,
  toggleTopLevel,
  selectedStaticItem,
  setSelectedStaticItem,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
  expandedTopLevel: Set<string>;
  toggleTopLevel: (id: string) => void;
  selectedStaticItem: string | null;
  setSelectedStaticItem: (id: string | null) => void;
}) {
  const isProductsExpanded = expandedTopLevel.has("products");
  const hasSelectedProduct = selectedSpuId !== "" && selectedStaticItem === null;

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[340px] h-full overflow-y-auto scrollbar-hide">
      {/* Products top-level */}
      <div className="w-full">
        <div
          className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
          onClick={() => toggleTopLevel("products")}
        >
          <div className="content-stretch flex flex-col items-start relative shrink-0">
            <p
              className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                hasSelectedProduct ? "text-[#ba0020]" : "text-[#333]"
              }`}
            >
              Products
            </p>
          </div>
          <ChevronIcon expanded={isProductsExpanded} />
        </div>
        <AnimatedCollapse expanded={isProductsExpanded}>
          <div className="pl-[16px]">
            {categoriesWithSpus.map((cat) => {
              const isExpanded = expandedCategories.has(cat.id);
              const hasSelectedSpu = cat.spus.some((spu) => spu.id === selectedSpuId) && selectedStaticItem === null;
              return (
                <div key={cat.id} className="w-full">
                  <div
                    className="content-stretch flex items-center justify-between py-[20px] relative shrink-0 w-full cursor-pointer"
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
                    selectedSpuId={selectedStaticItem === null ? selectedSpuId : ""}
                    setSelectedSpuId={(id) => {
                      setSelectedStaticItem(null);
                      setSelectedSpuId(id);
                    }}
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
        </AnimatedCollapse>
      </div>

      {/* Static sections: Alarm Triggered, Battery */}
      {STATIC_SECTIONS.map((section) => {
        const isSectionExpanded = expandedTopLevel.has(section.id);
        const hasSectionSelection = section.subItems.some((sub) => sub.id === selectedStaticItem);
        return (
          <div key={section.id} className="w-full">
            <div
              className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
              onClick={() => toggleTopLevel(section.id)}
            >
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                <p
                  className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                    hasSectionSelection ? "text-[#ba0020]" : "text-[#333]"
                  }`}
                >
                  {section.label}
                </p>
              </div>
              <ChevronIcon expanded={isSectionExpanded} />
            </div>
            <AnimatedCollapse expanded={isSectionExpanded}>
              <div className="pl-[16px]">
                {section.subItems.map((sub) => {
                  const isSelected = selectedStaticItem === sub.id;
                  return (
                    <div
                      key={sub.id}
                      className={`content-stretch flex items-center pl-[24px] py-[20px] relative shrink-0 w-full cursor-pointer transition-colors duration-150 ${
                        isSelected ? "bg-[rgba(0,0,0,0.05)]" : "hover:bg-[rgba(0,0,0,0.03)]"
                      }`}
                      onClick={() => setSelectedStaticItem(sub.id)}
                    >
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[16px] whitespace-nowrap">
                        {sub.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </AnimatedCollapse>
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
  expandedTopLevel,
  toggleTopLevel,
  selectedStaticItem,
  setSelectedStaticItem,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategories: Set<string>;
  toggleCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
  expandedTopLevel: Set<string>;
  toggleTopLevel: (id: string) => void;
  selectedStaticItem: string | null;
  setSelectedStaticItem: (id: string | null) => void;
}) {
  const isProductsExpanded = expandedTopLevel.has("products");
  const hasSelectedProduct = selectedSpuId !== "" && selectedStaticItem === null;

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {/* Products top-level */}
      <div className="w-full">
        <div
          className="content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full cursor-pointer"
          onClick={() => toggleTopLevel("products")}
        >
          <p
            className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
              hasSelectedProduct ? "text-[#ba0020]" : "text-[#333]"
            }`}
          >
            Products
          </p>
          <ChevronIcon expanded={isProductsExpanded} />
        </div>
        <AnimatedCollapse expanded={isProductsExpanded}>
          <div className="pl-[12px]">
            {categoriesWithSpus.map((cat) => {
              const isExpanded = expandedCategories.has(cat.id);
              const hasSelectedSpu = cat.spus.some((spu) => spu.id === selectedSpuId) && selectedStaticItem === null;
              return (
                <div key={cat.id} className="w-full">
                  <div
                    className="content-stretch flex items-center justify-between py-[12px] relative shrink-0 w-full cursor-pointer"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <p
                      className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[14px] whitespace-nowrap ${
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
                    selectedSpuId={selectedStaticItem === null ? selectedSpuId : ""}
                    setSelectedSpuId={(id) => {
                      setSelectedStaticItem(null);
                      setSelectedSpuId(id);
                    }}
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
        </AnimatedCollapse>
      </div>

      {/* Static sections: Alarm Triggered, Battery */}
      {STATIC_SECTIONS.map((section) => {
        const isSectionExpanded = expandedTopLevel.has(section.id);
        const hasSectionSelection = section.subItems.some((sub) => sub.id === selectedStaticItem);
        return (
          <div key={section.id} className="w-full">
            <div
              className="content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full cursor-pointer"
              onClick={() => toggleTopLevel(section.id)}
            >
              <p
                className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                  hasSectionSelection ? "text-[#ba0020]" : "text-[#333]"
                }`}
              >
                {section.label}
              </p>
              <ChevronIcon expanded={isSectionExpanded} />
            </div>
            <AnimatedCollapse expanded={isSectionExpanded}>
              <div className="pl-[12px]">
                {section.subItems.map((sub) => {
                  const isSelected = selectedStaticItem === sub.id;
                  return (
                    <div
                      key={sub.id}
                      className={`content-stretch flex items-center pl-[16px] py-[12px] relative shrink-0 w-full cursor-pointer transition-colors duration-150 ${
                        isSelected ? "bg-[rgba(0,0,0,0.05)]" : "hover:bg-[rgba(0,0,0,0.03)]"
                      }`}
                      onClick={() => setSelectedStaticItem(sub.id)}
                    >
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[14px] whitespace-nowrap">
                        {sub.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </AnimatedCollapse>
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

/* ==================== Static Placeholder Content ==================== */

function StaticPlaceholderContent({ itemId }: { itemId: string }) {
  if (itemId === "alarm-triggered-unexpectedly") {
    return <AlarmTriggeredContent />;
  }
  const allItems = STATIC_SECTIONS.flatMap((s) => s.subItems);
  const item = allItems.find((i) => i.id === itemId);
  return (
    <div className="content-stretch flex flex-col items-center justify-center min-h-[400px] w-full relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-[rgba(0,0,0,0.9)] mb-[12px]">
        {item?.label || ""}
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic text-[14px] text-[rgba(0,0,0,0.38)]">
        Content coming soon.
      </p>
    </div>
  );
}

function AlarmTriggeredContent() {
  const checkIcon = (
    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]">
      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#BA0020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const circleCheckIcon = (
    <svg viewBox="0 0 16.501 16.501" fill="none" className="shrink-0 size-[18px]">
      <path d="M15.599 6.753C16.305 10.217 14.496 13.703 11.258 15.121C8.019 16.539 4.231 15.502 2.164 12.634C0.098 9.766 0.316 5.844 2.686 3.221C5.056 0.599 8.936 -0.013 11.998 1.754" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.998 7.503L8.248 9.753L15.748 2.253" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const arrowDownIcon = (
    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]">
      <path d="M9 3.75V14.25M14.25 9L9 14.25L3.75 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const wrenchIcon = (
    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]">
      <path d="M11.025 4.725C10.739 5.017 10.739 5.483 11.025 5.775L12.225 6.975C12.517 7.261 12.983 7.261 13.275 6.975L15.605 4.646C15.845 4.405 16.252 4.481 16.342 4.81C16.804 6.492 16.253 8.29 14.926 9.424C13.6 10.557 11.737 10.822 10.148 10.103L4.215 16.035C3.594 16.656 2.586 16.656 1.965 16.035C1.345 15.414 1.345 14.406 1.966 13.785L7.898 7.853C7.179 6.263 7.443 4.401 8.577 3.074C9.71 1.747 11.509 1.196 13.191 1.658C13.52 1.748 13.596 2.155 13.355 2.396L11.025 4.725" stroke="#101820" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start px-[20px] relative w-full">
      {/* Header */}
      <div className="content-stretch flex flex-col gap-[12px] items-start shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] text-[32px] text-black w-full">
          Alarm triggered unexpectedly?
        </p>
        <p className="font-['Inter:Regular',sans-serif] leading-[22px] text-[16px] text-[rgba(0,0,0,0.54)] w-full">
          {`Don't worry. False alarms are often caused by dust, environmental interference, or battery issues, and can usually be resolved quickly. Follow the steps below to troubleshoot.`}
        </p>
      </div>

      {/* Steps */}
      <div className="content-stretch flex flex-col gap-[24px] items-start shrink-0 w-full">

        {/* ===== Step 1: Confirm there is no real hazard ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">1</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Confirm there is no real hazard
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                {`Before assuming it's a false alarm, quickly scan the area for actual signs of fire.`}
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start py-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M9 2.25C9.5 4.25 10.5 5.875 12 7.125C13.5 8.375 14.25 9.75 14.25 11.25C14.25 14.1476 11.8976 16.5 9 16.5C6.10245 16.5 3.75 14.1476 3.75 11.25C3.75 10.4386 4.01317 9.64911 4.5 9C4.5 10.0355 5.33947 10.875 6.375 10.875C7.41053 10.875 8.25 10.0355 8.25 9C8.25 7.5 7.125 6.75 7.125 5.25C7.125 4.25 7.75 3.25 9 2.25" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Visible open flame</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M3 11.1742C1.47371 9.61483 1.07111 7.2739 1.98875 5.29418C2.90639 3.31445 4.95292 2.10873 7.12933 2.26558C9.30573 2.42243 11.1582 3.90916 11.7825 6H13.125C14.6118 5.99983 15.9235 6.9726 16.3551 8.39536C16.7866 9.81811 16.2363 11.3557 15 12.1815M12 12.75H5.25M12.75 15.75H6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Obvious smoke</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M9.6 14.7C10.1221 15.0916 10.8375 15.1006 11.3694 14.7224C11.9012 14.3441 12.1274 13.6654 11.9289 13.0437C11.7304 12.422 11.1526 12 10.5 12H1.5M13.125 6C13.654 5.29461 14.6031 5.05314 15.4049 5.41991C16.2068 5.78668 16.6447 6.66258 16.457 7.52411C16.2693 8.38564 15.5067 9 14.625 9H1.5M7.35 3.3C7.87211 2.90842 8.5875 2.89937 9.11935 3.27761C9.6512 3.65586 9.87744 4.33459 9.67891 4.9563C9.48038 5.57801 8.90264 6 8.25 6H1.5" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Burning or scorched odor</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M3 10.5C2.71031 10.501 2.44596 10.3351 2.32091 10.0737C2.19587 9.81243 2.23249 9.50247 2.415 9.2775L9.84 1.6275C9.95471 1.49509 10.1458 1.45975 10.3003 1.54238C10.4548 1.62501 10.5315 1.80358 10.485 1.9725L9.045 6.4875C8.95881 6.71818 8.99135 6.97648 9.13207 7.17857C9.27278 7.38066 9.50374 7.5008 9.75 7.5H15C15.2897 7.49901 15.554 7.66495 15.6791 7.92626C15.8041 8.18757 15.7675 8.49753 15.585 8.7225L8.16 16.3725C8.04529 16.5049 7.85418 16.5403 7.6997 16.4576C7.54522 16.375 7.46854 16.1964 7.515 16.0275L8.955 11.5125C9.04119 11.2818 9.00865 11.0235 8.86793 10.8214C8.72722 10.6193 8.49626 10.4992 8.25 10.5H3" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Overheating electronics</span>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(255,59,59,0.05)] flex flex-col gap-[4px] items-start pl-[16px] pr-[20px] py-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">
                    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M16.298 13.5L10.298 3C10.031 2.53 9.533 2.24 8.993 2.24C8.452 2.24 7.954 2.53 7.688 3L1.688 13.5C1.418 13.966 1.42 14.541 1.691 15.006C1.962 15.471 2.462 15.755 3 15.75H15C15.536 15.75 16.03 15.463 16.298 14.999C16.566 14.535 16.565 13.964 16.298 13.5M9 6.75V9.75M9 12.75H9.008" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#ff3b3b]">If any are present</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Leave the area immediately and follow your household fire emergency procedures.</p>
                  </div>
                </div>
                <div className="absolute bg-[#ff3b3b] h-[78px] left-0 top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start pl-[17px] pr-[21px] py-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If none of the above is present</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Continue to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] h-[78px] left-[-1px] top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 2: Check for nearby interference ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">2</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Check for nearby interference
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Tiny particles in the air can trick the sensor. Check if any of these are near the alarm:
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start py-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M13.125 14.25H6.75C4.04678 14.2493 1.78595 12.1961 1.52573 9.50538C1.26551 6.81471 3.09096 4.36627 5.74395 3.84756C8.39694 3.32885 11.0102 4.90946 11.7825 7.5H13.125C14.9877 7.5 16.5 9.01229 16.5 10.875C16.5 12.7377 14.9877 14.25 13.125 14.25" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Cooking fumes</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 15 15.757" fill="none" className="shrink-0 size-[18px]"><path d="M3.75 10.71C5.4 10.71 6.75 9.3375 6.75 7.6725C6.75 6.8025 6.3225 5.9775 5.4675 5.28C4.6125 4.5825 3.9675 3.5475 3.75 2.46C3.5325 3.5475 2.895 4.59 2.0325 5.28C1.17 5.97 0.75 6.81 0.75 7.6725C0.75 9.3375 2.1 10.71 3.75 10.71" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.92 3.435C8.4354 2.61063 8.80102 1.70165 9 0.75C9.375 2.625 10.5 4.425 12 5.625C13.5 6.825 14.25 8.25 14.25 9.75C14.2588 11.8702 12.9878 13.7863 11.0311 14.6029C9.0744 15.4194 6.81841 14.975 5.3175 13.4775" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Steam from bathroom</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 16.496 15.746" fill="none" className="shrink-0 size-[18px]"><path d="M10.496 7.5L3.467 14.53C2.845 15.151 1.838 15.151 1.216 14.53C0.595 13.909 0.595 12.901 1.216 12.28L8.246 5.25M12.746 9.75L15.746 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.371 7.125L13.936 5.69C13.655 5.408 13.497 5.027 13.496 4.629V4.371C13.496 3.973 13.338 3.592 13.057 3.311L11.814 2.068C10.971 1.224 9.826 0.75 8.633 0.75H5.996L6.929 1.682C7.772 2.526 8.246 3.67 8.246 4.864V6L9.746 7.5H10.625C11.023 7.5 11.405 7.658 11.686 7.94L13.121 9.375" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Dust or renovation debris</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M2.25 2.25H2.2575M5.25 3.75H5.2575M8.25 5.25H8.2575M2.25 5.25H2.2575M5.25 6.75H5.2575M2.25 8.25H2.2575M11.25 3.75H14.25V6.75H11.25L2.25 2.25M5.25 5.25L6.75 6.75V14.25C6.75 14.7 6.45 15 6 15H1.5C1.05 15 0.75 14.7 0.75 14.25V8.25L2.25 6.75M0.75 10.5L6.75 9M0.75 14.25L6.75 12.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Aerosol sprays or incense</span>
              </div>
            </div>
            {/* What to do */}
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Open windows for ventilation</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Allow the air to return to a clean state</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Use a soft brush or a vacuum cleaner to gently clean the smoke inlet and surface dust</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start pl-[16px] pr-[20px] py-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">It was likely an environmental false alarm caused by airborne particles.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] h-[78px] left-0 top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start pl-[17px] pr-[21px] py-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the alarm continues</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Proceed to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] h-[78px] left-[-1px] top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 3: Inspect the battery ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">3</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Inspect the battery
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Low voltage or improper battery installation frequently causes random chirps or full alarms.
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Replace the current battery with a brand-new one.</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Ensure the positive (+) and negative (-) terminals match the markings inside the device.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start pl-[16px] pr-[20px] py-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">The issue was caused by insufficient battery power.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] h-[78px] left-0 top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start pl-[17px] pr-[21px] py-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the issue is still not resolved</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Proceed to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] h-[78px] left-[-1px] top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 4: Verify the installation location ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">4</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Verify the installation location
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Alarms placed too close to hazard-mimicking sources will trigger constantly.
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start py-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Directly inside a kitchen</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Just outside a steamy bathroom</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Near an AC vent or drafty window</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">In high-dust or high-humidity areas</span>
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Relocate the alarm at least 10 feet (3 meters) away from cooking appliances or bathrooms.</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Check the product manual for exact height and clearance requirements.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start pl-[16px] pr-[20px] py-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops after relocating</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">The placement was causing environmental interference.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] h-[78px] left-0 top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start pl-[17px] pr-[21px] py-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the issue still persists</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Continue to the final step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] h-[78px] left-[-1px] top-1/2 -translate-y-1/2 w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 5: Contact Support ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">5</span>
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Contact Support
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                If you have completed all the steps and the alarm is still triggering for no reason, the device may require professional service or replacement.
              </p>
            </div>
            <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[32px] items-start p-[25px] shrink-0 w-full">
              <div className="flex flex-col gap-[16px] w-full">
                <div className="flex flex-col gap-[2px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">Prepare before calling</p>
                  <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Having this information ready will help our team assist you faster:</p>
                </div>
                <div className="content-start flex flex-wrap gap-[16px_32px] items-start w-full">
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 14.663 14.663" fill="none" className="shrink-0 size-[16px]"><path d="M7.724 1.057C7.474 0.807 7.135 0.667 6.781 0.667H2C1.264 0.667 0.667 1.264 0.667 2V6.781C0.667 7.135 0.807 7.474 1.057 7.724L6.86 13.527C7.491 14.154 8.509 14.154 9.14 13.527L13.527 9.14C14.154 8.509 14.154 7.491 13.527 6.86L7.724 1.057" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4.333C4 4.517 4.149 4.667 4.333 4.667C4.517 4.667 4.667 4.517 4.667 4.333C4.667 4.149 4.517 4 4.333 4C4.149 4 4 4.149 4 4.333" fill="#757575" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Product model</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 13.333 14.667" fill="none" className="shrink-0 size-[16px]"><path d="M4 0.667V3.333M9.333 0.667V3.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 2H11.333C12.069 2 12.667 2.597 12.667 3.333V12.667C12.667 13.403 12.069 14 11.333 14H2C1.264 14 0.667 13.403 0.667 12.667V3.333C0.667 2.597 1.264 2 2 2" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M0.667 6H12.667" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Purchase date</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]"><path d="M14.667 8H13.013C12.415 7.999 11.888 8.397 11.727 8.973L10.16 14.547C10.139 14.618 10.074 14.667 10 14.667C9.926 14.667 9.861 14.618 9.84 14.547L6.16 1.453C6.139 1.382 6.074 1.333 6 1.333C5.926 1.333 5.861 1.382 5.84 1.453L4.273 7.027C4.112 7.601 3.59 7.998 2.993 8H1.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Alarm frequency</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 12 14.667" fill="none" className="shrink-0 size-[16px]"><path d="M11.333 6C11.333 9.329 7.641 12.795 6.401 13.866C6.163 14.044 5.837 14.044 5.599 13.866C4.359 12.795 0.667 9.329 0.667 6C0.667 3.056 3.056 0.667 6 0.667C8.944 0.667 11.333 3.056 11.333 6" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6C4 7.104 4.896 8 6 8C7.104 8 8 7.104 8 6C8 4.896 7.104 4 6 4C4.896 4 4 4.896 4 6" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Exact install location</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]"><path d="M10 9.333C10.133 8.667 10.467 8.2 11 7.667C11.667 7.067 12 6.2 12 5.333C12 3.126 10.208 1.333 8 1.333C5.792 1.333 4 3.126 4 5.333C4 6 4.133 6.8 5 7.667C5.467 8.133 5.867 8.667 6 9.333M6 12H10M6.667 14.667H9.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">LED light color/status</span>
                  </div>
                </div>
              </div>
              <a
                href="https://www.x-sense.com/pages/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ba0020] hover:bg-[#a0001b] flex items-center justify-center gap-[4px] px-[16px] py-[8px] rounded-[50px] h-[40px] transition-colors cursor-pointer"
              >
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[14px] text-white text-center whitespace-nowrap">Contact Support</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MobileAlarmTriggeredContent() {
  const checkIcon = (
    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]">
      <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#BA0020" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const circleCheckIcon = (
    <svg viewBox="0 0 16.501 16.501" fill="none" className="shrink-0 size-[18px]">
      <path d="M15.599 6.753C16.305 10.217 14.496 13.703 11.258 15.121C8.019 16.539 4.231 15.502 2.164 12.634C0.098 9.766 0.316 5.844 2.686 3.221C5.056 0.599 8.936 -0.013 11.998 1.754" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.998 7.503L8.248 9.753L15.748 2.253" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const arrowDownIcon = (
    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]">
      <path d="M9 3.75V14.25M14.25 9L9 14.25L3.75 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const wrenchIcon = (
    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]">
      <path d="M11.025 4.725C10.739 5.017 10.739 5.483 11.025 5.775L12.225 6.975C12.517 7.261 12.983 7.261 13.275 6.975L15.605 4.646C15.845 4.405 16.252 4.481 16.342 4.81C16.804 6.492 16.253 8.29 14.926 9.424C13.6 10.557 11.737 10.822 10.148 10.103L4.215 16.035C3.594 16.656 2.586 16.656 1.965 16.035C1.345 15.414 1.345 14.406 1.966 13.785L7.898 7.853C7.179 6.263 7.443 4.401 8.577 3.074C9.71 1.747 11.509 1.196 13.191 1.658C13.52 1.748 13.596 2.155 13.355 2.396L11.025 4.725" stroke="#101820" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative w-full">
      {/* Header */}
      <div className="content-stretch flex flex-col gap-[12px] items-start shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] text-[32px] text-black w-full">
          Alarm triggered unexpectedly?
        </p>
        <p className="font-['Inter:Regular',sans-serif] leading-[22px] text-[16px] text-[rgba(0,0,0,0.54)] w-full">
          {`Don't worry. False alarms are often caused by dust, environmental interference, or battery issues, and can usually be resolved quickly. Follow the steps below to troubleshoot.`}
        </p>
      </div>

      {/* Steps */}
      <div className="content-stretch flex flex-col gap-[24px] items-start shrink-0 w-full">

        {/* ===== Step 1: Confirm there is no real hazard ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">1</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Confirm there is no real hazard
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                {`Before assuming it's a false alarm, quickly scan the area for actual signs of fire.`}
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start pb-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M9 2.25C9.5 4.25 10.5 5.875 12 7.125C13.5 8.375 14.25 9.75 14.25 11.25C14.25 14.1476 11.8976 16.5 9 16.5C6.10245 16.5 3.75 14.1476 3.75 11.25C3.75 10.4386 4.01317 9.64911 4.5 9C4.5 10.0355 5.33947 10.875 6.375 10.875C7.41053 10.875 8.25 10.0355 8.25 9C8.25 7.5 7.125 6.75 7.125 5.25C7.125 4.25 7.75 3.25 9 2.25" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Visible open flame</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M3 11.1742C1.47371 9.61483 1.07111 7.2739 1.98875 5.29418C2.90639 3.31445 4.95292 2.10873 7.12933 2.26558C9.30573 2.42243 11.1582 3.90916 11.7825 6H13.125C14.6118 5.99983 15.9235 6.9726 16.3551 8.39536C16.7866 9.81811 16.2363 11.3557 15 12.1815M12 12.75H5.25M12.75 15.75H6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Obvious smoke</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M9.6 14.7C10.1221 15.0916 10.8375 15.1006 11.3694 14.7224C11.9012 14.3441 12.1274 13.6654 11.9289 13.0437C11.7304 12.422 11.1526 12 10.5 12H1.5M13.125 6C13.654 5.29461 14.6031 5.05314 15.4049 5.41991C16.2068 5.78668 16.6447 6.66258 16.457 7.52411C16.2693 8.38564 15.5067 9 14.625 9H1.5M7.35 3.3C7.87211 2.90842 8.5875 2.89937 9.11935 3.27761C9.6512 3.65586 9.87744 4.33459 9.67891 4.9563C9.48038 5.57801 8.90264 6 8.25 6H1.5" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Burning or scorched odor</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M3 10.5C2.71031 10.501 2.44596 10.3351 2.32091 10.0737C2.19587 9.81243 2.23249 9.50247 2.415 9.2775L9.84 1.6275C9.95471 1.49509 10.1458 1.45975 10.3003 1.54238C10.4548 1.62501 10.5315 1.80358 10.485 1.9725L9.045 6.4875C8.95881 6.71818 8.99135 6.97648 9.13207 7.17857C9.27278 7.38066 9.50374 7.5008 9.75 7.5H15C15.2897 7.49901 15.554 7.66495 15.6791 7.92626C15.8041 8.18757 15.7675 8.49753 15.585 8.7225L8.16 16.3725C8.04529 16.5049 7.85418 16.5403 7.6997 16.4576C7.54522 16.375 7.46854 16.1964 7.515 16.0275L8.955 11.5125C9.04119 11.2818 9.00865 11.0235 8.86793 10.8214C8.72722 10.6193 8.49626 10.4992 8.25 10.5H3" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Overheating electronics</span>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(255,59,59,0.05)] flex flex-col gap-[4px] items-start p-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">
                    <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M16.298 13.5L10.298 3C10.031 2.53 9.533 2.24 8.993 2.24C8.452 2.24 7.954 2.53 7.688 3L1.688 13.5C1.418 13.966 1.42 14.541 1.691 15.006C1.962 15.471 2.462 15.755 3 15.75H15C15.536 15.75 16.03 15.463 16.298 14.999C16.566 14.535 16.565 13.964 16.298 13.5M9 6.75V9.75M9 12.75H9.008" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#ff3b3b]">If any are present</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Leave the area immediately and follow your household fire emergency procedures.</p>
                  </div>
                </div>
                <div className="absolute bg-[#ff3b3b] inset-y-0 left-0 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start p-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If none of the above is present</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Continue to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] inset-y-0 left-[-1px] w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 2: Check for nearby interference ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">2</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Check for nearby interference
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Tiny particles in the air can trick the sensor. Check if any of these are near the alarm:
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start py-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M13.125 14.25H6.75C4.04678 14.2493 1.78595 12.1961 1.52573 9.50538C1.26551 6.81471 3.09096 4.36627 5.74395 3.84756C8.39694 3.32885 11.0102 4.90946 11.7825 7.5H13.125C14.9877 7.5 16.5 9.01229 16.5 10.875C16.5 12.7377 14.9877 14.25 13.125 14.25" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Cooking fumes</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 15 15.757" fill="none" className="shrink-0 size-[18px]"><path d="M3.75 10.71C5.4 10.71 6.75 9.3375 6.75 7.6725C6.75 6.8025 6.3225 5.9775 5.4675 5.28C4.6125 4.5825 3.9675 3.5475 3.75 2.46C3.5325 3.5475 2.895 4.59 2.0325 5.28C1.17 5.97 0.75 6.81 0.75 7.6725C0.75 9.3375 2.1 10.71 3.75 10.71" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.92 3.435C8.4354 2.61063 8.80102 1.70165 9 0.75C9.375 2.625 10.5 4.425 12 5.625C13.5 6.825 14.25 8.25 14.25 9.75C14.2588 11.8702 12.9878 13.7863 11.0311 14.6029C9.0744 15.4194 6.81841 14.975 5.3175 13.4775" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Steam from bathroom</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 16.496 15.746" fill="none" className="shrink-0 size-[18px]"><path d="M10.496 7.5L3.467 14.53C2.845 15.151 1.838 15.151 1.216 14.53C0.595 13.909 0.595 12.901 1.216 12.28L8.246 5.25M12.746 9.75L15.746 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M15.371 7.125L13.936 5.69C13.655 5.408 13.497 5.027 13.496 4.629V4.371C13.496 3.973 13.338 3.592 13.057 3.311L11.814 2.068C10.971 1.224 9.826 0.75 8.633 0.75H5.996L6.929 1.682C7.772 2.526 8.246 3.67 8.246 4.864V6L9.746 7.5H10.625C11.023 7.5 11.405 7.658 11.686 7.94L13.121 9.375" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Dust or renovation debris</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 18 18" fill="none" className="shrink-0 size-[18px]"><path d="M2.25 2.25H2.2575M5.25 3.75H5.2575M8.25 5.25H8.2575M2.25 5.25H2.2575M5.25 6.75H5.2575M2.25 8.25H2.2575M11.25 3.75H14.25V6.75H11.25L2.25 2.25M5.25 5.25L6.75 6.75V14.25C6.75 14.7 6.45 15 6 15H1.5C1.05 15 0.75 14.7 0.75 14.25V8.25L2.25 6.75M0.75 10.5L6.75 9M0.75 14.25L6.75 12.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Aerosol sprays or incense</span>
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Open windows for ventilation</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Allow the air to return to a clean state</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Use a soft brush or a vacuum cleaner to gently clean the smoke inlet and surface dust</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start p-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">It was likely an environmental false alarm caused by airborne particles.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] inset-y-0 left-0 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start p-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the alarm continues</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Proceed to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] inset-y-0 left-[-1px] w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 3: Inspect the battery ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">3</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Inspect the battery
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Low voltage or improper battery installation frequently causes random chirps or full alarms.
              </p>
            </div>
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Replace the current battery with a brand-new one.</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Ensure the positive (+) and negative (-) terminals match the markings inside the device.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start p-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">The issue was caused by insufficient battery power.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] inset-y-0 left-0 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start p-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the issue is still not resolved</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Proceed to the next step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] inset-y-0 left-[-1px] w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 4: Verify the installation location ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">4</span>
          </div>
          <div className="border-b border-[rgba(0,0,0,0.1)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Verify the installation location
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                Alarms placed too close to hazard-mimicking sources will trigger constantly.
              </p>
            </div>
            <div className="content-start flex flex-wrap gap-[16px_32px] items-start py-[16px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Directly inside a kitchen</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Just outside a steamy bathroom</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Near an AC vent or drafty window</span>
              </div>
              <div className="flex gap-[8px] items-center shrink-0">
                <svg viewBox="0 0 13.5 16.5" fill="none" className="shrink-0 size-[18px]"><path d="M12.75 6.75C12.75 10.495 8.596 14.395 7.201 15.599C6.934 15.8 6.566 15.8 6.299 15.599C4.904 14.395 0.75 10.495 0.75 6.75C0.75 3.439 3.439 0.75 6.75 0.75C10.062 0.75 12.75 3.439 12.75 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4.5 6.75C4.5 7.992 5.508 9 6.75 9C7.992 9 9 7.992 9 6.75C9 5.508 7.992 4.5 6.75 4.5C5.508 4.5 4.5 5.508 4.5 6.75" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">In high-dust or high-humidity areas</span>
              </div>
            </div>
            <div className="bg-[rgba(0,0,0,0.05)] flex flex-col gap-[16px] items-start p-[24px] shrink-0 w-full">
              <div className="flex gap-[8px] items-center w-full">
                <div className="flex items-center justify-center shrink-0 size-[24px]">{wrenchIcon}</div>
                <span className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">What to do</span>
              </div>
              <div className="flex flex-col gap-[12px] w-full">
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Relocate the alarm at least 10 feet (3 meters) away from cooking appliances or bathrooms.</p>
                </div>
                <div className="flex gap-[12px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[20px]">{checkIcon}</div>
                  <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] min-w-px">Check the product manual for exact height and clearance requirements.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px] w-full">
              <div className="bg-[rgba(22,221,0,0.05)] flex flex-col gap-[4px] items-start p-[16px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{circleCheckIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[#16a34a]">If the alarm stops after relocating</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">The placement was causing environmental interference.</p>
                  </div>
                </div>
                <div className="absolute bg-[#16dd00] inset-y-0 left-0 w-[4px]" />
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[4px] items-start p-[17px] relative w-full">
                <div className="flex gap-[8px] items-start w-full">
                  <div className="flex items-center justify-center shrink-0 size-[24px]">{arrowDownIcon}</div>
                  <div className="flex flex-[1_0_0] flex-col gap-[2px] min-w-px">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-black">If the issue still persists</p>
                    <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Continue to the final step.</p>
                  </div>
                </div>
                <div className="absolute bg-[#d9d9d9] inset-y-0 left-[-1px] w-[4px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== Step 5: Contact Support ===== */}
        <div className="content-stretch flex gap-[16px] items-start shrink-0 w-full">
          <div className="bg-[#022542] flex items-center justify-center rounded-[16px] shrink-0 size-[32px]">
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[15px] text-[#f2f0ed] text-center leading-normal">5</span>
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px pb-[32px]">
            <div className="flex flex-col gap-[2px] w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] text-[24px] text-[rgba(0,0,0,0.9)] w-full">
                Contact Support
              </p>
              <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                If you have completed all the steps and the alarm is still triggering for no reason, the device may require professional service or replacement.
              </p>
            </div>
            <div className="border border-[rgba(0,0,0,0.2)] flex flex-col gap-[32px] items-start p-[25px] shrink-0 w-full">
              <div className="flex flex-col gap-[16px] w-full">
                <div className="flex flex-col gap-[2px] w-full">
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">Prepare before calling</p>
                  <p className="font-['Inter:Regular',sans-serif] leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)]">Having this information ready will help our team assist you faster:</p>
                </div>
                <div className="content-start flex flex-wrap gap-[16px_32px] items-start w-full">
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 14.663 14.663" fill="none" className="shrink-0 size-[16px]"><path d="M7.724 1.057C7.474 0.807 7.135 0.667 6.781 0.667H2C1.264 0.667 0.667 1.264 0.667 2V6.781C0.667 7.135 0.807 7.474 1.057 7.724L6.86 13.527C7.491 14.154 8.509 14.154 9.14 13.527L13.527 9.14C14.154 8.509 14.154 7.491 13.527 6.86L7.724 1.057" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 4.333C4 4.517 4.149 4.667 4.333 4.667C4.517 4.667 4.667 4.517 4.667 4.333C4.667 4.149 4.517 4 4.333 4C4.149 4 4 4.149 4 4.333" fill="#757575" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Product model</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 13.333 14.667" fill="none" className="shrink-0 size-[16px]"><path d="M4 0.667V3.333M9.333 0.667V3.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 2H11.333C12.069 2 12.667 2.597 12.667 3.333V12.667C12.667 13.403 12.069 14 11.333 14H2C1.264 14 0.667 13.403 0.667 12.667V3.333C0.667 2.597 1.264 2 2 2" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M0.667 6H12.667" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Purchase date</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]"><path d="M14.667 8H13.013C12.415 7.999 11.888 8.397 11.727 8.973L10.16 14.547C10.139 14.618 10.074 14.667 10 14.667C9.926 14.667 9.861 14.618 9.84 14.547L6.16 1.453C6.139 1.382 6.074 1.333 6 1.333C5.926 1.333 5.861 1.382 5.84 1.453L4.273 7.027C4.112 7.601 3.59 7.998 2.993 8H1.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Alarm frequency</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 12 14.667" fill="none" className="shrink-0 size-[16px]"><path d="M11.333 6C11.333 9.329 7.641 12.795 6.401 13.866C6.163 14.044 5.837 14.044 5.599 13.866C4.359 12.795 0.667 9.329 0.667 6C0.667 3.056 3.056 0.667 6 0.667C8.944 0.667 11.333 3.056 11.333 6" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 6C4 7.104 4.896 8 6 8C7.104 8 8 7.104 8 6C8 4.896 7.104 4 6 4C4.896 4 4 4.896 4 6" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">Exact install location</span>
                  </div>
                  <div className="flex gap-[8px] items-center shrink-0">
                    <svg viewBox="0 0 16 16" fill="none" className="shrink-0 size-[16px]"><path d="M10 9.333C10.133 8.667 10.467 8.2 11 7.667C11.667 7.067 12 6.2 12 5.333C12 3.126 10.208 1.333 8 1.333C5.792 1.333 4 3.126 4 5.333C4 6 4.133 6.8 5 7.667C5.467 8.133 5.867 8.667 6 9.333M6 12H10M6.667 14.667H9.333" stroke="#757575" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.9)] leading-[20px] whitespace-nowrap">LED light color/status</span>
                  </div>
                </div>
              </div>
              <a
                href="https://www.x-sense.com/pages/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#ba0020] hover:bg-[#a0001b] active:bg-[#8a0018] flex items-center justify-center gap-[4px] px-[16px] py-[8px] rounded-[50px] h-[40px] transition-colors cursor-pointer"
              >
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[14px] text-white text-center whitespace-nowrap">Contact Support</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MobileStaticPlaceholderContent({ itemId }: { itemId: string }) {
  if (itemId === "alarm-triggered-unexpectedly") {
    return <MobileAlarmTriggeredContent />;
  }
  const allItems = STATIC_SECTIONS.flatMap((s) => s.subItems);
  const item = allItems.find((i) => i.id === itemId);
  return (
    <div className="content-stretch flex flex-col items-center justify-center min-h-[300px] relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic text-[20px] text-[rgba(0,0,0,0.9)] mb-[8px]">
        {item?.label || ""}
      </p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic text-[13px] text-[rgba(0,0,0,0.38)]">
        Content coming soon.
      </p>
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
  const urlSection = searchParams.get("section");

  const [isMobile, setIsMobile] = useState(false);
  const { categoriesWithSpus, loading } = useDownloadCenterData();
  const { appData } = useSupportApp();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedTopLevel, setExpandedTopLevel] = useState<Set<string>>(new Set(["products"]));
  const [selectedSpuId, setSelectedSpuId] = useState("");
  const [selectedStaticItem, setSelectedStaticItem] = useState<string | null>(null);
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

  const toggleTopLevel = useCallback((id: string) => {
    setExpandedTopLevel((prev) => {
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
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const initialized = useRef(false);
  useEffect(() => {
    if (!loading && categoriesWithSpus.length > 0 && !initialized.current) {
      initialized.current = true;

      // URL ?section= targets a static sidebar item (e.g. alarm-triggered-unexpectedly)
      if (urlSection) {
        const parentSection = STATIC_SECTIONS.find((s) =>
          s.subItems.some((sub) => sub.id === urlSection)
        );
        if (parentSection) {
          setSelectedStaticItem(urlSection);
          setExpandedTopLevel(new Set([parentSection.id]));
          return;
        }
      }

      const allSpus = categoriesWithSpus.flatMap((c) => c.spus);
      const targetSpu = urlSpuId ? allSpus.find((s) => s.id === urlSpuId) : null;

      if (targetSpu) {
        const ownerCat = categoriesWithSpus.find((c) => c.spus.some((s) => s.id === targetSpu.id));
        if (ownerCat) setExpandedCategories(new Set([ownerCat.id]));
        setSelectedSpuId(targetSpu.id);
        setExpandedTopLevel(new Set(["products"]));
      } else {
        const firstCatWithSpus = categoriesWithSpus.find((c) => c.spus.length > 0);
        if (firstCatWithSpus) {
          setExpandedCategories(new Set([firstCatWithSpus.id]));
          setExpandedTopLevel(new Set(["products"]));
          if (firstCatWithSpus.spus.length > 0) {
            setSelectedSpuId(firstCatWithSpus.spus[0].id);
          }
        }
      }
    }
  }, [loading, categoriesWithSpus, urlSpuId, urlSection]);

  const allSpus = categoriesWithSpus.flatMap((c) => c.spus);
  const selectedSpu = allSpus.find((s) => s.id === selectedSpuId) || null;
  const { faqs, loading: faqsLoading } = useFaqs(selectedStaticItem === null ? selectedSpu?.categoryId : undefined);

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
                Help Center
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
            ) : selectedStaticItem ? (
              <MobileStaticPlaceholderContent itemId={selectedStaticItem} />
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
    <div className="bg-white w-full h-screen flex flex-col overflow-hidden">
      <GlobalNav />
      <div className="flex flex-col flex-1 pt-[104px] overflow-hidden">
        {/* Navigation Bar */}
        <div
          className="bg-[#101820] content-stretch flex flex-col items-center justify-center overflow-clip relative shrink-0 w-full"
          style={{ padding: "0 clamp(24px, 8vw, 120px)" }}
        >
          <div className="content-stretch flex items-center max-w-[1312px] py-[10px] relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-center text-white whitespace-nowrap">
              Help Center
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div
          className="bg-white flex flex-1 items-start justify-center relative w-full overflow-hidden"
          style={{ padding: "32px clamp(24px, 8vw, 120px) 40px" }}
        >
          <div className="flex flex-[1_0_0] gap-[32px] items-start max-w-[1312px] min-w-px relative h-full">
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
                  expandedTopLevel={expandedTopLevel}
                  toggleTopLevel={toggleTopLevel}
                  selectedStaticItem={selectedStaticItem}
                  setSelectedStaticItem={setSelectedStaticItem}
                />
                <div className="flex-[1_0_0] min-w-px h-full overflow-y-auto scrollbar-hide">
                  {selectedStaticItem ? (
                    <StaticPlaceholderContent itemId={selectedStaticItem} />
                  ) : (
                    <ProductDetail
                      spu={selectedSpu}
                      appData={appData}
                      faqs={faqs}
                      faqsLoading={faqsLoading}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
