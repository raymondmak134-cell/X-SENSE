import { useState, useEffect, useRef, useCallback } from "react";
import svgPaths from "./svg-fb1729jawi";


import imgProductImage from "@/assets/placeholder-image-url";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";
import { SkuDropdown } from "../app/components/SkuDropdown";
import type { SkuOption } from "../app/components/use-products";
import { ProductFeatures } from "../app/components/feature-icons";

interface ProductData {
  id: string;
  name: string;
  imageUrl: string;
  imageUrlV2?: string;
  features: string[];
  options: SkuOption[];
  price: string;
  isHot: boolean;
  connectivity?: string[];
}

/* ========== Connectivity Badge ========== */

const CORNER_PATH = "M0 24C0 10.7452 10.7452 0 24 0H0V24Z";

/* ========== Pack Badge ========== */

const PACK_SHIELD_PATH =
  "M20.9336 0.648437C21.4823 0.450349 22.0832 0.450305 22.6318 0.648437L37.8789 6.1543C38.765 6.47428 39.3966 7.26612 39.5117 8.20117L43.0459 36.9219C43.1673 37.9086 42.6927 38.8731 41.8369 39.3789L23.0547 50.4785C22.2702 50.942 21.2952 50.942 20.5107 50.4785L1.72852 39.3789C0.872572 38.8731 0.39721 37.9086 0.518555 36.9219L4.05371 8.20117C4.16879 7.26617 4.79952 6.47431 5.68555 6.1543L20.9336 0.648437Z";

