function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[#022542] text-[26px] text-center w-full">1</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#022542] content-stretch flex items-center justify-center relative shrink-0 w-full">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">Pack</p>
    </div>
  );
}

export default function Pack() {
  return (
    <div className="relative rounded-[12px] size-full" data-name="Pack">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Frame1 />
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#022542] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}