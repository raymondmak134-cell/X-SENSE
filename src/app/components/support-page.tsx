import { useRef, useEffect, useState } from "react";
import { useCategories } from "./use-products"; // categories hook
import GlobalNav from "./global-nav";
import ProductSelectDialog from "./product-select-dialog";
import MobileSupportPage from "./mobile-support-page";
import Footer from "../../imports/Footer";
import SplitText from "@/components/SplitText";
import svgPaths from "../../imports/svg-zx55evvu35";
import svgArrow from "../../imports/svg-umdpbk5rtp";
import imgFrame2117132003 from "@/assets/placeholder-image-url";
import imgFrame2117131978 from "@/assets/placeholder-image-url";
import imgFrame2117131979 from "@/assets/placeholder-image-url";
import imgFrame2117131980 from "@/assets/placeholder-image-url";
import imgImage1 from "@/assets/placeholder-image-url";
import imgImage2 from "@/assets/placeholder-image-url";
import imgImage3 from "@/assets/placeholder-image-url";
import imgSmokeAlarms from "@/assets/placeholder-image-url";
import imgCoAlarms from "@/assets/placeholder-image-url";
import imgCombinationAlarms from "@/assets/placeholder-image-url";
import imgHomeAlarms from "@/assets/placeholder-image-url";
import imgHubBaseStation from "@/assets/placeholder-image-url";
import imgAccessories from "@/assets/placeholder-image-url";
const imgBanner = "/images/support-banner.jpg";
const imgConnectApp = "/images/support-connect-app.png";
const imgBatteryLife = "/images/support-battery-life.png";
const imgOrderTracking = "/images/support-order-tracking.png";

// Fallback images for categories
const FALLBACK_IMAGES: Record<string, string> = {
  "smoke-alarms": imgSmokeAlarms,
  "co-alarms": imgCoAlarms,
  "combination-alarms": imgCombinationAlarms,
  "home-alarms": imgHomeAlarms,
  "hub-base-station": imgHubBaseStation,
  "base-station": imgHubBaseStation,
  "accessories": imgAccessories,
};

/* ==================== Banner Section ==================== */

function BannerSection() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      if (bannerRef.current) {
        const scrollY = window.scrollY;
        const opacity = Math.max(0, 1 - scrollY / 560);
        const translateY = scrollY * 0.5;
        bannerRef.current.style.opacity = String(opacity);
        bannerRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={bannerRef}
      className="content-stretch flex flex-col h-[588px] items-center justify-center w-full overflow-clip relative"
      style={{ padding: "0 clamp(24px, 8vw, 120px)", willChange: "opacity, transform", opacity: 1, transform: "translateY(0px)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `url(${imgBanner})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute bg-gradient-to-l from-[32.437%] from-[rgba(255,255,255,0)] inset-0 to-[75.58%] to-[rgba(255,255,255,0)] via-[50.112%] via-[rgba(255,255,255,0.41)]" />
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-center max-w-[1312px] relative shrink-0 w-full">
        <SplitText
          text="Support"
          className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] min-w-full not-italic relative shrink-0 text-[56px] text-black text-center w-[min-content]"
          delay={50}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] text-center w-[min-content]">Need help? Start here.</p>
        <div className="content-stretch flex h-[56px] items-start relative shrink-0 w-[720px] max-w-full">
          <div className="bg-white flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[8px]">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
                <div className="overflow-clip relative shrink-0 size-[24px]">
                  <div className="absolute inset-[8.33%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                      <g>
                        <path d={svgPaths.p24af9800} fill="var(--fill-0, black)" fillOpacity="0.9" />
                        <path d={svgPaths.p31519780} fill="var(--fill-0, black)" fillOpacity="0.9" />
                      </g>
                    </svg>
                  </div>
                </div>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.54)] text-center whitespace-nowrap">Search for Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Product Overview Section ==================== */

function ProductItem({ name, imageUrl, isCombination, onClick }: { name: string; imageUrl: string; isCombination?: boolean; onClick?: () => void }) {
  return (
    <div className="group content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px relative cursor-pointer" onClick={onClick}>
      <div className="relative shrink-0 size-[180px]">
        {isCombination ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt={name} className="absolute left-[15.56%] max-w-none size-[68.66%] top-[15.44%]" src={imageUrl} />
          </div>
        ) : (
          <img alt={name} className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageUrl} />
        )}
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content] group-hover:text-[#5E0000] transition-colors">{name}</p>
    </div>
  );
}

