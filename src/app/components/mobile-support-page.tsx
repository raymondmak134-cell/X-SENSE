import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "./use-products";
import ProductSelectDialog from "./product-select-dialog";
import MobileNav from "./mobile-nav";
import Footer from "../../imports/Footer";
import svgPaths from "../../imports/svg-gq5o18jer6";
const imgBanner = "/images/support-banner.png";
import imgSmokeAlarms from "@/assets/placeholder-image-url";
import imgCoAlarms from "@/assets/placeholder-image-url";
import imgCombinationAlarms from "@/assets/placeholder-image-url";
import imgHomeAlarms from "@/assets/placeholder-image-url";
import imgHubBaseStation from "@/assets/placeholder-image-url";
import imgAccessories from "@/assets/placeholder-image-url";
import imgQuickLink1 from "@/assets/placeholder-image-url";
import imgQuickLink1Overlay from "@/assets/placeholder-image-url";
import imgQuickLink2 from "@/assets/placeholder-image-url";
import imgQuickLink2Overlay from "@/assets/placeholder-image-url";
import imgQuickLink3 from "@/assets/placeholder-image-url";
import imgQuickLink3Overlay from "@/assets/placeholder-image-url";
import imgSafety1 from "@/assets/placeholder-image-url";
import imgSafety2 from "@/assets/placeholder-image-url";
import imgSafety3 from "@/assets/placeholder-image-url";
import imgSafety4 from "@/assets/placeholder-image-url";
import imgContactBanner from "@/assets/placeholder-image-url";

const FALLBACK_IMAGES: Record<string, string> = {
  "smoke-alarms": imgSmokeAlarms,
  "co-alarms": imgCoAlarms,
  "combination-alarms": imgCombinationAlarms,
  "home-alarms": imgHomeAlarms,
  "hub-base-station": imgHubBaseStation,
  "base-station": imgHubBaseStation,
  "accessories": imgAccessories,
};

/* ==================== Banner with Parallax ==================== */

function MobileBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;
    let lastOpacity = -1;
    let lastTranslateY = -1;
    const bannerHeight = 262;

    const handleScroll = () => {
      rafId = 0;
      const el = bannerRef.current;
      if (!el) return;
      const scrollY = window.scrollY;
      if (scrollY > bannerHeight * 2) {
        if (lastOpacity !== 0) {
          el.style.opacity = "0";
          el.style.transform = "translate3d(0,0,0)";
          lastOpacity = 0;
          lastTranslateY = 0;
        }
        return;
      }
      const opacity = Math.max(0, 1 - scrollY / bannerHeight);
      const translateY = (scrollY * 0.5 + 0.5) | 0;
      if (opacity === lastOpacity && translateY === lastTranslateY) return;
      lastOpacity = opacity;
      lastTranslateY = translateY;
      el.style.transform = `translate3d(0,${translateY}px,0)`;
      el.style.opacity = String(opacity);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(handleScroll);
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
      className="relative content-stretch flex flex-col h-[262px] items-center justify-center overflow-clip p-[20px] w-full"
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        perspective: 1000,
        WebkitPerspective: 1000,
      } as React.CSSProperties}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgBanner} />
      <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 text-center w-[353px] max-w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] relative shrink-0 text-[32px] text-black w-full">Support</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] w-full">Need help? Start here.</p>
      </div>
      <div className="bg-white h-[56px] relative rounded-[8px] shrink-0 w-full mt-[24px]">
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[16px] relative size-full">
            <div className="overflow-clip relative shrink-0 size-[24px]">
              <div className="absolute inset-[8.33%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                  <path d={svgPaths.p24af9800} fill="black" fillOpacity="0.9" />
                  <path d={svgPaths.p31519780} fill="black" fillOpacity="0.9" />
                </svg>
              </div>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.54)] text-center whitespace-nowrap">Search for Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Product Overview ==================== */

