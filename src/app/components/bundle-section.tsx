import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { gsap } from "gsap";
import { ShoppingCart } from "lucide-react";

type BundleTabId = "essential" | "dual" | "whole-home";

type BundleFeatureId = "smoke" | "co" | "fire" | "water" | "heat";

type IncludedProduct = {
  name: string;
  model: string;
  pack: string;
  image: string;
};

type DisplayListItem = IncludedProduct & {
  rowKey: string;
  incoming?: IncludedProduct;
};

type BundleTab = {
  id: BundleTabId;
  label: string;
  floorPlan: string;
  activeFeatures: BundleFeatureId[];
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  included: IncludedProduct[];
};

const BUNDLE_FEATURES: { id: BundleFeatureId; label: string }[] = [
  { id: "smoke", label: "Smoke Protect" },
  { id: "co", label: "CO Protect" },
  { id: "fire", label: "Fire Protect" },
  { id: "water", label: "Water Leak Protect" },
  { id: "heat", label: "Thermometer Hygrometer Protect" },
];

const FEATURE_ICON_CHOICE = "/images/icon_bundle_feature_choice.svg";
const FEATURE_ICON_NORMAL = "/images/icon_bundle_feature_normal.svg";

const BUNDLE_TABS: BundleTab[] = [
  {
    id: "essential",
    label: "Essential Starter Bundle",
    floorPlan: "/images/bg_bundle_essential.jpg",
    activeFeatures: ["smoke", "co", "fire"],
    title: "Essential Starter",
    description: "Perfect for small homes, providing basic fire and CO protection.",
    price: 169.99,
    originalPrice: 215.99,
    included: [
      {
        name: "Required Base Station",
        model: "SBS50",
        pack: "1-Pack",
        image: "/images/build_system_main_image_station.png",
      },
      {
        name: "Smoke Alarm",
        model: "XS01-M-R",
        pack: "1-Pack",
        image: "/images/build_system_support_06.png",
      },
      {
        name: "CO Alarm",
        model: "XC01-M",
        pack: "1-Pack",
        image: "/images/build_system_support_05.png",
      },
    ],
  },
  {
    id: "dual",
    label: "Dual Hazard Protection",
    floorPlan: "/images/bg_bundle_dual.jpg",
    activeFeatures: ["smoke", "co", "fire", "water"],
    title: "Dual Hazard Protection",
    description: "Specialized for fire and water risk zones with dual protection.",
    price: 379.99,
    originalPrice: 515.99,
    included: [
      {
        name: "Required Base Station",
        model: "SBS50",
        pack: "1-Pack",
        image: "/images/build_system_main_image_station.png",
      },
      {
        name: "Combination Alarms",
        model: "SC07-MR",
        pack: "1-Pack",
        image: "/images/build_system_support_07.png",
      },
      {
        name: "Heat Alarms",
        model: "XH02-M",
        pack: "1-Pack",
        image: "/images/build_system_support_08.png",
      },
      {
        name: "Water Leak Alarm",
        model: "SWS0A",
        pack: "1-Pack",
        image: "/images/build_system_support_04.png",
      },
    ],
  },
  {
    id: "whole-home",
    label: "Whole-Home Protection",
    floorPlan: "/images/bg_bundle_whole.jpg",
    activeFeatures: ["smoke", "co", "fire", "water", "heat"],
    title: "Whole-Home Protection",
    description: "Complete multi-zone protection for total home safety, ideal for family homes.",
    price: 723.99,
    originalPrice: 815.99,
    included: [
      {
        name: "Required Base Station",
        model: "SBS50",
        pack: "1-Pack",
        image: "/images/build_system_main_image_station.png",
      },
      {
        name: "Smoke Alarm",
        model: "XS0B-MR",
        pack: "1-Pack",
        image: "/images/build_system_support_02.png",
      },
      {
        name: "Combination Alarms",
        model: "SC07-MR",
        pack: "1-Pack",
        image: "/images/build_system_support_07.png",
      },
      {
        name: "Heat Alarms",
        model: "XH02-M",
        pack: "1-Pack",
        image: "/images/build_system_support_08.png",
      },
      {
        name: "Water Leak Alarm",
        model: "SWS0A",
        pack: "1-Pack",
        image: "/images/build_system_support_04.png",
      },
      {
        name: "Thermometer Hygrometer",
        model: "STH0A",
        pack: "1-Pack",
        image: "/images/build_system_support_09.png",
      },
    ],
  },
];