function ProductOverviewSection({ onProductClick }: { onProductClick: (categoryId: string) => void }) {
  const { categories, loading } = useCategories();

  // Map categories to display items
  const displayItems = categories.length > 0
    ? categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        imageUrl: cat.coverImageUrl || FALLBACK_IMAGES[cat.id] || imgSmokeAlarms,
        isCombination: cat.id === "combination-alarms" && !cat.coverImageUrl,
      }))
    : [
        { id: "smoke-alarms", name: "Smoke Alarms", imageUrl: imgSmokeAlarms },
        { id: "co-alarms", name: "CO Alarms", imageUrl: imgCoAlarms },
        { id: "combination-alarms", name: "Combination Alarms", imageUrl: imgCombinationAlarms, isCombination: true },
        { id: "home-alarms", name: "Home Alarms", imageUrl: imgHomeAlarms },
        { id: "hub-base-station", name: "Base Station", imageUrl: imgHubBaseStation },
        { id: "accessories", name: "Accessories", imageUrl: imgAccessories },
      ];

  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[1312px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] not-italic relative shrink-0 text-[32px] text-black text-center w-full">Product Overview</p>
        </div>
        {loading ? (
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-[1_0_0] min-w-0 flex flex-col items-center gap-[4px]">
                <div className="size-[180px] rounded-full bg-[rgba(0,0,0,0.05)] animate-pulse" />
                <div className="h-[20px] w-[80px] rounded bg-[rgba(0,0,0,0.05)] animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
            {displayItems.map((item) => (
              <ProductItem key={item.id} name={item.name} imageUrl={item.imageUrl} isCombination={item.isCombination} onClick={() => onProductClick(item.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Quick Links Section (3 cards) ==================== */

function ConnectToAppIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 56">
        <g>
          <rect fill="var(--fill-0, white)" height="56" rx="16" width="56" />
          <rect height="55" rx="15.5" stroke="var(--stroke-0, black)" strokeOpacity="0.1" width="55" x="0.5" y="0.5" />
          <g>
            <path d={svgPaths.p2df60a00} fill="#101820" />
            <path d={svgPaths.p13d8ee00} fill="var(--fill-0, #BA0020)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function SetupIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[40px] top-1/2">
        <div className="absolute inset-[4.33%_3.43%_5%_5%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.6308 36.2658">
            <path d={svgPaths.p7f19900} fill="var(--fill-0, black)" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OrderTrackingIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <div className="absolute left-[8px] overflow-clip size-[40px] top-[8px]">
        <div className="absolute flex inset-[16.17%_5.42%_11.32%_5.42%] items-center justify-center">
          <div className="-scale-y-100 flex-none h-[29.001px] rotate-180 w-[35.667px]">
            <div className="relative size-full">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.667 29">
                <path d={svgPaths.p17f61000} fill="var(--fill-0, black)" fillOpacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLinksSectionWrapper() {
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex gap-[16px] items-center justify-center max-w-[1312px] relative shrink-0 w-full">
        {/* Connect to App */}
        <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center justify-center min-h-px min-w-px overflow-clip relative rounded-[16px] cursor-pointer" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 246) 0%, rgb(246, 246, 246) 100%), linear-gradient(90deg, rgba(94, 127, 156, 0.1) 0%, rgba(94, 127, 156, 0.1) 100%)" }}>
          <div className="aspect-[213/213] flex-[1_0_0] min-h-px min-w-px relative">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgConnectApp} />
          </div>
          <div className="aspect-[160/160] flex-[1_0_0] min-h-px min-w-px relative">
            <div className="flex flex-col justify-center size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start justify-center pr-[32px] relative size-full">
                <ConnectToAppIcon />
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Connect to the App</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] w-[min-content]">{`Learn More >`}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Setup & Installation */}
        <div className="bg-[rgba(94,127,156,0.1)] content-stretch flex flex-[1_0_0] gap-[24px] items-center justify-center min-h-px min-w-px overflow-clip relative rounded-[16px] cursor-pointer">
          <div className="aspect-[213/213] flex-[1_0_0] min-h-px min-w-px relative">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBatteryLife} />
          </div>
          <div className="aspect-[160/160] flex-[1_0_0] min-h-px min-w-px relative">
            <div className="flex flex-col justify-center size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start justify-center pr-[32px] relative size-full">
                <SetupIcon />
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">{`Setup & Installation`}</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] w-[min-content]">{`Learn More >`}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Order tracking */}
        <div className="bg-[rgba(217,190,161,0.15)] content-stretch flex flex-[1_0_0] gap-[24px] items-center justify-center min-h-px min-w-px overflow-clip relative rounded-[16px] cursor-pointer">
          <div className="aspect-[213/213] flex-[1_0_0] min-h-px min-w-px relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgOrderTracking} />
            </div>
          </div>
          <div className="aspect-[160/160] flex-[1_0_0] min-h-px min-w-px relative">
            <div className="flex flex-col justify-center size-full">
              <div className="content-stretch flex flex-col gap-[8px] items-start justify-center pr-[32px] relative size-full">
                <OrderTrackingIcon />
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Order tracking</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] w-[min-content]">{`Learn More >`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Safety Knowledge Section ==================== */

const SAFETY_CARDS = [
  {
    image: imgFrame2117132003,
    title: "DO NOT use an open flame to test",
    description: "How to Tell If Your Smoke Alarm is Working？You can test your smoke alarm by pushing the Test/Hush button on the cover and holding it down for a minimum of 5 seconds.",
  },
  {
    image: imgFrame2117131978,
    title: "Fire and Carbon Monoxide Safety Tips",
    description: "Carbon monoxide alarms should be installed on every level of the home and in sleeping areas.",
  },
  {
    image: imgFrame2117131979,
    title: "How to Choose a Heat Alarm",
    description: "Learn more about how to choose a heat alarm.",
  },
  {
    image: imgFrame2117131980,
    title: "Fire and Carbon Monoxide Safety Tips",
    description: "Protect your home and family from the dangers of fire and carbon monoxide. Install smoke detectors and carbon monoxide detectors in your home.",
  },
];

function SafetyKnowledgeSection() {
  const [hoveredIndex, setHoveredIndex] = useState(0);

  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[1312px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-center w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] relative shrink-0 text-[32px] text-black w-full">Safety Knowledge</p>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full cursor-pointer">{`Browse all related articles >`}</p>
        </div>
        <div className="content-stretch flex gap-[16px] h-[440px] items-center max-w-[1312px] relative shrink-0 w-full" onMouseLeave={() => setHoveredIndex(0)}>
          {SAFETY_CARDS.map((card, index) => {
            const isExpanded = hoveredIndex === index;
            return (
              <div
                key={index}
                className="h-[440px] relative rounded-[16px] overflow-hidden cursor-pointer"
                style={{
                  flex: isExpanded ? 3 : 1,
                  transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  minWidth: 0,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Background image — always rendered, same for both states */}
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full"
                  src={card.image}
                />
                {/* Gradient overlay + content — fixed-width inner to prevent text reflow */}
                <div
                  className="absolute inset-0 rounded-[16px] flex flex-col justify-end overflow-hidden"
                  style={{
                    opacity: isExpanded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                    pointerEvents: isExpanded ? "auto" : "none",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.6)] rounded-[16px]" />
                  <div className="relative flex gap-[24px] items-end justify-center p-[24px]" style={{ width: "calc((min(1312px, 100vw - clamp(24px, 8vw, 120px) * 2) - 48px) * 3 / 6)" }}>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px not-italic relative">
                      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-white w-full">{card.title}</p>
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] overflow-hidden relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] w-full line-clamp-2">{card.description}</p>
                    </div>
                    <div className="group/btn relative h-[40px] w-[128px] shrink-0 cursor-pointer rounded-[50px] overflow-hidden">
                      {/* Default state: white bg, dark text */}
                      <div className="flex gap-[4px] items-center justify-center px-[16px] py-[8px] h-full bg-white rounded-[50px] transition-opacity duration-300 ease-in-out group-hover/btn:opacity-0">
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] text-center whitespace-nowrap">Learn more</p>
                      </div>
                      {/* Hover state: red bg, white text + arrow slide in */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#ba0020] rounded-[50px] opacity-0 transition-opacity duration-300 ease-in-out group-hover/btn:opacity-100 overflow-hidden">
                        <div className="flex gap-[4px] items-center translate-x-[12px] group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out">
                          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Learn more</p>
                          <div className="relative shrink-0 size-[20px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ease-in-out">
                            <div className="absolute inset-[16.67%_8.33%]">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 13.3333">
                                <path d={svgArrow.p9e88260} fill="white" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ==================== Contact Us Section ==================== */

function ContactUsSection() {
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[1312px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] not-italic relative shrink-0 text-[32px] text-black text-center w-full">Contact Us</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          {/* Contact banner */}
          <div className="bg-[#f2f0ed] content-stretch flex items-center max-w-[1312px] overflow-clip p-[40px] relative rounded-[16px] shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] w-full">Still can't resolve the issue?</p>
                <div className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[16px] text-[rgba(0,0,0,0.54)] w-full whitespace-pre-wrap">
                  <p className="mb-0">{`Sorry for the inconvenience. `}</p>
                  <p>Please contact us for assistance. We will reply within 24 hours.</p>
                </div>
              </div>
              <div className="bg-[#101820] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Contact</p>
              </div>
            </div>
          </div>
          {/* 3 contact info cards */}
          <div className="content-stretch flex gap-[16px] items-start justify-center max-w-[1312px] relative shrink-0 w-full">
            {/* Email Contacts */}
            <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px overflow-clip px-[40px] py-[24px] relative rounded-[16px] self-stretch" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 246) 0%, rgb(246, 246, 246) 100%), linear-gradient(90deg, rgba(94, 127, 156, 0.1) 0%, rgba(94, 127, 156, 0.1) 100%)" }}>
              <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                <div className="relative rounded-[16px] shrink-0 size-[56px]">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[40px] top-1/2">
                    <div className="absolute inset-[13.33%_5%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.0002 29.333">
                        <path d={svgPaths.p3abc4d00} fill="var(--fill-0, black)" fillOpacity="0.9" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Email Contacts</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Customer Service</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">service@x-sense.com</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Small Bulk Order</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">smallbulk@x-sense.com</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Business Partnership</p>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">partners@x-sense.com</p>
              </div>
            </div>
            {/* Phone Contacts */}
            <div className="bg-[rgba(94,127,156,0.1)] content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px overflow-clip px-[40px] py-[24px] relative rounded-[16px]">
              <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                <div className="relative rounded-[16px] shrink-0 size-[56px]">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] overflow-clip size-[40px] top-1/2">
                    <div className="absolute inset-[5.36%_5.42%_6.02%_5.64%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.5774 35.4491">
                        <path d={svgPaths.p2a142700} fill="var(--fill-0, black)" fillOpacity="0.9" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Phone Contacts</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                  <p className="mb-0">United States</p>
                  <p>(Mon-Fri 9 AM-5 PM (US Eastern Time)</p>
                </div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+1(833)952-1880</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                  <p className="mb-0">United Kingdom</p>
                  <p>Mon-Fri 9 AM-5 PM (GMT)</p>
                </div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+44 (0) 808 501 5078</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                  <p className="mb-0">Germany</p>
                  <p>Mon-Fri9 AM-5 PM (CET)</p>
                </div>
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+49 (0) 800 1821 385</p>
              </div>
            </div>
            {/* Office Location */}
            <div className="bg-[rgba(217,190,161,0.15)] content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px overflow-clip px-[40px] py-[24px] relative rounded-[16px] self-stretch">
              <div className="border-[rgba(0,0,0,0.1)] border-b border-solid content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                <div className="relative rounded-[16px] shrink-0 size-[56px]">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.33px)] overflow-clip size-[40px] top-1/2">
                    <div className="absolute inset-[35.48%_5.44%_5.42%_5.39%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.667 23.6416">
                        <path d={svgPaths.p117d5f00} fill="var(--fill-0, black)" />
                      </svg>
                    </div>
                    <div className="absolute inset-[10.21%_24.43%_5.42%_24.37%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4805 33.75">
                        <path d={svgPaths.p3ace9800} fill="var(--fill-0, black)" />
                      </svg>
                    </div>
                    <div className="absolute inset-[22.08%_38.7%_34.77%_38.64%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.0625 17.2568">
                        <path d={svgPaths.p1977300} fill="var(--fill-0, black)" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Office Location</p>
              </div>
              <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">X-SENSE USA LLC</p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">1209 Orange St, Wilmington,DE 19801, United States</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Footer Section ==================== */

function FooterSection() {
  return <Footer />;
}

/* ==================== Main Support Page ==================== */

export { ContactUsSection, FooterSection };

export default function SupportPage() {
  const [isMobile, setIsMobile] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState<string>("");

  const handleProductClick = (categoryId: string) => {
    setInitialCategoryId(categoryId);
    setDialogOpen(true);
  };

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile) {
    return <MobileSupportPage />;
  }

  return (
    <div className="bg-white w-full min-h-screen">
      <GlobalNav />
      <div className="pt-[104px]">
        <BannerSection />
        <div className="relative z-10 bg-white">
          <ProductOverviewSection onProductClick={handleProductClick} />
          <QuickLinksSectionWrapper />
          <SafetyKnowledgeSection />
          <ContactUsSection />
          <FooterSection />
        </div>
      </div>

      {/* Dialog rendered outside z-10 stacking context so it covers GlobalNav */}
      <ProductSelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={categories}
        categoriesLoading={categoriesLoading}
        fallbackImages={FALLBACK_IMAGES}
        initialCategoryId={initialCategoryId}
      />
    </div>
  );
}