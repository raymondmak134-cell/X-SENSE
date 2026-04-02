import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import type { Category } from "./use-products";
import svgClose from "../../imports/svg-eq26t96ixf";
import svgMobile from "../../imports/svg-s77hhl3g4q";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

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

interface Spu {
  id: string;
  name: string;
  imageUrl: string;
  connectivity: string;
  categoryId?: string;
}

// Connectivity filter options per category type
const CONNECTIVITY_OPTIONS = [
  "Base Station Interconnected (App)",
  "Wi-Fi (App)",
  "Wireless Interconnected",
  "Standalone",
];

const SENSOR_TYPE_OPTIONS = [
  "Water Leak",
  "Heat Alarm",
  "Thermometer & Hygrometer",
];

const CATEGORIES_WITH_CONNECTIVITY = ["smoke-alarms", "co-alarms", "combination-alarms"];
const CATEGORIES_WITH_SENSOR_TYPE = ["home-alarms"];

function getFilterOptions(categoryId: string): string[] {
  if (CATEGORIES_WITH_CONNECTIVITY.includes(categoryId)) return CONNECTIVITY_OPTIONS;
  if (CATEGORIES_WITH_SENSOR_TYPE.includes(categoryId)) return SENSOR_TYPE_OPTIONS;
  return [];
}

/* ==================== Mobile Accordion Section ==================== */

function MobileAccordionSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (expanded && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [expanded]);

  // Re-measure when children change
  useEffect(() => {
    if (expanded && contentRef.current) {
      const raf = requestAnimationFrame(() => {
        if (contentRef.current) setHeight(contentRef.current.scrollHeight);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [expanded, children]);

  return (
    <div className="relative shrink-0 w-full">
      <div
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full cursor-pointer"
        onClick={onToggle}
      >
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] whitespace-nowrap">
            <p className={`leading-[24px] ${expanded ? "text-[#ba0020]" : "text-[#333]"}`}>{label}</p>
          </div>
        </div>
        <div className="relative shrink-0 size-[20px]">
          <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
            <div
              className="flex-none h-[15px] w-[8.333px] transition-transform duration-300 ease-in-out"
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(-90deg)" }}
            >
              <div className="relative size-full">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                  <path
                    d={svgMobile.pbb72f00}
                    fill={expanded ? "#BA0020" : "black"}
                    fillOpacity={expanded ? 1 : 0.9}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{ height, overflow: "hidden", transition: "height 300ms ease-in-out" }}
      >
        <div ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

interface ProductSelectDialogProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  categoriesLoading: boolean;
  fallbackImages: Record<string, string>;
  initialCategoryId?: string;
  onSelectSpu?: (spu: Spu) => void;
}

export default function ProductSelectDialog({
  open,
  onClose,
  categories,
  categoriesLoading,
  fallbackImages,
  initialCategoryId,
  onSelectSpu,
}: ProductSelectDialogProps) {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [spus, setSpus] = useState<Spu[]>([]);
  const [spusLoading, setSpusLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 1024);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Track viewport width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set initial category when dialog opens or initialCategoryId changes
  useEffect(() => {
    if (open && initialCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    } else if (open && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [open, initialCategoryId, categories]);

  // Fetch SPUs
  const loadSpus = useCallback(async () => {
    try {
      setSpusLoading(true);
      const res = await fetchWithRetry(`${API_BASE}/spus`, { headers: AUTH_HEADER });
      if (!res.ok) throw new Error(`Failed to fetch SPUs (${res.status})`);
      const data = await res.json();
      setSpus(data.spus || []);
    } catch (err) {
      console.error("Error fetching SPUs for dialog:", err);
    } finally {
      setSpusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadSpus();
    }
  }, [open, loadSpus]);

  // Reset filter when category changes — default to first option
  useEffect(() => {
    const opts = getFilterOptions(selectedCategoryId);
    setActiveFilter(opts.length > 0 ? opts[0] : null);
    // On mobile, default expand the first filter section
    if (opts.length > 0) {
      setExpandedSections(new Set([opts[0]]));
    } else {
      setExpandedSections(new Set());
    }
  }, [selectedCategoryId]);

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
      onClose();
    }, 300);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, handleClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  const filteredSpus = spus
    .filter((s) => (s.categoryId || "smoke-alarms") === selectedCategoryId)
    .filter((s) => {
      if (!activeFilter) return true;
      return s.connectivity === activeFilter;
    });

  const filterOptions = getFilterOptions(selectedCategoryId);
  const hasFilters = filterOptions.length > 0;

  // Get selected category info for mobile title
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const categoryName = selectedCategory?.name || "Products";

  // All SPUs for current category (unfiltered by connectivity — used by mobile accordion)
  const categorySpus = spus.filter((s) => (s.categoryId || "smoke-alarms") === selectedCategoryId);

  const handleSpuClick = (spu: Spu) => {
    if (onSelectSpu) {
      onSelectSpu(spu);
    } else {
      setVisible(false);
      document.body.style.overflow = "";
      onClose();
      navigate(`/support/product/${spu.id}`);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  /* ==================== Mobile fullscreen drawer ==================== */
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-[210] transition-all duration-300 ease-in-out ${
          open && !animating ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`bg-white flex flex-col size-full transition-transform duration-300 ease-in-out ${
            open && !animating ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Header — close button */}
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row justify-end size-full">
              <div className="content-stretch flex items-start justify-end p-[16px] relative w-full">
                <button
                  onClick={handleClose}
                  className="opacity-40 overflow-clip relative shrink-0 size-[32px] cursor-pointer border-none bg-transparent"
                >
                  <div className="absolute inset-[8.33%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6667 26.6667">
                      <path
                        clipRule="evenodd"
                        d={svgMobile.p38086130}
                        fill="black"
                        fillOpacity="0.54"
                        fillRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Title Container — fixed */}
          <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic relative shrink-0 text-center w-full px-[20px]">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[#101820] text-[24px] w-full">
              {categoryName}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
              How-to guides and technical help
            </p>
          </div>

          {/* Scrollable content */}
          <div
            className="mobile-spu-scroll flex-1 min-h-0 w-full overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <style>{`.mobile-spu-scroll::-webkit-scrollbar { display: none; }`}</style>
            <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-full">
              <div className="relative shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
                <div className="content-stretch flex flex-col items-start pt-px px-[20px] relative w-full">
                  {spusLoading ? (
                    /* Skeleton — mimics accordion sections with first expanded */
                    <>
                      {/* First section: expanded with product grid skeleton */}
                      <div className="relative shrink-0 w-full">
                        <div className="flex items-center justify-between py-[24px] w-full">
                          <div className="h-[20px] w-[220px] rounded-[4px] bg-[rgba(0,0,0,0.06)] animate-pulse" />
                          <div className="size-[20px] rounded-[4px] bg-[rgba(0,0,0,0.06)] animate-pulse" />
                        </div>
                        {/* Expanded product grid skeleton */}
                        <div className="flex gap-[16px] items-start py-[24px] w-full flex-wrap">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px"
                              style={{ maxWidth: "calc(50% - 8px)" }}
                            >
                              <div className="size-[140px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
                              <div className="h-[18px] w-[72px] rounded-[4px] bg-[rgba(0,0,0,0.05)] animate-pulse mt-[2px]" />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Remaining collapsed sections */}
                      {[2, 3, 4].map((i) => (
                        <div key={i} className="relative shrink-0 w-full">
                          <div className="flex items-center justify-between py-[24px] w-full">
                            <div className={`h-[20px] rounded-[4px] bg-[rgba(0,0,0,0.06)] animate-pulse`} style={{ width: i === 2 ? 120 : i === 3 ? 180 : 100 }} />
                            <div className="size-[20px] rounded-[4px] bg-[rgba(0,0,0,0.06)] animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </>
                  ) : hasFilters ? (
                    /* Accordion sections by filter option */
                    filterOptions.map((opt) => {
                      const sectionSpus = categorySpus.filter((s) => s.connectivity === opt);
                      if (sectionSpus.length === 0) {
                        return (
                          <MobileAccordionSection
                            key={opt}
                            label={opt}
                            expanded={expandedSections.has(opt)}
                            onToggle={() => toggleSection(opt)}
                          >
                            <div className="flex items-center justify-center w-full py-[16px] pb-[24px]">
                              <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.3)]">
                                No products
                              </p>
                            </div>
                          </MobileAccordionSection>
                        );
                      }
                      return (
                        <MobileAccordionSection
                          key={opt}
                          label={opt}
                          expanded={expandedSections.has(opt)}
                          onToggle={() => toggleSection(opt)}
                        >
                          <div className="relative shrink-0 w-full">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start py-[24px] relative w-full flex-wrap">
                              {sectionSpus.map((spu) => (
                                <button
                                  key={spu.id}
                                  type="button"
                                  onClick={() => handleSpuClick(spu)}
                                  className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative cursor-pointer bg-transparent border-none outline-none"
                                  style={{ maxWidth: "calc(50% - 8px)" }}
                                >
                                  <div className="relative shrink-0 size-[140px]">
                                    {spu.imageUrl ? (
                                      <img
                                        alt={spu.name}
                                        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                                        src={spu.imageUrl}
                                      />
                                    ) : (
                                      <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[8px] flex items-center justify-center">
                                        <span className="text-[rgba(0,0,0,0.2)] text-[12px]">No image</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">
                                    {spu.name}
                                  </p>
                                </button>
                              ))}
                              {/* Placeholder to maintain 2-col alignment */}
                              {sectionSpus.length % 2 !== 0 && (
                                <div className="flex-[1_0_0] min-h-px min-w-px" style={{ maxWidth: "calc(50% - 8px)" }} />
                              )}
                            </div>
                          </div>
                        </MobileAccordionSection>
                      );
                    })
                  ) : (
                    /* No filters — show all SPUs as flat list */
                    <div className="relative shrink-0 w-full">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start py-[24px] relative w-full flex-wrap">
                        {categorySpus.length > 0 ? (
                          categorySpus.map((spu) => (
                            <button
                              key={spu.id}
                              type="button"
                              onClick={() => handleSpuClick(spu)}
                              className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative cursor-pointer bg-transparent border-none outline-none"
                              style={{ maxWidth: "calc(50% - 8px)" }}
                            >
                              <div className="relative shrink-0 size-[140px]">
                                {spu.imageUrl ? (
                                  <img
                                    alt={spu.name}
                                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                                    src={spu.imageUrl}
                                  />
                                ) : (
                                  <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[8px] flex items-center justify-center">
                                    <span className="text-[rgba(0,0,0,0.2)] text-[12px]">No image</span>
                                  </div>
                                )}
                              </div>
                              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">
                                {spu.name}
                              </p>
                            </button>
                          ))
                        ) : (
                          <div className="flex items-center justify-center w-full py-[40px]">
                            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-[rgba(0,0,0,0.3)]">
                              No products in this category yet
                            </p>
                          </div>
                        )}
                        {/* Placeholder */}
                        {categorySpus.length % 2 !== 0 && (
                          <div className="flex-[1_0_0] min-h-px min-w-px" style={{ maxWidth: "calc(50% - 8px)" }} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== Desktop dialog (unchanged) ==================== */
  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-300 ease-in-out ${
        open && !animating ? "bg-[rgba(0,0,0,0.2)] opacity-100" : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      style={{ padding: "0 clamp(24px, 8vw, 120px)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div className={`bg-white flex flex-col items-center max-w-[1312px] w-full overflow-hidden rounded-[32px] max-h-[90vh] transition-all duration-300 ease-in-out ${
        open && !animating
          ? "scale-100 opacity-100"
          : "scale-95 opacity-0"
      }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="shrink-0 w-full">
          <div className="flex flex-row justify-center w-full">
            <div className="flex gap-[24px] items-start justify-center pb-[24px] pt-[32px] px-[32px] w-full">
              <div className="opacity-40 shrink-0 size-[44px]" />
              <div className="flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px text-center">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] text-[#101820] text-[32px] w-full">
                  Select a product for support
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] text-[16px] text-[rgba(0,0,0,0.54)] w-full">
                  How-to guides and technical help
                </p>
              </div>
              <button
                onClick={handleClose}
                className="relative opacity-40 overflow-clip shrink-0 size-[40px] cursor-pointer hover:opacity-60 transition-opacity mt-[2px]"
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
          </div>
        </div>

        {/* Body */}
        <div className="shrink-0 w-full min-h-0 flex-1">
          <div className="flex items-start pb-[32px] px-[32px] w-full h-full">
            {/* Left sidebar - Categories */}
            <div className="flex flex-col items-start justify-center shrink-0 w-[340px] relative self-stretch overflow-y-auto border-r border-solid border-[rgba(0,0,0,0.1)]">
              {categoriesLoading ? (
                // Skeleton for categories
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex gap-[4px] items-center py-[8px] w-full">
                      <div className="shrink-0 size-[80px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
                      <div className="h-[20px] w-[120px] rounded bg-[rgba(0,0,0,0.05)] animate-pulse" />
                    </div>
                  ))}
                </>
              ) : (
                categories.map((cat) => {
                  const isActive = selectedCategoryId === cat.id;
                  const imageUrl = cat.coverImageUrl || fallbackImages[cat.id] || "";
                  const isCombination = cat.id === "combination-alarms" && !cat.coverImageUrl;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className="group/cat flex gap-[4px] items-center py-[8px] pr-[16px] w-full cursor-pointer bg-transparent border-none outline-none text-left relative"
                    >
                      <div className="relative shrink-0 size-[80px]">
                        {imageUrl ? (
                          isCombination ? (
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                              <img alt="" className="absolute left-[15.56%] max-w-none size-[68.66%] top-[15.44%]" src={imageUrl} />
                            </div>
                          ) : (
                            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageUrl} />
                          )
                        ) : (
                          <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[8px]" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center whitespace-nowrap flex-1 min-w-0">
                        <p
                          className={`font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] transition-colors ${
                            isActive ? "text-[#ba0020]" : "text-[rgba(0,0,0,0.54)] group-hover/cat:text-black"
                          }`}
                        >
                          {cat.name}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Right content - SPUs */}
            <div className="flex-[1_0_0] min-h-px min-w-px self-stretch">
              <div className="flex flex-col items-center size-full">
                <div className="flex flex-col gap-[32px] items-center pt-[32px] px-[16px] w-full">
                  {/* Filter chips */}
                  {hasFilters && (
                    <div className="flex flex-wrap gap-[48px] items-center w-full">
                      {filterOptions.map((opt) => {
                        const isActive = activeFilter === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => { if (activeFilter !== opt) setActiveFilter(opt); }}
                            className={`flex gap-[4px] items-center justify-center overflow-clip px-[12px] py-[6px] rounded-[49px] shrink-0 cursor-pointer border-none outline-none transition-colors ${
                              isActive
                                ? "bg-[#101820]"
                                : "bg-transparent hover:bg-[rgba(0,0,0,0.04)]"
                            }`}
                          >
                            <p
                              className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] text-[14px] text-center whitespace-nowrap ${
                                isActive ? "text-white" : "text-[rgba(0,0,0,0.54)]"
                              }`}
                            >
                              {opt}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SPU grid */}
                  {spusLoading ? (
                    <div className="flex gap-[16px] items-start w-full">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px">
                          <div className="size-[140px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
                          <div className="h-[18px] w-[80px] rounded bg-[rgba(0,0,0,0.05)] animate-pulse mt-[2px]" />
                        </div>
                      ))}
                    </div>
                  ) : filteredSpus.length > 0 ? (
                    <div className="flex gap-[16px] items-start w-full flex-wrap">
                      {filteredSpus.map((spu) => (
                        <button
                          key={spu.id}
                          type="button"
                          onClick={() => {
                            if (onSelectSpu) {
                              onSelectSpu(spu);
                            } else {
                              // Default: navigate to SPU detail page — close immediately (skip animation)
                              setVisible(false);
                              document.body.style.overflow = "";
                              onClose();
                              navigate(`/support/product/${spu.id}`);
                            }
                          }}
                          className="flex flex-col gap-[4px] items-center cursor-pointer bg-transparent border-none outline-none group"
                          style={{ flex: "1 0 0", minWidth: 0, maxWidth: "calc(25% - 12px)" }}
                        >
                          <div className="relative shrink-0 size-[140px]">
                            {spu.imageUrl ? (
                              <img
                                alt={spu.name}
                                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                                src={spu.imageUrl}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[8px] flex items-center justify-center">
                                <span className="text-[rgba(0,0,0,0.2)] text-[12px]">No image</span>
                              </div>
                            )}
                          </div>
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full text-[16px] text-black text-center w-[min-content] group-hover:text-[#ba0020] transition-colors">
                            {spu.name}
                          </p>
                        </button>
                      ))}
                      {/* Placeholder items to maintain grid alignment (up to 4 cols) */}
                      {filteredSpus.length < 4 &&
                        Array.from({ length: 4 - filteredSpus.length }).map((_, i) => (
                          <div key={`ph-${i}`} className="flex-[1_0_0] h-[208px] min-h-px min-w-px" />
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full py-[60px]">
                      <p className="font-['Inter:Regular',sans-serif] text-[15px] text-[rgba(0,0,0,0.3)]">
                        No products in this category yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}