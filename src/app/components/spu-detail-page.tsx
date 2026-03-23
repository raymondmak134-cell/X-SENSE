import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import { ContactUsSection, FooterSection } from "./support-page";
import { MobileContactUs } from "./mobile-support-page";
import Footer from "../../imports/Footer";
import svgPaths from "../../imports/svg-rvx1jp8p39";
import svgMobile from "../../imports/svg-j7io6l51ec";

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

interface SpuData {
  id: string;
  name: string;
  imageUrl: string;
  categoryId?: string;
  connectivity?: string;
}

/* ==================== Get Started Cards ==================== */

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

function AppIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[40px] top-1/2">
        <div className="absolute inset-[5%_21.67%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.666 36">
            <path d={svgPaths.p881f7b1} fill="var(--fill-0, black)" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FaqIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] overflow-clip size-[40px] top-[calc(50%-0.34px)]">
        <div className="absolute inset-[8.09%_10.01%_8.09%_10.02%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 31.9883 33.5312">
            <path d={svgPaths.pddde900} fill="var(--fill-0, black)" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SpecsIcon() {
  return (
    <div className="relative shrink-0 size-[56px]">
      <div className="absolute left-[8px] size-[40px] top-[8px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <path d={svgPaths.p85a0000} stroke="var(--stroke-0, black)" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M10 10H5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M10 16.6667H5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M10 23.3333H5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M10 30H5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M35 10H30" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M35 16.6667H30" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M35 23.3333H30" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
          <path d="M35 30H30" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="2.67" />
        </svg>
      </div>
    </div>
  );
}

const GET_STARTED_CARDS = [
  {
    icon: <SetupIcon />,
    title: "Setup & Installation",
    description: "Watch the installation video to quickly set up your alarm detector",
    link: "Learn More >",
    tab: "Setup & Installation",
  },
  {
    icon: <AppIcon />,
    title: "App",
    description: "Official X-SENSE applications with the latest features.",
    link: "Download >",
    tab: "App",
  },
  {
    icon: <FaqIcon />,
    title: "FAQ",
    description: "Browse FAQs and solutions to quickly resolve common issues.",
    link: "View Now >",
    tab: "FAQs",
  },
  {
    icon: <SpecsIcon />,
    title: "Specs",
    description: "View product specifications and detailed parameters.",
    link: "View Now >",
    tab: "Specs",
  },
];

/* ==================== Mobile Skeleton ==================== */

function MobileProductHeroSkeleton() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <div className="content-stretch flex flex-col items-center min-w-[168.5px] relative shrink-0 w-full">
          <div className="relative shrink-0 size-[240px]">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.05)] rounded-[16px] animate-pulse" />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-center mt-[4px] w-full">
            <div className="h-[34px] w-[180px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
            <div className="h-[22px] w-[120px] rounded-[4px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileGetStartedSkeleton() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[20px] py-[32px] relative w-full">
          <div className="h-[34px] w-[140px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
          <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[rgba(0,0,0,0.03)] flex-[1_0_0] h-[96px] min-w-[353px] relative rounded-[16px] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Mobile Product Hero ==================== */

