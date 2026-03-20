import svgPaths from "./svg-gszn089xz8";
import svgPathsExtra from "./svg-wbn2vrrkrc";
import { useState, useEffect } from "react";
import { InteractiveCheckbox } from "../app/components/InteractiveCheckbox";
import { InfoIconWithTooltip } from "../app/components/InfoIconWithTooltip";

function Left() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[40px] items-center min-h-px min-w-px opacity-0 relative" data-name="Left（占位）">
      <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px]">Fast and Free Delivery</p>
    </div>
  );
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
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)]">United States (English)</p>
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

function Component1() {
  return (
    <div className="absolute inset-[0_0.66%_0_0]" data-name="图层 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 149.011 20.0002">
        <g id="å¾å± 1">
          <path d={svgPaths.p31609b00} fill="var(--fill-0, #101820)" id="Vector" />
          <path d={svgPaths.p279ad300} fill="var(--fill-0, #101820)" id="Vector_2" />
          <path d={svgPaths.pfa12100} fill="var(--fill-0, #101820)" id="Vector_3" />
          <path d={svgPaths.p11a37f80} fill="var(--fill-0, #BA0020)" id="Vector_4" />
          <path d={svgPaths.pda74d00} fill="var(--fill-0, #101820)" id="Vector_5" />
          <path d={svgPaths.p17346f00} fill="var(--fill-0, #101820)" id="Vector_6" />
          <path d={svgPaths.p1f1eec00} fill="var(--fill-0, #101820)" id="Vector_7" />
          <path d={svgPaths.p23550c00} fill="var(--fill-0, #101820)" id="Vector_8" />
          <path d={svgPaths.pcd76280} fill="var(--fill-0, #101820)" id="Vector_9" />
          <path d={svgPaths.p683100} fill="var(--fill-0, #101820)" id="Vector_10" />
        </g>
      </svg>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute contents inset-[0_0.66%_0_0]" data-name="图层 3">
      <Component1 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0 w-[150px]" data-name="logo">
      <div className="h-[20px] relative shrink-0 w-[150px]" data-name="通用/控件/Logo">
        <Component3 />
      </div>
    </div>
  );
}

function Tab() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] h-full items-center min-h-px min-w-px relative" data-name="Tab">
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Smoke Alarms</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">CO Alarms</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Combination Alarms</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Home Alarms</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Support</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Explore</p>
          </div>
        </div>
      </div>
      <div className="h-full relative shrink-0" data-name="Web/Tab Bar选项">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">Partnership</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[32px] h-full items-center min-h-px min-w-px relative" data-name="左侧">
      <Logo />
      <Tab />
    </div>
  );
}

function IconGroup() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="icon Group">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/搜 Search">
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

function Component2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="右侧">
      <IconGroup />
    </div>
  );
}

function Body1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center max-w-[1312px] min-h-px min-w-px relative w-full" data-name="Body">
      <Component />
      <Component2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="relative shrink-0 size-[22px]" data-name="power_pc">
        <div className="absolute inset-[4.79%_25.83%_4.38%_25.83%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.7666 20.0498">
            <path d={svgPaths.pdb9f400} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Power Source</p>
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
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="overflow-clip relative shrink-0 size-[22px]" data-name="Icon">
        <div className="absolute flex inset-[-2.15%_-2.14%_-2.15%_-2.16%] items-center justify-center">
          <div className="-rotate-45 flex-none h-[11.358px] w-[24.04px]">
            <div className="relative size-full" data-name="Union">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.1699 10.5449">
                <path d={svgPaths.p5be3300} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Connectivity</p>
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

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <div className="overflow-clip relative shrink-0 size-[22px]" data-name="功能卖点/智能与连接功能/无线互联警报">
        <div className="absolute inset-[5.01%_5%_4.99%_5%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7996 19.7996">
            <g id="Vector">
              <path d={svgPaths.p358bc900} fill="var(--fill-0, black)" />
              <path d={svgPaths.p298bf100} fill="var(--fill-0, black)" />
              <path d={svgPaths.p65cd280} fill="var(--fill-0, black)" />
              <path d={svgPaths.p26f82200} fill="var(--fill-0, black)" />
              <path d={svgPaths.p2fffe280} fill="var(--fill-0, black)" />
            </g>
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Features</p>
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

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[48px] items-center min-h-px min-w-px relative">
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container1({ hasAnyChecked, onReset }: { hasAnyChecked?: boolean; onReset?: () => void }) {
  return (
    <div className="content-stretch flex gap-[32px] h-[64px] items-center max-w-[1312px] relative shrink-0 w-full" data-name="Container">
      <Frame />
      {hasAnyChecked && (
        <p 
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#ba0020] text-[16px] text-right cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onReset}
        >
          Reset
        </p>
      )}
    </div>
  );
}

