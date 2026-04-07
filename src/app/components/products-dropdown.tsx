import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useSpus,
  useProducts,
  useCategories,
  type Spu,
  type Product,
} from "./use-products";

const CONNECTIVITY_ORDER = [
  "Base Station Interconnected (App)",
  "Wireless Interconnected",
  "Wi-Fi (App)",
  "Standalone",
];

const SENSOR_TYPE_ORDER = [
  "Water Leak",
  "Heat Alarm",
  "Thermometer & Hygrometer",
];

const SENSOR_TYPE_CATEGORY = "home-alarms";

interface DropdownCard {
  id: string;
  name: string;
  imageUrl: string;
  feature?: string;
  isHot: boolean;
}

interface GroupedSection {
  title: string;
  cards: DropdownCard[];
}

function buildDropdownCards(
  spus: Spu[],
  products: Product[],
  categoryId: string
): GroupedSection[] {
  const order =
    categoryId === SENSOR_TYPE_CATEGORY ? SENSOR_TYPE_ORDER : CONNECTIVITY_ORDER;

  const catSpus = spus.filter(
    (s) => (s.categoryId || "smoke-alarms") === categoryId
  );

  const productBySpuId = new Map<string, Product>();
  for (const p of products) {
    if (p.spuId) productBySpuId.set(p.spuId, p);
  }

  const groups: Record<string, DropdownCard[]> = {};
  for (const spu of catSpus) {
    const conn = spu.connectivity;
    if (!conn) continue;
    if (!groups[conn]) groups[conn] = [];
    const linked = productBySpuId.get(spu.id);
    groups[conn].push({
      id: spu.id,
      name: spu.name,
      imageUrl: spu.imageUrl,
      feature: spu.powerSource || undefined,
      isHot: linked?.isHot ?? false,
    });
  }

  return order
    .filter((key) => groups[key]?.length)
    .map((key) => ({ title: key, cards: groups[key] }));
}

function InfoIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <svg className="size-full" viewBox="0 0 16 16" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 14.4C11.5346 14.4 14.4 11.5346 14.4 8C14.4 4.46538 11.5346 1.6 8 1.6C4.46538 1.6 1.6 4.46538 1.6 8C1.6 11.5346 4.46538 14.4 8 14.4ZM8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 4.5C9 5.05228 8.55229 5.5 8 5.5C7.44772 5.5 7 5.05228 7 4.5C7 3.94772 7.44772 3.5 8 3.5C8.55229 3.5 9 3.94772 9 4.5ZM7.25 7C7.25 6.58579 7.58579 6.25 8 6.25C8.41421 6.25 8.75 6.58579 8.75 7V12C8.75 12.4142 8.41421 12.75 8 12.75C7.58579 12.75 7.25 12.4142 7.25 12V7Z"
          fill="rgba(0,0,0,0.54)"
        />
      </svg>
    </div>
  );
}

function ProductImage({ src }: { src?: string }) {
  if (!src) {
    return (
      <div className="bg-[#f0f0f0] rounded-[12px] shrink-0 size-[92px] animate-pulse" />
    );
  }
  return (
    <img
      src={src}
      alt=""
      className="shrink-0 size-[92px] object-contain"
      loading="lazy"
    />
  );
}

