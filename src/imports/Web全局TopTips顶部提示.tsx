import svgPaths from "./svg-iboyift3z8";

function Left() {
  return <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px opacity-0" data-name="Left（占位）" />;
}

function MidSaleInfo() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-h-px min-w-px relative" data-name="Mid（Sale info）">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[12px] text-[rgba(0,0,0,0.9)] text-center text-ellipsis whitespace-nowrap">{`Back to School Sale | Up to 40% Off | Shop Now >>`}</p>
    </div>
  );
}

function RightLanguage() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[40px] items-center justify-end min-h-px min-w-px relative" data-name="Right（Language）">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/全球语言">
        <div className="absolute inset-[5%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5996 21.5996">
            <path d={svgPaths.p3d794f00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">United States (English)</p>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[1312px] relative shrink-0 w-full" data-name="Body">
      <Left />
      <MidSaleInfo />
      <RightLanguage />
    </div>
  );
}

export default function WebTopTips() {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col items-center justify-center px-[120px] relative size-full" data-name="Web/全局/Top tips 顶部提示">
      <Body />
    </div>
  );
}