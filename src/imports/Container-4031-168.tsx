function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-normal gap-[4px] items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] leading-[22px] relative shrink-0 text-[16px] text-black whitespace-nowrap">Base Station、Interconnected (App)</p>
      <p className="font-['Inter:Regular',sans-serif] leading-[16px] min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-[min-content]">Connect alarms through a central base station hub with app control for monitoring, testing, and notifications across all connected devices.</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] border-solid inset-[12.5%] rounded-[4px]" />
      </div>
      <Frame />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="leading-[22px] relative shrink-0 text-[16px] text-black whitespace-nowrap">Wireless Interconnected</p>
      <p className="leading-[16px] min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-[min-content]">When one alarm detects danger, all wirelessly interconnected alarms sound simultaneously throughout your home without needing Wi-Fi.</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] border-solid inset-[12.5%] rounded-[4px]" />
      </div>
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="leading-[22px] relative shrink-0 text-[16px] text-black whitespace-nowrap">Wi-Fi (App)</p>
      <p className="leading-[16px] min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-[min-content]">Connect directly via WiFi, receive APP notifications, and manage remote test/silence with low battery alerts.</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] border-solid inset-[12.5%] rounded-[4px]" />
      </div>
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="leading-[22px] relative shrink-0 text-[16px] text-black whitespace-nowrap">Standalone</p>
      <p className="leading-[16px] min-w-full relative shrink-0 text-[12px] text-[rgba(0,0,0,0.4)] w-[min-content]">Independent alarm operation without connection to other devices or networks. Simple installation with no additional setup required.</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] border-solid inset-[12.5%] rounded-[4px]" />
      </div>
      <Frame3 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start pb-[16px] pt-[12px] px-[20px] relative shadow-[0px_6px_24px_0px_rgba(0,0,0,0.1)] size-full" data-name="Container">
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ba0020] text-[16px] text-right w-full">
        <p className="leading-[22px]">Reset all filters</p>
      </div>
    </div>
  );
}