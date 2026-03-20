import svgPaths from "./svg-8d3d7e83kk";
import imgProductImage from "@/assets/placeholder-image-url";

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex items-start justify-end p-[16px] relative w-full">
          <div className="opacity-40 overflow-clip relative shrink-0 size-[32px]" data-name="Close Icon">
            <div className="absolute inset-[8.33%]" data-name="Subtract">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.6667 26.6667">
                <path clipRule="evenodd" d={svgPaths.p38086130} fill="var(--fill-0, black)" fillOpacity="0.54" fillRule="evenodd" id="Subtract" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TitleContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start justify-center not-italic relative shrink-0 text-center w-full" data-name="Title Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[#101820] text-[24px] w-full">Compare Similar Products</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Find the best smoke alarms for you</p>
    </div>
  );
}

function ProductImageContainer() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Product Image Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.25px)] size-[80px] top-1/2" data-name="Product Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProductImage} />
      </div>
    </div>
  );
}

function ProductImageContainer1() {
  return (
    <div className="flex-[1_0_0] h-[80px] min-h-px min-w-px relative" data-name="Product Image Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.25px)] size-[80px] top-1/2" data-name="Product Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProductImage} />
      </div>
    </div>
  );
}

function Info() {
  return (
    <div className="relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center pt-[24px] px-[19px] relative w-full">
          <ProductImageContainer />
          <ProductImageContainer1 />
        </div>
      </div>
    </div>
  );
}

function ProductOptions() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[10px]" data-name="Product Options">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">XS01-M</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Dropdown Icon">
            <div className="absolute inset-[29.17%_4.17%_20.83%_4.17%]">
              <div className="absolute inset-[0_8.67%_6%_8.67%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1241 7.52011">
                  <path d={svgPaths.p206bffc0} fill="var(--fill-0, black)" fillOpacity="0.9" id="Polygon 1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function ProductOptions1() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[10px]" data-name="Product Options">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">XS01-WX</p>
          <div className="overflow-clip relative shrink-0 size-[16px]" data-name="Dropdown Icon">
            <div className="absolute inset-[29.17%_4.17%_20.83%_4.17%]">
              <div className="absolute inset-[0_8.67%_6%_8.67%]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.1241 7.52011">
                  <path d={svgPaths.p206bffc0} fill="var(--fill-0, black)" fillOpacity="0.9" id="Polygon 1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Info1() {
  return (
    <div className="relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center pb-[24px] pt-[16px] px-[19px] relative w-full">
          <ProductOptions />
          <ProductOptions1 />
        </div>
      </div>
    </div>
  );
}

function Info2() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative text-[14px] text-[rgba(0,0,0,0.9)] w-full">
          <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative">
            <p className="leading-[20px]">Wireless Interconnected</p>
          </div>
          <div className="flex flex-[1_0_0] flex-col justify-center min-h-px min-w-px relative">
            <p className="leading-[20px]">Wi-Fi (App)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[16px] pt-[24px] px-[19px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.54)]">
            <p className="leading-[20px]">Battery</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BatteryInfoContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Info Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">Replaceable Battery (Included)</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Power Source</p>
      </div>
    </div>
  );
}

function BatteryInfoContainer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Info Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">10-Year Sealed Lithium Battery</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Power Source</p>
      </div>
    </div>
  );
}

function Info3() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative w-full">
          <BatteryInfoContainer />
          <BatteryInfoContainer1 />
        </div>
      </div>
    </div>
  );
}

function BatteryLifeContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Life Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">5 years</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Battery Life</p>
      </div>
    </div>
  );
}

function BatteryLifeContainer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Life Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">10 years</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Battery Life</p>
      </div>
    </div>
  );
}

function Info4() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative w-full">
          <BatteryLifeContainer />
          <BatteryLifeContainer1 />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pb-[16px] pt-[24px] px-[19px] relative w-full">
          <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(0,0,0,0.54)]">
            <p className="leading-[20px]">Capabilities</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame2 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">App Push Alerts</p>
      </div>
    </div>
  );
}

function Checkmark() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">App Push Alerts</p>
      </div>
    </div>
  );
}

function Info5() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer />
          <CheckmarkContainer1 />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame3 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Direct Wi-Fi Connection</p>
      </div>
    </div>
  );
}

function Checkmark1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark1 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Direct Wi-Fi Connection</p>
      </div>
    </div>
  );
}

function Info6() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer2 />
          <CheckmarkContainer3 />
        </div>
      </div>
    </div>
  );
}

function Checkmark2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark2 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Connects to SBS50 Base Station</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame4 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Connects to SBS50 Base Station</p>
      </div>
    </div>
  );
}

function Info7() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer4 />
          <CheckmarkContainer5 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame5 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Customizable Wireless Network</p>
      </div>
    </div>
  );
}

function Checkmark3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark3 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Customizable Wireless Network</p>
      </div>
    </div>
  );
}

function Info8() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer6 />
          <CheckmarkContainer7 />
        </div>
      </div>
    </div>
  );
}

function Checkmark4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark4 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Voice Alerts</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame6 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Voice Alerts</p>
      </div>
    </div>
  );
}

function Info9() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer8 />
          <CheckmarkContainer9 />
        </div>
      </div>
    </div>
  );
}

function Checkmark5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark5 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Replaceable Battery</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer11() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame7 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Replaceable Battery</p>
      </div>
    </div>
  );
}

function Info10() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer10 />
          <CheckmarkContainer11 />
        </div>
      </div>
    </div>
  );
}

function Checkmark6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark6 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Fire Dispatch subscription</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame8 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Fire Dispatch subscription</p>
      </div>
    </div>
  );
}

function Info11() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer12 />
          <CheckmarkContainer13 />
        </div>
      </div>
    </div>
  );
}

function Checkmark7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark7 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Night Mode</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame9 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Night Mode</p>
      </div>
    </div>
  );
}

function Info12() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer14 />
          <CheckmarkContainer15 />
        </div>
      </div>
    </div>
  );
}

function Checkmark8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Checkmark">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <path d={svgPaths.p38ff0800} fill="var(--fill-0, black)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Checkmark8 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Magnetic Mount</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Checkmark Icon Container">
          <g id="Vector">
            <path d={svgPaths.p3779f800} fill="var(--fill-0, #067AD9)" />
            <path d={svgPaths.p10c65a40} fill="var(--fill-0, #067AD9)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function CheckmarkContainer17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative" data-name="Checkmark Container">
      <Frame10 />
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.4)]">
        <p className="leading-[16px]">Magnetic Mount</p>
      </div>
    </div>
  );
}

function Info13() {
  return (
    <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="info">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[24px] items-center px-[19px] py-[24px] relative w-full">
          <CheckmarkContainer16 />
          <CheckmarkContainer17 />
        </div>
      </div>
    </div>
  );
}

function Compare() {
  return (
    <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-full" data-name="Compare">
      <Info />
      <Info1 />
      <Info2 />
      <Frame1 />
      <Info3 />
      <Info4 />
      <Frame />
      <Info5 />
      <Info6 />
      <Info7 />
      <Info8 />
      <Info9 />
      <Info10 />
      <Info11 />
      <Info12 />
      <Info13 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Container">
      <Header />
      <TitleContainer />
      <Compare />
    </div>
  );
}