interface ContainerProps {
  hasAnyChecked?: boolean;
  onReset?: () => void;
  checkboxStates?: any;
  setCheckboxStates?: any;
  isVisible?: boolean;
  categoryId?: string;
}

// Interactive filter button with dropdown
function FilterButton({ 
  isOpen, 
  onMouseEnter, 
  icon, 
  label 
}: { 
  isOpen: boolean; 
  onMouseEnter: () => void; 
  icon: React.ReactNode; 
  label: string; 
}) {
  return (
    <div 
      className="content-stretch flex gap-[8px] items-center relative shrink-0 cursor-pointer hover:opacity-80 transition-opacity" 
      data-name="Container"
      onMouseEnter={onMouseEnter}
    >
      {icon}
      <p className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] ${isOpen ? 'text-[#ba0020]' : 'text-black'}`}>{label}</p>
      <div className="relative shrink-0 size-[20px]" data-name="icon/常规/下拉展开">
        <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
          <div className={`flex-none h-[15px] w-[8.333px] transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : '-rotate-90'}`}>
            <div className="relative size-full" data-name="Chevron">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                <path d={svgPaths.pbb72f00} fill={isOpen ? '#ba0020' : 'black'} fillOpacity="0.9" id="Chevron" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dropdown panels for each filter type with animation
function PowerSourceDropdown({ checkboxStates, setCheckboxStates, isClosing }: any) {
  return (
    <div 
      className={`bg-white content-stretch flex flex-col items-center border-b border-[rgba(0,0,0,0.1)] relative w-full overflow-hidden ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
      data-name="Container"
    >
      <div className="content-stretch flex flex-wrap gap-[48px] items-start max-w-[1312px] relative shrink-0 w-full px-[0px] pt-[12px] pb-[20px]" data-name="Container">
        <InteractiveCheckbox 
          label="10-Year Sealed Lithium Battery" 
          checked={checkboxStates?.battery10Year}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, battery10Year: checked }))}
        />
        <InteractiveCheckbox 
          label="Replaceable Battery (Included)" 
          checked={checkboxStates?.batteryReplaceable}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, batteryReplaceable: checked }))}
        />
        <InteractiveCheckbox 
          label="AC Plug-in + Replaceable Battery Backup" 
          checked={checkboxStates?.batteryACPlugIn}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, batteryACPlugIn: checked }))}
        />
      </div>
    </div>
  );
}

function ConnectivityDropdown({ checkboxStates, setCheckboxStates, isClosing, isHomeAlarms }: any) {
  if (isHomeAlarms) {
    return (
      <div 
        className={`bg-white content-stretch flex flex-col items-center border-b border-[rgba(0,0,0,0.1)] relative w-full overflow-hidden ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
        data-name="Container"
      >
        <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] pb-[16px] pt-[12px] relative shrink-0 w-full" data-name="Container">
          <InteractiveCheckbox
            label="Water Leak"
            checked={checkboxStates?.waterLeak}
            onChange={(checked: boolean) => setCheckboxStates?.((prev: any) => ({ ...prev, waterLeak: checked }))}
          />
          <InteractiveCheckbox
            label="Heat Alarm"
            checked={checkboxStates?.heatAlarm}
            onChange={(checked: boolean) => setCheckboxStates?.((prev: any) => ({ ...prev, heatAlarm: checked }))}
          />
          <InteractiveCheckbox
            label="Thermometer & Hygrometer"
            checked={checkboxStates?.thermometerHygrometer}
            onChange={(checked: boolean) => setCheckboxStates?.((prev: any) => ({ ...prev, thermometerHygrometer: checked }))}
          />
        </div>
      </div>
    );
  }
  return (
    <div 
      className={`bg-white content-stretch flex flex-col items-center border-b border-[rgba(0,0,0,0.1)] relative w-full overflow-hidden ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
      data-name="Container"
    >
      <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] pb-[16px] pt-[12px] relative shrink-0 w-full" data-name="Container">
        <InteractiveCheckbox
          checked={checkboxStates?.baseStation}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, baseStation: checked }))}
        >
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Base Station Interconnected (App)</p>
            <InfoIconWithTooltip
              iconPath={svgPathsExtra.p12e9fe00}
              tooltip="Connect alarms through a central base station hub with app control for monitoring, testing, and notifications across all connected devices."
            />
          </div>
        </InteractiveCheckbox>
        <InteractiveCheckbox
          checked={checkboxStates?.wirelessInterconnected}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, wirelessInterconnected: checked }))}
        >
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Wireless Interconnected</p>
            <InfoIconWithTooltip
              iconPath={svgPathsExtra.p12e9fe00}
              tooltip="When one alarm detects danger, all wirelessly interconnected alarms sound simultaneously throughout your home without needing Wi-Fi."
            />
          </div>
        </InteractiveCheckbox>
        <InteractiveCheckbox
          checked={checkboxStates?.wifi}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, wifi: checked }))}
        >
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Wi-Fi (App)</p>
            <InfoIconWithTooltip
              iconPath={svgPathsExtra.p12e9fe00}
              tooltip="Connect directly via WiFi, receive APP notifications, and manage remote test/silence with low battery alerts."
            />
          </div>
        </InteractiveCheckbox>
        <InteractiveCheckbox
          checked={checkboxStates?.standalone}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, standalone: checked }))}
        >
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Standalone</p>
            <InfoIconWithTooltip
              iconPath={svgPathsExtra.p12e9fe00}
              tooltip="Independent alarm operation without connection to other devices or networks. Simple installation with no additional setup required."
            />
          </div>
        </InteractiveCheckbox>
      </div>
    </div>
  );
}

