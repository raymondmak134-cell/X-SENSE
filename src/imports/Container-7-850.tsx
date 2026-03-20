import svgPaths from "./svg-pcxpg7zpsc";

function Checkbox() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Checkbox 多选">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Checkbox å¤é">
          <rect fill="var(--fill-0, #101820)" height="18" id="Rectangle 1329130375" rx="4" width="18" />
          <path clipRule="evenodd" d={svgPaths.p38e26540} fill="var(--fill-0, white)" fillRule="evenodd" id="[fixed-theme]" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="content-stretch flex items-center justify-center p-[4px] relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <Checkbox />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">10-Year Sealed Lithium Battery</p>
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Checkbox 多选">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Checkbox å¤é">
          <rect fill="var(--fill-0, #101820)" height="18" id="Rectangle 1329130375" rx="4" width="18" />
          <path clipRule="evenodd" d={svgPaths.p38e26540} fill="var(--fill-0, white)" fillRule="evenodd" id="[fixed-theme]" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="content-stretch flex items-center justify-center p-[4px] relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <Checkbox1 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Replaceable Battery (Included)</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] pb-[16px] pt-[12px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Container">
      <Container1 />
    </div>
  );
}