const PAGE_HORIZONTAL_PADDING = "clamp(24px, 8vw, 120px)";
const TAB_SWITCH_DURATION = 0.35;
const FLOOR_PLAN_FADE_DURATION = 0.4;
const FEATURE_LIGHT_UP_DURATION = 0.38;
const PRICE_COUNT_DURATION = 0.55;
const LIST_ITEM_DURATION = 0.32;
const LIST_ITEM_GAP = 16; // Figma: 52px row + 16px gap
const ROW_CONTENT_FADE_DURATION = 0.24;
const ROW_STAGGER = 0.06;

function toDisplayList(products: IncludedProduct[]): DisplayListItem[] {
  return products.map((product, index) => ({ ...product, rowKey: `row-${index}` }));
}

function productsEqual(a: IncludedProduct, b: IncludedProduct) {
  return (
    a.model === b.model &&
    a.name === b.name &&
    a.image === b.image &&
    a.pack === b.pack
  );
}

function buildTransitionList(from: IncludedProduct[], to: IncludedProduct[]): DisplayListItem[] {
  const fromLen = from.length;
  const toLen = to.length;
  const rows: DisplayListItem[] = [];

  for (let i = 0; i < Math.max(fromLen, toLen); i += 1) {
    const rowKey = `row-${i}`;
    if (i < fromLen && i < toLen) {
      rows.push({
        ...from[i],
        rowKey,
        incoming: productsEqual(from[i], to[i]) ? undefined : to[i],
      });
    } else if (i < fromLen) {
      rows.push({ ...from[i], rowKey });
    } else {
      rows.push({ ...to[i], rowKey });
    }
  }

  return rows;
}

function resetListRowStyles(
  wrappers: Iterable<HTMLDivElement>,
  fronts: Iterable<HTMLDivElement>,
  backs: Iterable<HTMLDivElement>,
  imageBacks: Iterable<HTMLImageElement>,
) {
  wrappers.forEach((el) => {
    gsap.set(el, { height: "auto", clearProps: "height,marginBottom,overflow" });
  });
  fronts.forEach((el) => {
    gsap.set(el, { opacity: 1, clearProps: "opacity" });
  });
  backs.forEach((el) => {
    gsap.set(el, { opacity: 0, clearProps: "opacity" });
  });
  imageBacks.forEach((el) => {
    gsap.set(el, { opacity: 0, clearProps: "opacity" });
  });
}

