import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
} from "react";
import { gsap } from "gsap";
import { ShoppingCart, ChevronDown } from "lucide-react";
import {
  useProducts,
  useSpus,
  type Product as BackendProduct,
} from "./use-products";

export type CustomSystemSectionHandle = {
  resetAnimations: () => void;
  applyBannerFade: (progress: number) => void;
};

type CategoryId =
  | "base-station"
  | "smoke-alarm"
  | "co-alarm"
  | "combination-alarm"
  | "heat-alarm"
  | "water-leak-alarm"
  | "thermometer-hygrometer";

type ProductOption = {
  label: string;
  price: number;
  originalPrice?: number;
  isDiscounted?: boolean;
};

type Product = {
  id: string;
  name: string;
  image: string;
  features: string[];
  options: ProductOption[];
  badge?: string;
};

type Category = {
  id: CategoryId;
  title: string;
  description: string;
  products: Product[];
};

type CartItem = {
  categoryId: CategoryId;
  productId: string;
  optionIndex: number;
  quantity: number;
};

const CATEGORIES: Category[] = [
  {
    id: "base-station",
    title: "Base Station",
    description: "Required Base Device",
    products: [],
  },
  {
    id: "smoke-alarm",
    title: "Smoke Alarm",
    description: "Detects smoke to prevent fires.",
    products: [],
  },
  {
    id: "co-alarm",
    title: "CO Alarm",
    description: "Monitors CO to keep air safe.",
    products: [],
  },
  {
    id: "combination-alarm",
    title: "Combination Alarm",
    description: "Dual detection for smoke and CO",
    products: [],
  },
  {
    id: "heat-alarm",
    title: "Heat Alarm",
    description: "Detects heat to signal fire risks.",
    products: [],
  },
  {
    id: "water-leak-alarm",
    title: "Water Leak Alarm",
    description: "Detects leaks to prevent damage.",
    products: [],
  },
  {
    id: "thermometer-hygrometer",
    title: "Thermometer & Hygrometer",
    description: "Monitors climate for comfort.",
    products: [],
  },
];

const SERVICE_ITEMS = [
  { icon: "/images/icon_service_shipping.svg", text: "Free Shipping Over $49" },
  { icon: "/images/icon_service_warranty.svg", text: "Worry-Free Warranty" },
  { icon: "/images/icon_service_moneyback.svg", text: "30-DAY MONEY BACK GUARANTEE" },
  { icon: "/images/icon_service_customer.svg", text: "Lifetime Customer Support" },
];

const DISCOUNT_TIERS = [
  { threshold: 400, label: "$40 OFF" },
  { threshold: 500, label: "$120 OFF" },
];

const BASE_STATION_SKUS = ["SBS50", "SBS0A"];

const CATEGORY_BACKEND_MAP: Record<CategoryId, string[]> = {
  "base-station": ["accessories"],
  "smoke-alarm": ["smoke-alarms"],
  "co-alarm": ["co-alarms"],
  "combination-alarm": ["combination-alarms"],
  "heat-alarm": ["heat-alarms", "home-alarms"],
  "water-leak-alarm": ["water-leak-alarms", "home-alarms"],
  "thermometer-hygrometer": ["thermometer-hygrometer", "accessories"],
};

function backendToLocalProduct(bp: BackendProduct, overrideImageUrl?: string): Product {
  return {
    id: bp.id,
    name: bp.name,
    image: overrideImageUrl ?? bp.imageUrlV2,
    features: (bp.features || []).slice(0, 2),
    options: (bp.options || []).map((opt) => {
      const price = parseFloat(opt.price) || 0;
      const hasDiscount = opt.discountEnabled && !!opt.discountPercent;
      const pct = parseInt(opt.discountPercent, 10) || 0;
      return {
        label: opt.name,
        price: hasDiscount ? parseFloat((price * (1 - pct / 100)).toFixed(2)) : price,
        originalPrice: hasDiscount ? price : undefined,
        isDiscounted: hasDiscount || undefined,
      };
    }),
    badge: (() => {
      const d = bp.options?.find((o) => o.discountEnabled && o.discountPercent);
      return d ? `${d.discountPercent}%OFF` : undefined;
    })(),
  };
}