function CardItem({ card }: { card: DropdownCard }) {
  return (
    <div className="border border-[#f6f6f6] border-solid content-stretch flex h-[116px] items-start overflow-clip relative rounded-[16px] shrink-0 w-[349px] cursor-pointer hover:border-[#e0e0e0] transition-colors duration-200">
      <div className="bg-white content-stretch flex items-center justify-center relative rounded-bl-[12px] rounded-tl-[12px] shrink-0 size-[116px]">
        <ProductImage src={card.imageUrl} />
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px px-[12px] py-[12px] relative justify-center gap-[4px]">
        {card.isHot && (
          <p className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[14px] text-[#ba0020] whitespace-nowrap">
            Hot
          </p>
        )}
        <p className="font-['Inter',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">
          {card.name}
        </p>
        {card.feature && (
          <div className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
              <div className="bg-[#ba0020] rounded-full shrink-0 size-[8px] mt-[4px]" />
              <p className="flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[16px] text-[12px] text-[rgba(0,0,0,0.54)]">
                {card.feature}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  animDelay,
}: {
  section: GroupedSection;
  animDelay: number;
}) {
  return (
    <div
      className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full opacity-0 translate-y-[8px] animate-[fadeSlideIn_0.35s_ease-out_forwards]"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
        <p className="font-['Inter',sans-serif] font-medium leading-[20px] text-[14px] text-[rgba(0,0,0,0.54)] whitespace-nowrap">
          {section.title}
        </p>
        <InfoIcon />
      </div>
      <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
        {section.cards.slice(0, 3).map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
        {section.cards.length < 3 && (
          <div className="flex-[1_0_0] h-[116px] min-h-px min-w-px rounded-[12px]" />
        )}
      </div>
    </div>
  );
}

interface ProductsDropdownProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ProductsDropdown({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: ProductsDropdownProps) {
  const { spus } = useSpus();
  const { products } = useProducts();
  const { categories } = useCategories();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const firstCategoryId = categories[0]?.id ?? null;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setActiveCategoryId(null);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const currentCategoryId = activeCategoryId ?? firstCategoryId;

  const activeCategory = useMemo(
    () => categories.find((c) => c.id === currentCategoryId),
    [categories, currentCategoryId]
  );

  const sections = useMemo(() => {
    if (!activeCategory) return [];
    return buildDropdownCards(spus, products, activeCategory.id);
  }, [spus, products, activeCategory]);

  const handleCategoryHover = useCallback((catId: string) => {
    setActiveCategoryId(catId);
    setContentKey((k) => k + 1);
  }, []);

  const shopAllLabel = activeCategory
    ? `Shop All ${activeCategory.name}`
    : "";

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 top-[104px] z-40 transition-opacity duration-[350ms] ease-out"
        style={{
          backgroundColor: "rgba(221,221,221,0.2)",
          backdropFilter: "blur(8.1px)",
          WebkitBackdropFilter: "blur(8.1px)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
        }}
        onMouseEnter={onMouseLeave}
      />

      {/* Dropdown panel */}
      <div
        className="fixed left-0 right-0 top-[104px] z-50 overflow-hidden transition-all duration-[350ms] ease-out"
        style={{
          maxHeight: visible ? "900px" : "0px",
          opacity: visible ? 1 : 0,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className="bg-white content-stretch flex flex-col items-center overflow-hidden relative w-full"
          style={{ padding: "16px clamp(24px, 8vw, 120px) 32px" }}
        >
          <div className="content-stretch flex gap-[24px] items-start max-w-[1312px] relative w-full">
            {/* Left category sidebar */}
            <div
              className="content-stretch flex flex-col items-start relative shrink-0 w-[208px] opacity-0 translate-y-[8px] animate-[fadeSlideIn_0.35s_ease-out_forwards]"
              style={{ animationDelay: "50ms" }}
            >
              {categories.map((cat) => {
                const isActive = cat.id === currentCategoryId;
                return (
                  <div
                    key={cat.id}
                    className={`content-stretch flex items-center justify-center px-[12px] py-[20px] relative shrink-0 w-full cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-[rgba(0,0,0,0.05)] rounded-[16px]"
                        : "rounded-[4px] hover:bg-[rgba(0,0,0,0.02)]"
                    }`}
                    onMouseEnter={() => handleCategoryHover(cat.id)}
                  >
                    <p
                      className={`flex-[1_0_0] font-['Inter',sans-serif] font-medium leading-[20px] text-[14px] ${
                        isActive ? "text-[#ba0020]" : "text-[rgba(0,0,0,0.9)]"
                      }`}
                    >
                      {cat.name}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right content area */}
            <div
              ref={contentRef}
              key={contentKey}
              className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px relative"
            >
              {sections.map((section, idx) => (
                <SectionBlock
                  key={`${currentCategoryId}-${section.title}`}
                  section={section}
                  animDelay={80 + idx * 60}
                />
              ))}

              {sections.length === 0 && spus.length > 0 && (
                <div
                  className="flex items-center justify-center h-[116px] w-full text-[rgba(0,0,0,0.3)] text-[14px] font-['Inter',sans-serif] opacity-0 translate-y-[8px] animate-[fadeSlideIn_0.35s_ease-out_forwards]"
                  style={{ animationDelay: "80ms" }}
                >
                  No products in this category yet
                </div>
              )}

              {sections.length > 0 && (
                <div
                  className="btn-outline-dark border-2 border-[#101820] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 cursor-pointer opacity-0 translate-y-[8px] animate-[fadeSlideIn_0.35s_ease-out_forwards]"
                  style={{
                    animationDelay: `${80 + sections.length * 60}ms`,
                  }}
                >
                  <p className="font-['Inter',sans-serif] font-semibold leading-[20px] text-[14px] text-[#101820] text-center whitespace-nowrap">
                    {shopAllLabel}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
