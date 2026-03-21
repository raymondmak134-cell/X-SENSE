import { useState, useEffect, useCallback } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { useCategories, type Category } from "./use-products";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import { FooterSection } from "./support-page";
import Footer from "../../imports/Footer";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  categoryId?: string;
  connectivity?: string;
  setupInstallation?: {
    installationVideoUrl?: string;
    quickStartGuideImages?: Array<{ url: string; path: string }>;
  };
}

interface SupportAppData {
  iconUrl?: string;
  appName?: string;
  appDescription?: string;
  iosVersion?: string;
  androidVersion?: string;
}

interface CategoryWithSpus extends Category {
  spus: Spu[];
}

const TABS = ["Setup & Installation", "App", "FAQs", "Specs", "Manuals"];

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
    spus: spus.filter((spu) => spu.categoryId === cat.id),
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

  const needsBaseStation = spu?.connectivity === "Base Station Interconnected (App)";
  const version = platform === "ios" ? appData?.iosVersion : appData?.androidVersion;

  return (
    <div className="content-stretch flex flex-col gap-[0px] items-start relative shrink-0 w-full">
      {/* App Header: Icon + Name + Description */}
      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
        <div className="bg-[#f6f6f6] rounded-[16px] shrink-0 size-[80px] overflow-hidden">
          {appData?.iconUrl && (
            <img alt="App Icon" className="size-full object-cover" src={appData.iconUrl} />
          )}
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black w-full">
            {appData?.appName || "X-SENSE Home Security"}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
            {appData?.appDescription || ""}
          </p>
        </div>
      </div>

      {/* Base Station Notice */}
      {needsBaseStation && (
        <div className="bg-[rgba(255,161,0,0.1)] content-stretch flex gap-[10px] items-center p-[8px] relative shrink-0 w-full mt-[8px] rounded-[4px]">
          <InfoIcon />
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative text-[12px] text-[rgba(0,0,0,0.54)]">
            This device must be connected to a Base Station before it can be used with the X-SENSE App.
          </p>
        </div>
      )}

      {/* Platform Tabs: iOS / Android */}
      <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[34px] h-[40px] items-center relative shrink-0 w-full mt-[8px]">
        {(["ios", "android"] as const).map((p) => (
          <div key={p} className="flex flex-row items-center self-stretch">
            <div
              className="content-stretch flex h-full items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer"
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
      <div className="bg-[#f6f6f6] content-stretch flex flex-col gap-[16px] items-start px-[32px] py-[24px] relative shrink-0 w-full mt-[16px] rounded-[8px]">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start not-italic relative shrink-0" style={{ maxWidth: "calc(100% - 96px)" }}>
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
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-black">
            Recommended Models:
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
            {platform === "ios"
              ? "Compatible with: iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17, iPhone 16E, iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15, iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14, iPhone 13 Pro Max, iPhone 13 Pro, iPhone 13, iPhone 13 mini, iPhone 12 Pro Max, iPhone 12 Pro, iPhone 12, iPhone 12 mini, iPhone 11 Pro Max, iPhone 11 Pro, iPhone 11, iPhone SE 3, iPhone SE 2"
              : "Compatible with: Samsung Galaxy S25 Ultra, Galaxy S25+, Galaxy S25, Galaxy S24 Ultra, Galaxy S24+, Galaxy S24, Galaxy S23 Ultra, Galaxy S23+, Galaxy S23, Google Pixel 9 Pro, Pixel 9, Pixel 8 Pro, Pixel 8, Pixel 7 Pro, Pixel 7, OnePlus 13, OnePlus 12, Xiaomi 15, Xiaomi 14"}
          </p>
        </div>
      </div>
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

function VideoPlayer({ url }: { url?: string }) {
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
    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
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
          <video className="absolute inset-0 size-full object-contain pointer-events-none" src={url} preload="metadata" />
          <PlayButtonOverlay onClick={() => setPlaying(true)} />
        </>
      )}
    </div>
  );
}

/* ==================== Sidebar ==================== */

function Sidebar({
  categoriesWithSpus,
  expandedCategory,
  setExpandedCategory,
  selectedSpuId,
  setSelectedSpuId,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategory: string;
  setExpandedCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[340px]">
      {categoriesWithSpus.map((cat) => (
        <div key={cat.id} className="w-full">
          <div
            className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
            onClick={() => setExpandedCategory(expandedCategory === cat.id ? "" : cat.id)}
          >
            <div className="content-stretch flex flex-col items-start relative shrink-0">
              <p
                className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                  expandedCategory === cat.id ? "text-[#ba0020]" : "text-[#333]"
                }`}
              >
                {cat.name}
              </p>
            </div>
            <ChevronIcon expanded={expandedCategory === cat.id} />
          </div>
          {expandedCategory === cat.id &&
            cat.spus.map((spu) => (
              <div
                key={spu.id}
                className={`content-stretch flex items-center justify-between pl-[24px] py-[20px] relative shrink-0 w-full cursor-pointer ${
                  selectedSpuId === spu.id ? "bg-[rgba(0,0,0,0.05)]" : ""
                }`}
                onClick={() => setSelectedSpuId(spu.id)}
              >
                <div className="content-stretch flex flex-col items-start relative shrink-0">
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[16px] whitespace-nowrap">
                    {spu.name}
                  </p>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

/* ==================== Product Detail ==================== */

function SetupTabContent({ spu }: { spu: Spu | null }) {
  const videoUrl = spu?.setupInstallation?.installationVideoUrl;
  const guideImages = spu?.setupInstallation?.quickStartGuideImages || [];

  return (
    <>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">
          Installation video
        </p>
        <VideoPlayer key={spu?.id} url={videoUrl} />
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">
          Quick Start Guide
        </p>
        <div className="content-stretch flex gap-[16px] items-center justify-center max-w-[1312px] relative shrink-0 w-full">
          {guideImages.length > 0
            ? guideImages.map((img, i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-px rounded-[12px] overflow-hidden">
                  <img alt={`Step ${i + 1}`} className="size-full object-cover" src={img.url} />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-px rounded-[12px]" />
              ))}
        </div>
      </div>
    </>
  );
}

function ProductDetail({
  spu,
  appData,
  activeTab,
  setActiveTab,
}: {
  spu: Spu | null;
  appData: SupportAppData | null;
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
        <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[34px] h-[40px] items-center relative shrink-0 w-full">
          {TABS.map((tab) => (
            <div key={tab} className="flex flex-row items-center self-stretch">
              <div
                className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative shrink-0 cursor-pointer"
                onClick={() => setActiveTab(tab)}
              >
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                  {tab}
                </p>
                {activeTab === tab && (
                  <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Setup & Installation" && <SetupTabContent spu={spu} />}
        {activeTab === "App" && <AppTabContent spu={spu} appData={appData} />}
      </div>
    </div>
  );
}

/* ==================== Mobile Sidebar ==================== */

function MobileSidebar({
  categoriesWithSpus,
  expandedCategory,
  setExpandedCategory,
  selectedSpuId,
  setSelectedSpuId,
}: {
  categoriesWithSpus: CategoryWithSpus[];
  expandedCategory: string;
  setExpandedCategory: (id: string) => void;
  selectedSpuId: string;
  setSelectedSpuId: (id: string) => void;
}) {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      {categoriesWithSpus.map((cat) => (
        <div key={cat.id} className="w-full">
          <div
            className="content-stretch flex items-center justify-between py-[16px] relative shrink-0 w-full cursor-pointer"
            onClick={() => setExpandedCategory(expandedCategory === cat.id ? "" : cat.id)}
          >
            <p
              className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] whitespace-nowrap ${
                expandedCategory === cat.id ? "text-[#ba0020]" : "text-[#333]"
              }`}
            >
              {cat.name}
            </p>
            <ChevronIcon expanded={expandedCategory === cat.id} />
          </div>
          {expandedCategory === cat.id &&
            cat.spus.map((spu) => (
              <div
                key={spu.id}
                className={`content-stretch flex items-center pl-[16px] py-[12px] relative shrink-0 w-full cursor-pointer ${
                  selectedSpuId === spu.id ? "bg-[rgba(0,0,0,0.05)]" : ""
                }`}
                onClick={() => setSelectedSpuId(spu.id)}
              >
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[#333] text-[14px] whitespace-nowrap">
                  {spu.name}
                </p>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

/* ==================== Mobile Product Detail ==================== */

function MobileSetupTabContent({ spu }: { spu: Spu | null }) {
  const videoUrl = spu?.setupInstallation?.installationVideoUrl;
  const guideImages = spu?.setupInstallation?.quickStartGuideImages || [];

  return (
    <>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black text-center w-full">
          Installation video
        </p>
        <VideoPlayer key={spu?.id} url={videoUrl} />
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[16px]">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black text-center w-full">
          Quick Start Guide
        </p>
        <div className="content-stretch flex flex-wrap gap-[8px] items-center justify-center relative shrink-0 w-full">
          {guideImages.length > 0
            ? guideImages.map((img, i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] flex-[1_0_0] min-w-[140px] rounded-[8px] overflow-hidden">
                  <img alt={`Step ${i + 1}`} className="size-full object-cover" src={img.url} />
                </div>
              ))
            : [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[2492/4096] bg-[#f6f6f6] flex-[1_0_0] min-w-[140px] rounded-[8px]" />
              ))}
        </div>
      </div>
    </>
  );
}

function MobileAppTabContent({ spu, appData }: { spu: Spu | null; appData: SupportAppData | null }) {
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  const needsBaseStation = spu?.connectivity === "Base Station Interconnected (App)";
  const version = platform === "ios" ? appData?.iosVersion : appData?.androidVersion;

  return (
    <div className="content-stretch flex flex-col gap-[0px] items-start relative shrink-0 w-full mt-[16px]">
      {/* App Header */}
      <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
        <div className="bg-[#f6f6f6] rounded-[12px] shrink-0 size-[56px] overflow-hidden">
          {appData?.iconUrl && (
            <img alt="App Icon" className="size-full object-cover" src={appData.iconUrl} />
          )}
        </div>
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[28px] not-italic relative shrink-0 text-[20px] text-black w-full">
            {appData?.appName || "X-SENSE Home Security"}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
            {appData?.appDescription || ""}
          </p>
        </div>
      </div>

      {/* Base Station Notice */}
      {needsBaseStation && (
        <div className="bg-[rgba(255,161,0,0.1)] content-stretch flex gap-[8px] items-center p-[8px] relative shrink-0 w-full mt-[8px] rounded-[4px]">
          <InfoIcon />
          <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative text-[12px] text-[rgba(0,0,0,0.54)]">
            This device must be connected to a Base Station before it can be used with the X-SENSE App.
          </p>
        </div>
      )}

      {/* Platform Tabs */}
      <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[24px] h-[36px] items-center relative shrink-0 w-full mt-[8px]">
        {(["ios", "android"] as const).map((p) => (
          <div key={p} className="flex flex-row items-center self-stretch">
            <div
              className="content-stretch flex h-full items-center justify-center px-[8px] py-[8px] relative shrink-0 cursor-pointer"
              onClick={() => setPlatform(p)}
            >
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
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
      <div className="bg-[#f6f6f6] content-stretch flex flex-col gap-[12px] items-start px-[16px] py-[16px] relative shrink-0 w-full mt-[12px] rounded-[8px]">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0" style={{ maxWidth: "calc(100% - 72px)" }}>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[16px] text-black w-full">
              {version || "—"}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
              {platform === "ios"
                ? "Requires iOS 13.0 or later; we recommend using an iPhone 11 or newer."
                : "Requires Android 8.0 or later."}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
              The following models have been tested and are recommended for use:
            </p>
          </div>
          <div className="bg-white rounded-[4px] shrink-0 size-[56px] flex items-center justify-center overflow-hidden">
            <img
              alt={platform === "android" ? "Android QR Code" : "iOS QR Code"}
              className="size-full object-contain"
              src={platform === "android" ? "/images/android-qr.svg" : "/images/ios-qr.svg"}
            />
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-black">
            Recommended Models:
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[18px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
            {platform === "ios"
              ? "Compatible with: iPhone 17 Pro Max, iPhone 17 Pro, iPhone 17, iPhone 16E, iPhone 16 Pro Max, iPhone 16 Pro, iPhone 16 Plus, iPhone 16, iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15 Plus, iPhone 15, iPhone 14 Pro Max, iPhone 14 Pro, iPhone 14 Plus, iPhone 14, iPhone 13 Pro Max, iPhone 13 Pro, iPhone 13, iPhone 13 mini, iPhone 12 Pro Max, iPhone 12 Pro, iPhone 12, iPhone 12 mini, iPhone 11 Pro Max, iPhone 11 Pro, iPhone 11, iPhone SE 3, iPhone SE 2"
              : "Compatible with: Samsung Galaxy S25 Ultra, Galaxy S25+, Galaxy S25, Galaxy S24 Ultra, Galaxy S24+, Galaxy S24, Galaxy S23 Ultra, Galaxy S23+, Galaxy S23, Google Pixel 9 Pro, Pixel 9, Pixel 8 Pro, Pixel 8, Pixel 7 Pro, Pixel 7, OnePlus 13, OnePlus 12, Xiaomi 15, Xiaomi 14"}
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileProductDetail({
  spu,
  appData,
  activeTab,
  setActiveTab,
}: {
  spu: Spu | null;
  appData: SupportAppData | null;
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
      <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex gap-[16px] h-[40px] items-center relative shrink-0 w-full overflow-x-auto mt-[12px]">
        {TABS.map((tab) => (
          <div key={tab} className="flex flex-row items-center self-stretch shrink-0">
            <div
              className="content-stretch flex h-full items-center justify-center px-[8px] py-[10px] relative shrink-0 cursor-pointer"
              onClick={() => setActiveTab(tab)}
            >
              <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[13px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                {tab}
              </p>
              {activeTab === tab && (
                <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Setup & Installation" && <MobileSetupTabContent spu={spu} />}
      {activeTab === "App" && <MobileAppTabContent spu={spu} appData={appData} />}
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
  const [isMobile, setIsMobile] = useState(false);
  const { categoriesWithSpus, loading } = useDownloadCenterData();
  const { appData } = useSupportApp();
  const [expandedCategory, setExpandedCategory] = useState("");
  const [selectedSpuId, setSelectedSpuId] = useState("");
  const [activeTab, setActiveTab] = useState("Setup & Installation");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!loading && categoriesWithSpus.length > 0 && !expandedCategory) {
      const firstCatWithSpus = categoriesWithSpus.find((c) => c.spus.length > 0);
      if (firstCatWithSpus) {
        setExpandedCategory(firstCatWithSpus.id);
        if (firstCatWithSpus.spus.length > 0 && !selectedSpuId) {
          setSelectedSpuId(firstCatWithSpus.spus[0].id);
        }
      }
    }
  }, [loading, categoriesWithSpus, expandedCategory, selectedSpuId]);

  const allSpus = categoriesWithSpus.flatMap((c) => c.spus);
  const selectedSpu = allSpus.find((s) => s.id === selectedSpuId) || null;

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
              <>
                <MobileSidebar
                  categoriesWithSpus={categoriesWithSpus}
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  selectedSpuId={selectedSpuId}
                  setSelectedSpuId={setSelectedSpuId}
                />
                <MobileProductDetail
                  spu={selectedSpu}
                  appData={appData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </>
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
                  expandedCategory={expandedCategory}
                  setExpandedCategory={setExpandedCategory}
                  selectedSpuId={selectedSpuId}
                  setSelectedSpuId={setSelectedSpuId}
                />
                <ProductDetail
                  spu={selectedSpu}
                  appData={appData}
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