function FeaturesDropdown({ checkboxStates, setCheckboxStates, isClosing }: any) {
  return (
    <div 
      className={`bg-white content-stretch flex flex-col items-center border-b border-[rgba(0,0,0,0.1)] relative w-full overflow-hidden ${isClosing ? 'animate-slideUp' : 'animate-slideDown'}`}
      data-name="Container"
    >
      <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] pb-[16px] pt-[12px] relative shrink-0 w-full" data-name="Container">
        <InteractiveCheckbox
          label="Voice Alerts"
          checked={checkboxStates?.voiceAlarm}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, voiceAlarm: checked }))}
        />
        <InteractiveCheckbox
          label="Night Mode"
          checked={checkboxStates?.nightMode}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, nightMode: checked }))}
        />
        <InteractiveCheckbox
          label="Magnetic Mount"
          checked={checkboxStates?.magneticMount}
          onChange={(checked) => setCheckboxStates?.((prev: any) => ({ ...prev, magneticMount: checked }))}
        />
      </div>
    </div>
  );
}

// Export only the filter bar part for sticky header with dropdown
export function FilterBarOnly(props?: ContainerProps) {
  const { hasAnyChecked, onReset, checkboxStates, setCheckboxStates, isVisible, categoryId } = props || {};
  const isHomeAlarms = categoryId === "home-alarms";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [closingDropdown, setClosingDropdown] = useState<string | null>(null);

  // Reset dropdown state when component becomes invisible
  useEffect(() => {
    if (isVisible === false && (openDropdown || closingDropdown)) {
      setOpenDropdown(null);
      setClosingDropdown(null);
    }
  }, [isVisible, openDropdown, closingDropdown]);

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      return; // Already open, do nothing on hover
    }
    setOpenDropdown(name);
    setClosingDropdown(null);
  };

  const handleMouseLeave = () => {
    if (openDropdown) {
      const closing = openDropdown;
      setOpenDropdown(null);
      setClosingDropdown(closing);
      setTimeout(() => {
        setClosingDropdown(null);
      }, 300);
    }
  };

  // 所有筛选项被清空时，自动收起下拉面板
  useEffect(() => {
    if (!hasAnyChecked) {
      setOpenDropdown(null);
      setClosingDropdown(null);
    }
  }, [hasAnyChecked]);

  const powerSourceIcon = (
    <div className="relative shrink-0 size-[22px]" data-name="power_pc">
      <div className="absolute inset-[4.79%_25.83%_4.38%_25.83%]" data-name="Union">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.7666 20.0498">
          <path d={svgPaths.pdb9f400} fill={openDropdown === 'power' ? '#ba0020' : 'black'} fillOpacity="0.9" id="Union" />
        </svg>
      </div>
    </div>
  );

  const connectivityIcon = (
    <div className="overflow-clip relative shrink-0 size-[22px]" data-name="Icon">
      <div className="absolute flex inset-[-2.15%_-2.14%_-2.15%_-2.16%] items-center justify-center">
        <div className="-rotate-45 flex-none h-[11.358px] w-[24.04px]">
          <div className="relative size-full" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22.1699 10.5449">
              <path d={svgPaths.p5be3300} fill={openDropdown === 'connectivity' ? '#ba0020' : 'black'} fillOpacity="0.9" id="Union" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  const featuresIcon = (
    <div className="overflow-clip relative shrink-0 size-[22px]" data-name="功能卖点/智能与连接功能/无线互联警报">
      <div className="absolute inset-[5.01%_5%_4.99%_5%]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.7996 19.7996">
          <g id="Vector">
            <path d={svgPaths.p358bc900} fill={openDropdown === 'features' ? '#ba0020' : 'black'} />
            <path d={svgPaths.p298bf100} fill={openDropdown === 'features' ? '#ba0020' : 'black'} />
            <path d={svgPaths.p65cd280} fill={openDropdown === 'features' ? '#ba0020' : 'black'} />
            <path d={svgPaths.p26f82200} fill={openDropdown === 'features' ? '#ba0020' : 'black'} />
            <path d={svgPaths.p2fffe280} fill={openDropdown === 'features' ? '#ba0020' : 'black'} />
          </g>
        </svg>
      </div>
    </div>
  );
  
  const powerSourceCount = [checkboxStates?.battery10Year, checkboxStates?.batteryReplaceable].filter(Boolean).length;
  const connectivityCount = isHomeAlarms
    ? [checkboxStates?.waterLeak, checkboxStates?.heatAlarm, checkboxStates?.thermometerHygrometer].filter(Boolean).length
    : [checkboxStates?.baseStation, checkboxStates?.wirelessInterconnected, checkboxStates?.wifi, checkboxStates?.standalone].filter(Boolean).length;
  const featuresCount = [checkboxStates?.voiceAlarm, checkboxStates?.nightMode, checkboxStates?.magneticMount].filter(Boolean).length;
  
  return (
    <div 
      className={`bg-white relative w-full ${(openDropdown || closingDropdown) ? 'shadow-[0px_6px_30px_0px_rgba(0,0,0,0.12)]' : ''}`} 
      data-name="Container"
      onMouseLeave={handleMouseLeave}
    >
      {/* Full-width border when no dropdown is open */}
      {!openDropdown && !closingDropdown && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[rgba(0,0,0,0.1)]" />
      )}
      
      {/* Filter bar - centered content with padding */}
      <div className="flex justify-center px-[120px]">
        <div className={`content-stretch flex gap-[32px] h-[64px] items-center max-w-[1312px] relative shrink-0 w-full border-b ${(openDropdown || closingDropdown) ? 'border-transparent' : 'border-[rgba(0,0,0,0.1)]'}`} data-name="Container">
          <div className="content-stretch flex flex-[1_0_0] gap-[48px] items-center min-h-px min-w-px relative">
            <FilterButton 
              isOpen={openDropdown === 'power'}
              onMouseEnter={() => toggleDropdown('power')}
              icon={powerSourceIcon}
              label={`Power Source${powerSourceCount > 0 ? ` (${powerSourceCount})` : ''}`}
            />
            <FilterButton 
              isOpen={openDropdown === 'connectivity'}
              onMouseEnter={() => toggleDropdown('connectivity')}
              icon={connectivityIcon}
              label={`${isHomeAlarms ? 'Sensor Type' : 'Connectivity'}${connectivityCount > 0 ? ` (${connectivityCount})` : ''}`}
            />
            <FilterButton 
              isOpen={openDropdown === 'features'}
              onMouseEnter={() => toggleDropdown('features')}
              icon={featuresIcon}
              label={`Features${featuresCount > 0 ? ` (${featuresCount})` : ''}`}
            />
          </div>
          {hasAnyChecked && (
            <p 
              className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#ba0020] text-[16px] text-right cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onReset}
            >
              Reset
            </p>
          )}
        </div>
      </div>
      
      {/* Dropdown panels - also centered with padding */}
      {(openDropdown === 'power' || closingDropdown === 'power') && (
        <div className="flex justify-center px-[120px]">
          <PowerSourceDropdown 
            checkboxStates={checkboxStates} 
            setCheckboxStates={setCheckboxStates}
            isClosing={closingDropdown === 'power'}
          />
        </div>
      )}
      {(openDropdown === 'connectivity' || closingDropdown === 'connectivity') && (
        <div className="flex justify-center px-[120px]">
          <ConnectivityDropdown 
            checkboxStates={checkboxStates} 
            setCheckboxStates={setCheckboxStates}
            isClosing={closingDropdown === 'connectivity'}
            isHomeAlarms={isHomeAlarms}
          />
        </div>
      )}
      {(openDropdown === 'features' || closingDropdown === 'features') && (
        <div className="flex justify-center px-[120px]">
          <FeaturesDropdown 
            checkboxStates={checkboxStates} 
            setCheckboxStates={setCheckboxStates}
            isClosing={closingDropdown === 'features'}
          />
        </div>
      )}
    </div>
  );
}

export default function Container(props?: ContainerProps) {
  const { hasAnyChecked, onReset } = props || {};
  
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="Container">
      <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="Top Tips">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center px-[120px] relative w-full">
            <Body />
          </div>
        </div>
      </div>
      <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="Web/全局/导航">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center px-[120px] relative size-full">
            <Body1 />
          </div>
        </div>
      </div>
      <Container1 hasAnyChecked={hasAnyChecked} onReset={onReset} />
    </div>
  );
}