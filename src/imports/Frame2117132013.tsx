import imgFrame2117131978 from "@/assets/placeholder-image-url";
import imgFrame2117131979 from "@/assets/placeholder-image-url";
import imgFrame2117131980 from "@/assets/placeholder-image-url";
import imgFrame2117132003 from "@/assets/placeholder-image-url";

function Frame() {
  return (
    <div className="h-[440px] relative rounded-[16px] shrink-0 w-[205.333px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame2117131978} />
    </div>
  );
}

function Frame1() {
  return (
    <div className="h-[440px] relative rounded-[16px] shrink-0 w-[205.333px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgFrame2117131979} />
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgFrame2117131980} />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[440px] relative rounded-[16px] shrink-0 w-[205.333px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame2117131979} />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-white w-full">Fire and Carbon Monoxide Safety Tips</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] overflow-hidden relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-ellipsis w-full">Protect your home and family from the dangers of fire and carbon monoxide. Install smoke detectors and carbon monoxide</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[24px] h-[440px] items-end justify-center p-[24px] relative rounded-[16px] shrink-0 w-[648px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgFrame2117131979} />
        <img alt="" className="absolute max-w-none object-cover rounded-[16px] size-full" src={imgFrame2117132003} />
        <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0)] inset-0 rounded-[16px] to-[rgba(0,0,0,0.6)]" />
      </div>
      <Frame3 />
      <div className="bg-white content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 w-[128px]" data-name="原子控件/Web/Button/填充Button">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] text-center whitespace-nowrap">Learn more</p>
      </div>
    </div>
  );
}

export default function Frame5() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative size-full">
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame4 />
    </div>
  );
}