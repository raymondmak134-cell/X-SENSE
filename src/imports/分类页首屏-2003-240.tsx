import svgPaths from "./svg-7h0tlbncam";
import imgImage from "@/assets/placeholder-image-url";
import imgProductImage from "@/assets/placeholder-image-url";

function Component1() {
  return (
    <div className="absolute inset-[0_0.66%_0_0]" data-name="图层 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 119.208 16.0001">
        <g id="å¾å± 1">
          <path d={svgPaths.p3dc89a80} fill="var(--fill-0, #101820)" id="Vector" />
          <path d={svgPaths.pbe0d00} fill="var(--fill-0, #101820)" id="Vector_2" />
          <path d={svgPaths.p3a591380} fill="var(--fill-0, #101820)" id="Vector_3" />
          <path d={svgPaths.pc0264f0} fill="var(--fill-0, #BA0020)" id="Vector_4" />
          <path d={svgPaths.p24b34f80} fill="var(--fill-0, #101820)" id="Vector_5" />
          <path d={svgPaths.p1064b600} fill="var(--fill-0, #101820)" id="Vector_6" />
          <path d={svgPaths.p14e36800} fill="var(--fill-0, #101820)" id="Vector_7" />
          <path d={svgPaths.p5d5ef00} fill="var(--fill-0, #101820)" id="Vector_8" />
          <path d={svgPaths.p3f49e400} fill="var(--fill-0, #101820)" id="Vector_9" />
          <path d={svgPaths.p74fa000} fill="var(--fill-0, #101820)" id="Vector_10" />
        </g>
      </svg>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute contents inset-[0_0.66%_0_0]" data-name="图层 3">
      <Component1 />
    </div>
  );
}

function Right() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Right">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/排序">
        <div className="absolute inset-[20.83%_13.33%_20.83%_16.67%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7998 14">
            <path d={svgPaths.p3c599000} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <div className="h-[16px] relative shrink-0 w-[120px]" data-name="通用/控件/Logo">
        <Component2 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/搜索 Search">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g id="Vector">
              <path d={svgPaths.p24af9800} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p31519780} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/购物车">
        <div className="-translate-x-1/2 absolute aspect-[18.594295501708984/18.5591983795166] bottom-[8.33%] left-1/2 top-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p26bff00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/用户">
        <div className="-translate-x-1/2 absolute aspect-[14.665620803833008/16] bottom-[8.33%] left-1/2 top-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
            <g id="Vector">
              <path d={svgPaths.p2a0cae80} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p1cdecf00} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-[353px]" data-name="Text Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-black w-full">Smoke Detectors</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] w-full">X-SENSE smoke alarms offer fast, accurate alerts with practical features, keeping your home and family safe from smoke and fire dangers.</p>
    </div>
  );
}

function Image() {
  return (
    <div className="absolute content-stretch flex flex-col h-[262px] items-start left-0 overflow-clip p-[20px] right-0 top-[48px]" data-name="Image">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
      <TextContainer />
    </div>
  );
}

function ProductInfoContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Product Info Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">24 products selected</p>
    </div>
  );
}

function HeaderContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start justify-center relative shrink-0" data-name="Header Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">Explore Products</p>
      <ProductInfoContainer />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex h-[57px] items-center justify-between max-w-[1312px] relative shrink-0 w-full" data-name="Header">
      <HeaderContainer />
      <div className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0" data-name="原子控件/Web/Button/描边Button">
        <div aria-hidden="true" className="absolute border-2 border-[#101820] border-solid inset-0 pointer-events-none rounded-[53px]" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101820] text-[14px] text-center whitespace-nowrap">Compare</p>
      </div>
    </div>
  );
}

function ProductFeatures() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[2px] h-[52px] items-start leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full" data-name="Product Features">
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Voice Alarm with Location</span>
        </li>
      </ul>
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Real-Time App Alerts</span>
        </li>
      </ul>
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Interconnected Alarm with Base Station</span>
        </li>
      </ul>
    </div>
  );
}

function ProductOptions() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full" data-name="Product Options">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">6*Alarm+1*SBS50 Base Station (XS0B-MR61)</p>
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

function ProductInfo() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Product Info">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full">XS0B-MR Interconnected Smart Smoke Alarm</p>
      <ProductFeatures />
      <ProductOptions />
    </div>
  );
}

function ProductContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Product Container">
      <div className="aspect-[307/307] relative shrink-0 w-full" data-name="Product Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProductImage} />
      </div>
      <ProductInfo />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic right-[32px] text-[#ba0020] text-[18px] top-[-4px] translate-x-full whitespace-nowrap">Hot</p>
    </div>
  );
}

function PriceContainer() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Price Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">$169.99</p>
      <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 w-[96px]" data-name="原子控件/Web/Button/填充Button">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="icon/常规/购物车">
          <div className="absolute inset-[7.08%_10.67%_8.33%_5%]" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8666 16.9165">
              <g id="Union">
                <path d={svgPaths.p2c3b9880} fill="var(--fill-0, white)" />
                <path d={svgPaths.p393cb180} fill="var(--fill-0, white)" />
                <path d={svgPaths.p1f161380} fill="var(--fill-0, white)" />
                <path d={svgPaths.p35d67700} fill="var(--fill-0, white)" />
              </g>
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">&nbsp;</p>
      </div>
    </div>
  );
}

function ProductFeatures1() {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[2px] h-[52px] items-start leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full" data-name="Product Features">
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Voice Alarm with Location</span>
        </li>
      </ul>
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Real-Time App Alerts</span>
        </li>
      </ul>
      <ul className="block relative shrink-0 w-full">
        <li className="list-disc ms-[18px] whitespace-pre-wrap">
          <span className="leading-[16px]">Interconnected Alarm with Base Station</span>
        </li>
      </ul>
    </div>
  );
}

function ProductOptions1() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full" data-name="Product Options">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">6*Alarm+1*SBS50 Base Station (XS0B-MR61)</p>
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

function ProductInfo1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Product Info">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full">XS0B-MR Interconnected Smart Smoke Alarm</p>
      <ProductFeatures1 />
      <ProductOptions1 />
    </div>
  );
}

function ProductContainer1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Product Container">
      <div className="aspect-[307/307] relative shrink-0 w-full" data-name="Product Image">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgProductImage} />
      </div>
      <ProductInfo1 />
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic right-[32px] text-[#ba0020] text-[18px] top-[-4px] translate-x-full whitespace-nowrap">Hot</p>
    </div>
  );
}

function PriceContainer1() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Price Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">$169.99</p>
      <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 w-[96px]" data-name="原子控件/Web/Button/填充Button">
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="icon/常规/购物车">
          <div className="absolute inset-[7.08%_10.67%_8.33%_5%]" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.8666 16.9165">
              <g id="Union">
                <path d={svgPaths.p2c3b9880} fill="var(--fill-0, white)" />
                <path d={svgPaths.p393cb180} fill="var(--fill-0, white)" />
                <path d={svgPaths.p1f161380} fill="var(--fill-0, white)" />
                <path d={svgPaths.p35d67700} fill="var(--fill-0, white)" />
              </g>
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">&nbsp;</p>
      </div>
    </div>
  );
}

function ProductListContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Product List Container">
      <div className="bg-white relative rounded-[32px] shrink-0 w-full" data-name="Product Card">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
            <ProductContainer />
            <PriceContainer />
          </div>
        </div>
      </div>
      <div className="bg-white relative rounded-[32px] shrink-0 w-full" data-name="Product Card">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
            <ProductContainer1 />
            <PriceContainer1 />
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContainer() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-0 px-[20px] right-0 top-[370px]" data-name="Main Container">
      <Header />
      <ProductListContainer />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Power Source</p>
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
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Connectivity</p>
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
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Features</p>
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
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center min-h-px min-w-px relative">
      <Container1 />
      <Container2 />
      <Container3 />
    </div>
  );
}

function Reset() {
  return (
    <div className="bg-gradient-to-l content-stretch flex flex-col from-[#f6f6f6] from-[70.127%] h-[60px] items-center justify-center relative shrink-0 to-[rgba(246,246,246,0)] w-[72px]" data-name="Reset">
      <div className="flex flex-[1_0_0] flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#ba0020] text-[16px] text-right w-full">
        <p className="leading-[22px]">Reset</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#f6f6f6] content-stretch flex h-[60px] items-center left-1/2 px-[20px] top-[310px] w-[393px]" data-name="Container">
      <Frame1 />
      <Reset />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#f6f6f6] relative size-full" data-name="分类页 / 首屏">
      <div className="absolute bg-white content-stretch flex items-center justify-between left-0 overflow-clip px-[20px] py-[12px] right-0 top-0" data-name="Mobile/全局/导航">
        <Right />
        <Frame />
      </div>
      <Image />
      <MainContainer />
      <Container />
    </div>
  );
}