function ProductCard({
  product,
  selectedOption,
  onOptionChange,
  isInCart,
  onToggleCart,
}: {
  product: Product;
  selectedOption: number;
  onOptionChange: (index: number) => void;
  isInCart: boolean;
  onToggleCart: () => void;
}) {
  const option = product.options[selectedOption];
  const displayPrice = option?.price ?? 0;
  const originalPrice = option?.originalPrice;

  return (
    <div className="w-[319px] shrink-0 rounded-[16px] bg-white pb-[12px]">
      {/* Image area */}
      <div className="relative mx-[12px] mt-[12px] h-[295px] w-[295px] flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="h-[200px] w-[200px] bg-[#d9d9d9] rounded-[8px]" />
        )}
        {/* Discount badge at top-left of image */}
        {product.badge && (
          <div className="absolute left-0 top-0 inline-flex rounded-br-[8px] border border-[#ba0020] bg-white px-[4px] py-[2px]">
            <span className="font-['Inter',sans-serif] text-[12px] font-bold leading-[16px] text-[#ba0020]">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="mx-[12px] mt-[8px]">
        <p
          className="font-['Inter',sans-serif] text-[18px] font-bold leading-[24px] text-[rgba(0,0,0,0.9)] h-[48px] overflow-hidden"
          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
        >
          {product.name}
        </p>
        <div className="mt-[8px] flex flex-col gap-[8px]">
          {product.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-[4px]">
              <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-[rgba(0,0,0,0.4)]" />
              <span className="font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-[rgba(0,0,0,0.6)]">
                {feature}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-[8px] h-[40px] rounded-[10px] border border-[rgba(0,0,0,0.12)] flex items-center px-[12px]">
          <select
            value={selectedOption}
            onChange={(e) => onOptionChange(Number(e.target.value))}
            className="w-full appearance-none bg-transparent font-['Inter',sans-serif] text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.54)] outline-none cursor-pointer pr-[24px]"
          >
            {product.options.map((opt, i) => (
              <option key={i} value={i}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-[12px] h-[16px] w-[16px] text-[rgba(0,0,0,0.4)] pointer-events-none" />
        </div>
      </div>

      {/* Price + action */}
      <div className="mx-[12px] mt-[8px] flex items-center justify-between">
        <div className="flex items-baseline gap-[4px]">
          <span className={`font-['Inter',sans-serif] text-[24px] font-bold leading-[34px] ${originalPrice ? "text-[#ba0020]" : "text-[rgba(0,0,0,0.9)]"}`}>
            ${displayPrice.toFixed(2)}
          </span>
          {originalPrice != null && (
            <span className="font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-[rgba(0,0,0,0.4)] line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleCart}
          className="flex h-[40px] w-[40px] items-center justify-center shrink-0"
        >
          {isInCart ? (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="rgba(0,0,0,0.9)" strokeWidth="2" />
              <path d="M12 20H28" stroke="rgba(0,0,0,0.9)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <img src="/images/icon_add.svg" alt="Add" className="h-[40px] w-[40px]" />
          )}
        </button>
      </div>
    </div>
  );
}

function CategoryAccordion({
  category,
  isExpanded,
  onToggle,
  cartItems,
  onToggleProduct,
  selectedOptions,
  onOptionChange,
  backendProducts,
}: {
  category: Category;
  isExpanded: boolean;
  onToggle: () => void;
  cartItems: CartItem[];
  onToggleProduct: (productId: string, optionIndex: number) => void;
  selectedOptions: Record<string, number>;
  onOptionChange: (productId: string, index: number) => void;
  backendProducts: Product[];
}) {
  const hasProducts = backendProducts.length > 0;
  const isActive = isExpanded && hasProducts;

  return (
    <div>
      {/* Header — border-transparent when collapsed keeps layout stable */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between rounded-[16px] bg-white px-[16px] py-[14px] border-[2px] transition-colors duration-300 ease-in-out ${
          isActive ? "border-[#BA0020]" : "border-transparent"
        }`}
      >
        <div className="flex flex-col items-start gap-[2px]">
          <span className="font-['Inter',sans-serif] text-[18px] font-bold leading-[24px] text-[rgba(0,0,0,0.9)]">
            {category.title}
          </span>
          <span className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.4)]">
            {category.description}
          </span>
        </div>
        <img
          src="/images/icon_more.svg"
          alt={isActive ? "Collapse" : "Expand"}
          className={`h-[24px] w-[24px] shrink-0 transition-transform duration-300 ease-in-out ${
            isActive ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>

      {/* Expandable product cards with CSS grid height animation */}
      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-in-out"
        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-[16px] flex gap-[12px]">
            {backendProducts.map((product) => {
              const isInCart = cartItems.some(
                (item) =>
                  item.categoryId === category.id &&
                  item.productId === product.id
              );
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectedOption={selectedOptions[product.id] ?? 0}
                  onOptionChange={(i) => onOptionChange(product.id, i)}
                  isInCart={isInCart}
                  onToggleCart={() =>
                    onToggleProduct(
                      product.id,
                      selectedOptions[product.id] ?? 0
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscountProgressBar({ currentTotal }: { currentTotal: number }) {
  const maxThreshold = DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1].threshold;
  const progress = Math.min(currentTotal / maxThreshold, 1);
  const nearestTier = DISCOUNT_TIERS.find((t) => currentTotal < t.threshold);
  const amountAway = nearestTier
    ? (nearestTier.threshold - currentTotal).toFixed(2)
    : "0";
  const MIN_ANCHOR_PERCENT = 8;
  const MAX_ANCHOR_PERCENT = 92;
  const tierAnchors = DISCOUNT_TIERS.map((tier, i) => {
    const thresholdPercent = (tier.threshold / maxThreshold) * 100;
    const nextThresholdPercent =
      i < DISCOUNT_TIERS.length - 1
        ? (DISCOUNT_TIERS[i + 1].threshold / maxThreshold) * 100
        : null;
    const shouldShiftLeft =
      nextThresholdPercent !== null &&
      nextThresholdPercent - thresholdPercent <= 22;
    const adjustedPercent = shouldShiftLeft ? thresholdPercent - 8 : thresholdPercent;
    const anchorPercent = Math.max(
      MIN_ANCHOR_PERCENT,
      Math.min(MAX_ANCHOR_PERCENT, adjustedPercent)
    );
    return {
      ...tier,
      reached: currentTotal >= tier.threshold,
      anchorPercent,
    };
  });

  return (
    <div className="rounded-[12px] bg-[#f5f5f5] p-[8px]">
      <div className="flex items-center gap-[4px]">
        <img src="/images/icon_system_discount.svg" alt="" className="h-[24px] w-[24px]" />
        <span className="font-['Inter',sans-serif] text-[16px] font-normal leading-[22px] text-[rgba(0,0,0,0.9)]">
          You're <span className="font-bold text-[#ba0020]">${amountAway}</span> away from{" "}
          <span className="font-bold text-[#ba0020]">$50</span> off!
        </span>
      </div>
      <div className="relative mt-[8px] px-[8px]">
        {/* Tier labels with downward triangle pointers */}
        <div className="relative h-[34px]">
          {tierAnchors.map((tier, i) => {
            const pillBg = tier.reached ? "#ba0020" : "#b3b3b3";
            return (
              <div
                key={i}
                className="absolute top-0"
                style={{ left: `${tier.anchorPercent}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className="relative inline-flex w-max items-center justify-center rounded-[10px] px-[10px] py-[4px]"
                  style={{ backgroundColor: pillBg }}
                >
                  <span className="whitespace-nowrap font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-white">
                    {tier.label}
                  </span>
                  <span
                    className="absolute left-1/2 top-full -translate-x-1/2 border-l-[7px] border-r-[7px] border-t-[9px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: pillBg }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative mt-[6px] h-[6px] w-full rounded-full bg-[rgba(0,0,0,0.12)]">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#ba0020] transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />

          {/* Current progress node - strictly centered with bar */}
          <div
            className="absolute h-[12px] w-[12px] rounded-full bg-[#ba0020] transition-all duration-300"
            style={{ left: `${progress * 100}%`, top: "50%", transform: "translate(-50%, -50%)" }}
          />

          {/* Tier nodes - strictly centered with bar */}
          {tierAnchors.map((tier, i) => (
            <div
              key={i}
              className="absolute h-[12px] w-[12px] rounded-full border-[1px] transition-colors duration-300"
              style={{
                left: `${tier.anchorPercent}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                borderColor: "rgba(0,0,0,0.32)",
                backgroundColor: "white",
              }}
            />
          ))}
        </div>

        <div className="relative mt-[6px] h-[16px]">
          <span className="absolute left-0 top-0 font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-[rgba(0,0,0,0.9)]">
            $0
          </span>
          {tierAnchors.map((tier, i) => (
            <span
              key={i}
              className="absolute top-0 -translate-x-1/2 font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-[rgba(0,0,0,0.9)]"
              style={{ left: `${tier.anchorPercent}%` }}
            >
              ${tier.threshold}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  image,
  name,
  pack,
  price,
  onRemove,
}: {
  image: string;
  name: string;
  pack: string;
  price: number;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-[12px]">
      <div className="h-[48px] w-[48px] shrink-0 rounded-[8px] bg-[#f5f5f5] flex items-center justify-center">
        <img src={image} alt="" className="h-[36px] w-[36px] object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-[24px] text-[rgba(0,0,0,0.9)] truncate">
          {name}
        </p>
      </div>
      <span className="shrink-0 font-['Inter',sans-serif] text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.6)]">
        {pack}
      </span>
      <span className="shrink-0 font-['Inter',sans-serif] text-[16px] font-bold leading-[24px] text-[rgba(0,0,0,0.9)]">
        ${price.toFixed(2)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-[24px] w-[24px] shrink-0 items-center justify-center"
      >
        <img src="/images/icon_remove.png" alt="Remove" className="h-[24px] w-[24px]" />
      </button>
    </div>
  );
}

function CustomSystemSection(_props: object, ref: ForwardedRef<CustomSystemSectionHandle>) {
    const bannerTitleRef = useRef<HTMLHeadingElement>(null);
    const bannerDescRef = useRef<HTMLParagraphElement>(null);
    const bannerGradientRef = useRef<HTMLDivElement>(null);

    const resetBannerFade = useCallback(() => {
      [bannerTitleRef, bannerDescRef].forEach((itemRef) => {
        if (itemRef.current) gsap.set(itemRef.current, { opacity: 0, y: 32 });
      });
      if (bannerGradientRef.current) {
        gsap.set(bannerGradientRef.current, { opacity: 0, clearProps: "transform" });
      }
    }, []);

    const applyBannerFade = useCallback((progress: number) => {
      const t = Math.max(0, Math.min(1, progress));
      [bannerTitleRef, bannerDescRef].forEach((itemRef) => {
        if (itemRef.current) gsap.set(itemRef.current, { opacity: t, y: (1 - t) * 32 });
      });
      if (bannerGradientRef.current) {
        gsap.set(bannerGradientRef.current, { opacity: t });
      }
    }, []);

    useImperativeHandle(ref, () => ({
      resetAnimations: resetBannerFade,
      applyBannerFade,
    }));

    const [expandedCategory, setExpandedCategory] = useState<CategoryId>("smoke-alarm");
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

    const { products: allBackendProducts } = useProducts();
    const { spus } = useSpus();

    const spuById = useMemo(
      () => new Map(spus.map((s) => [s.id, s])),
      [spus]
    );

    const ALARM_CATEGORIES = new Set<CategoryId>(["smoke-alarm", "co-alarm", "combination-alarm"]);
    const BASE_STATION_CONNECTIVITY = "Base Station Interconnected (App)";

    const categoryProductsMap = useMemo(() => {
      const map: Record<string, Product[]> = {};
      for (const cat of CATEGORIES) {
        const backendCatIds = CATEGORY_BACKEND_MAP[cat.id] || [];
        let filtered = allBackendProducts.filter(
          (bp) => backendCatIds.includes(bp.categoryId || "smoke-alarms")
        );
        if (cat.id === "base-station") {
          filtered = filtered.filter((bp) =>
            BASE_STATION_SKUS.some((sku) => bp.name?.includes(sku))
          );
        } else if (ALARM_CATEGORIES.has(cat.id)) {
          filtered = filtered.filter((bp) =>
            bp.connectivity?.includes(BASE_STATION_CONNECTIVITY)
          );
        }
        const capped = ALARM_CATEGORIES.has(cat.id) ? filtered : filtered.slice(0, 3);
        const matching = capped.map((bp) => {
          const spuImageUrl = ALARM_CATEGORIES.has(cat.id)
            ? (bp.spuId ? spuById.get(bp.spuId)?.imageUrl : undefined)
            : undefined;
          return backendToLocalProduct(bp, spuImageUrl);
        });
        map[cat.id] = matching;
      }
      return map;
    }, [allBackendProducts, spuById]);

    const handleToggleCategory = useCallback((id: CategoryId) => {
      setExpandedCategory((prev) => (prev === id ? (null as unknown as CategoryId) : id));
    }, []);

    const handleToggleProduct = useCallback(
      (categoryId: CategoryId, productId: string, optionIndex: number) => {
        setCartItems((prev) => {
          const existing = prev.findIndex(
            (item) => item.categoryId === categoryId && item.productId === productId
          );
          if (existing >= 0) {
            return prev.filter((_, i) => i !== existing);
          }
          return [...prev, { categoryId, productId, optionIndex, quantity: 1 }];
        });
      },
      []
    );

    const handleOptionChange = useCallback((productId: string, index: number) => {
      setSelectedOptions((prev) => ({ ...prev, [productId]: index }));
    }, []);

    const handleRemoveItem = useCallback((index: number) => {
      setCartItems((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const totalPrice = cartItems.reduce((sum) => sum + 29.99, 0);

    const summaryItems = [
      {
        image: "/images/build_system_main_image_station.png",
        name: "SBS50 Base Station",
        pack: "1-Pack",
        price: 29.99,
        category: "Required Base Device",
      },
      {
        image: "/images/build_system_support_06.png",
        name: "SD19-W Wireless Interconnected...",
        pack: "1-Pack",
        price: 29.99,
        category: "Smoke Alarm",
      },
      {
        image: "/images/build_system_support_06.png",
        name: "SD19-W Wireless Interconnected...",
        pack: "1-Pack",
        price: 29.99,
        category: "Smoke Alarm",
      },
      {
        image: "/images/build_system_support_05.png",
        name: "SD19-W Wireless Interconnected...",
        pack: "1-Pack",
        price: 29.99,
        category: "CO Alarm",
      },
    ];

    const groupedItems: Record<string, typeof summaryItems> = {};
    summaryItems.forEach((item) => {
      if (!groupedItems[item.category]) groupedItems[item.category] = [];
      groupedItems[item.category].push(item);
    });

    return (
      <div className="w-full bg-[#F6F6F6]">
        {/* Banner Section */}
        <div className="relative w-full h-[480px]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="/images/customize_system_bg.jpg"
              alt="Customize system background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2
              ref={bannerTitleRef}
              className="font-['Inter',sans-serif] text-[40px] font-bold leading-[48px] text-white text-center opacity-0"
            >
              Want to learn more about bundles?
            </h2>
            <p
              ref={bannerDescRef}
              className="mt-[12px] font-['Inter',sans-serif] text-[16px] font-normal leading-[24px] text-[rgba(255,255,255,0.8)] text-center opacity-0"
            >
              Try building your own and save even more
            </p>
          </div>
          <div
            ref={bannerGradientRef}
            className="absolute bottom-0 left-0 right-0 h-[50%] translate-y-[2px] bg-gradient-to-t from-[#F6F6F6] to-transparent opacity-0"
          />
        </div>

        {/* Customize Your Safety System Content */}
        <div className="mx-auto w-full max-w-[1440px] px-0 pb-[80px]">
          <h2
            className="font-['Inter',sans-serif] text-[32px] font-bold leading-[44px] text-[rgba(0,0,0,0.9)]"
          >
            Customize Your Safety System
          </h2>

          <div className="mt-[24px] flex gap-[32px]">
            {/* Left Panel — Category List */}
            <div className="w-[981px] shrink-0 flex flex-col gap-[24px]">
              {CATEGORIES.map((category) => (
                <CategoryAccordion
                  key={category.id}
                  category={category}
                  isExpanded={expandedCategory === category.id}
                  onToggle={() => handleToggleCategory(category.id)}
                  cartItems={cartItems}
                  onToggleProduct={(productId, optionIndex) =>
                    handleToggleProduct(category.id, productId, optionIndex)
                  }
                  selectedOptions={selectedOptions}
                  onOptionChange={handleOptionChange}
                  backendProducts={categoryProductsMap[category.id] || []}
                />
              ))}
            </div>

            {/* Right Panel — Selection Summary */}
            <div className="w-[427px] shrink-0">
              <div className="rounded-[24px] bg-white p-[16px]">
                <h3 className="font-['Inter',sans-serif] text-[24px] font-bold leading-[34px] text-[rgba(0,0,0,0.9)]">
                  Selection Summary
                </h3>

                <div className="mt-[16px]">
                  <DiscountProgressBar currentTotal={totalPrice} />
                </div>

                <div className="mt-[24px]">
                  {Object.entries(groupedItems).map(([category, items], groupIdx) => (
                    <div key={category}>
                      <p className="font-['Inter',sans-serif] text-[14px] font-bold leading-[20px] text-[rgba(0,0,0,0.9)]">
                        {category}
                      </p>
                      <div className="mt-[12px] flex flex-col gap-[24px]">
                        {items.map((item, i) => (
                          <SummaryItem
                            key={`${category}-${i}`}
                            image={item.image}
                            name={item.name}
                            pack={item.pack}
                            price={item.price}
                            onRemove={() => handleRemoveItem(groupIdx + i)}
                          />
                        ))}
                      </div>
                      {groupIdx < Object.keys(groupedItems).length - 1 && (
                        <div className="my-[24px] h-px w-full bg-[rgba(0,0,0,0.08)]" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-[24px] h-px w-full bg-[rgba(0,0,0,0.08)]" />

                <div className="mt-[24px] flex items-center justify-between">
                  <span className="font-['Inter',sans-serif] text-[16px] font-bold leading-[24px] text-[rgba(0,0,0,0.9)]">
                    Total
                  </span>
                  <span className="font-['Inter',sans-serif] text-[28px] font-bold leading-[36px] text-[rgba(0,0,0,0.9)]">
                    ${(469.99).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  className="mt-[24px] flex h-[40px] w-full items-center justify-center gap-[8px] rounded-full bg-[#ba0020]"
                >
                  <ShoppingCart className="h-[20px] w-[20px] text-white" strokeWidth={1.5} />
                  <span className="font-['Inter',sans-serif] text-[14px] font-bold leading-[20px] text-white">
                    Add Cart
                  </span>
                </button>
              </div>

              {/* Service Section */}
              <div className="mt-[16px]">
                <h4 className="px-[16px] font-['Inter',sans-serif] text-[20px] font-bold leading-[24px] text-[rgba(0,0,0,0.9)]">
                  Service
                </h4>
                <div className="mt-[12px] flex flex-col">
                  {SERVICE_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-[8px] px-[16px] py-[12px]">
                      <img src={item.icon} alt="" className="h-[20px] w-[20px] shrink-0" />
                      <span className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.9)]">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default forwardRef(CustomSystemSection);
