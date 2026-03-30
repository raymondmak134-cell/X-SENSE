import { useState, useRef, useEffect, useCallback } from "react";
import {
  useProducts,
  useProductCards,
  useGuides,
  getMinPriceForCard,
  type ProductCardItem,
  type GuideItem,
  type Product,
} from "./use-products";
import MobileNav from "./mobile-nav";
import Footer from "../../imports/Footer";

/* ========== Skeleton Loaders ========== */

function MobileProductCardSkeleton() {
  return (
    <div className="content-stretch flex flex-col h-[480px] items-center justify-between overflow-clip p-[24px] relative rounded-[24px] shrink-0 w-full bg-[#f0f0f0] animate-pulse">
      <div className="flex flex-col gap-[4px] items-start w-full">
        <div className="h-[34px] w-[160px] rounded-[8px] bg-[rgba(0,0,0,0.08)]" />
        <div className="h-[16px] w-[200px] rounded-[6px] bg-[rgba(0,0,0,0.06)] mt-[4px]" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="h-[24px] w-[120px] rounded-[6px] bg-[rgba(0,0,0,0.08)]" />
        <div className="h-[40px] w-[80px] rounded-full bg-[rgba(0,0,0,0.08)]" />
      </div>
    </div>
  );
}

function MobileGuideCardSkeleton() {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col h-[374px] items-start overflow-clip relative rounded-[24px] shrink-0 w-[305px] animate-pulse">
      <div className="flex flex-col gap-[4px] items-start p-[24px] w-full">
        <div className="h-[16px] w-[140px] rounded-[4px] bg-[rgba(0,0,0,0.06)]" />
        <div className="h-[34px] w-full rounded-[6px] bg-[rgba(0,0,0,0.08)] mt-[4px]" />
        <div className="h-[34px] w-[80%] rounded-[6px] bg-[rgba(0,0,0,0.08)]" />
      </div>
      <div className="flex-[1_0_0] w-full bg-[rgba(0,0,0,0.04)]" />
    </div>
  );
}

/* ========== Mobile Product Card ========== */