function MobileProductHeroSection({ spu }: { spu: SpuData }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <div className="content-stretch flex flex-col items-center min-w-[168.5px] relative shrink-0 w-full">
          <div className="relative shrink-0 size-[240px]">
            {spu.imageUrl ? (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt={spu.name} className="absolute left-0 max-w-none size-full top-0 object-contain" src={spu.imageUrl} />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[16px] flex items-center justify-center">
                <span className="text-[rgba(0,0,0,0.2)] text-[16px]">No image</span>
              </div>
            )}
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-center w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] relative shrink-0 text-[32px] text-black w-full">{spu.name}</p>
            <p
              className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-fit mx-auto cursor-pointer hover:underline"
              onClick={() => navigate(`/support/download-center?spuId=${encodeURIComponent(spu.id)}&tab=Manuals`)}
            >{`View Manuals >`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Mobile Get Started Icons (24px) ==================== */

function MobileSetupIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[4.33%_3.43%_5%_5%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9771 21.7593">
          <path d={svgMobile.p1c1a700} fill="var(--fill-0, black)" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function MobileAppIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[5%_21.67%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5996 21.5996">
          <path d={svgMobile.p12fc9c0} fill="var(--fill-0, black)" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function MobileFaqIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[8.09%_10.01%_8.09%_10.02%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1924 20.1191">
          <path d={svgMobile.p1dc39180} fill="var(--fill-0, black)" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

function MobileSpecsIcon() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgMobile.p31b57480} stroke="var(--stroke-0, black)" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M6 6H3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M6 9.99844H3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M6 14.0016H3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M6 18H3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M21 6H18" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M21 9.99844H18" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M21 14.0016H18" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        <path d="M21 18H18" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
      </svg>
    </div>
  );
}

/* ==================== Mobile Get Started Section ==================== */

const MOBILE_GET_STARTED_CARDS = [
  {
    icon: <MobileSetupIcon />,
    title: "Setup & Installation",
    description: "Watch the installation video to quickly set up your alarm detector",
    link: "Learn More >",
    tab: "Setup & Installation",
  },
  {
    icon: <MobileAppIcon />,
    title: "App",
    description: "Official X-SENSE applications with the latest features.",
    link: "Download >",
    tab: "App",
  },
  {
    icon: <MobileFaqIcon />,
    title: "FAQ",
    description: "Browse FAQs and solutions to quickly resolve common issues.",
    link: "View Now >",
    tab: "FAQs",
  },
  {
    icon: <MobileSpecsIcon />,
    title: "Specs",
    description: "View product specifications and detailed parameters.",
    link: "View Now >",
    tab: "Specs",
  },
];

function MobileGetStartedSection({ spuId }: { spuId: string }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[20px] py-[32px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Get Started</p>
          </div>
          <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
            {MOBILE_GET_STARTED_CARDS.map((card) => (
              <div
                key={card.title}
                className="group bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-full relative rounded-[16px] cursor-pointer"
                onClick={() => navigate(`/support/download-center?spuId=${encodeURIComponent(spuId)}&tab=${encodeURIComponent(card.tab)}`)}
              >
                <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
                  {card.icon}
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">{card.title}</p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">{card.description}</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full group-hover:underline">{card.link}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Skeleton ==================== */

function ProductHeroSkeleton() {
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col items-center max-w-[1312px] relative shrink-0 w-full">
        {/* Image skeleton */}
        <div className="relative shrink-0 size-[320px]">
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.05)] rounded-[16px] animate-pulse" />
        </div>
        {/* Name skeleton */}
        <div className="content-stretch flex flex-col gap-[8px] items-center mt-[4px] w-full">
          <div className="h-[56px] w-[280px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
          <div className="h-[22px] w-[120px] rounded-[4px] bg-[rgba(0,0,0,0.05)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function GetStartedSkeleton() {
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[1312px] relative shrink-0 w-full">
        <div className="h-[44px] w-[200px] rounded-[8px] bg-[rgba(0,0,0,0.05)] animate-pulse mx-auto" />
        <div className="content-stretch flex gap-[16px] h-[320px] items-center justify-center max-w-[1312px] relative shrink-0 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[rgba(0,0,0,0.03)] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== Product Hero Section ==================== */

function ProductHeroSection({ spu }: { spu: SpuData }) {
  const navigate = useNavigate();
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col items-center max-w-[1312px] relative shrink-0 w-full">
        {/* Product image */}
        <div className="relative shrink-0 size-[320px]">
          {spu.imageUrl ? (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt={spu.name} className="absolute left-0 max-w-none size-full top-0 object-contain" src={spu.imageUrl} />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.03)] rounded-[16px] flex items-center justify-center">
              <span className="text-[rgba(0,0,0,0.2)] text-[16px]">No image</span>
            </div>
          )}
        </div>
        {/* Product info */}
        <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-center w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] relative shrink-0 text-[56px] text-black w-full">{spu.name}</p>
          <p
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-fit mx-auto cursor-pointer hover:underline"
            onClick={() => navigate(`/support/download-center?spuId=${encodeURIComponent(spu.id)}&tab=Manuals`)}
          >{`View Manuals >`}</p>
        </div>
      </div>
    </div>
  );
}

/* ==================== Get Started Section ==================== */

function GetStartedSection({ spuId }: { spuId: string }) {
  const navigate = useNavigate();
  return (
    <div className="content-stretch flex flex-col items-center w-full" style={{ padding: "48px clamp(24px, 8vw, 120px)" }}>
      <div className="content-stretch flex flex-col gap-[48px] items-start max-w-[1312px] relative shrink-0 w-full">
        {/* Header */}
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] not-italic relative shrink-0 text-[32px] text-black text-center w-full">Get Started</p>
        </div>
        {/* 4 Cards */}
        <div className="content-stretch flex gap-[16px] h-[320px] items-center justify-center max-w-[1312px] relative shrink-0 w-full">
          {GET_STARTED_CARDS.map((card) => (
            <div
              key={card.title}
              className="group bg-[#f6f6f6] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px] cursor-pointer"
              onClick={() => navigate(`/support/download-center?spuId=${encodeURIComponent(spuId)}&tab=${encodeURIComponent(card.tab)}`)}
            >
              <div className="flex flex-col items-center justify-center size-full">
                <div className="content-stretch flex flex-col gap-[8px] items-center justify-center px-[32px] relative size-full">
                  {card.icon}
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">{card.title}</p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] text-center w-[min-content]">{card.description}</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] text-center w-[min-content] group-hover:underline">{card.link}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== QR Welcome Dialog ==================== */

function QrWelcomeDialog({ spuName, spuImage, onClose }: { spuName: string; spuImage?: string; onClose: () => void }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => setClosing(true);

  const handleOverlayAnimationEnd = (e: React.AnimationEvent) => {
    if (closing && e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{`
        @keyframes qr-overlay-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes qr-overlay-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes qr-card-in { from { opacity: 0; transform: translateY(60px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes qr-card-out { from { opacity: 1; transform: translateY(0) } to { opacity: 0; transform: translateY(60px) } }
      `}</style>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center px-[16px]"
        style={{
          backgroundColor: "rgba(0,0,0,0.2)",
          animation: closing ? "qr-overlay-out 0.3s ease-in forwards" : "qr-overlay-in 0.25s ease-out",
        }}
        onAnimationEnd={handleOverlayAnimationEnd}
      >
        <div
          className="flex flex-col gap-[33px] items-center max-w-[480px] w-full pb-[24px] pl-[20px] pt-[16px] rounded-[32px]"
          style={{
            backgroundImage: "linear-gradient(152.553deg, rgb(103, 9, 18) 1.0488%, rgb(142, 68, 60) 26.7%, rgb(221, 187, 143) 59.637%, rgb(250, 232, 182) 86.351%)",
            animation: closing ? "qr-card-out 0.3s ease-in forwards" : "qr-card-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
        {/* Header: tagline + decorative shapes */}
        <div className="flex items-center justify-between pr-[20px] w-full">
          <div className="flex-[1_0_0] min-h-px min-w-px font-['Inter:Medium',sans-serif] font-medium leading-[16px] text-[12px] text-[rgba(255,255,255,0.3)]">
            <p className="mb-0">{`North America's`}</p>
            <p>No.1 Smart Smoke Detector</p>
          </div>
          <div className="h-[17px] w-[81px] shrink-0">
            <svg className="block size-full" fill="none" viewBox="0 0 81 17">
              <path d="M16.265 8.283C16.265 12.858 12.624 16.566 8.132 16.566C3.641 16.566 0 12.858 0 8.283C0 3.708 3.641 0 8.132 0C12.624 0 16.265 3.708 16.265 8.283Z" fill="white" fillOpacity="0.3" />
              <path d="M22.074 4.733C22.074 2.119 24.154 0 26.721 0H33.692C36.258 0 38.339 2.119 38.339 4.733V11.833C38.339 14.447 36.258 16.566 33.692 16.566H26.721C24.154 16.566 22.074 14.447 22.074 11.833V4.733Z" fill="white" fillOpacity="0.3" />
              <path d="M65.825 10.793C64.464 9.407 64.464 7.159 65.825 5.773L70.438 1.075C71.799 -0.311 74.005 -0.311 75.367 1.075L79.979 5.773C81.34 7.159 81.34 9.407 79.979 10.793L75.367 15.491C74.005 16.877 71.799 16.877 70.438 15.491L65.825 10.793Z" fill="white" fillOpacity="0.3" />
              <path d="M52.475 1.544C53.609 0.389 55.448 0.389 56.582 1.544L58.318 3.311C59.452 4.467 59.452 6.34 58.318 7.495L49.836 16.134C48.702 17.289 46.863 17.289 45.729 16.134L43.993 14.366C42.859 13.211 42.859 11.338 43.993 10.183L52.475 1.544Z" fill="white" fillOpacity="0.3" />
            </svg>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-[16px] items-start w-full">
          <div className="flex items-start justify-between w-full">
            <div className="flex-[1_0_0] min-h-px min-w-px font-['Inter:Bold',sans-serif] font-bold leading-[36px] text-[26px] text-white">
              <p className="mb-0">thank you for choosing</p>
              <p>{`${spuName}. `}</p>
            </div>
            <div className="h-[108px] w-[118px] shrink-0 overflow-hidden">
              <img src="/images/qr-xs01.png" alt={spuName} className="size-full object-contain" />
            </div>
          </div>

          {/* Divider */}
          <div className="w-full" style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />

          {/* Support link + icons */}
          <div className="flex items-center justify-between pr-[20px] w-full">
            <p className="flex-[1_0_0] min-h-px min-w-px font-['Inter:Medium',sans-serif] font-medium leading-[24px] text-[16px] text-white">
              Find setup and<br />troubleshooting here.
            </p>
            <div className="flex gap-[4px] items-center shrink-0">
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[4.33%_3.43%_5%_5%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9771 21.7593">
                    <path d="M10.802 0.159C11.244 0.16 11.602 0.518 11.602 0.959C11.602 1.401 11.244 1.759 10.802 1.759C9.572 1.758 8.354 2.005 7.221 2.483C6.088 2.962 5.062 3.663 4.205 4.545C3.347 5.427 2.675 6.471 2.228 7.617C1.782 8.761 1.57 9.983 1.604 11.21L1.63 11.648C1.817 13.829 2.769 15.881 4.324 17.436C5.982 19.094 8.205 20.066 10.549 20.155H10.548C11.776 20.189 12.998 19.977 14.142 19.531C15.288 19.085 16.333 18.412 17.214 17.555C18.096 16.697 18.797 15.671 19.276 14.538C19.754 13.405 20.001 12.187 20 10.957C20.001 10.516 20.359 10.158 20.8 10.157C21.242 10.158 21.6 10.516 21.6 10.957C21.601 12.401 21.312 13.831 20.75 15.161C20.189 16.491 19.365 17.696 18.331 18.702C17.295 19.709 16.067 20.498 14.722 21.023C13.377 21.547 11.94 21.796 10.497 21.755H10.489V21.754C7.742 21.649 5.136 20.511 3.192 18.568C1.248 16.624 0.111 14.017 0.005 11.271L0.004 11.263C-0.037 9.82 0.213 8.382 0.737 7.037C1.261 5.692 2.05 4.464 3.057 3.429C4.064 2.394 5.268 1.57 6.598 1.009C7.928 0.447 9.358 0.159 10.802 0.159ZM13.725 1.421C14.96 0.186 16.683 -0.247 18.268 0.134L18.269 0.135C18.692 0.237 18.954 0.56 19.045 0.891C19.121 1.167 19.089 1.478 18.938 1.743L18.866 1.855L18.853 1.871L18.84 1.887L17.488 3.529L18.448 4.489L20.09 3.137L20.106 3.124L20.123 3.111C20.41 2.899 20.771 2.844 21.086 2.931C21.376 3.01 21.66 3.222 21.794 3.557L21.843 3.709C22.224 5.294 21.791 7.017 20.556 8.252C19.327 9.481 17.591 9.917 16.012 9.528L10.635 14.905C9.815 15.725 8.485 15.725 7.665 14.905L7.072 14.312C6.252 13.492 6.252 12.161 7.072 11.341L12.449 5.964C12.06 4.385 12.497 2.65 13.725 1.421ZM17 1.604C16.222 1.637 15.456 1.953 14.857 2.552C13.942 3.467 13.685 4.792 14.101 5.916L14.279 6.398L8.204 12.473C8.009 12.668 8.009 12.985 8.204 13.18L8.797 13.774C8.992 13.969 9.309 13.969 9.504 13.774L15.58 7.698L16.061 7.876C17.185 8.292 18.509 8.035 19.424 7.12C20.024 6.52 20.34 5.753 20.374 4.975L19.105 6.02V6.019C18.656 6.395 18.022 6.326 17.649 5.953L16.023 4.327C15.65 3.954 15.581 3.32 15.957 2.871H15.957L17 1.604Z" fill="white" fillOpacity="0.9" />
                  </svg>
                </div>
              </div>
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[5%_21.67%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5996 21.5996">
                    <path d="M11.5 0C12.66 0 13.6 0.94 13.6 2.1V19.5C13.599 20.66 12.66 21.599 11.5 21.6H2.1C0.94 21.6 0 20.66 0 19.5V2.1C0 0.94 0.94 0 2.1 0H11.5ZM2.1 1.6C1.824 1.6 1.6 1.824 1.6 2.1V19.5C1.6 19.776 1.824 20 2.1 20H11.5C11.776 20 12 19.776 12 19.5V2.1C12 1.824 11.776 1.6 11.5 1.6H2.1ZM8.8 17.5C9.242 17.5 9.6 17.858 9.6 18.3C9.6 18.742 9.241 19.1 8.8 19.1H4.8C4.358 19.1 4 18.742 4 18.3C4 17.858 4.358 17.5 4.8 17.5H8.8ZM6.8 2.3C7.352 2.3 7.8 2.748 7.8 3.3C7.8 3.852 7.352 4.3 6.8 4.3C6.248 4.3 5.8 3.852 5.8 3.3C5.8 2.748 6.248 2.3 6.8 2.3Z" fill="white" fillOpacity="0.9" />
                  </svg>
                </div>
              </div>
              <div className="overflow-clip relative shrink-0 size-[24px]">
                <div className="absolute inset-[8.09%_10.01%_8.09%_10.02%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1924 20.1191">
                    <path d="M9.597 0C14.935 0 19.192 4.543 19.192 10.06C19.192 15.576 14.935 20.119 9.597 20.119H0.8C0.51 20.119 0.243 19.962 0.102 19.709C-0.039 19.456 -0.033 19.147 0.118 18.9L1.899 15.995C0.725 14.335 0 12.296 0 10.06C0 4.543 4.259 0 9.597 0ZM9.597 1.6C5.219 1.6 1.6 5.349 1.6 10.06C1.6 12.119 2.325 13.983 3.491 15.457C3.699 15.72 3.721 16.085 3.546 16.371L2.229 18.519H9.597C13.975 18.518 17.593 14.77 17.593 10.06C17.593 5.349 13.975 1.6 9.597 1.6ZM9.597 12.927C10.057 12.927 10.43 13.3 10.43 13.76C10.43 14.22 10.057 14.593 9.597 14.593C9.136 14.593 8.764 14.22 8.764 13.76C8.764 13.3 9.137 12.927 9.597 12.927ZM9.738 5.377C10.256 5.403 10.757 5.569 11.188 5.857C11.618 6.146 11.964 6.546 12.185 7.015C12.406 7.484 12.495 8.005 12.443 8.521C12.392 9.036 12.2 9.529 11.891 9.944C11.586 10.353 11.177 10.672 10.707 10.87C10.613 10.913 10.533 10.983 10.478 11.07C10.422 11.158 10.393 11.261 10.396 11.364V11.67C10.396 12.112 10.037 12.47 9.596 12.47C9.154 12.47 8.796 12.112 8.796 11.67V11.381C8.791 10.969 8.904 10.563 9.125 10.215C9.349 9.862 9.671 9.582 10.053 9.411L10.076 9.401C10.287 9.314 10.471 9.171 10.607 8.988C10.744 8.805 10.828 8.588 10.851 8.36C10.873 8.133 10.835 7.904 10.737 7.697C10.64 7.491 10.488 7.314 10.298 7.187C10.108 7.06 9.887 6.987 9.659 6.976C9.431 6.964 9.203 7.015 9.002 7.123C8.801 7.231 8.632 7.391 8.515 7.587C8.397 7.783 8.335 8.007 8.335 8.235C8.335 8.677 7.977 9.036 7.535 9.036C7.094 9.036 6.736 8.678 6.735 8.236C6.735 7.718 6.875 7.209 7.142 6.765C7.408 6.32 7.791 5.956 8.248 5.712C8.705 5.468 9.221 5.351 9.738 5.377Z" fill="white" fillOpacity="0.9" />
                  </svg>
                </div>
              </div>
              <div className="relative shrink-0 size-[24px]">
                <svg className="absolute block size-full" fill="none" viewBox="0 0 24 24">
                  <path d="M17 3H7C6.448 3 6 3.448 6 4V20C6 20.552 6.448 21 7 21H17C17.552 21 18 20.552 18 20V4C18 3.448 17.552 3 17 3Z" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" />
                  <path d="M6 6H3" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 9.998H3" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 14.002H3" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 18H3" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 6H18" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 9.998H18" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 14.002H18" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 18H18" stroke="white" strokeOpacity="0.9" strokeWidth="1.602" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleClose}
          className="bg-[#ba0020] flex gap-[8px] items-center justify-center max-w-[240px] min-h-[56px] min-w-[180px] px-[24px] py-[16px] rounded-[50px] border-none cursor-pointer hover:bg-[#a0001b] transition-colors"
        >
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] text-white text-center whitespace-nowrap">
            Get Started
          </span>
          <div className="overflow-clip shrink-0 size-[24px]">
            <div className="flex items-center justify-center size-full">
              <div className="rotate-180 size-[20px]">
                <svg className="block size-full" fill="none" viewBox="0 0 20 20">
                  <path d="M10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM6 10.007L11.657 15.664L13.071 14.249L8.828 10.007L13.071 5.765L11.657 4.35L6 10.007Z" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
    </>
  );
}

/* ==================== Main SPU Detail Page ==================== */

export default function SpuDetailPage() {
  const { spuId } = useParams<{ spuId: string }>();
  const navigate = useNavigate();
  const [spu, setSpu] = useState<SpuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showQrWelcome, setShowQrWelcome] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("from") === "qr";
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (!spuId) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchWithRetry(`${API_BASE}/spus/${spuId}`, { headers: AUTH_HEADER });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch SPU (${res.status}): ${text}`);
        }
        const data = await res.json();
        setSpu(data.spu);
      } catch (err: any) {
        console.error("Error fetching SPU detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [spuId]);

  /* ---------- Error / Not Found (shared between mobile & desktop) ---------- */
  const errorBlock = (
    <div className="flex flex-col items-center justify-center py-[120px] gap-[16px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium text-[18px] text-[rgba(0,0,0,0.54)]">
        {error ? "Failed to load product" : "Product not found"}
      </p>
      <button
        onClick={() => navigate("/support")}
        className="bg-[#ba0020] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] px-[24px] py-[10px] rounded-[50px] cursor-pointer border-none"
      >
        Back to Support
      </button>
    </div>
  );

  /* ---------- Mobile layout ---------- */
  if (isMobile) {
    return (
      <>
        <MobileNav />
        <div className="bg-white relative min-h-screen w-full overflow-x-clip">
          {/* Nav spacer */}
          <div className="h-[48px] w-full shrink-0" />

          <div className="relative bg-white">
            {loading ? (
              <>
                <MobileProductHeroSkeleton />
                <MobileGetStartedSkeleton />
              </>
            ) : error || !spu ? (
              errorBlock
            ) : (
              <>
                <MobileProductHeroSection spu={spu} />
                <MobileGetStartedSection spuId={spu.id} />
              </>
            )}
            <MobileContactUs />
            <Footer />
          </div>
        </div>
        {showQrWelcome && spu && (
          <QrWelcomeDialog spuName={spu.name} spuImage={spu.imageUrl} onClose={() => setShowQrWelcome(false)} />
        )}
      </>
    );
  }

  /* ---------- Desktop layout ---------- */
  return (
    <div className="bg-white w-full min-h-screen">
      <GlobalNav />
      <div className="pt-[104px]">
        <div className="relative z-10 bg-white">
          {loading ? (
            <>
              <ProductHeroSkeleton />
              <GetStartedSkeleton />
            </>
          ) : error || !spu ? (
            errorBlock
          ) : (
            <>
              <ProductHeroSection spu={spu} />
              <GetStartedSection spuId={spu.id} />
            </>
          )}
          <ContactUsSection />
          <FooterSection />
        </div>
      </div>
      {showQrWelcome && spu && (
        <QrWelcomeDialog spuName={spu.name} spuImage={spu.imageUrl} onClose={() => setShowQrWelcome(false)} />
      )}
    </div>
  );
}