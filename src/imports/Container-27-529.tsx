import { useState, useEffect, useRef, useCallback } from "react";
import svgPaths from "./svg-fb1729jawi";
import discountSvg from "./svg-dh0xjw0cla";
import badgeSvgPaths from "./svg-tjcgcmfmss";
import imgProductImage from "@/assets/placeholder-image-url";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";
import { SkuDropdown } from "../app/components/SkuDropdown";
import type { SkuOption } from "../app/components/use-products";
import { ProductFeatures } from "../app/components/feature-icons";

interface ProductData {
  id: string;
  name: string;
  imageUrl: string;
  features: string[];
  options: SkuOption[];
  price: string;
  isHot: boolean;
  connectivity?: string[];
}

/* ========== Connectivity Badge ========== */

const CORNER_PATH = "M0 24C0 10.7452 10.7452 0 24 0H0V24Z";

/* ========== Pack Badge ========== */

function PackBadge({ qty }: { qty: string }) {
  return (
    <div className="absolute left-[16px] top-[52px] z-[15] w-[46px] h-[56px] pointer-events-none">
      <div className="relative rounded-[12px] size-full">
        <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[#022542] text-[26px] text-center w-full">{qty}</p>
          </div>
          <div className="bg-[#022542] content-stretch flex items-center justify-center relative flex-1 w-full rounded-b-[11px]">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Pack</p>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#022542] border-solid inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function ConnectivityBadge({ connectivity }: { connectivity?: string[] }) {
  if (!connectivity?.length) return null;
  const type = connectivity[0];

  let bg: string;
  let textColor: string;
  let fillColor: string;
  let label: string;
  let icon: React.ReactNode = null;

  switch (type) {
    case "Base Station Interconnected (App)":
      bg = "bg-[#700013]";
      textColor = "text-white";
      fillColor = "#700013";
      label = "Base-connected (App)";
      icon = (
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <div className="absolute inset-[9.17%_5%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3997 13.0665">
              <path d={badgeSvgPaths.p30cd5800} fill="white" />
            </svg>
          </div>
        </div>
      );
      break;
    case "Wi-Fi (App)":
      bg = "bg-[#067ad9]";
      textColor = "text-white";
      fillColor = "#067AD9";
      label = "Wi-Fi (App)";
      icon = (
        <div className="overflow-clip relative shrink-0 size-[16px]">
          <div className="absolute inset-[17.5%_4.94%_17.92%_4.94%]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4194 10.3333">
              <path d={badgeSvgPaths.p3d8a2900} fill="white" />
            </svg>
          </div>
        </div>
      );
      break;
    case "Wireless Interconnected":
      bg = "bg-[#022542]";
      textColor = "text-white";
      fillColor = "#022542";
      label = "Wireless Interconnected";
      icon = (
        <div className="relative shrink-0 size-[16px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path d={badgeSvgPaths.p2ca87700} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
      break;
    case "Standalone":
      bg = "bg-[#f2f0ed]";
      textColor = "text-[#101820]";
      fillColor = "#F2F0ED";
      label = "Standalone";
      break;
    default:
      return null;
  }

  return (
    <div className="absolute left-0 top-0 z-[15]" style={{ pointerEvents: "none" }}>
      {/* Main badge pill */}
      <div className={`${bg} flex gap-[4px] items-center justify-center overflow-clip pl-[20px] pr-[16px] py-[8px] rounded-tl-[32px] rounded-br-[14px]`}>
        {icon}
        <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[14px] ${textColor} whitespace-nowrap`}>
          {label}
        </p>
      </div>
      {/* Top-right concave corner */}
      <div className="absolute top-0 size-[24px]" style={{ left: "100%" }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={CORNER_PATH} fill={fillColor} />
        </svg>
      </div>
      {/* Bottom-left concave corner */}
      <div className="absolute left-0 size-[24px]" style={{ top: "100%" }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={CORNER_PATH} fill={fillColor} />
        </svg>
      </div>
    </div>
  );
}

export default function Container({ className, product }: { className?: string; product?: ProductData }) {
  const name = product?.name || "XS0B-MR Interconnected Smart Smoke Alarm";
  const defaultImageUrl = product?.imageUrl || imgProductImage;
  const features = product?.features || [
    "Voice Alarm with Location",
    "Easy Magnetic Mount",
    "10-Year Battery (NEVER-CHANGE)",
  ];
  const options: SkuOption[] = product?.options || [{ name: "6*Alarm+1*SBS50 Base Station (XS0B-MR61)", price: "", imageUrl: "", imagePath: "" }];
  const defaultPrice = product?.price || "$169.99";
  const isHot = product?.isHot ?? true;

  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const prevImageRef = useRef<string>("");
  const [isHovered, setIsHovered] = useState(false);

  const selectedSku = options[selectedSkuIndex];
  const displayPrice = selectedSku?.price ? `$${selectedSku.price}` : defaultPrice;
  const displayImage = selectedSku?.imageUrl || defaultImageUrl;
  const hoverImage = selectedSku?.hoverImageUrl || "";

  // Discount calculation
  const hasDiscount = selectedSku?.discountEnabled && selectedSku.discountPercent && selectedSku.price;
  const discountedPrice = hasDiscount
    ? `$${(parseFloat(selectedSku.price) * (1 - parseInt(selectedSku.discountPercent, 10) / 100)).toFixed(2)}`
    : null;

  // Track image URL changes to trigger loading skeleton
  useEffect(() => {
    if (prevImageRef.current && prevImageRef.current !== displayImage) {
      setImageLoading(true);
    }
    prevImageRef.current = displayImage;
  }, [displayImage]);

  const handleImageLoaded = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <div
      className={className || "bg-white content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[20px] relative rounded-[32px] w-[387px]"}
      data-name="Container"
      style={{ height: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover background image overlay — fills entire card, above product image but below other content */}
      {hoverImage && (
        <div
          className="absolute inset-0 z-[11] pointer-events-none rounded-[inherit] overflow-hidden"
        >
          <img
            src={hoverImage}
            alt=""
            className="absolute inset-0 size-full object-cover transition-all duration-500 ease-in-out"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1) translate3d(0,0,0)' : 'scale(1.08) translate3d(0,0,0)',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      )}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative flex-[1_0_0] w-full" data-name="Product Container">
        <div className="aspect-[307/307] relative shrink-0 w-full" data-name="Product Image">
          {/* Skeleton overlay while SKU image loads */}
          {imageLoading && (
            <div className="absolute inset-0 z-10 rounded-[16px] bg-[rgba(0,0,0,0.06)]" style={{ animation: 'skuImagePulse 1.5s ease-in-out infinite' }} />
          )}
          <ImageWithFallback
            alt={name}
            className={`absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            src={displayImage}
            onLoad={handleImageLoaded}
          />
          <style>{`
            @keyframes skuImagePulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `}</style>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative z-[12] shrink-0 w-full" data-name="Product Info">
          {/* 固定名称区域为2行高度，超出截断 */}
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full h-[48px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{name}</p>
          {/* 固定features区域高度 — icon-based display for predefined features */}
          <div className="relative shrink-0 w-full overflow-hidden" data-name="Product Features" style={{ height: '72px' }}>
            <ProductFeatures features={features} />
          </div>
          <SkuDropdown options={options} iconSize="sm" onSelect={setSelectedSkuIndex} />
        </div>
        {isHot && (
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic right-[32px] text-[#ba0020] text-[18px] top-[-4px] translate-x-full whitespace-nowrap">Hot</p>
        )}
      </div>
      <div className="content-stretch flex items-center justify-between relative z-[12] shrink-0 w-full" data-name="Price Container">
        {hasDiscount ? (
          <div className="flex gap-[4px] h-[34px] items-center relative shrink-0">
            <div className="flex flex-col h-[34px] items-start justify-end relative shrink-0 whitespace-nowrap">
              <p className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[16px] line-through relative shrink-0 text-[12px] text-[rgba(0,0,0,0.3)]">{displayPrice}</p>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-[#ba0020] relative shrink-0">{discountedPrice}</p>
            </div>
            <div className="h-[20px] relative shrink-0 w-[74px]">
              <div className="absolute h-[18px] left-[0.41px] top-px w-[73.595px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.5947 18">
                  <path d={discountSvg.p3a8ae7c0} fill="#BA0020" />
                </svg>
              </div>
              <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic right-[64px] text-[14px] text-white top-0 translate-x-full whitespace-nowrap">{selectedSku.discountPercent}% OFF</p>
            </div>
          </div>
        ) : (
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-black whitespace-nowrap">{displayPrice}</p>
        )}
        <div className="bg-[#ba0020] content-stretch flex gap-[8px] items-center justify-center w-[96px] h-[40px] px-[16px] py-[10px] relative rounded-[50px] shrink-0" data-name="原子控件/Web/Button/填充Button">
          <div className="overflow-clip relative shrink-0 size-[20px] flex items-center justify-center" data-name="icon/常规/购物车">
            <svg className="block w-[20.24px] h-[20.3px]" fill="none" viewBox="0 0 20.2399 20.2998">
              <g id="Union">
                <path d={svgPaths.p38729380} fill="var(--fill-0, white)" />
                <path d={svgPaths.p1829b100} fill="var(--fill-0, white)" />
                <path d={svgPaths.p18281200} fill="var(--fill-0, white)" />
                <path d={svgPaths.p3f7e2080} fill="var(--fill-0, white)" />
              </g>
            </svg>
          </div>
          
        </div>
      </div>
      <ConnectivityBadge connectivity={product?.connectivity} />
      {selectedSku?.packEnabled && selectedSku.packQty && (
        <PackBadge qty={selectedSku.packQty} />
      )}
    </div>
  );
}