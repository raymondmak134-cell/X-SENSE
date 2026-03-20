import svgPaths from "./svg-s77hhl3g4q";
import imgSmokeAlarms from "@/assets/placeholder-image-url";
import imgSmokeAlarms1 from "@/assets/placeholder-image-url";

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
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[#101820] text-[24px] w-full">Smoke Alarms</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">How-to guides and technical help</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ba0020] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Base Station Interconnected (App)</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container2 />
        <div className="relative shrink-0 size-[20px]" data-name="icon/常规/收起">
          <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
            <div className="flex-none h-[15px] rotate-90 w-[8.333px]">
              <div className="relative size-full" data-name="Chevron">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                  <path d={svgPaths.pbb72f00} fill="var(--fill-0, #BA0020)" id="Chevron" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Product() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative" data-name="Product">
      <div className="relative shrink-0 size-[140px]" data-name="Smoke Alarms">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSmokeAlarms} />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">XS0B-MR</p>
    </div>
  );
}

function Product1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-center min-h-px min-w-px relative" data-name="Product">
      <div className="relative shrink-0 size-[140px]" data-name="Smoke Alarms">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSmokeAlarms1} />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-w-full not-italic relative shrink-0 text-[16px] text-black text-center w-[min-content]">XS01-M</p>
    </div>
  );
}

function Products() {
  return (
    <div className="relative shrink-0 w-full" data-name="Products">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start py-[24px] relative w-full">
        <Product />
        <Product1 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Wi-Fi (App)</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container4 />
        <div className="relative shrink-0 size-[20px]" data-name="icon/常规/下拉展开">
          <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
            <div className="-rotate-90 flex-none h-[15px] w-[8.333px]">
              <div className="relative size-full" data-name="Chevron">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                  <path d={svgPaths.pbb72f00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Chevron" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Wireless Interconnected</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container6 />
        <div className="relative shrink-0 size-[20px]" data-name="icon/常规/下拉展开">
          <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
            <div className="-rotate-90 flex-none h-[15px] w-[8.333px]">
              <div className="relative size-full" data-name="Chevron">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                  <path d={svgPaths.pbb72f00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Chevron" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Standalone</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container8 />
        <div className="relative shrink-0 size-[20px]" data-name="icon/常规/下拉展开">
          <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
            <div className="-rotate-90 flex-none h-[15px] w-[8.333px]">
              <div className="relative size-full" data-name="Chevron">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                  <path d={svgPaths.pbb72f00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Chevron" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-px px-[20px] relative w-full">
        <Container1 />
        <Products />
        <Container3 />
        <Container5 />
        <Container7 />
      </div>
    </div>
  );
}

function Compare() {
  return (
    <div className="content-stretch flex flex-col items-start py-[16px] relative shrink-0 w-full" data-name="Compare">
      <HorizontalBorder />
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