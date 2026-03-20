import { useState, useEffect, useRef, useCallback } from "react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import svgPaths from "../../imports/svg-8d3d7e83kk";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

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

const hideScrollbarStyle = { scrollbarWidth: "none" as const, msOverflowStyle: "none" as const };

/* ========== SVG Icons ========== */

function CheckIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g>
          <path d={svgPaths.p3779f800} fill="#067AD9" />
          <path d={svgPaths.p10c65a40} fill="#067AD9" />
        </g>
      </svg>
    </div>
  );
}

function CrossIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p38ff0800} fill="black" fillOpacity="0.2" />
      </svg>
    </div>
  );
}

function CloseIcon() {
  return (
    <div className="opacity-40 relative shrink-0 size-[32px]">
      <div className="absolute inset-[8.33%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6667 26.6667">
          <path
            clipRule="evenodd"
            d={svgPaths.p38086130}
            fill="black"
            fillOpacity="0.54"
            fillRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}

function MobileBatteryIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <div className="absolute inset-[4.79%_25.83%_4.38%_25.83%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.78809 18.2275">
          <path d="M7.97754 1.99805C8.90301 1.99805 9.78809 2.68979 9.78809 3.7002V16.5254C9.78796 17.5357 8.90295 18.2275 7.97754 18.2275H1.81055C0.885368 18.2272 0.000121418 17.5354 0 16.5254V3.7002C-4.4156e-08 2.69002 0.885316 1.99837 1.81055 1.99805H7.97754ZM1.81055 3.45313C1.68848 3.45328 1.59156 3.49756 1.53125 3.55176C1.4723 3.6049 1.45508 3.65868 1.45508 3.7002V16.5254C1.45513 16.5669 1.47223 16.6207 1.53125 16.6738C1.59156 16.7281 1.68844 16.7723 1.81055 16.7725H7.97754C8.09964 16.7725 8.19639 16.728 8.25684 16.6738C8.31592 16.6207 8.33392 16.5669 8.33398 16.5254V3.7002C8.33398 3.65861 8.31602 3.60498 8.25684 3.55176C8.1964 3.49757 8.09974 3.45313 7.97754 3.45313H1.81055ZM2.84668 8.33301C3.55327 8.33309 4.21144 8.68076 4.61035 9.25684L4.7627 9.49316C5.16169 10.069 5.81991 10.416 6.52637 10.416H7.34277C7.37109 10.416 7.39453 10.4395 7.39453 10.4678V15.3789C7.39436 15.6296 7.19116 15.8328 6.94043 15.833H2.84863C2.59791 15.8328 2.39471 15.6296 2.39453 15.3789V8.37402C2.3946 8.35143 2.41293 8.33301 2.43555 8.33301H2.84668ZM5.72754 0C6.18747 -2.01043e-08 6.56152 0.368408 6.56152 0.822266V0.838867C6.56139 1.06569 6.37442 1.25 6.14453 1.25H3.64453C3.41464 1.25 3.22767 1.06569 3.22754 0.838867V0.822266C3.22754 0.368408 3.60159 2.01043e-08 4.06152 0H5.72754Z" fill="black" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function MobileCapabilitiesIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[5.01%_5%_4.99%_5%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.9997 17.9997">
          <g>
            <path d="M9.58333 1.9165C9.58333 1.59433 9.32202 1.33301 8.99984 1.33301C8.67766 1.33301 8.41634 1.59433 8.41634 1.9165C8.41634 2.23868 8.67766 2.5 8.99984 2.5C9.32202 2.5 9.58333 2.23868 9.58333 1.9165ZM10.9163 1.9165C10.9163 2.97504 10.0584 3.83301 8.99984 3.83301C7.94127 3.83301 7.08333 2.97504 7.08333 1.9165C7.08333 0.857967 7.94127 0 8.99984 0C10.0584 0 10.9163 0.857967 10.9163 1.9165Z" fill="black" />
            <path d="M9.58333 16.0832C9.58333 15.761 9.32202 15.4997 8.99984 15.4997C8.67765 15.4997 8.41634 15.761 8.41634 16.0832C8.41634 16.4054 8.67765 16.6667 8.99984 16.6667C9.32202 16.6667 9.58333 16.4054 9.58333 16.0832ZM10.9163 16.0832C10.9163 17.1417 10.0584 17.9997 8.99984 17.9997C7.94127 17.9997 7.08333 17.1417 7.08333 16.0832C7.08333 15.0246 7.94127 14.1667 8.99984 14.1667C10.0584 14.1667 10.9163 15.0246 10.9163 16.0832Z" fill="black" />
            <path d="M2.5 8.99984C2.5 8.67766 2.23868 8.41634 1.9165 8.41634C1.59433 8.41634 1.33301 8.67766 1.33301 8.99984C1.33301 9.32202 1.59433 9.58333 1.9165 9.58333C2.23868 9.58333 2.5 9.32202 2.5 8.99984ZM3.83301 8.99984C3.83301 10.0584 2.97504 10.9163 1.9165 10.9163C0.857967 10.9163 0 10.0584 0 8.99984C0 7.94127 0.857967 7.08333 1.9165 7.08333C2.97504 7.08333 3.83301 7.94127 3.83301 8.99984Z" fill="black" />
            <path d="M16.6667 8.99984C16.6667 8.67765 16.4054 8.41634 16.0832 8.41634C15.761 8.41634 15.4997 8.67765 15.4997 8.99984C15.4997 9.32202 15.761 9.58333 16.0832 9.58333C16.4054 9.58333 16.6667 9.32202 16.6667 8.99984ZM17.9997 8.99984C17.9997 10.0584 17.1417 10.9163 16.0832 10.9163C15.0246 10.9163 14.1667 10.0584 14.1667 8.99984C14.1667 7.94127 15.0246 7.08333 16.0832 7.08333C17.1417 7.08333 17.9997 7.94127 17.9997 8.99984Z" fill="black" />
            <path d="M11.6669 9.00005C11.6669 7.66257 12.2624 6.46542 13.2001 5.65613C12.938 5.34341 12.6407 5.06142 12.3147 4.81548C11.509 5.68156 10.36 6.22651 9.08224 6.22661C7.80975 6.22661 6.66404 5.68668 5.85877 4.82687C5.46963 5.1224 5.1224 5.46963 4.82687 5.85877C5.68668 6.66404 6.22661 7.80975 6.22661 9.08224C6.22651 10.36 5.68157 11.509 4.81548 12.3147C5.05528 12.6326 5.32991 12.9225 5.63335 13.1797C6.44212 12.1696 7.68583 11.5204 9.08224 11.5204C10.4835 11.5205 11.73 12.1749 12.5385 13.1911C12.8141 11.6087 11.6669 10.3796 11.6669 9.00005ZM12.9999 9.00005C12.9999 10.1444 13.6233 11.1439 14.5518 11.6766C14.7083 11.7665 14.8215 11.916 14.8659 12.0909C14.9103 12.2659 14.8819 12.4516 14.787 12.6052C14.2674 13.446 13.5667 14.1627 12.7395 14.7015C12.5838 14.8029 12.3931 14.8348 12.2129 14.7894C12.0328 14.744 11.8796 14.6254 11.7906 14.4623C11.2667 13.5026 10.2496 12.8543 9.08224 12.8542C7.91832 12.8542 6.9034 13.4984 6.37798 14.4533C6.28841 14.6161 6.13511 14.734 5.9548 14.7789C5.77451 14.8236 5.58359 14.7912 5.42827 14.6893C4.58251 14.1344 3.87026 13.3928 3.34982 12.523C3.16885 12.2204 3.25474 11.8291 3.54594 11.6303C4.3605 11.074 4.89267 10.1402 4.89279 9.08224C4.89279 8.02758 4.36412 7.09606 3.55408 6.53911C3.26353 6.33935 3.17853 5.9476 3.3604 5.64555C3.92402 4.71022 4.71029 3.92401 5.64555 3.3604L5.70333 3.32947C5.99593 3.19006 6.35186 3.28171 6.53911 3.55408C7.09606 4.36412 8.02758 4.89279 9.08224 4.89279C10.1403 4.89267 11.074 4.36048 11.6303 3.54594L11.6701 3.49386C11.8781 3.24522 12.2393 3.1802 12.523 3.34982C13.3936 3.87072 14.1358 4.58393 14.691 5.43071C14.7899 5.58171 14.8234 5.76647 14.7837 5.94259C14.7441 6.11871 14.6343 6.27095 14.4802 6.36495C13.591 6.90736 12.9999 7.88522 12.9999 9.00005Z" fill="black" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function DropdownArrowIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[29.17%_4.17%_20.83%_4.17%]">
        <div className="absolute inset-[0_8.67%_6%_8.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1241 7.52011">
            <path d={svgPaths.p206bffc0} fill="black" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ========== Skeleton ========== */

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-[6px] bg-[rgba(0,0,0,0.06)] ${className ?? ""}`} />;
}

function MobileSkeletonContent() {
  return (
    <>
      {/* Images skeleton */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[24px] items-center pt-[24px] px-[19px] relative w-full">
            {[0, 1].map((i) => (
              <div key={i} className="flex-[1_0_0] h-[80px] flex items-center justify-center">
                <div className="size-[80px] rounded-[8px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Dropdowns skeleton */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[24px] items-center pb-[24px] pt-[16px] px-[19px] relative w-full">
            {[0, 1].map((i) => (
              <div key={i} className="flex-[1_0_0]">
                <SkeletonPulse className="h-[40px] w-full rounded-[10px]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Rows skeleton */}
      <div className="bg-[#f6f6f6] relative shrink-0 w-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          {[0, 1].map((i) => (
            <div key={i} className="flex-[1_0_0]">
              <SkeletonPulse className="h-[20px] w-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Section header skeleton */}
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
        <div className="content-stretch flex gap-[4px] items-center justify-center pb-[16px] pt-[24px] px-[19px] relative w-full">
          <div className="size-[20px] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          <SkeletonPulse className="h-[24px] w-[60px] flex-[1_0_0]" />
        </div>
      </div>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`${i % 2 === 0 ? "bg-[#f6f6f6]" : "bg-white"} relative shrink-0 w-full`}>
          <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
            {[0, 1].map((j) => (
              <div key={j} className="flex-[1_0_0] flex gap-[8px] items-center">
                <div className="size-[24px] rounded-full animate-pulse bg-[rgba(0,0,0,0.06)]" />
                <SkeletonPulse className="h-[16px] flex-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ========== SPU Dropdown (mobile) ========== */

function MobileSpuDropdown({
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
    <div className="flex-[1_0_0] min-w-0 min-h-px relative" ref={ref}>
      <div
        className="flex flex-row items-center overflow-clip rounded-[10px] size-full cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full h-[40px]">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">
            {selected?.name || "Select..."}
          </p>
          <div className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <DropdownArrowIcon />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />

      {open && (
        <div
          className="absolute z-50 top-[44px] left-0 w-full bg-white rounded-[12px] border border-[rgba(0,0,0,0.1)] shadow-lg max-h-[240px] overflow-y-auto"
          style={hideScrollbarStyle}
        >
          <style>{`.mobile-spu-dd::-webkit-scrollbar { display: none; }`}</style>
          <div className="mobile-spu-dd">
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
                    className={`flex items-center gap-[8px] cursor-pointer active:bg-[#EDEDEE] ${ spu.id === selectedId ? "bg-[#f0f7ff]" : "" } px-[12px] py-[16px]`}
                  >
                    {spu.imageUrl && (
                      <img
                        src={spu.imageUrl}
                        alt=""
                        className="size-[24px] rounded-full object-cover shrink-0"
                      />
                    )}
                    <span className="font-['Inter',sans-serif] font-normal text-[13px] text-[rgba(0,0,0,0.8)] truncate">
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

/* ========== Capability Row ========== */

function CapabilityCheckmark({ enabled }: { enabled: boolean }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
      {enabled ? <CheckIcon /> : <CrossIcon />}
    </div>
  );
}

function CapabilityRow({
  label,
  spus,
  capKey,
  isGray,
}: {
  label: string;
  spus: (Spu | null)[];
  capKey: keyof SpuCapabilities;
  isGray: boolean;
}) {
  return (
    <div className={`${isGray ? "bg-[#f6f6f6]" : "bg-white"} relative shrink-0 w-full`}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          {spus.map((spu, i) => (
            <div key={i} className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
              {spu?.capabilities?.[capKey] ? <CheckIcon /> : <CrossIcon />}
              <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
                <p className="leading-[16px]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========== Main Dialog ========== */

export default function MobileCompareDialog({
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
  const [selectedIds, setSelectedIds] = useState<[string, string]>(["", ""]);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Fetch SPUs
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/spus`, { headers: AUTH_HEADER });
        if (!res.ok) throw new Error("Failed to fetch SPUs");
        const data = await res.json();
        const allSpus: Spu[] = data.spus || [];
        // Filter by categoryId if provided
        const fetched = categoryId
          ? allSpus.filter((s: any) => !s.categoryId || s.categoryId === categoryId)
          : allSpus;
        setSpus(fetched);
        setSelectedIds([
          fetched[0]?.id || "",
          fetched[1]?.id || "",
        ]);
      } catch (err) {
        console.error("Failed to load SPUs for mobile compare:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, categoryId]);

  // Animation: fade in (top-down)
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

  // Handle close with fade out (bottom-up)
  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      onClose();
    }, 300);
  }, [onClose]);

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
      const next = [...prev] as [string, string];
      next[index] = id;
      return next;
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[210] transition-all duration-300 ease-in-out ${
        open && !animating ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Hide scrollbar for webkit */}
      <style>{`.mobile-compare-hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>

      <div
        className={`bg-white flex flex-col size-full transition-transform duration-300 ease-in-out ${
          open && !animating ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* ===== Fixed top section ===== */}
        <div className="shrink-0 w-full flex flex-col">
          {/* Header: close button */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row justify-end size-full">
              <div className="content-stretch flex items-start justify-end p-[16px] relative w-full">
                <div className="cursor-pointer" onClick={handleClose}>
                  <CloseIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic relative shrink-0 text-center w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[#101820] text-[24px] w-full">
              Compare Similar Products
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
              Find the best smoke alarms for you
            </p>
          </div>

          {loading ? (
            /* Skeleton for images + dropdowns while loading */
            <>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[24px] items-center pt-[24px] px-[19px] relative w-full">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex-[1_0_0] h-[80px] flex items-center justify-center">
                        <div className="size-[80px] rounded-[8px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[24px] items-center pb-[24px] pt-[16px] px-[19px] relative w-full">
                    {[0, 1].map((i) => (
                      <div key={i} className="flex-[1_0_0]">
                        <SkeletonPulse className="h-[40px] w-full rounded-[10px]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Product images */}
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[24px] items-center pt-[24px] px-[19px] relative w-full">
                    {selectedSpus.map((spu, i) => (
                      <div key={i} className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative">
                        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.25px)] size-[80px] top-1/2">
                          {spu?.imageUrl ? (
                            <img
                              alt={spu.name}
                              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full rounded-[8px]"
                              src={spu.imageUrl}
                            />
                          ) : (
                            <div className="absolute inset-0 rounded-[8px] bg-[#f6f6f6] flex items-center justify-center">
                              <span className="text-[10px] text-[rgba(0,0,0,0.2)]">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compare Model dropdowns */}
              <div className="relative shrink-0 w-full">
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex gap-[24px] items-center pb-[24px] pt-[16px] px-[19px] relative w-full">
                    {[0, 1].map((i) => (
                      <MobileSpuDropdown
                        key={i}
                        spus={spus}
                        selectedId={selectedIds[i]}
                        onSelect={(id) => setSlot(i, id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== Scrollable content ===== */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden mobile-compare-hide-scrollbar"
          style={hideScrollbarStyle}
        >
          <div className="content-stretch flex flex-col items-start relative w-full">
            {loading ? (
              <MobileSkeletonContent />
            ) : (
              <>
                {/* Connectivity row */}
                <div className="bg-[#f6f6f6] relative shrink-0 w-full">
                  <div className="content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative w-full">
                    {selectedSpus.map((spu, i) => (
                      <div key={i} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative">
                        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
                          <p className="leading-[20px]">{spu?.connectivity || "\u2014"}</p>
                        </div>
                        <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
                          <p className="leading-[16px]">{categoryId === "home-alarms" ? "Sensor Type" : "Connectivity"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Battery section header */}
                <div className="relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[4px] items-center justify-center pb-[16px] pt-[24px] px-[19px] relative w-full">
                      <MobileBatteryIcon />
                      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[16px] text-black">
                        <p className="leading-[24px]">Battery</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Power Source row */}
                <div className="bg-[#f6f6f6] relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative w-full">
                      {selectedSpus.map((spu, i) => (
                        <div key={i} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative">
                          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
                            <p className="leading-[20px]">{spu?.powerSource || "\u2014"}</p>
                          </div>
                          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
                            <p className="leading-[16px]">Power Source</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Battery Life row */}
                <div className="bg-white relative shrink-0 w-full">
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative w-full">
                      {selectedSpus.map((spu, i) => (
                        <div key={i} className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative">
                          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
                            <p className="leading-[20px]">{spu?.batteryLife || "\u2014"}</p>
                          </div>
                          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
                            <p className="leading-[16px]">Battery Life</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Capabilities section header */}
                <div className="relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="content-stretch flex gap-[4px] items-center justify-center pb-[16px] pt-[24px] px-[19px] relative w-full">
                      <MobileCapabilitiesIcon />
                      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[16px] text-black">
                        <p className="leading-[24px]">Capabilities</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Capability rows */}
                {CAPABILITY_ROWS.map((cap, rowIdx) => (
                  <CapabilityRow
                    key={cap.key}
                    label={cap.label}
                    spus={selectedSpus}
                    capKey={cap.key}
                    isGray={rowIdx % 2 === 0}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}