function AnimatedFeatureItem({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) {
  const iconWrapRef = useRef<HTMLDivElement>(null);
  const choiceRef = useRef<HTMLImageElement>(null);
  const normalRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const choiceEl = choiceRef.current;
    const normalEl = normalRef.current;
    const textEl = textRef.current;
    const iconWrap = iconWrapRef.current;
    if (!choiceEl || !normalEl || !textEl || !iconWrap) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      gsap.set(choiceEl, { opacity: isActive ? 1 : 0 });
      gsap.set(normalEl, { opacity: isActive ? 0 : 1 });
      gsap.set(iconWrap, { scale: 1 });
      gsap.set(textEl, { color: isActive ? "#067AD9" : "rgba(0,0,0,0.2)" });
      return;
    }

    gsap.killTweensOf([choiceEl, normalEl, textEl, iconWrap]);

    if (isActive) {
      gsap.to(normalEl, { opacity: 0, duration: 0.2, ease: "power2.out" });
      gsap.fromTo(
        choiceEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" },
      );
      gsap.fromTo(
        iconWrap,
        { scale: 0.72 },
        { scale: 1, duration: FEATURE_LIGHT_UP_DURATION, ease: "back.out(2)" },
      );
      gsap.to(textEl, {
        color: "#067AD9",
        duration: 0.32,
        ease: "power2.out",
      });
    } else {
      gsap.to(choiceEl, { opacity: 0, duration: 0.22, ease: "power2.inOut" });
      gsap.to(normalEl, { opacity: 1, duration: 0.22, ease: "power2.inOut" });
      gsap.to(iconWrap, { scale: 1, duration: 0.22 });
      gsap.to(textEl, {
        color: "rgba(0,0,0,0.2)",
        duration: 0.22,
        ease: "power2.inOut",
      });
    }
  }, [isActive]);

  return (
    <div className="flex items-center gap-[4px]">
      <div ref={iconWrapRef} className="relative h-4 w-4 shrink-0 origin-center">
        <img
          ref={normalRef}
          src={FEATURE_ICON_NORMAL}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ opacity: isActive ? 0 : 1 }}
        />
        <img
          ref={choiceRef}
          src={FEATURE_ICON_CHOICE}
          alt=""
          className="absolute inset-0 h-full w-full"
          style={{ opacity: isActive ? 1 : 0 }}
        />
      </div>
      <span
        ref={textRef}
        className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px]"
        style={{ color: isActive ? "#067AD9" : "rgba(0,0,0,0.2)" }}
      >
        {label}
      </span>
    </div>
  );
}

function FeatureChecklist({ activeFeatures }: { activeFeatures: BundleFeatureId[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[4px]">
      {BUNDLE_FEATURES.map((feature) => (
        <AnimatedFeatureItem
          key={feature.id}
          label={feature.label}
          isActive={activeFeatures.includes(feature.id)}
        />
      ))}
    </div>
  );
}

function ProductThumbnail({
  product,
  incoming,
  imageBackRef,
}: {
  product: IncludedProduct;
  incoming?: IncludedProduct;
  imageBackRef: (el: HTMLImageElement | null) => void;
}) {
  return (
    <div className="relative mt-[6px] h-[40px] w-[40px] shrink-0">
      <img
        src={product.image}
        alt=""
        decoding="async"
        className="absolute inset-0 h-full w-full object-contain"
      />
      {incoming ? (
        <img
          ref={imageBackRef}
          src={incoming.image}
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain opacity-0"
        />
      ) : null}
    </div>
  );
}

function IncludedTextContent({ product }: { product: IncludedProduct }) {
  return (
    <div className="min-w-0">
      <div className="flex items-start justify-between gap-[12px]">
        <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.9)] md:text-[16px] md:leading-[20px]">
          {product.name}
        </p>
        <span className="shrink-0 font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.6)] md:text-[16px]">
          {product.pack}
        </span>
      </div>
      <div className="mt-[4px] inline-flex rounded-[4px] border border-[rgba(0,0,0,0.12)] px-[8px] py-[2px]">
        <span className="font-['Inter',sans-serif] text-[12px] font-normal leading-[16px] text-[rgba(0,0,0,0.6)]">
          {product.model}
        </span>
      </div>
    </div>
  );
}

