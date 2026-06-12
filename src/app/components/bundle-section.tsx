import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Plus, ShoppingCart } from "lucide-react";

const BUNDLE_CARD_WIDTH = 660;
const BUNDLE_CARD_GAP = 24;

export type BundleSectionHandle = {
  resetAnimations: () => void;
  setRevealProgress: (progress: number) => void;
};

type BundleItem = { name: string; qty: number };

type BundleData = {
  id: string;
  image: string;
  deviceCount: number;
  title: string;
  description: string;
  items: BundleItem[];
  price: number;
  originalPrice: number;
};

const BUNDLES: BundleData[] = [
  {
    id: "essential",
    image: "/images/bundle_essential_starter.jpg",
    deviceCount: 3,
    title: "Essential Starter",
    description: "Perfect for small homes, providing basic fire and CO protection.",
    items: [
      { name: "BaseStation", qty: 1 },
      { name: "CO Alarm", qty: 1 },
      { name: "Smoke Alarm", qty: 1 },
    ],
    price: 169.99,
    originalPrice: 215.99,
  },
  {
    id: "dual",
    image: "/images/bundle_dual_hazard_protection.jpg",
    deviceCount: 4,
    title: "Dual Hazard Protection",
    description: "Specialized for fire and water risk zones with dual protection.",
    items: [
      { name: "BaseStation", qty: 1 },
      { name: "Heat Alarms", qty: 1 },
      { name: "Combination Alarms", qty: 1 },
      { name: "Water Leak Alarm", qty: 1 },
    ],
    price: 379.99,
    originalPrice: 515.99,
  },
  {
    id: "whole-home",
    image: "/images/bundle_whole_home_protection.jpg",
    deviceCount: 6,
    title: "Whole-Home Protection",
    description: "Complete multi-zone protection for total home safety.",
    items: [
      { name: "BaseStation", qty: 1 },
      { name: "Smoke Alarm", qty: 2 },
      { name: "CO Alarm", qty: 1 },
      { name: "Heat Alarms", qty: 1 },
      { name: "Combination Alarms", qty: 1 },
      { name: "Water Leak Alarm", qty: 1 },
    ],
    price: 723.99,
    originalPrice: 815.99,
  },
];

function DeviceBadge({ count }: { count: number }) {
  return (
    <div className="flex h-[72px] w-[56px] flex-col items-center justify-center rounded-lg border-2 border-white/90 text-white">
      <span className="font-['Inter',sans-serif] text-[28px] font-bold leading-none">{count}</span>
      <span className="mt-1 font-['Inter',sans-serif] text-[11px] font-medium leading-none">Device</span>
    </div>
  );
}

