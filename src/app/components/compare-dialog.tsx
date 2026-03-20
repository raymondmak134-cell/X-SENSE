import { useState, useEffect, useRef, useCallback } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

/* ========== Retry helper ========== */

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1500): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || i === retries) return res;
    } catch (err) {
      if (i === retries) throw err;
    }
    await new Promise((r) => setTimeout(r, delay * Math.pow(2, i)));
  }
  throw new Error("fetchWithRetry: unreachable");
}

/* ========== Types ========== */

interface SpuCapabilities {
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

interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  imagePath: string;
  connectivity: string;
  capabilities: SpuCapabilities;
  powerSource: string;
  batteryLife: string;
}

const CAPABILITY_ROWS: { key: keyof SpuCapabilities; label: string }[] = [
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

const CONNECTIVITY_ORDER = [
  "Base Station Interconnected (App)",
  "Wireless Interconnected",
  "Wi-Fi (App)",
  "Standalone",
];

/* ========== Shared hide-scrollbar style ========== */
const hideScrollbarStyle = { scrollbarWidth: "none" as const, msOverflowStyle: "none" as const };

/* ========== SVG Icons ========== */

function CheckIcon() {
  return (
    <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6.86396 18.2164L21.7132 3.36719L23.8345 5.48851L8.98528 20.3377L6.86396 18.2164Z" fill="#067AD9" />
      <path d="M0.5 11.8525L2.62132 9.73115L8.98528 16.0951L6.86396 18.2164L0.5 11.8525Z" fill="#067AD9" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="shrink-0" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5.28249 3.16117L3.16116 5.28249L9.87868 12L3.16116 18.7175L5.28249 20.8388L12 14.1213L18.7175 20.8388L20.8388 18.7175L14.1213 12L20.8388 5.28249L18.7175 3.16117L12 9.87868L5.28249 3.16117Z"
        fill="black"
        fillOpacity="0.2"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path
        clipRule="evenodd"
        d="M16.6667 0C25.8714 0 33.3333 7.46192 33.3333 16.6667C33.3333 25.8714 25.8714 33.3333 16.6667 33.3333C7.46192 33.3333 0 25.8714 0 16.6667C0 7.46192 7.46192 0 16.6667 0ZM16.6667 14.5707L11.8236 9.72765L9.72765 11.8218L14.5725 16.6667L9.72765 21.5133L11.8218 23.6075L16.6667 18.7609L21.5133 23.6075L23.6075 21.5115L18.7627 16.6667L23.6075 11.8236L22.5604 10.7747L21.5115 9.72765L16.6667 14.5707Z"
        fill="black"
        fillOpacity="0.54"
        fillRule="evenodd"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <div className="relative shrink-0 size-[22px]">
      <div className="absolute inset-[4.79%_25.83%_4.38%_25.83%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.7666 20.0498">
          <path d="M8.77441 2.19824C9.79243 2.19824 10.7666 2.95886 10.7666 4.07031V18.1787C10.7663 19.2898 9.79227 20.0498 8.77441 20.0498H1.99121C0.973618 20.0494 0.000331207 19.2896 0 18.1787V4.07031C-4.85715e-08 2.95913 0.973458 2.1986 1.99121 2.19824H8.77441ZM1.99121 3.79785C1.85687 3.79803 1.74993 3.84757 1.68359 3.90723C1.61892 3.96562 1.59961 4.02469 1.59961 4.07031V18.1787C1.59976 18.2242 1.61918 18.2827 1.68359 18.3408C1.74994 18.4005 1.85688 18.45 1.99121 18.4502H8.77441C8.90886 18.4502 9.01555 18.4005 9.08203 18.3408C9.14686 18.2825 9.16586 18.2244 9.16602 18.1787V4.07031C9.16602 4.02457 9.14713 3.96577 9.08203 3.90723C9.01555 3.8476 8.90886 3.79785 8.77441 3.79785H1.99121ZM3.13086 9.16699C3.90802 9.16705 4.63147 9.54909 5.07031 10.1826L5.23828 10.4424C5.67707 11.0758 6.4007 11.4579 7.17773 11.458H8.07715C8.1083 11.458 8.13379 11.4835 8.13379 11.5146V16.917C8.13354 17.1929 7.90969 17.4169 7.63379 17.417H3.13379C2.8578 17.417 2.63404 17.1929 2.63379 16.917V9.21191C2.63379 9.187 2.65379 9.16699 2.67871 9.16699H3.13086ZM6.2998 0C6.80569 -2.21128e-08 7.21673 0.405113 7.2168 0.904297V0.922852C7.21665 1.17229 7.01158 1.3749 6.75879 1.375H4.00879C3.75591 1.375 3.54995 1.17235 3.5498 0.922852V0.904297C3.54988 0.405156 3.96097 6.99896e-05 4.4668 0H6.2998Z" fill="black" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function CapabilitiesIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[22px]">
      <div className="absolute inset-[5.01%_5%_4.99%_5%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7996 19.7996">
          <g>
            <path d="M10.5417 2.10815C10.5417 1.75377 10.2542 1.46631 9.89982 1.46631C9.54543 1.46631 9.25798 1.75377 9.25798 2.10815C9.25798 2.46254 9.54543 2.75 9.89982 2.75C10.2542 2.75 10.5417 2.46254 10.5417 2.10815ZM12.008 2.10815C12.008 3.27254 11.0643 4.21631 9.89982 4.21631C8.73539 4.21631 7.79167 3.27254 7.79167 2.10815C7.79167 0.943764 8.73539 0 9.89982 0C11.0643 0 12.008 0.943764 12.008 2.10815Z" fill="black" />
            <path d="M10.5417 17.6915C10.5417 17.3371 10.2542 17.0496 9.89982 17.0496C9.54542 17.0496 9.25798 17.3371 9.25798 17.6915C9.25798 18.0459 9.54542 18.3333 9.89982 18.3333C10.2542 18.3333 10.5417 18.0459 10.5417 17.6915ZM12.008 17.6915C12.008 18.8559 11.0642 19.7996 9.89982 19.7996C8.7354 19.7996 7.79167 18.8559 7.79167 17.6915C7.79167 16.5271 8.7354 15.5833 9.89982 15.5833C11.0642 15.5833 12.008 16.5271 12.008 17.6915Z" fill="black" />
            <path d="M2.75 9.89982C2.75 9.54543 2.46254 9.25798 2.10815 9.25798C1.75377 9.25798 1.46631 9.54543 1.46631 9.89982C1.46631 10.2542 1.75377 10.5417 2.10815 10.5417C2.46254 10.5417 2.75 10.2542 2.75 9.89982ZM4.21631 9.89982C4.21631 11.0643 3.27254 12.008 2.10815 12.008C0.943764 12.008 0 11.0643 0 9.89982C0 8.73539 0.943764 7.79167 2.10815 7.79167C3.27254 7.79167 4.21631 8.73539 4.21631 9.89982Z" fill="black" />
            <path d="M18.3333 9.89982C18.3333 9.54542 18.0459 9.25798 17.6915 9.25798C17.3371 9.25798 17.0496 9.54542 17.0496 9.89982C17.0496 10.2542 17.3371 10.5417 17.6915 10.5417C18.0459 10.5417 18.3333 10.2542 18.3333 9.89982ZM19.7996 9.89982C19.7996 11.0642 18.8559 12.008 17.6915 12.008C16.5271 12.008 15.5833 11.0642 15.5833 9.89982C15.5833 8.7354 16.5271 7.79167 17.6915 7.79167C18.8559 7.79167 19.7996 8.7354 19.7996 9.89982Z" fill="black" />
            <path d="M12.8336 9.90005C12.8336 8.42882 13.4887 7.11196 14.5201 6.22175C14.2318 5.87775 13.9048 5.56756 13.5461 5.29702C12.6598 6.24972 11.396 6.84916 9.99046 6.84927C8.59072 6.84927 7.33045 6.25535 6.44465 5.30956C6.01659 5.63464 5.63464 6.01659 5.30956 6.44465C6.25535 7.33045 6.84927 8.59072 6.84927 9.99046C6.84916 11.3959 6.24973 12.6599 5.29702 13.5461C5.56081 13.8958 5.8629 14.2148 6.19668 14.4977C7.08633 13.3866 8.45441 12.6724 9.99046 12.6724C11.5318 12.6726 12.903 13.3923 13.7923 14.5102C14.0956 14.255 14.373 13.9705 14.6195 13.6598C13.5313 12.7696 12.8336 11.4176 12.8336 9.90005ZM14.2999 9.90005C14.2999 11.1588 14.9856 12.2583 16.007 12.8443C16.1791 12.9431 16.3037 13.1076 16.3525 13.3C16.4013 13.4925 16.37 13.6968 16.2657 13.8657C15.6941 14.7906 14.9234 15.579 14.0134 16.1717C13.8422 16.2832 13.6324 16.3183 13.4342 16.2684C13.236 16.2184 13.0675 16.0879 12.9696 15.9085C12.3933 14.8529 11.2746 14.1398 9.99046 14.1396C8.71016 14.1396 7.59374 14.8483 7.01577 15.8987C6.91725 16.0777 6.74862 16.2075 6.55028 16.2567C6.35196 16.306 6.14195 16.2704 5.9711 16.1583C5.04077 15.5478 4.25728 14.7321 3.6848 13.7753C3.48573 13.4424 3.58021 13.012 3.90054 12.7933C4.79655 12.1814 5.38193 11.1542 5.38207 9.99046C5.38207 8.83034 4.80054 7.80567 3.90949 7.19302C3.58988 6.97329 3.49639 6.54236 3.69644 6.21011C4.31642 5.18124 5.18132 4.31641 6.21011 3.69644L6.27367 3.66242C6.59552 3.50907 6.98704 3.60989 7.19302 3.90949C7.80567 4.80054 8.83034 5.38207 9.99046 5.38207C11.1543 5.38193 12.1814 4.79653 12.7933 3.90054L12.8371 3.84325C13.0659 3.56974 13.4633 3.49822 13.7753 3.6848C14.733 4.25779 15.5494 5.04232 16.1601 5.97378C16.2689 6.13988 16.3057 6.34312 16.2621 6.53685C16.2185 6.73058 16.0977 6.89804 15.9282 7.00145C14.9501 7.5981 14.2999 8.67374 14.2999 9.90005Z" fill="black" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function DropdownArrow() {
  return (
    <svg className="shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5.32492 7.19583C5.72125 7.6282 6.40289 7.6282 6.79922 7.19583L11.8593 1.67573C12.4473 1.03432 11.9923 0 11.1222 0H1.00197C0.131868 0 -0.323133 1.03432 0.264818 1.67572L5.32492 7.19583Z"
        fill="black"
        fillOpacity="0.9"
        transform="translate(2, 4)"
      />
    </svg>
  );
}

/* ========== Skeleton ========== */

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-[6px] bg-[rgba(0,0,0,0.06)] ${className ?? ""}`} />;
}

/** Skeleton for the fixed top area (images + compare model) */
function SkeletonFixedTop() {
  return (
    <div className="flex flex-col items-start px-[32px] w-full">
      {/* Product images skeleton */}
      <div className="w-full">
        <div className="flex items-center gap-[48px] pt-[24px] px-[16px] w-full">
          <div className="flex-[1_0_0] h-[24px]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-[1_0_0] h-[160px] flex items-center justify-center">
              <div className="size-[160px] rounded-[8px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Compare Model skeleton */}
      <div className="w-full">
        <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
          <div className="flex-[1_0_0]">
            <SkeletonPulse className="h-[24px] w-[130px]" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-[1_0_0]">
              <SkeletonPulse className="h-[40px] w-full rounded-[10px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the scrollable rows area */
function SkeletonRows() {
  return (
    <div className="flex flex-col items-start px-[32px] w-full">
      {/* Connectivity skeleton */}
      <div className="bg-[#f6f6f6] w-full">
        <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
          <div className="flex-[1_0_0]">
            <SkeletonPulse className="h-[24px] w-[110px]" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-[1_0_0] flex justify-center">
              <SkeletonPulse className="h-[22px] w-[160px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Battery section header skeleton */}
      <div className="w-full relative">
        <div aria-hidden="true" className="absolute inset-0 border-b border-[rgba(0,0,0,0.1)] pointer-events-none" />
        <div className="flex gap-[4px] items-center w-full pt-[24px] pb-[16px] px-[16px]">
          <div className="size-[22px] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          <SkeletonPulse className="h-[24px] w-[70px]" />
        </div>
      </div>

      {/* Power Source skeleton */}
      <div className="bg-[#f6f6f6] w-full">
        <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
          <div className="flex-[1_0_0]">
            <SkeletonPulse className="h-[24px] w-[110px]" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-[1_0_0] flex justify-center">
              <SkeletonPulse className="h-[22px] w-[180px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Battery Life skeleton */}
      <div className="bg-white w-full">
        <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
          <div className="flex-[1_0_0]">
            <SkeletonPulse className="h-[24px] w-[100px]" />
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-[1_0_0] flex justify-center">
              <SkeletonPulse className="h-[22px] w-[80px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities section header skeleton */}
      <div className="w-full relative">
        <div aria-hidden="true" className="absolute inset-0 border-b border-[rgba(0,0,0,0.1)] pointer-events-none" />
        <div className="flex gap-[4px] items-center w-full pt-[24px] pb-[16px] px-[16px]">
          <div className="size-[22px] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          <SkeletonPulse className="h-[24px] w-[100px]" />
        </div>
      </div>

      {/* Capability rows skeleton */}
      {CAPABILITY_ROWS.map((cap, rowIdx) => {
        const isGray = rowIdx % 2 === 0;
        return (
          <div key={cap.key} className={`w-full ${isGray ? "bg-[#f6f6f6]" : "bg-white"}`}>
            <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
              <div className="flex-[1_0_0]">
                <SkeletonPulse className="h-[24px] w-[180px]" />
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-[1_0_0] flex items-center justify-center">
                  <div className="size-[24px] rounded-full animate-pulse bg-[rgba(0,0,0,0.06)]" />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="h-[32px] w-full shrink-0" />
    </div>
  );
}

/* ========== SPU Dropdown ========== */

function SpuDropdown({
  spus,
  selectedId,
  onSelect,
}: {
  spus: Spu[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selected = spus.find((s) => s.id === selectedId);

  // Group SPUs by connectivity
  const grouped: Record<string, Spu[]> = {};
  for (const spu of spus) {
    const key = spu.connectivity || "Other";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(spu);
  }
  const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
    const ia = CONNECTIVITY_ORDER.indexOf(a);
    const ib = CONNECTIVITY_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  return (
    <div className="flex-[1_0_0] min-w-0 relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[8px] w-full h-[40px] px-[12px] py-[6px] rounded-[10px] border border-[rgba(0,0,0,0.1)] bg-white cursor-pointer"
      >
        <p className="flex-1 min-w-0 font-['Inter',sans-serif] font-normal leading-[22px] text-[16px] text-[rgba(0,0,0,0.54)] overflow-hidden text-ellipsis whitespace-nowrap text-left">
          {selected?.name || "Select model..."}
        </p>
        <div className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <DropdownArrow />
        </div>
      </button>
      {open && (
        <div
          className="absolute z-50 top-[44px] left-0 w-full bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] shadow-lg max-h-[280px] overflow-y-auto"
          style={hideScrollbarStyle}
        >
          <style>{`.spu-dropdown-list::-webkit-scrollbar { display: none; }`}</style>
          <div className="spu-dropdown-list">
            {sortedGroups.map(([group, items]) => (
              <div key={group}>
                <div className="px-[12px] py-[6px] text-[12px] font-['Inter',sans-serif] font-semibold text-[rgba(0,0,0,0.4)] bg-[#f9f9f9] sticky top-0">
                  {group}
                </div>
                {items.map((spu) => (
                  <div
                    key={spu.id}
                    onClick={() => {
                      onSelect(spu.id);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-[8px] px-[12px] py-[8px] cursor-pointer hover:bg-[#EDEDEE] transition-colors ${
                      spu.id === selectedId ? "bg-[#f0f7ff]" : ""
                    }`}
                  >
                    {spu.imageUrl && (
                      <img
                        src={spu.imageUrl}
                        alt=""
                        className="size-[28px] rounded-full object-cover shrink-0"
                      />
                    )}
                    <span className="font-['Inter',sans-serif] font-normal text-[14px] text-[rgba(0,0,0,0.8)] truncate">
                      {spu.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {spus.length === 0 && (
              <div className="px-[12px] py-[16px] text-center text-[13px] text-[rgba(0,0,0,0.3)]">
                No SPUs available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Compare Dialog ========== */

export default function CompareDialog({
  open,
  onClose,
  categoryId,
}: {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
}) {
  const [spus, setSpus] = useState<Spu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<[string, string, string]>(["", "", ""]);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModelSticky, setIsModelSticky] = useState(false);

  // Fetch SPUs
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchWithRetry(`${API_BASE}/spus`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error("Failed to fetch SPUs");
        const data = await res.json();
        const allSpus: Spu[] = data.spus || [];
        // Filter by categoryId if provided
        const fetched = categoryId
          ? allSpus.filter((s: any) => (s.categoryId || "smoke-alarms") === categoryId)
          : allSpus;
        setSpus(fetched);
        setSelectedIds([
          fetched[0]?.id || "",
          fetched[1]?.id || "",
          fetched[2]?.id || "",
        ]);
      } catch (err) {
        console.error("Failed to load SPUs for compare:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, categoryId]);

  // Animation: fade in
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

  // Handle close with fade out
  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      setIsModelSticky(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Scroll listener: show shadow when rows area is scrolled
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const handler = () => {
      setIsModelSticky(scrollEl.scrollTop > 0);
    };
    scrollEl.addEventListener("scroll", handler, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handler);
  }, [visible]);

  // Lock body scroll when open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  const selectedSpus = selectedIds.map((id) => spus.find((s) => s.id === id) || null);

  const setSlot = (index: number, id: string) => {
    setSelectedIds((prev) => {
      const next = [...prev] as [string, string, string];
      next[index] = id;
      return next;
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center px-[120px] transition-all duration-300 ease-in-out ${
        open && !animating ? "bg-[rgba(0,0,0,0.2)] opacity-100" : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      onClick={handleClose}
    >
      {/* Webkit scrollbar hide for all inner scrollable areas */}
      <style>{`
        .compare-hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        className={`bg-white flex flex-col max-w-[1312px] w-full max-h-[85vh] rounded-[32px] overflow-hidden transition-all duration-300 ease-in-out ${
          open && !animating
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title — fixed at top */}
        <div className="shrink-0 w-full">
          <div className="flex items-start justify-center gap-[24px] pt-[32px] pb-[24px] px-[32px]">
            <div className="shrink-0 size-[44px] opacity-0" />
            <div className="flex-1 flex flex-col gap-[4px] items-center justify-center text-center">
              <p className="font-['Inter',sans-serif] font-bold leading-[44px] text-[#101820] text-[32px] w-full">
                Compare Similar Products
              </p>
              <p className="font-['Inter',sans-serif] font-normal leading-[22px] text-[16px] text-[rgba(0,0,0,0.54)] w-full">
                Find the best smoke alarms for you
              </p>
            </div>
            <button
              onClick={handleClose}
              className="shrink-0 size-[40px] opacity-40 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {loading ? (
          <>
            {/* Fixed top skeleton */}
            <div className="shrink-0 w-full">
              <SkeletonFixedTop />
            </div>
            {/* Scrollable rows skeleton */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden compare-hide-scrollbar" style={hideScrollbarStyle}>
              <SkeletonRows />
            </div>
          </>
        ) : (
          <>
            {/* Fixed: Product images */}
            <div className="shrink-0 w-full px-[32px]">
              <div className="flex items-center gap-[48px] pt-[24px] px-[16px] w-full">
                <div className="flex-[1_0_0] h-[24px]" />
                {selectedSpus.map((spu, i) => (
                  <div key={i} className="flex-[1_0_0] h-[160px] relative flex items-center justify-center">
                    {spu?.imageUrl ? (
                      <img
                        src={spu.imageUrl}
                        alt={spu.name}
                        className="size-[160px] object-cover rounded-[8px]"
                      />
                    ) : (
                      <div className="size-[160px] rounded-[8px] bg-[#f6f6f6] flex items-center justify-center">
                        <span className="text-[14px] text-[rgba(0,0,0,0.2)]">No image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed: Compare Model with bottom shadow */}
            <div className="shrink-0 w-full px-[32px] relative z-10">
              <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
                <div className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">
                  Compare Model
                </div>
                {[0, 1, 2].map((i) => (
                  <SpuDropdown
                    key={i}
                    spus={spus}
                    selectedId={selectedIds[i]}
                    onSelect={(id) => setSlot(i, id)}
                  />
                ))}
              </div>
              {/* Bottom-only shadow */}
              <div
                className={`absolute left-0 right-0 bottom-0 h-[12px] translate-y-full pointer-events-none transition-opacity duration-200 ${
                  isModelSticky ? "opacity-100" : "opacity-0"
                }`}
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.06), transparent)" }}
              />
            </div>

            {/* Scrollable: comparison rows */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overflow-x-hidden compare-hide-scrollbar"
              style={hideScrollbarStyle}
            >
              <div className="flex flex-col items-start px-[32px] w-full">
                {/* Connectivity */}
                <div className="bg-[#f6f6f6] w-full">
                  <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full text-[16px] text-[rgba(0,0,0,0.9)]">
                    <div className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[24px]">
                      {categoryId === "home-alarms" ? "Sensor Type" : "Connectivity"}
                    </div>
                    {selectedSpus.map((spu, i) => (
                      <div
                        key={i}
                        className="flex-[1_0_0] font-['Inter',sans-serif] font-normal leading-[22px] text-center"
                      >
                        {spu?.connectivity || "—"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Battery section header */}
                <div className="w-full relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 border-b border-[rgba(0,0,0,0.1)] pointer-events-none"
                  />
                  <div className="flex items-center justify-center w-full">
                    <div className="flex gap-[4px] items-center w-full pt-[24px] pb-[16px] px-[16px]">
                      <BatteryIcon />
                      <div className="flex-[1_0_0] font-['Inter',sans-serif] font-semibold leading-[24px] text-[18px] text-black">
                        Battery
                      </div>
                    </div>
                  </div>
                </div>

                {/* Power Source row */}
                <div className="bg-[#f6f6f6] w-full">
                  <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full text-[16px] text-[rgba(0,0,0,0.9)]">
                    <div className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[24px]">
                      Power Source
                    </div>
                    {selectedSpus.map((spu, i) => (
                      <div
                        key={i}
                        className="flex-[1_0_0] font-['Inter',sans-serif] font-normal leading-[22px] text-center"
                      >
                        {spu?.powerSource || "—"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Battery Life row */}
                <div className="bg-white w-full">
                  <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full text-[16px] text-[rgba(0,0,0,0.9)]">
                    <div className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[24px]">
                      Battery Life
                    </div>
                    {selectedSpus.map((spu, i) => (
                      <div
                        key={i}
                        className="flex-[1_0_0] font-['Inter',sans-serif] font-normal leading-[22px] text-center"
                      >
                        {spu?.batteryLife || "—"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities section header */}
                <div className="w-full relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 border-b border-[rgba(0,0,0,0.1)] pointer-events-none"
                  />
                  <div className="flex items-center justify-center w-full">
                    <div className="flex gap-[4px] items-center w-full pt-[24px] pb-[16px] px-[16px]">
                      <CapabilitiesIcon />
                      <div className="flex-[1_0_0] font-['Inter',sans-serif] font-semibold leading-[24px] text-[18px] text-black">
                        Capabilities
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capability rows */}
                {CAPABILITY_ROWS.map((cap, rowIdx) => {
                  const isGray = rowIdx % 2 === 0;
                  return (
                    <div
                      key={cap.key}
                      className={`w-full ${isGray ? "bg-[#f6f6f6]" : "bg-white"}`}
                    >
                      <div className="flex items-center gap-[48px] px-[16px] py-[24px] w-full">
                        <div className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[24px] text-[16px] text-[rgba(0,0,0,0.9)]">
                          {cap.label}
                        </div>
                        {selectedSpus.map((spu, i) => (
                          <div
                            key={i}
                            className="flex-[1_0_0] flex items-center justify-center"
                          >
                            {spu?.capabilities?.[cap.key] ? (
                              <CheckIcon />
                            ) : (
                              <CrossIcon />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Bottom padding */}
                <div className="h-[32px] w-full shrink-0" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}