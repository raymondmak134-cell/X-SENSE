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
  },
  {
    icon: <AppIcon />,
    title: "App",
    description: "Official X-SENSE applications with thelatest features.",
    link: "Download >",
  },
  {
    icon: <FaqIcon />,
    title: "FAQ",
    description: "Browse FAQs and solutions to quickly resolve common issues.",
    link: "View Now >",
  },
  {
    icon: <SpecsIcon />,
    title: "Specs",
    description: "View product specifications and detailed parameters.",
    link: "View Now >",
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
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full cursor-pointer">{`View Manuals >`}</p>
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
  },
  {
    icon: <MobileAppIcon />,
    title: "App",
    description: "Official X-SENSE applications with thelatest features.",
    link: "Download >",
  },
  {
    icon: <MobileFaqIcon />,
    title: "FAQ",
    description: "Browse FAQs and solutions to quickly resolve common issues.",
    link: "View Now >",
  },
  {
    icon: <MobileSpecsIcon />,
    title: "Specs",
    description: "View product specifications and detailed parameters.",
    link: "View Now >",
  },
];

function MobileGetStartedSection() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[20px] py-[32px] relative w-full">
          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Get Started</p>
          </div>
          <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
            {MOBILE_GET_STARTED_CARDS.map((card) => (
              <div key={card.title} className="bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-[353px] relative rounded-[16px] cursor-pointer">
                <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
                  {card.icon}
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
                    <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">{card.title}</p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">{card.description}</p>
                    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full">{card.link}</p>
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
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full cursor-pointer">{`View Manuals >`}</p>
        </div>
      </div>
    </div>
  );
}

/* ==================== Get Started Section ==================== */

function GetStartedSection() {
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
            <div key={card.title} className="bg-[#f6f6f6] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px] cursor-pointer">
              <div className="flex flex-col items-center justify-center size-full">
                <div className="content-stretch flex flex-col gap-[8px] items-center justify-center px-[32px] relative size-full">
                  {card.icon}
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">{card.title}</p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-w-full not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] text-center w-[min-content]">{card.description}</p>
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-w-full not-italic relative shrink-0 text-[#5e0000] text-[14px] text-center w-[min-content]">{card.link}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
                <MobileGetStartedSection />
              </>
            )}
            <MobileContactUs />
            <Footer />
          </div>
        </div>
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
              <GetStartedSection />
            </>
          )}
          <ContactUsSection />
          <FooterSection />
        </div>
      </div>
    </div>
  );
}