function BundleCard({
  bundle,
  cardRef,
}: {
  bundle: BundleData;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const leftItems = bundle.items.filter((_, i) => i % 2 === 0);
  const rightItems = bundle.items.filter((_, i) => i % 2 === 1);

  return (
    <div
      ref={cardRef}
      className="relative mr-[24px] h-[480px] w-[660px] shrink-0 overflow-hidden rounded-[24px] opacity-0"
    >
      <img
        src={bundle.image}
        alt={bundle.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/85 to-transparent" />

      <div className="relative flex h-full flex-col p-[32px]">
        <DeviceBadge count={bundle.deviceCount} />

        <div className="mt-auto">
          <h3 className="font-['Inter',sans-serif] text-[28px] font-bold leading-[36px] text-[rgba(0,0,0,0.9)]">
            {bundle.title}
          </h3>
          <p className="mt-[8px] font-['Inter',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.6)]">
            {bundle.description}
          </p>

          <div className="mt-[16px] grid grid-cols-2 gap-x-[24px] gap-y-[6px]">
            <div className="flex flex-col gap-[6px]">
              {leftItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between font-['Inter',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.9)]"
                >
                  <span>• {item.name}</span>
                  <span className="text-[rgba(0,0,0,0.6)]">x{item.qty}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-[6px]">
              {rightItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between font-['Inter',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.9)]"
                >
                  <span>• {item.name}</span>
                  <span className="text-[rgba(0,0,0,0.6)]">x{item.qty}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[20px] flex items-end justify-between">
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-baseline gap-[8px]">
                <span className="font-['Inter',sans-serif] text-[32px] font-bold leading-[40px] text-[#ba0020]">
                  ${bundle.price.toFixed(2)}
                </span>
                <span className="font-['Inter',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.4)] line-through">
                  ${bundle.originalPrice.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                className="flex h-[48px] w-[160px] items-center justify-center gap-[8px] rounded-full bg-[#ba0020] font-['Inter',sans-serif] text-[16px] font-medium text-white"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                Add to Cart
              </button>
            </div>
            <button
              type="button"
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[rgba(0,0,0,0.2)] bg-white/80"
              aria-label="View bundle details"
            >
              <Plus className="h-5 w-5 text-[rgba(0,0,0,0.9)]" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BundleSection = forwardRef<BundleSectionHandle>(function BundleSection(_, ref) {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [trackEndPadding, setTrackEndPadding] = useState(24);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: false,
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateEndPadding = () => {
      const viewportWidth = viewport.clientWidth;
      const padding = Math.max(24, viewportWidth - BUNDLE_CARD_WIDTH - BUNDLE_CARD_GAP);
      setTrackEndPadding(padding);
    };

    updateEndPadding();
    const observer = new ResizeObserver(updateEndPadding);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const resetAnimations = useCallback(() => {
    if (headerRef.current) gsap.set(headerRef.current, { opacity: 0, y: 40 });
    cardRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 48 });
    });
  }, []);

  const setRevealProgress = useCallback((progress: number) => {
    const p = Math.max(0, Math.min(1, progress));
    const headerP = Math.min(1, p / 0.35);
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: headerP, y: (1 - headerP) * 40 });
    }
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const cardP = Math.min(1, Math.max(0, (p - 0.08 - i * 0.06) / 0.32));
      gsap.set(el, { opacity: cardP, y: (1 - cardP) * 48 });
    });
  }, []);

  useImperativeHandle(ref, () => ({
    resetAnimations,
    setRevealProgress,
  }));

  return (
    <div className="w-full bg-white py-[64px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        <div ref={headerRef} className="flex items-start justify-between gap-[24px] opacity-0">
          <div className="min-w-0 flex-1">
            <h2 className="font-['Inter',sans-serif] text-[36px] font-bold leading-[44px] text-[rgba(0,0,0,0.9)]">
              3 Protection Options
            </h2>
            <p className="mt-[4px] font-['Inter',sans-serif] text-[16px] leading-[22px] text-[rgba(0,0,0,0.6)]">
              Choose a Bundle That Suits Your Needs – Quick, Simple, and Convenient.
            </p>
          </div>
          <button
            type="button"
            className="mt-[15px] shrink-0 rounded-full border-2 border-[rgba(0,0,0,0.9)] px-[24px] py-[8px] font-['Inter',sans-serif] text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.9)]"
          >
            Custom Setup
          </button>
        </div>
      </div>

      <div
        className="mt-[24px] w-full overflow-hidden px-6 lg:pl-[max(24px,calc((100vw-1440px)/2))]"
        ref={(node) => {
          viewportRef.current = node;
          emblaRef(node);
        }}
      >
        <div className="flex" style={{ paddingRight: `${trackEndPadding}px` }}>
          {BUNDLES.map((bundle, i) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-[16px] w-full max-w-[1440px] px-6 lg:px-0">
        <div className="flex gap-[16px]">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[rgba(0,0,0,0.06)] disabled:opacity-30"
            aria-label="Previous bundle"
          >
            <ChevronLeft className="h-5 w-5 text-[rgba(0,0,0,0.9)]" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[rgba(0,0,0,0.06)] disabled:opacity-30"
            aria-label="Next bundle"
          >
            <ChevronRight className="h-5 w-5 text-[rgba(0,0,0,0.9)]" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default BundleSection;
