function BatteryInfoContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Info Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">Wireless Interconnected</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Connectivity</p>
      </div>
    </div>
  );
}

function BatteryInfoContainer1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative" data-name="Battery Info Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)] w-full">
        <p className="leading-[20px]">Wi-Fi (App)</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[16px]">Connectivity</p>
      </div>
    </div>
  );
}

export default function Info() {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex gap-[24px] items-center leading-[0] not-italic px-[19px] py-[24px] relative size-full" data-name="info">
      <BatteryInfoContainer />
      <BatteryInfoContainer1 />
    </div>
  );
}