function MobileModelCard({
  card,
  minPrice,
}: {
  card: ProductCardItem;
  minPrice: string;
}) {
  return (
    <div className="content-stretch flex flex-col h-[480px] items-center justify-between overflow-clip p-[24px] relative rounded-[24px] shrink-0 w-full">
      <img
        alt=""
        className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full"
        src={card.coverImageUrl}
      />
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full z-[1]">
        <div className="content-stretch flex gap-[4px] items-end not-italic relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
            {card.name}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[22px] relative shrink-0 text-[16px] text-[#101820] w-[46px]">
            series
          </p>
        </div>
        {card.sellingPoint && (
          <div className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-[279px]">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
              <div className="bg-[#ba0020] rounded-[27px] shrink-0 size-[8px]" />
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                {card.sellingPoint}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full z-[1]">
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap">
            {minPrice ? `From ${minPrice}` : "\u00A0"}
          </p>
          <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer hover:bg-[#a0001a] transition-colors">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white text-center whitespace-nowrap">
              Select
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Mobile Guide Card ========== */

function MobileGuideCard({ guide }: { guide: GuideItem }) {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col h-[374px] items-start overflow-clip relative rounded-[24px] shrink-0 w-[305px]">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[24px] relative shrink-0 w-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
          {guide.tag}
        </p>
        <div className="content-stretch flex items-end relative shrink-0 w-full">
          <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[34px] min-h-px min-w-px not-italic relative text-[24px] text-[rgba(0,0,0,0.9)]">
            {guide.title}
          </p>
        </div>
      </div>
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
        {guide.coverImageUrl && (
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={guide.coverImageUrl}
          />
        )}
      </div>
    </div>
  );
}

/* ========== Mobile Small Bulk Section ========== */

function MobileSmallBulkSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] w-full">
        <span className="leading-[36px] text-[#067ad9] text-[26px]">
          Small Bulk.
        </span>
        <span className="leading-[36px] text-[26px]">&nbsp;</span>
        <span className="leading-[36px] text-[26px] text-[rgba(0,0,0,0.4)]">
          Bulk Buying, Bigger Savings
        </span>
      </p>
      <div className="content-stretch flex flex-col h-[360px] items-start overflow-clip p-[24px] relative rounded-[24px] shrink-0 w-full">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[24px]"
        >
          <div className="absolute bg-[#f6f6f6] inset-0 rounded-[24px]" />
          <img
            alt=""
            className="absolute max-w-none object-cover rounded-[24px] size-full"
            src="/images/smallbulk-card-bg.jpg"
          />
        </div>
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full z-[1]">
          <div
            className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[rgba(255,255,255,0.9)] w-full"
            style={{ textShadow: "0px 0px 8px rgba(29,35,45,0.24)" }}
          >
            <div className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[32px] w-full">
              <p className="leading-[44px] mb-0">Bulk Buying.</p>
              <p className="leading-[44px]">Bigger Savings.</p>
            </div>
            <div className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px] w-full">
              <p className="leading-[22px] mb-0">
                Self-serve wholesale ordering with exclusive bulk
              </p>
              <p className="leading-[22px]">
                discounts and fast, streamlined checkout.
              </p>
            </div>
          </div>
          <div className="bg-[#067ad9] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer hover:bg-[#0568b8] transition-colors">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white text-center whitespace-nowrap">
              Learn More
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Mobile Tab Bar ========== */

type TabId = "models" | "guides" | "bulk";

function MobileTabBar({
  activeTab,
  onTabClick,
}: {
  activeTab: TabId;
  onTabClick: (tab: TabId) => void;
}) {
  return (
    <div className="content-stretch flex gap-[24px] h-[64px] items-center relative shrink-0 w-full">
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("models")}
      >
        <p
          className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
            activeTab === "models"
              ? "text-[rgba(0,0,0,0.9)]"
              : "text-[rgba(0,0,0,0.54)]"
          }`}
        >
          All Models
        </p>
        {activeTab === "models" && (
          <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("guides")}
      >
        <p
          className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
            activeTab === "guides"
              ? "text-[rgba(0,0,0,0.9)]"
              : "text-[rgba(0,0,0,0.54)]"
          }`}
        >
          Shopping guides
        </p>
        {activeTab === "guides" && (
          <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("bulk")}
      >
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[#067ad9] whitespace-nowrap">
          Small Bulk
        </p>
        {activeTab === "bulk" && (
          <div className="absolute bg-[#067ad9] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
    </div>
  );
}

/* ========== Pagination Dots ========== */

function PaginationDots({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  if (total <= 1) return null;
  return (
    <div className="content-stretch flex gap-[8px] items-center px-[24px] relative shrink-0 w-full">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-[8px] rounded-[42px] shrink-0 transition-all duration-300 ease-in-out"
          style={{
            width: i === activeIndex ? 32 : 8,
            backgroundColor: i === activeIndex ? "#022542" : "rgba(0,0,0,0.2)",
          }}
        />
      ))}
    </div>
  );
}

/* ========== Main Mobile Page Component ========== */

export default function SmokeAlarmsNewPageMobile() {
  const { products, loading: productsLoading } = useProducts();
  const { cards, loading: cardsLoading } = useProductCards();
  const { guides, loading: guidesLoading } = useGuides("smoke-alarms");

  const smokeProducts = products.filter(
    (p) => !p.categoryId || p.categoryId === "smoke-alarms"
  );

  const [activeTab, setActiveTab] = useState<TabId>("models");
  const [activeGuideIndex, setActiveGuideIndex] = useState(0);

  const modelsRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const bulkRef = useRef<HTMLDivElement>(null);
  const guidesScrollRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((tab: TabId) => {
    setActiveTab(tab);
    const refMap: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
      models: modelsRef,
      guides: guidesRef,
      bulk: bulkRef,
    };
    const el = refMap[tab]?.current;
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 100;
      const bulkTop = bulkRef.current?.getBoundingClientRect().top ?? Infinity;
      const guidesTop =
        guidesRef.current?.getBoundingClientRect().top ?? Infinity;
      if (bulkTop < offset) {
        setActiveTab("bulk");
      } else if (guidesTop < offset) {
        setActiveTab("guides");
      } else {
        setActiveTab("models");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const scrollEl = guidesScrollRef.current;
    if (!scrollEl) return;
    const handleGuideScroll = () => {
      const cardWidth = 305;
      const gap = 20;
      const scrollLeft = scrollEl.scrollLeft;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActiveGuideIndex(index);
    };
    scrollEl.addEventListener("scroll", handleGuideScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", handleGuideScroll);
  }, [guidesLoading]);

  const guideCount = guidesLoading ? 4 : guides.length;

  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full">
      <MobileNav />
      <div className="content-stretch flex flex-col gap-[24px] items-center overflow-clip pb-[20px] pt-[49px] px-[20px] relative shrink-0 w-full mt-[48px]">
        {/* Title */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] not-italic relative shrink-0 text-[32px] text-black w-full">
            Shop Smoke Alarm
          </p>
        </div>

        {/* Tab Bar */}
        <MobileTabBar activeTab={activeTab} onTabClick={handleTabClick} />

        {/* Sections Container */}
        <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full">
          {/* All Models Section */}
          <div
            ref={modelsRef}
            className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
          >
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] w-full">
              <span className="leading-[34px] text-[24px]">All models.</span>
              <span className="leading-[34px] text-[24px] text-[rgba(0,0,0,0.4)]">
                {" Take your pick."}
              </span>
            </p>
            <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
              {cardsLoading || productsLoading ? (
                <>
                  <MobileProductCardSkeleton />
                  <MobileProductCardSkeleton />
                  <MobileProductCardSkeleton />
                </>
              ) : cards.length > 0 ? (
                cards.map((card) => (
                  <MobileModelCard
                    key={card.id}
                    card={card}
                    minPrice={getMinPriceForCard(card, smokeProducts)}
                  />
                ))
              ) : (
                <p className="text-[rgba(0,0,0,0.4)] text-[16px] py-[40px]">
                  No product cards configured yet.
                </p>
              )}
            </div>
          </div>

          {/* Shopping Guides Section */}
          <div
            ref={guidesRef}
            className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
          >
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] w-full">
              <span className="leading-[34px] text-[24px]">
                Shopping guides.
              </span>
              <span className="leading-[34px] text-[24px] text-[rgba(0,0,0,0.4)]">
                {" Choose the Smoke Detector That Fits You Best"}
              </span>
            </p>
            <div
              ref={guidesScrollRef}
              className="flex gap-[20px] items-center overflow-x-auto relative shrink-0 w-full scrollbar-hide"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {guidesLoading ? (
                <>
                  <MobileGuideCardSkeleton />
                  <MobileGuideCardSkeleton />
                  <MobileGuideCardSkeleton />
                  <MobileGuideCardSkeleton />
                </>
              ) : guides.length > 0 ? (
                guides.map((guide) => (
                  <div key={guide.id} style={{ scrollSnapAlign: "start" }}>
                    <MobileGuideCard guide={guide} />
                  </div>
                ))
              ) : (
                <p className="text-[rgba(0,0,0,0.4)] text-[16px] py-[40px]">
                  No shopping guides available.
                </p>
              )}
            </div>
            <PaginationDots total={guideCount} activeIndex={activeGuideIndex} />
          </div>

          {/* Small Bulk Section */}
          <div ref={bulkRef} className="w-full">
            <MobileSmallBulkSection />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
