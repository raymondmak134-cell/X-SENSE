import svgPaths from "./svg-34h4mjtn5w";

function Component() {
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

function Component1() {
  return (
    <div className="absolute contents inset-[0_0.66%_0_0]" data-name="图层 3">
      <Component />
    </div>
  );
}

function Right() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Right">
      <div className="h-[16px] relative shrink-0 w-[120px]" data-name="通用/控件/Logo">
        <Component1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/常规/排序">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/å¸¸è§/æåº">
          <path d={svgPaths.p3f2f8ac0} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
        </g>
      </svg>
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
        <div className="absolute inset-[7.08%_10.67%_8.33%_5%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2399 20.2998">
            <g id="Union">
              <path d={svgPaths.p38729380} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p1829b100} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p18281200} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p3f7e2080} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
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
      <Icon />
    </div>
  );
}

export default function Mobile() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[20px] py-[12px] relative size-full" data-name="Mobile/全局/导航">
      <Right />
      <Frame />
    </div>
  );
}