function MobileProductItem({ name, imageUrl, isCombination, onClick }: { name: string; imageUrl: string; isCombination?: boolean; onClick?: () => void }) {
  return (
    <div className="group content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-[168.5px] relative cursor-pointer" onClick={onClick}>
      <div className="relative shrink-0 size-[168.5px]">
        {isCombination ? (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt={name} className="absolute left-[15.56%] max-w-none size-[68.66%] top-[15.44%]" src={imageUrl} />
          </div>
        ) : (
          <img alt={name} className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imageUrl} />
        )}
      </div>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-black text-center w-[min-content] group-hover:text-[#5E0000] transition-colors">{name}</p>
    </div>
  );
}

function MobileProductOverview({ onProductClick }: { onProductClick: (categoryId: string) => void }) {
  const { categories, loading } = useCategories();

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
        { id: "hub-base-station", name: "Hub / Base Station", imageUrl: imgHubBaseStation },
        { id: "accessories", name: "Accessories", imageUrl: imgAccessories },
      ];

  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Product Overview</p>
        </div>
        {loading ? (
          <div className="content-center flex flex-wrap gap-[16px_0px] items-center relative shrink-0 w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex-[1_0_0] min-w-[168.5px] flex flex-col items-center gap-[4px]">
                <div className="size-[168.5px] rounded-full bg-[rgba(0,0,0,0.05)] animate-pulse" />
                <div className="h-[16px] w-[80px] rounded bg-[rgba(0,0,0,0.05)] animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="content-center flex flex-wrap gap-[16px_0px] items-center relative shrink-0 w-full">
            {displayItems.map((item) => (
              <MobileProductItem key={item.id} name={item.name} imageUrl={item.imageUrl} isCombination={item.isCombination} onClick={() => onProductClick(item.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Quick Links ==================== */

function QuickLinkCard({ bgClass, bgStyle, image, overlayImage, imageStyle, icon, title, linkText }: {
  bgClass?: string;
  bgStyle?: React.CSSProperties;
  image: string;
  overlayImage?: string;
  imageStyle?: string;
  icon: React.ReactNode;
  title: string;
  linkText: string;
}) {
  return (
    <div className={`content-stretch flex flex-[1_0_0] gap-[16px] items-center min-h-px min-w-[318px] overflow-clip relative rounded-[16px] cursor-pointer ${bgClass || ""}`} style={bgStyle}>
      <div className="relative shrink-0 size-[168.5px]">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {imageStyle ? (
            <div className="absolute inset-0 overflow-hidden">
              <img alt="" className={imageStyle} src={image} />
            </div>
          ) : (
            <img alt="" className="absolute max-w-none object-cover size-full" src={image} />
          )}
          {overlayImage && (
            <img alt="" className="absolute max-w-none object-cover size-full" src={overlayImage} />
          )}
        </div>
      </div>
      <div className="flex-[1_0_0] h-[168.5px] min-h-px min-w-px relative">
        <div className="flex flex-col justify-center size-full">
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center pr-[32px] relative size-full">
            {icon}
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-black w-[min-content]">{title}</p>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] w-[min-content]">{linkText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectToAppIcon() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <rect fill="white" height="40" rx="12" width="40" />
        <rect height="39" rx="11.5" stroke="black" strokeOpacity="0.1" width="39" x="0.5" y="0.5" />
        <path d={svgPaths.p1131600} fill="#101820" />
        <path d={svgPaths.p12e96100} fill="#BA0020" />
      </svg>
    </div>
  );
}

function SetupIcon() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[32px] top-1/2">
        <div className="absolute inset-[4.33%_3.43%_5%_5%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 29.3039 29.0135">
            <path d={svgPaths.p2e621380} fill="black" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OrderTrackingIcon() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[32px] top-1/2">
        <div className="absolute flex inset-[16.17%_5.42%_11.32%_5.42%] items-center justify-center">
          <div className="-scale-y-100 flex-none h-[23.201px] rotate-180 w-[28.534px]">
            <div className="relative size-full">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28.7998 23.4658">
                <path d={svgPaths.p395d5700} fill="black" fillOpacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileQuickLinks() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-center max-w-[inherit] size-full">
        <div className="content-center flex flex-wrap gap-[16px] items-center justify-center max-w-[inherit] px-[20px] py-[32px] relative w-full">
          <QuickLinkCard
            bgStyle={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 246) 0%, rgb(246, 246, 246) 100%), linear-gradient(90deg, rgba(94, 127, 156, 0.1) 0%, rgba(94, 127, 156, 0.1) 100%)" }}
            image={imgQuickLink1}
            overlayImage={imgQuickLink1Overlay}
            icon={<ConnectToAppIcon />}
            title="Connect to the App"
            linkText="Learn More >"
          />
          <QuickLinkCard
            bgClass="bg-[rgba(94,127,156,0.1)]"
            image={imgQuickLink2}
            overlayImage={imgQuickLink2Overlay}
            icon={<SetupIcon />}
            title="Setup & Installation"
            linkText="Learn More >"
          />
          <QuickLinkCard
            bgClass="bg-[rgba(217,190,161,0.15)]"
            image={imgQuickLink3}
            overlayImage={imgQuickLink3Overlay}
            imageStyle="absolute h-[132.21%] left-[-45.93%] max-w-none top-[-22.57%] w-[166.46%]"
            icon={<OrderTrackingIcon />}
            title="Order tracking"
            linkText="Learn More >"
          />
        </div>
      </div>
    </div>
  );
}

/* ==================== Safety Knowledge ==================== */

const SAFETY_CARDS = [
  { image: imgSafety1, title: "DO NOT use an open flame to test", description: "How to Tell If Your Smoke Alarm is Working？You can test your smoke alarm by pushing the Test/Hush button on the cover and holding it down for a minimum of 5 seconds. " },
  { image: imgSafety2, title: "Fire and Carbon Monoxide Safety Tips", description: "Carbon monoxide alarms should be installed on every level of the home and in sleeping areas." },
  { image: imgSafety3, title: "How to Choose a Heat Alarm", description: "Learn more about how to choose a heat alarm." },
  { image: imgSafety4, title: "Fire and Carbon Monoxide Safety Tips", description: "Protect your home and family from the dangers of fire and carbon monoxide. Install smoke detectors and carbon monoxide" },
];

function MobileSafetyKnowledge() {
  return (
    <div className="bg-[#f6f6f6] max-w-[1312px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 text-center w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-black w-full">Safety Knowledge</p>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full cursor-pointer">{`Browse all related articles >`}</p>
        </div>
        <div className="content-start flex flex-wrap gap-[16px] items-start justify-center max-w-[1312px] relative shrink-0 w-full">
          {SAFETY_CARDS.map((card, index) => (
            <div key={index} className="flex-[1_0_0] h-[260px] min-h-px min-w-[318px] relative rounded-[16px]">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
                <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={card.image} />
                <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-0 rounded-[16px] to-[rgba(0,0,0,0.6)]" />
              </div>
              <div className="flex flex-col justify-end min-w-[inherit] size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-end min-w-[inherit] p-[16px] relative size-full">
                  <div className="content-stretch flex flex-col items-start justify-center not-italic relative shrink-0 w-full">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[18px] text-white w-full">{card.title}</p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] overflow-hidden relative shrink-0 text-[12px] text-[rgba(255,255,255,0.9)] text-ellipsis w-full">{card.description}</p>
                  </div>
                  <div className="bg-white content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] text-center whitespace-nowrap">Learn more</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== Contact Us ==================== */

export function MobileContactUs() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Contact Us</p>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
          {/* Contact banner */}
          <div className="bg-[#f2f0ed] max-w-[1312px] relative rounded-[16px] shrink-0 w-full">
            <div className="flex flex-col justify-center max-w-[inherit] overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col gap-[12px] items-start justify-center max-w-[inherit] p-[16px] relative w-full">
                <div className="h-[119px] relative shrink-0 w-[120px]">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <img alt="" className="absolute h-full left-[-4.12%] max-w-none top-0 w-[135.44%]" src={imgContactBanner} />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full">
                    <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] w-full">Still can't resolve the issue?</p>
                    <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full whitespace-pre-wrap">
                      <p className="mb-0">{`Sorry for the inconvenience. `}</p>
                      <p>Please contact us for assistance. We will reply within 24 hours.</p>
                    </div>
                  </div>
                  <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer">
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Contact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Contacts */}
          <div className="relative rounded-[16px] shrink-0 w-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 246) 0%, rgb(246, 246, 246) 100%), linear-gradient(90deg, rgba(94, 127, 156, 0.1) 0%, rgba(94, 127, 156, 0.1) 100%)" }}>
            <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
                <div className="content-stretch flex flex-col gap-[4px] items-start pb-[16px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
                  <div className="relative rounded-[16px] shrink-0 size-[56px]">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[40px] top-1/2">
                      <div className="absolute inset-[13.33%_5%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.0002 29.333">
                          <path d={svgPaths.p3abc4d00} fill="black" fillOpacity="0.9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Email Contacts</p>
                </div>
                {[
                  { label: "Customer Service", value: "service@x-sense.com" },
                  { label: "Small Bulk Order", value: "smallbulk@x-sense.com" },
                  { label: "Business Partnership", value: "partners@x-sense.com" },
                ].map((item) => (
                  <div key={item.label} className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[16px] relative shrink-0 w-full">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">{item.label}</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phone Contacts */}
          <div className="bg-[rgba(94,127,156,0.1)] relative rounded-[16px] shrink-0 w-full">
            <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
                <div className="content-stretch flex flex-col gap-[4px] items-start pb-[12px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
                  <div className="relative rounded-[16px] shrink-0 size-[56px]">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] overflow-clip size-[40px] top-1/2">
                      <div className="absolute inset-[5.36%_5.42%_6.02%_5.64%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.5774 35.4491">
                          <path d={svgPaths.p2a142700} fill="black" fillOpacity="0.9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Phone Contacts</p>
                </div>
                {[
                  { region: ["United States", "(Mon-Fri 9 AM-5 PM (US Eastern Time)"], phone: "+1(833)952-1880" },
                  { region: ["United Kingdom", "Mon-Fri 9 AM-5 PM (GMT)"], phone: "+44 (0) 808 501 5078" },
                  { region: ["Germany", "Mon-Fri9 AM-5 PM (CET)"], phone: "+49 (0) 800 1821 385" },
                ].map((item) => (
                  <div key={item.phone} className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full">
                    <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
                      <p className="mb-0">{item.region[0]}</p>
                      <p>{item.region[1]}</p>
                    </div>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">{item.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Office Location */}
          <div className="bg-[rgba(217,190,161,0.15)] relative rounded-[16px] shrink-0 w-full">
            <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
                <div className="content-stretch flex flex-col gap-[4px] items-start pb-[12px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
                  <div className="relative rounded-[16px] shrink-0 size-[56px]">
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.33px)] overflow-clip size-[40px] top-1/2">
                      <div className="absolute inset-[35.48%_5.44%_5.42%_5.39%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.667 23.6416">
                          <path d={svgPaths.p117d5f00} fill="black" />
                        </svg>
                      </div>
                      <div className="absolute inset-[10.21%_24.43%_5.42%_24.37%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4805 33.75">
                          <path d={svgPaths.p3ace9800} fill="black" />
                        </svg>
                      </div>
                      <div className="absolute inset-[22.08%_38.7%_34.77%_38.64%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.0625 17.2568">
                          <path d={svgPaths.p1977300} fill="black" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Office Location</p>
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
    </div>
  );
}

/* ==================== Main Mobile Support Page ==================== */

export default function MobileSupportPage() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [initialCategoryId, setInitialCategoryId] = useState<string>("");

  const handleProductClick = (categoryId: string) => {
    setInitialCategoryId(categoryId);
    setDialogOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MobileNav />
      <div className="bg-white relative min-h-screen w-full overflow-x-clip">
        {/* Nav spacer (48px) */}
        <div className="h-[48px] w-full shrink-0" />

        {/* Banner with parallax */}
        <MobileBanner />

        {/* Content sections - covers parallax banner */}
        <div className="relative z-[1] bg-white">
          <MobileProductOverview onProductClick={handleProductClick} />
          <MobileQuickLinks />
          <MobileSafetyKnowledge />
          <MobileContactUs />
          <Footer />
        </div>
      </div>

      {/* Dialog rendered outside z-[1] stacking context so it covers MobileNav */}
      <ProductSelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        categories={categories}
        categoriesLoading={categoriesLoading}
        fallbackImages={FALLBACK_IMAGES}
        initialCategoryId={initialCategoryId}
      />
    </>
  );
}