function IncludedListRow({
  product,
  incoming,
  wrapperRef,
  frontRef,
  backRef,
  imageBackRef,
}: {
  product: IncludedProduct;
  incoming?: IncludedProduct;
  wrapperRef: (el: HTMLDivElement | null) => void;
  frontRef: (el: HTMLDivElement | null) => void;
  backRef: (el: HTMLDivElement | null) => void;
  imageBackRef: (el: HTMLImageElement | null) => void;
}) {
  return (
    <div ref={wrapperRef} className="overflow-hidden">
      <div className="flex items-start gap-[8px]">
        <ProductThumbnail
          product={product}
          incoming={incoming}
          imageBackRef={imageBackRef}
        />
        <div className="grid min-w-0 flex-1 [&>*]:col-start-1 [&>*]:row-start-1">
          <div ref={frontRef}>
            <IncludedTextContent product={product} />
          </div>
          {incoming ? (
            <div ref={backRef} className="opacity-0">
              <IncludedTextContent product={incoming} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function BundleSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const floorPlanFrontRef = useRef<HTMLImageElement>(null);
  const floorPlanBackRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const listItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowFrontRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowBackRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rowImageBackRefs = useRef<Map<string, HTMLImageElement>>(new Map());
  const listProductsRef = useRef<DisplayListItem[]>(toDisplayList(BUNDLE_TABS[0].included));
  const listAnimTlRef = useRef<gsap.core.Timeline | null>(null);
  const priceAnimTweenRef = useRef<gsap.core.Tween | null>(null);

  const tabSwitchTlRef = useRef<gsap.core.Timeline | null>(null);
  const indicatorTweenRef = useRef<gsap.core.Tween | null>(null);
  const isTabAnimatingRef = useRef(false);
  const floorPlanFrontIsARef = useRef(true);
  const pendingIndicatorIndexRef = useRef<number | null>(null);

  const [activeTab, setActiveTab] = useState<BundleTabId>("essential");
  const [contentBundle, setContentBundle] = useState<BundleTab>(BUNDLE_TABS[0]);
  const [listProducts, setListProducts] = useState<DisplayListItem[]>(
    toDisplayList(BUNDLE_TABS[0].included),
  );
  listProductsRef.current = listProducts;
  const [displayFeatures, setDisplayFeatures] = useState<BundleFeatureId[]>(
    BUNDLE_TABS[0].activeFeatures,
  );
  const [displayPrices, setDisplayPrices] = useState({
    price: BUNDLE_TABS[0].price,
    original: BUNDLE_TABS[0].originalPrice,
  });
  const displayPricesRef = useRef(displayPrices);
  displayPricesRef.current = displayPrices;

  const activeTabIndex = BUNDLE_TABS.findIndex((tab) => tab.id === activeTab);
  const initialFloorPlan = BUNDLE_TABS[0].floorPlan;

  const snapIndicatorToTab = useCallback((index: number, animated: boolean) => {
    const bar = tabBarRef.current;
    const indicator = indicatorRef.current;
    const button = tabButtonRefs.current[index];
    if (!bar || !indicator || !button) return;

    const barRect = bar.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const x = buttonRect.left - barRect.left;
    const width = buttonRect.width;

    indicatorTweenRef.current?.kill();

    if (animated) {
      indicatorTweenRef.current = gsap.to(indicator, {
        x,
        width,
        opacity: 1,
        duration: TAB_SWITCH_DURATION,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      indicatorTweenRef.current = null;
      gsap.set(indicator, { x, width, opacity: 1 });
    }
  }, []);

  const crossfadeFloorPlan = useCallback((nextSrc: string) => {
    const front = floorPlanFrontRef.current;
    const back = floorPlanBackRef.current;
    if (!front || !back) return gsap.timeline();

    const showingA = floorPlanFrontIsARef.current;
    const bottomEl = showingA ? front : back;
    const topEl = showingA ? back : front;

    topEl.src = nextSrc;
    gsap.set(bottomEl, { opacity: 1, zIndex: 1 });
    gsap.set(topEl, { opacity: 0, zIndex: 2 });

    return gsap
      .timeline()
      .to(topEl, {
        opacity: 1,
        duration: FLOOR_PLAN_FADE_DURATION,
        ease: "power2.inOut",
      })
      .set(bottomEl, { opacity: 0 })
      .call(() => {
        floorPlanFrontIsARef.current = !showingA;
      });
  }, []);

  const readExpandedRowHeight = useCallback((el: HTMLDivElement) => {
    gsap.set(el, { height: "auto", visibility: "hidden", overflow: "hidden" });
    const height = el.offsetHeight;
    gsap.set(el, { height: 0, visibility: "visible" });
    return height;
  }, []);

  const collapseRowWrapper = useCallback((rowKey: string, cancelGap: boolean) => {
    const el = listItemRefs.current.get(rowKey);
    if (!el) return gsap.timeline();

    gsap.killTweensOf(el);
    const currentHeight = el.offsetHeight;
    gsap.set(el, { height: currentHeight, overflow: "hidden" });

    return gsap.to(el, {
      height: 0,
      ...(cancelGap ? { marginBottom: -LIST_ITEM_GAP } : {}),
      duration: LIST_ITEM_DURATION,
      ease: "power2.inOut",
    });
  }, []);

  const expandRowWrapper = useCallback(
    (rowKey: string) => {
      const el = listItemRefs.current.get(rowKey);
      if (!el) return gsap.timeline();

      gsap.killTweensOf(el);
      const targetHeight = readExpandedRowHeight(el);
      return gsap.to(el, {
        height: targetHeight,
        duration: LIST_ITEM_DURATION,
        ease: "power2.inOut",
      });
    },
    [readExpandedRowHeight],
  );

  const crossfadeRowLayers = useCallback((rowKey: string) => {
    const front = rowFrontRefs.current.get(rowKey);
    const back = rowBackRefs.current.get(rowKey);
    const imageBack = rowImageBackRefs.current.get(rowKey);
    if (!front || !back) return gsap.timeline();

    const targets = imageBack ? [front, back, imageBack] : [front, back];
    gsap.killTweensOf(targets);
    gsap.set(front, { opacity: 1 });
    gsap.set(back, { opacity: 0 });
    if (imageBack) gsap.set(imageBack, { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(front, { opacity: 0, duration: ROW_CONTENT_FADE_DURATION, ease: "power2.inOut" }, 0);
    tl.to(back, { opacity: 1, duration: ROW_CONTENT_FADE_DURATION, ease: "power2.inOut" }, 0);
    if (imageBack) {
      tl.to(
        imageBack,
        { opacity: 1, duration: ROW_CONTENT_FADE_DURATION, ease: "power2.inOut" },
        0,
      );
    }
    return tl;
  }, []);

  const animateProductListDiff = useCallback(
    (from: IncludedProduct[], to: IncludedProduct[]) => {
      const tl = gsap.timeline();
      const fromLen = from.length;
      const toLen = to.length;

      if (fromLen === toLen && from.every((item, index) => productsEqual(item, to[index]))) {
        tl.call(() => setListProducts(toDisplayList(to)));
        return tl;
      }

      const transitionList = buildTransitionList(from, to);

      tl.add(() => {
        listAnimTlRef.current?.kill();

        return new Promise<void>((resolve) => {
          flushSync(() => {
            setListProducts(transitionList);
          });

          const animTl = gsap.timeline({
            onComplete: () => {
              flushSync(() => {
                setListProducts(toDisplayList(to));
              });
              resetListRowStyles(
                listItemRefs.current.values(),
                rowFrontRefs.current.values(),
                rowBackRefs.current.values(),
                rowImageBackRefs.current.values(),
              );
              listAnimTlRef.current = null;
              resolve();
            },
          });
          listAnimTlRef.current = animTl;

          for (let i = fromLen; i < toLen; i += 1) {
            const el = listItemRefs.current.get(`row-${i}`);
            if (el) gsap.set(el, { height: 0, overflow: "hidden" });
          }

          transitionList.forEach((row) => {
            if (row.incoming) {
              animTl.add(crossfadeRowLayers(row.rowKey), 0);
            }
          });

          if (toLen > fromLen) {
            let addStagger = 0;
            for (let i = toLen - 1; i >= fromLen; i -= 1) {
              animTl.add(expandRowWrapper(`row-${i}`), addStagger);
              addStagger += LIST_ITEM_DURATION + ROW_STAGGER;
            }
          }

          if (toLen < fromLen) {
            let removeStagger = 0;
            for (let i = fromLen - 1; i >= toLen; i -= 1) {
              const rowKey = `row-${i}`;
              const cancelGap = i < fromLen - 1;
              animTl.add(collapseRowWrapper(rowKey, cancelGap), removeStagger);
              removeStagger += LIST_ITEM_DURATION + ROW_STAGGER;
            }
          }
        });
      });

      return tl;
    },
    [collapseRowWrapper, crossfadeRowLayers, expandRowWrapper],
  );

  const animatePriceCount = useCallback((to: BundleTab) => {
    priceAnimTweenRef.current?.kill();
    const from = displayPricesRef.current;
    const obj = { price: from.price, original: from.original };

    priceAnimTweenRef.current = gsap.to(obj, {
      price: to.price,
      original: to.originalPrice,
      duration: PRICE_COUNT_DURATION,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayPrices({ price: obj.price, original: obj.original });
      },
      onComplete: () => {
        setDisplayPrices({ price: to.price, original: to.originalPrice });
      },
    });

    return priceAnimTweenRef.current;
  }, []);

  const animateContentTransition = useCallback(
    (to: BundleTab) => {
      const tl = gsap.timeline();

      setContentBundle(to);
      setDisplayFeatures(to.activeFeatures);

      tl.add(animatePriceCount(to), 0);
      tl.add(
        animateProductListDiff(
          listProductsRef.current.map(({ rowKey: _rowKey, ...product }) => product),
          to.included,
        ),
        0,
      );

      return tl;
    },
    [animatePriceCount, animateProductListDiff],
  );

  const handleTabClick = useCallback(
    (tabId: BundleTabId) => {
      if (tabId === activeTab || isTabAnimatingRef.current) return;

      const nextIndex = BUNDLE_TABS.findIndex((tab) => tab.id === tabId);
      const nextBundle = BUNDLE_TABS[nextIndex];
      if (!nextBundle) return;

      isTabAnimatingRef.current = true;
      listAnimTlRef.current?.kill();
      priceAnimTweenRef.current?.kill();
      pendingIndicatorIndexRef.current = nextIndex;
      setActiveTab(tabId);

      tabSwitchTlRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          isTabAnimatingRef.current = false;
        },
      });
      tabSwitchTlRef.current = tl;

      tl.add(crossfadeFloorPlan(nextBundle.floorPlan), 0);
      tl.add(animateContentTransition(nextBundle), 0.05);
    },
    [activeTab, animateContentTransition, crossfadeFloorPlan],
  );

  useLayoutEffect(() => {
    const pendingIndex = pendingIndicatorIndexRef.current;
    if (pendingIndex !== null) {
      pendingIndicatorIndexRef.current = null;
      snapIndicatorToTab(pendingIndex, true);
      return;
    }

    if (indicatorTweenRef.current?.isActive()) return;
    snapIndicatorToTab(activeTabIndex, false);
  }, [activeTabIndex, snapIndicatorToTab]);

  useEffect(() => {
    const handleResize = () => snapIndicatorToTab(activeTabIndex, false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTabIndex, snapIndicatorToTab]);

  useEffect(() => {
    if (floorPlanFrontRef.current) gsap.set(floorPlanFrontRef.current, { opacity: 1 });
    if (floorPlanBackRef.current) gsap.set(floorPlanBackRef.current, { opacity: 0 });
    floorPlanFrontIsARef.current = true;
    isTabAnimatingRef.current = false;
    return () => {
      tabSwitchTlRef.current?.kill();
      listAnimTlRef.current?.kill();
      priceAnimTweenRef.current?.kill();
      indicatorTweenRef.current?.kill();
    };
  }, []);

  return (
    <div className="w-full bg-white py-[48px] md:py-[80px]">
      <div
        className="mx-auto flex w-full max-w-[1440px] flex-col gap-[24px] lg:flex-row lg:items-start lg:gap-[64px]"
        style={{ padding: `0 ${PAGE_HORIZONTAL_PADDING}` }}
      >
        <div ref={floorPlanRef} className="w-full shrink-0 lg:w-[720px]">
          <div className="relative aspect-square w-full overflow-hidden rounded-[16px] md:rounded-[24px]">
            <img
              ref={floorPlanFrontRef}
              src={initialFloorPlan}
              alt={`${contentBundle.label} floor plan`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <img
              ref={floorPlanBackRef}
              src={initialFloorPlan}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden lg:max-w-[656px]">
          <div ref={headerRef}>
            <h2 className="font-['Inter',sans-serif] text-[24px] font-bold leading-[32px] text-[rgba(0,0,0,0.9)] md:text-[36px] md:leading-[44px]">
              3 Protection Options
            </h2>
            <p className="mt-[4px] font-['Inter',sans-serif] text-[14px] font-normal leading-[22px] text-[rgba(0,0,0,0.6)] md:text-[16px]">
              Choose a Bundle That Suits Your Needs – Quick, Simple, and Convenient.
            </p>
          </div>

          <div className="mt-[24px] overflow-hidden">
            <div
              ref={tabBarRef}
              className="relative flex w-full max-w-full rounded-full bg-[#f5f5f5] p-[4px] md:max-w-[564px]"
            >
              <div
                ref={indicatorRef}
                className="pointer-events-none absolute top-[4px] bottom-[4px] left-0 rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              />
              {BUNDLE_TABS.map((tab, index) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabButtonRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative z-10 min-w-0 flex-1 rounded-full px-[12px] py-[8px] font-['Inter',sans-serif] text-[12px] font-medium leading-[16px] transition-colors duration-300 md:px-[16px] md:text-[14px] md:leading-[20px] ${
                      isActive ? "text-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.6)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={contentRef}
            className="mt-[24px] rounded-[16px] bg-[#f5f5f5] p-[24px] md:rounded-[24px] md:p-[32px]"
          >
            <div>
              <div className="flex flex-col gap-[4px]">
                <h3 className="font-['Inter',sans-serif] text-[24px] font-bold leading-[30px] text-[rgba(0,0,0,0.9)] md:text-[28px] md:leading-[34px]">
                  {contentBundle.title}
                </h3>
                <p className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.6)]">
                  {contentBundle.description}
                </p>
              </div>
              <div className="mt-[16px]">
                <FeatureChecklist activeFeatures={displayFeatures} />
              </div>
            </div>

            <div className="mt-[16px] flex items-baseline gap-[4px]">
              <span className="font-['Inter',sans-serif] text-[28px] font-bold leading-[36px] text-[#ba0020] md:text-[32px] md:leading-[36px]">
                ${displayPrices.price.toFixed(2)}
              </span>
              <span className="font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.4)] line-through">
                ${displayPrices.original.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="mt-[16px] flex h-[40px] w-fit items-center justify-center gap-[8px] rounded-full bg-[#ba0020] px-[20px] font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-white"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              Add to Cart
            </button>

            <div className="mt-[24px] h-px w-full bg-[rgba(0,0,0,0.08)]" />

            <p className="mt-[16px] font-['Inter',sans-serif] text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.6)] md:text-[16px]">
              Included
            </p>

            <div className="mt-[16px] flex flex-col gap-[16px]">
              {listProducts.map((product) => (
                <IncludedListRow
                  key={product.rowKey}
                  product={product}
                  incoming={product.incoming}
                  wrapperRef={(el) => {
                    if (el) listItemRefs.current.set(product.rowKey, el);
                    else listItemRefs.current.delete(product.rowKey);
                  }}
                  frontRef={(el) => {
                    if (el) rowFrontRefs.current.set(product.rowKey, el);
                    else rowFrontRefs.current.delete(product.rowKey);
                  }}
                  backRef={(el) => {
                    if (el) rowBackRefs.current.set(product.rowKey, el);
                    else rowBackRefs.current.delete(product.rowKey);
                  }}
                  imageBackRef={(el) => {
                    if (el) rowImageBackRefs.current.set(product.rowKey, el);
                    else rowImageBackRefs.current.delete(product.rowKey);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