function PackBadge({ qty }: { qty: string }) {
  return (
    <div className="absolute left-[16px] top-[52px] z-[15] pointer-events-none" style={{ width: 44, height: 52 }}>
      <p className="absolute left-1/2 -translate-x-1/2 top-0 w-[44px] text-center font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic text-[26px] text-[#022542]">{qty}</p>
      <p className="absolute left-[7.5px] top-[28px] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic text-[12px] text-[#022542] whitespace-nowrap">Pack</p>
      <svg className="absolute inset-0 block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 43.5651 51.3258">
        <path d={PACK_SHIELD_PATH} stroke="#022542" />
      </svg>
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

  switch (type) {
    case "Base Station Interconnected (App)":
      bg = "bg-[#700013]";
      textColor = "text-white";
      fillColor = "#700013";
      label = "Base-connected (App)";
      break;
    case "Wi-Fi (App)":
      bg = "bg-[#067ad9]";
      textColor = "text-white";
      fillColor = "#067AD9";
      label = "Wi-Fi (App)";
      break;
    case "Wireless Interconnected":
      bg = "bg-[#022542]";
      textColor = "text-white";
      fillColor = "#022542";
      label = "Wireless Interconnected";
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
      <div className={`${bg} flex items-center justify-center overflow-clip pl-[20px] pr-[16px] py-[8px] rounded-tl-[32px] rounded-br-[14px]`}>
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

export default function Container({ className, product, useNewCard }: { className?: string; product?: ProductData; useNewCard?: boolean }) {
  const name = product?.name || "XS0B-MR Interconnected Smart Smoke Alarm";
  const defaultImageUrl = product?.imageUrl || imgProductImage;
  const v2ImageUrl = product?.imageUrlV2 || "";
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
  const [isImageHovered, setIsImageHovered] = useState(false);

  const selectedSku = options[selectedSkuIndex];
  const displayPrice = selectedSku?.price ? `$${selectedSku.price}` : defaultPrice;
  const displayImage = (useNewCard && v2ImageUrl) ? v2ImageUrl : defaultImageUrl;
  const hoverImage = useNewCard
    ? (selectedSku?.hoverImageUrlV2 || selectedSku?.hoverImageUrl || "")
    : (selectedSku?.hoverImageUrl || "");

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

  if (useNewCard) {
    return (
      <div
        className="bg-white content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[20px] relative rounded-[32px] w-full"
        data-name="Container-V2"
        style={{ height: '100%' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Container: image + name + pack badges */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {/* Product image — full-bleed, fixed 250px height; hover image triggers on image area only */}
          <div
            className="bg-[#e8e8e8] h-[250px] shrink-0 w-full relative overflow-hidden"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <ImageWithFallback
              alt={name}
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
              src={displayImage}
            />
            {/* Hover V2 image overlay — triggers on image area hover */}
            {hoverImage && (
              <img
                src={hoverImage}
                alt=""
                className="absolute inset-0 size-full object-cover transition-all duration-500 ease-in-out pointer-events-none"
                style={{
                  opacity: isImageHovered ? 1 : 0,
                  transform: isImageHovered ? 'scale(1) translate3d(0,0,0)' : 'scale(1.08) translate3d(0,0,0)',
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              />
            )}
          </div>

          {/* Product name — fixed 2-line height */}
          <div className="content-stretch flex flex-col items-start px-[16px] relative shrink-0 w-full">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full h-[48px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {name}
            </p>
          </div>

          {/* Pack badges row — driven by SKU data */}
          {options.some(o => o.packEnabled && o.packQty) && (
            <div className="content-stretch flex gap-[8px] items-start px-[16px] relative shrink-0 w-full">
              {options.map((sku, i) => {
                if (!sku.packEnabled || !sku.packQty) return null;
                const isActive = i === selectedSkuIndex;

                if (sku.includeBaseStation) {
                  return (
                    <div
                      key={i}
                      className="border border-solid content-stretch flex flex-col items-center overflow-clip relative rounded-[12px] shrink-0 cursor-pointer"
                      style={{ borderColor: isActive ? '#101820' : '#DADADA' }}
                      onClick={() => setSelectedSkuIndex(i)}
                    >
                      <div className="content-stretch flex flex-col items-center justify-center px-[4px] relative shrink-0">
                        <div className="content-stretch flex gap-[2px] items-center not-italic relative shrink-0 pr-[4px]" style={{ color: isActive ? '#101820' : '#DADADA' }}>
                          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] relative shrink-0 text-[26px] text-center whitespace-nowrap">
                            {sku.packQty}+1
                          </p>
                          <div className="flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[21px] justify-center leading-[11px] relative shrink-0 text-[11px] w-[40px]">
                            <p className="mb-0">Base</p>
                            <p>Station</p>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" style={{ backgroundColor: isActive ? '#101820' : '#DADADA' }}>
                        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                          Pack
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className="border border-solid content-stretch flex flex-col items-center min-w-[44px] overflow-clip relative rounded-[12px] shrink-0 cursor-pointer"
                    style={{ borderColor: isActive ? '#101820' : '#DADADA' }}
                    onClick={() => setSelectedSkuIndex(i)}
                  >
                    <div className="content-stretch flex flex-col items-center justify-center px-[4px] relative shrink-0">
                      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-center whitespace-nowrap" style={{ color: isActive ? '#101820' : '#DADADA' }}>
                        {sku.packQty}
                      </p>
                    </div>
                    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" style={{ backgroundColor: isActive ? '#101820' : '#DADADA' }}>
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                        Pack
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Container */}
        <div className="content-stretch flex items-center justify-between px-[16px] relative shrink-0 w-full">
          <div className="content-stretch flex h-[34px] items-center relative shrink-0">
            {hasDiscount ? (
              <div className="content-stretch flex gap-[4px] h-[34px] items-end justify-center not-italic relative shrink-0">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-[#ba0020] whitespace-nowrap">
                  {discountedPrice}
                </p>
                <p className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] line-through relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)]">
                  {displayPrice}
                </p>
              </div>
            ) : (
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-black whitespace-nowrap">
                {displayPrice}
              </p>
            )}
          </div>
          <div
            className="bg-[#ba0020] flex gap-[4px] h-[40px] items-center justify-center rounded-full shrink-0 overflow-hidden transition-all duration-300 ease-in-out cursor-pointer"
            style={{ width: isHovered ? 130 : 40, paddingLeft: isHovered ? 16 : 0, paddingRight: isHovered ? 16 : 0 }}
          >
            <div className="overflow-clip relative shrink-0 size-[20px] flex items-center justify-center">
              <svg className="block w-[20.24px] h-[20.3px]" fill="none" viewBox="0 0 20.2399 20.2998">
                <g id="Union">
                  <path d={svgPaths.p38729380} fill="white" />
                  <path d={svgPaths.p1829b100} fill="white" />
                  <path d={svgPaths.p18281200} fill="white" />
                  <path d={svgPaths.p3f7e2080} fill="white" />
                </g>
              </svg>
            </div>
            <p
              className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic text-[14px] text-white text-center whitespace-nowrap transition-all duration-300 ease-in-out"
              style={{
                opacity: isHovered ? 1 : 0,
                maxWidth: isHovered ? 80 : 0,
                overflow: 'hidden',
              }}
            >
              Add Cart
            </p>
          </div>
        </div>

        {/* "Hot" label — positioned at bottom of image area */}
        {isHot && (
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] left-[16px] not-italic text-[14px] text-[#ba0020] top-[240.5px] whitespace-nowrap">
            Hot
          </p>
        )}

        {/* Discount tag — top-left corner, only shown when SKU has discount enabled */}
        {hasDiscount && (
          <div className="absolute bg-[#ba0020] content-stretch flex h-[24px] items-center justify-center left-[16px] px-[6px] rounded-[8px] top-[16px] w-[80px]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
              {selectedSku.discountPercent}% OFF
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={className || "bg-white content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[20px] relative rounded-[32px] w-[387px]"}
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
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Product Container">
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
          {isHot && (
            <p className="absolute left-0 bottom-[100%] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic text-[14px] text-[#ba0020] whitespace-nowrap">Hot</p>
          )}
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full h-[48px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{name}</p>
          <div className="relative shrink-0 w-full overflow-hidden" data-name="Product Features" style={{ height: '72px' }}>
            <ProductFeatures features={features} />
          </div>
          <SkuDropdown options={options} iconSize="sm" onSelect={setSelectedSkuIndex} />
        </div>
      </div>
      <div className="content-stretch flex items-center justify-between relative z-[12] shrink-0 w-full" data-name="Price Container">
        {hasDiscount ? (
          <div className="flex gap-[4px] h-[34px] items-end relative shrink-0">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-[#ba0020] whitespace-nowrap">{discountedPrice}</p>
            <p className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Regular',sans-serif] font-normal h-[20px] leading-[16px] line-through text-[12px] text-[rgba(0,0,0,0.4)] whitespace-nowrap">{displayPrice}</p>
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
      {hasDiscount && (
        <div className="absolute bg-[#ba0020] flex h-[24px] items-center justify-center px-[6px] rounded-[8px] right-[16px] top-[11px] z-[15] pointer-events-none">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[14px] text-white whitespace-nowrap">{selectedSku.discountPercent}% OFF</p>
        </div>
      )}
      {selectedSku?.packEnabled && selectedSku.packQty && (
        <PackBadge qty={selectedSku.packQty} />
      )}
    </div>
  );
}