import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import svgPaths from "./svg-wbn2vrrkrc";
import imgBanner from "@/assets/placeholder-image-url";
import imgImage14 from "@/assets/placeholder-image-url";
import imgImage15 from "@/assets/placeholder-image-url";
import { imgImage13 } from "./svg-hbbdq";
import { InteractiveCheckbox } from "../app/components/InteractiveCheckbox";
import { FilterBarOnly } from "./Container";
import Header from "./Header";
import ProductCard from "./Container-27-529";
import { type Product, filterProducts, type CheckboxStates as CheckboxStatesType, defaultCheckboxStates as defaultCBStates, useCategories } from "../app/components/use-products";
import { InfoIconWithTooltip } from "../app/components/InfoIconWithTooltip";
import CompareDialog from "../app/components/compare-dialog";
import GlobalNav from "../app/components/global-nav";

// Product card skeleton for loading state
function ProductCardSkeleton() {
  return (
    <div className="bg-white flex flex-col gap-[32px] items-start overflow-clip p-[20px] rounded-[32px] w-full" style={{ height: '100%' }}>
      <div className="flex flex-col gap-[16px] items-start flex-[1_0_0] w-full">
        {/* Image placeholder */}
        <div className="aspect-square w-full rounded-[16px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
        {/* Product info */}
        <div className="flex flex-col gap-[12px] items-start w-full">
          {/* Name: 2 lines */}
          <div className="flex flex-col gap-[6px] w-full h-[48px]">
            <div className="h-[18px] w-[85%] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            <div className="h-[18px] w-[60%] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          </div>
          {/* Features: 3 lines */}
          <div className="flex flex-col gap-[4px] w-full h-[52px]">
            <div className="h-[12px] w-[70%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
            <div className="h-[12px] w-[55%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
            <div className="h-[12px] w-[65%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
          </div>
        </div>
      </div>
      {/* Bottom: SKU dropdown + price */}
      <div className="flex flex-col gap-[16px] items-start w-full">
        <div className="h-[40px] w-full rounded-[10px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
        <div className="flex items-center justify-between w-full">
          <div className="h-[28px] w-[90px] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          <div className="h-[40px] w-[100px] rounded-[20px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
        </div>
      </div>
    </div>
  );
}

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

function Component2() {
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
      <Component2 />
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

function Component1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[32px] h-full items-center min-h-px min-w-px relative" data-name="左侧">
      <Logo />
      <Tab />
    </div>
  );
}

function IconGroup() {
  const navigate = useNavigate();
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="icon Group">
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
      <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer" data-name="icon/常规/用户" onClick={() => navigate("/admin")}>
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

function Component4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="右侧">
      <IconGroup />
    </div>
  );
}

function Body1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center max-w-[1312px] min-h-px min-w-px relative w-full" data-name="Body">
      <Component1 />
      <Component4 />
    </div>
  );
}

function Container() {
  return (
    <div className="fixed content-stretch flex flex-col items-start left-0 right-0 top-0 z-50" data-name="Container">
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
    </div>
  );
}

function Container1({ categoryId = "smoke-alarms" }: { categoryId?: string }) {
  const { categories, loading } = useCategories();
  const category = categories.find(c => c.id === categoryId);
  const categoryName = category?.name;
  const defaultName = categoryId === "smoke-alarms" ? "Smoke Alarms" : "CO Alarms";
  const defaultDesc = categoryId === "smoke-alarms"
    ? "X-SENSE smoke alarms offer fast, accurate alerts with practical features, keeping your home and family safe from smoke and fire dangers."
    : "X-SENSE CO alarms provide reliable carbon monoxide detection with advanced sensors, protecting your family from this invisible, odorless threat.";

  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[1312px] not-italic relative shrink-0 w-full whitespace-pre-wrap" data-name="Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] min-w-full relative shrink-0 text-[56px] text-black w-[min-content]">{loading ? "\u00A0" : (categoryName || defaultName)}</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[538px]">{loading ? "\u00A0" : (category?.description || defaultDesc)}</p>
    </div>
  );
}

function Banner({ categoryId = "smoke-alarms" }: { categoryId?: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategories();
  const category = categories.find(c => c.id === categoryId);
  const bannerSrc = category?.bannerPcUrl || "";

  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      if (bannerRef.current) {
        const scrollY = window.scrollY;
        // 计算透明度：从0滚动到400px时，从1渐变到0
        const opacity = Math.max(0, 1 - scrollY / 400);
        // 计算位移：向下移动的速度是滚动速度的0.5倍，产生视差效果
        const translateY = scrollY * 0.5;
        
        // 直接操作DOM，避免state更新导致的重渲染
        bannerRef.current.style.opacity = String(opacity);
        bannerRef.current.style.transform = `translateY(${translateY}px)`;
      }
    };

    const onScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // 初始状态

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div 
      ref={bannerRef}
      className="content-stretch flex flex-col h-[400px] items-center justify-center left-0 overflow-clip px-[120px] right-0" 
      data-name="Banner"
      style={{ willChange: 'opacity, transform' }}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bannerSrc} />
      <Container1 categoryId={categoryId} />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="relative shrink-0 size-[22px]" data-name="power_pc">
        <div className="absolute inset-[4.79%_25.83%_4.38%_25.83%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.7666 20.0498">
            <path d={svgPaths.pdb9f400} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Power Source</p>
    </div>
  );
}

function Container8({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox 
      label="10-Year Sealed Lithium Battery" 
      checked={checkboxStates.battery10Year}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, battery10Year: checked }))}
    />
  );
}

function Container9({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox 
      label="Replaceable Battery (Included)" 
      checked={checkboxStates.batteryReplaceable}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, batteryReplaceable: checked }))}
    />
  );
}

function Container9b({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox 
      label="AC Plug-in + Replaceable Battery Backup" 
      checked={checkboxStates.batteryACPlugIn}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, batteryACPlugIn: checked }))}
    />
  );
}

function Container7({ checkboxStates, setCheckboxStates, products, productsLoading }: any) {
  // Derive available power source options from actual product data in this category
  const POWER_SOURCE_CHECKBOX_MAP: { key: string; label: string }[] = [
    { key: "battery10Year", label: "10-Year Sealed Lithium Battery" },
    { key: "batteryReplaceable", label: "Replaceable Battery (Included)" },
    { key: "batteryACPlugIn", label: "AC Plug-in + Replaceable Battery Backup" },
  ];

  const availableOptions = POWER_SOURCE_CHECKBOX_MAP.filter(({ label }) =>
    (products || []).some((p: Product) => p.powerSource?.includes(label))
  );

  // Show skeleton placeholders while products are still loading
  if (productsLoading) {
    return (
      <div className="content-stretch flex gap-[48px] items-start relative shrink-0 flex-wrap" data-name="Container">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex gap-[12px] items-center shrink-0">
            <div className="w-[22px] h-[22px] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            <div
              className="h-[20px] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]"
              style={{ width: [220, 200, 280][i] }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="content-stretch flex gap-[48px] items-start relative shrink-0 flex-wrap" data-name="Container">
      {availableOptions.map(({ key, label }) => (
        <InteractiveCheckbox
          key={key}
          label={label}
          checked={checkboxStates[key]}
          onChange={(checked: boolean) => setCheckboxStates((prev: any) => ({ ...prev, [key]: checked }))}
        />
      ))}
    </div>
  );
}

function Container5({ checkboxStates, setCheckboxStates, products, productsLoading }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-[1312px]" data-name="Container">
      <Container6 />
      <Container7 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} products={products} productsLoading={productsLoading} />
    </div>
  );
}

function Container11({ categoryId }: { categoryId?: string }) {
  const isHomeAlarms = categoryId === "home-alarms";
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
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
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">{isHomeAlarms ? "Sensor Type" : "Connectivity"}</p>
    </div>
  );
}

function SensorTypeOptions({ checkboxStates, setCheckboxStates }: any) {
  return (
    <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-name="Container">
      <InteractiveCheckbox
        checked={checkboxStates.waterLeak}
        onChange={(checked: boolean) => setCheckboxStates((prev: any) => ({ ...prev, waterLeak: checked }))}
      >
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Water Leak</p>
      </InteractiveCheckbox>
      <InteractiveCheckbox
        checked={checkboxStates.heatAlarm}
        onChange={(checked: boolean) => setCheckboxStates((prev: any) => ({ ...prev, heatAlarm: checked }))}
      >
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Heat Alarm</p>
      </InteractiveCheckbox>
      <InteractiveCheckbox
        checked={checkboxStates.thermometerHygrometer}
        onChange={(checked: boolean) => setCheckboxStates((prev: any) => ({ ...prev, thermometerHygrometer: checked }))}
      >
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Thermometer &amp; Hygrometer</p>
      </InteractiveCheckbox>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular','Noto_Sans_JP:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Base Station Interconnected (App)</p>
      <InfoIconWithTooltip
        iconPath={svgPaths.p12e9fe00}
        tooltip="Connect alarms through a central base station hub with app control for monitoring, testing, and notifications across all connected devices."
      />
    </div>
  );
}

function Container13({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.baseStation}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, baseStation: checked }))}
    >
      <Container14 />
    </InteractiveCheckbox>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Wireless Interconnected</p>
      <InfoIconWithTooltip
        iconPath={svgPaths.p12e9fe00}
        tooltip="When one alarm detects danger, all wirelessly interconnected alarms sound simultaneously throughout your home without needing Wi-Fi."
      />
    </div>
  );
}

function Container15({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.wirelessInterconnected}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, wirelessInterconnected: checked }))}
    >
      <Container16 />
    </InteractiveCheckbox>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Wi-Fi (App)</p>
      <InfoIconWithTooltip
        iconPath={svgPaths.p12e9fe00}
        tooltip="Connect directly via WiFi, receive APP notifications, and manage remote test/silence with low battery alerts."
      />
    </div>
  );
}

function Container17({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.wifi}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, wifi: checked }))}
    >
      <Container18 />
    </InteractiveCheckbox>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Standalone</p>
      <InfoIconWithTooltip
        iconPath={svgPaths.p12e9fe00}
        tooltip="Independent alarm operation without connection to other devices or networks. Simple installation with no additional setup required."
      />
    </div>
  );
}

function Container19({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.standalone}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, standalone: checked }))}
    >
      <Container20 />
    </InteractiveCheckbox>
  );
}

function Container12({ checkboxStates, setCheckboxStates }: any) {
  return (
    <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-name="Container">
      <Container13 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      <Container15 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      <Container17 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      <Container19 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
    </div>
  );
}

function Container10({ checkboxStates, setCheckboxStates, categoryId }: any) {
  const isHomeAlarms = categoryId === "home-alarms";
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative shrink-0 w-[1312px]" data-name="Container">
      <Container11 categoryId={categoryId} />
      {isHomeAlarms ? (
        <SensorTypeOptions checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      ) : (
        <Container12 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      )}
    </div>
  );
}

function Component5({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative shrink-0 size-[22px]"} data-name="功能卖点/智能与连接功能/无线互联警报">
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
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="Container">
      <Component5 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Features</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Voice Alerts</p>
    </div>
  );
}

function Container24({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.voiceAlarm}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, voiceAlarm: checked }))}
    >
      <Container25 />
    </InteractiveCheckbox>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Night Mode</p>
    </div>
  );
}

function Container26({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.nightMode}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, nightMode: checked }))}
    >
      <Container27 />
    </InteractiveCheckbox>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black">Magnetic Mount</p>
    </div>
  );
}

function Container28({ checkboxStates, setCheckboxStates }: any) {
  return (
    <InteractiveCheckbox
      checked={checkboxStates.magneticMount}
      onChange={(checked) => setCheckboxStates((prev: any) => ({ ...prev, magneticMount: checked }))}
    >
      <Container29 />
    </InteractiveCheckbox>
  );
}

function Container23({ checkboxStates, setCheckboxStates }: any) {
  return (
    <div className="content-stretch flex gap-[48px] items-start relative shrink-0" data-name="Container">
      <Container24 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      <Container26 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      <Container28 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
    </div>
  );
}

function Container21({ checkboxStates, setCheckboxStates, hasAnyChecked, onReset }: any) {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[1312px]" data-name="Container">
      <div className="flex flex-col gap-[24px] w-full">
        <Container22 />
        <Container23 checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} />
      </div>
    </div>
  );
}

function Container4({ checkboxStates, setCheckboxStates, hasAnyChecked, onReset, products, productsLoading, categoryId }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[1312px] relative shrink-0 w-full" data-name="Container">
      <Container5 
        checkboxStates={checkboxStates}
        setCheckboxStates={setCheckboxStates}
        products={products}
        productsLoading={productsLoading}
      />
      <div className="h-0 relative shrink-0 w-[1312px]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1312 1">
            <path d="M0 0.5H1312" id="Vector 3597" stroke="var(--stroke-0, black)" strokeOpacity="0.1" />
          </svg>
        </div>
      </div>
      <Container10 
        checkboxStates={checkboxStates}
        setCheckboxStates={setCheckboxStates}
        categoryId={categoryId}
      />
      <div className="h-0 relative shrink-0 w-[1312px]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1312 1">
            <path d="M0 0.5H1312" id="Vector 3597" stroke="var(--stroke-0, black)" strokeOpacity="0.1" />
          </svg>
        </div>
      </div>
      <Container21 
        checkboxStates={checkboxStates}
        setCheckboxStates={setCheckboxStates}
        hasAnyChecked={hasAnyChecked}
        onReset={onReset}
      />
    </div>
  );
}

function Container3({ checkboxStates, setCheckboxStates, hasAnyChecked, onReset, products, productsLoading, categoryId }: any) {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Container4 
        checkboxStates={checkboxStates}
        setCheckboxStates={setCheckboxStates}
        hasAnyChecked={hasAnyChecked}
        onReset={onReset}
        products={products}
        productsLoading={productsLoading}
        categoryId={categoryId}
      />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgImage14} />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame18() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame17() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame18 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame19 />
      <Frame20 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame21 />
      <Frame />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup />
      <Frame22 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame23 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame30() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame29() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame30 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame28 />
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame27 />
      <Frame31 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame26 />
      <Frame1 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup1 />
      <Frame25 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame24 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame38() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame38 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame36 />
      <Frame37 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame35 />
      <Frame39 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame34 />
      <Frame2 />
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup2 />
      <Frame33 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame32 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame46() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame45() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame46 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame44 />
      <Frame45 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame43 />
      <Frame47 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame42 />
      <Frame3 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup3 />
      <Frame41 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame40 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function Container32({ products, productsLoading }: { products: Product[]; productsLoading?: boolean }) {
  return (
    <div className="content-stretch grid grid-cols-4 gap-[12px] items-stretch relative shrink-0 w-[1312px]" data-name="Container">
      {productsLoading ? (
        [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={`skeleton-${i}`} />)
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            className="bg-white content-stretch flex flex-col gap-[32px] items-start overflow-clip p-[20px] relative rounded-[32px] w-full"
            product={product}
          />
        ))
      )}
    </div>
  );
}

function MaskGroup4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame54() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame53() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame54 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame52 />
      <Frame53 />
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame51 />
      <Frame55 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame50 />
      <Frame4 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup4 />
      <Frame49 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame48 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup5() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame62() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame61() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame62 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame60 />
      <Frame61 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame59 />
      <Frame63 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame58 />
      <Frame5 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup5 />
      <Frame57 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame56 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup6() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame70() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame69() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame70 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame68 />
      <Frame69 />
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame67 />
      <Frame71 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame66 />
      <Frame6 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup6 />
      <Frame65 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame64 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

function MaskGroup7() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Mask group">
      <div className="col-1 h-[188px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[16px_-15px] mask-size-[220px_220px] ml-[-16px] mt-[15px] relative row-1 w-[253px]" data-name="image 13" style={{ maskImage: `url('${imgImage13}')` }}>
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage15} />
      </div>
    </div>
  );
}

function Frame76() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[normal] relative shrink-0 text-[#ba0020] text-[16px] w-full">Hot</p>
      <p className="font-['Metropolis:Semi_Bold',sans-serif] leading-[1.2] relative shrink-0 text-[18px] text-black w-full">SD19W Wireless InterconnectedSmoke Alarm</p>
      <ul className="block font-['Metropolis:Regular',sans-serif] leading-[0] list-disc relative shrink-0 text-[#999] text-[16px] w-full">
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">Wireless Interconnected</span>
        </li>
        <li className="mb-0 ms-[24px]">
          <span className="leading-[24px]">10-Year Battery</span>
        </li>
        <li className="ms-[24px]">
          <span className="leading-[24px]">LED Indicator</span>
        </li>
      </ul>
    </div>
  );
}

function Frame78() {
  return (
    <div className="absolute right-[23.5px] size-[16px] top-[12px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_637)" id="Frame 2117131708">
          <path d={svgPaths.p13ba5000} fill="var(--fill-0, #666666)" id="Rectangle 17" />
        </g>
        <defs>
          <clipPath id="clip0_1_637">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Frame77() {
  return (
    <div className="h-[40px] relative rounded-[10px] shrink-0 w-full">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Metropolis:Medium',sans-serif] leading-[normal] left-[24px] not-italic text-[#666] text-[16px] top-[calc(50%-8px)]">6*XS0B-MR+1*Base Stati...</p>
        <Frame78 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Frame75() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <Frame76 />
      <Frame77 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex font-['Metropolis:Medium',sans-serif] gap-[8px] items-end leading-[normal] not-italic relative shrink-0 text-center">
      <p className="h-[21px] relative shrink-0 text-[24px] text-black w-[83px] whitespace-pre-wrap">$89.99</p>
      <p className="[text-decoration-skip-ink:none] decoration-solid line-through relative shrink-0 text-[#999] text-[14px]">$109.99</p>
    </div>
  );
}

function Frame74() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
      <Frame75 />
      <Frame79 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-[#ba0020] h-[40px] relative rounded-[200px] shrink-0 w-full">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[54px] py-[8px] relative size-full">
          <p className="font-['Metropolis:Medium',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white">Learn more</p>
        </div>
      </div>
    </div>
  );
}

function Frame73() {
  return (
    <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
      <Frame74 />
      <Frame7 />
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative">
      <MaskGroup7 />
      <Frame73 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start p-[32px] rounded-[10px]">
      <div aria-hidden="true" className="absolute border border-[#eeeded] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Frame72 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute bottom-[91.63%] contents left-0 top-0">
      <div className="absolute bottom-[91.63%] left-0 top-0 w-[56px]">
        <div className="absolute inset-[0_0_0.95%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 56 53.4862">
            <path d={svgPaths.p20375f00} fill="var(--fill-0, #BA0020)" id="Rectangle 22" />
          </svg>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute bottom-[93.18%] font-['Metropolis:Medium',sans-serif] font-['Metropolis:Semi_Bold',sans-serif] leading-[0] left-[28.02px] not-italic text-[0px] text-center text-white top-[1.4%] w-[38.222px] whitespace-pre-wrap">
        <p className="leading-[normal] mb-0 text-[18px]">$30</p>
        <p className="leading-[16px] text-[12px]">OFF</p>
      </div>
    </div>
  );
}

// Container33 removed - now using single dynamic grid in Container31

function Container31({ products, productsLoading }: { products: Product[]; productsLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start max-w-[1312px] relative shrink-0 w-full" data-name="Container">
      <Container32 products={products} productsLoading={productsLoading} />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black w-full">
        <p className="leading-[24px] whitespace-pre-wrap">Products</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Smoke Alarms</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">CO Alarms</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Combination Alarms</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Home Alarms</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Link />
      <Link1 />
      <Link2 />
      <Link3 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Heading />
      <Container37 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black w-full">
        <p className="leading-[24px] whitespace-pre-wrap">Support</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Contact Us</p>
      </div>
    </div>
  );
}

function Link5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">FAQs</p>
      </div>
    </div>
  );
}

function Link6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Order Tracking</p>
      </div>
    </div>
  );
}

function Link7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Warranty Extension Registration</p>
      </div>
    </div>
  );
}

function Link8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Products Manual</p>
      </div>
    </div>
  );
}

function Link9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Developer APIs</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Link4 />
      <Link5 />
      <Link6 />
      <Link7 />
      <Link8 />
      <Link9 />
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Heading1 />
      <Container39 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black w-full">
        <p className="leading-[24px] whitespace-pre-wrap">Explore</p>
      </div>
    </div>
  );
}

function Link10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">About Us</p>
      </div>
    </div>
  );
}

function Link11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Safety Tips</p>
      </div>
    </div>
  );
}

function Link12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Affiliate Program</p>
      </div>
    </div>
  );
}

function Link13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Protect+</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Link10 />
      <Link11 />
      <Link12 />
      <Link13 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Heading2 />
      <Container41 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black w-full">
        <p className="leading-[24px] whitespace-pre-wrap">{`Privacy & Terms`}</p>
      </div>
    </div>
  );
}

function Link14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Shipping Policy</p>
      </div>
    </div>
  );
}

function Link15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">{`Return & Warranty Policy`}</p>
      </div>
    </div>
  );
}

function Link16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Terms of Use</p>
      </div>
    </div>
  );
}

function Link17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Privacy Policy</p>
      </div>
    </div>
  );
}

function Link18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">EU Declaration of Conformity</p>
      </div>
    </div>
  );
}

function Link19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Vulnerability Report</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <Link14 />
      <Link15 />
      <Link16 />
      <Link17 />
      <Link18 />
      <Link19 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Heading3 />
      <Container43 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[40px] h-[248px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container36 />
      <Container38 />
      <Container40 />
      <Container42 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p1d17700} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1877f2] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Background">
      <Svg />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.35%_8.33%_8.32%_8.33%]" data-name="Group">
      <div className="absolute inset-[-5.02%_-5%_-4.98%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
          <g id="Group">
            <path d={svgPaths.p40c12a0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p2ecfec80} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#c13584] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Background">
      <Svg1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[20.56%_8.23%]" data-name="Group">
      <div className="absolute inset-[-7.07%_-4.99%_-7.08%_-4.99%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6992 10.7545">
          <g id="Group">
            <path d={svgPaths.p36afdb80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p2b616d00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group1 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[red] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Background">
      <Svg2 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[20.56%_8.33%_20.55%_8.33%]" data-name="Group">
      <div className="absolute inset-[-7.08%_-5%_-7.07%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6665 10.756">
          <g id="Group">
            <path d={svgPaths.p2a7f3c00} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p378eec0} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group2 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#ff4500] content-stretch flex items-center justify-center relative rounded-[16px] shrink-0 size-[32px]" data-name="Background">
      <Svg3 />
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Background />
      <Background1 />
      <Background2 />
      <Background3 />
    </div>
  );
}

function MockingPaymentIconsWithSimpleDivsTextSinceDirectLogosArentGuaranteedInLucide() {
  return (
    <div className="bg-[#005c9e] content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Mocking payment icons with simple divs/text since direct logos aren\'t guaranteed in lucide">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[10px] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white w-[24.2px]">
        <p className="leading-[normal] whitespace-pre-wrap">AMEX</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-white content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[10px] text-center w-[18.02px]">
        <p className="leading-[normal] whitespace-pre-wrap">Pay</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[10px] text-center w-[25.52px]">
        <p className="leading-[normal] whitespace-pre-wrap">GPay</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[10px] relative shrink-0 w-[6px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-[#f79e1b] left-[-4px] rounded-[5px] size-[10px] top-0" data-name="Background" />
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="bg-[#eb001b] rounded-[5px] shrink-0 size-[10px]" data-name="Background" />
      <Margin />
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#003087] text-[10px] text-center w-[32.91px]">
        <p className="leading-[normal] whitespace-pre-wrap">PayPal</p>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-white content-stretch flex h-[24px] items-center justify-center px-[5px] py-[3px] relative rounded-[4px] shrink-0 w-[36px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#1434cb] text-[10px] text-center w-[24.14px]">
        <p className="leading-[normal] whitespace-pre-wrap">VISA</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <MockingPaymentIconsWithSimpleDivsTextSinceDirectLogosArentGuaranteedInLucide />
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
      <BackgroundBorder4 />
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-[256px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative w-full">
        <Container46 />
        <Container47 />
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.4)] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Enter Your Email Address</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip py-[8px] relative rounded-[inherit] w-full">
        <Container49 />
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[16.65%_8.33%_16.68%_8.33%]" data-name="Group">
      <div className="absolute inset-[-6.23%_-5%_-6.27%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6668 12">
          <g id="Group">
            <path d={svgPaths.pdaa6c80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.pfe3b580} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#eaeaea] relative shrink-0 size-[42px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg4 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative rounded-[12px] shrink-0 w-full" data-name="HorizontalBorder">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center pl-[9px] pr-px py-px relative w-full">
          <Input />
          <Button />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="SVG">
          <path d={svgPaths.p1098da98} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#c0001f] content-stretch flex h-[14px] items-center justify-center relative rounded-[2px] shrink-0 w-[13px]" data-name="Background">
      <Svg5 />
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Label">
      <Background4 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">Exclusive updates delivered directly to your mailbox!</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative">
        <HorizontalBorder1 />
        <Label />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="HorizontalBorder">
      <Container45 />
      <Container48 />
    </div>
  );
}

function Container51() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col items-start pr-[21.6px] relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[13px] w-full">
          <p className="leading-[normal] whitespace-pre-wrap">Copyright © 2025 X-Sense. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[8.35%_8.33%_8.32%_8.33%]" data-name="Group">
      <div className="absolute inset-[-5.02%_-5%_-4.98%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
          <g id="Group">
            <path d={svgPaths.p1878fd00} id="Vector" stroke="var(--stroke-0, #555555)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p131df600} id="Vector_2" stroke="var(--stroke-0, #555555)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]" data-name="SVG">
      <Group4 />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[16px]" data-name="Container">
      <Svg6 />
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex gap-[6px] items-center justify-end relative shrink-0" data-name="Container">
      <Container53 />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[13px] whitespace-nowrap">
        <p className="leading-[normal]">United States (English)</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container51 />
      <Container52 />
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-full" data-name="Container">
      <HorizontalBorder />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1312 1">
            <path d="M0 0.5H1312" id="Vector 3602" stroke="var(--stroke-0, black)" strokeOpacity="0.1" />
          </svg>
        </div>
      </div>
      <Container50 />
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center py-[40px] relative shrink-0" data-name="Container" style={{ width: 'calc(100vw)', marginLeft: 'calc(-120px)', marginRight: 'calc(-120px)' }}>
      <div className="content-stretch flex flex-col gap-[56px] items-start max-w-[1312px] shrink-0 w-full">
        <Container35 />
        <Container44 />
      </div>
    </div>
  );
}

function Container30({ hasAnyChecked, onReset, filteredProducts, onCompare, productsLoading }: { hasAnyChecked: boolean; onReset: () => void; filteredProducts: Product[]; onCompare?: () => void; productsLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <div className="max-w-[1312px] w-full">
        <Header hasAnyChecked={hasAnyChecked} onReset={onReset} productCount={filteredProducts.length} onCompare={onCompare} />
      </div>
      <Container31 products={filteredProducts} productsLoading={productsLoading} />
      <Container34 />
    </div>
  );
}

function Container2({ checkboxStates, setCheckboxStates, hasAnyChecked, onReset, filterSectionRef, filteredProducts, onCompare, productsLoading, products, categoryId }: any) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-center left-0 px-[120px] py-[24px] right-0 top-[504px] bg-[#F6F6F6]" data-name="Container">
      <div ref={filterSectionRef}>
        <Container3 
          checkboxStates={checkboxStates}
          setCheckboxStates={setCheckboxStates}
          hasAnyChecked={hasAnyChecked}
          onReset={onReset}
          products={products}
          productsLoading={productsLoading}
          categoryId={categoryId}
        />
      </div>
      <Container30 hasAnyChecked={hasAnyChecked} onReset={onReset} filteredProducts={filteredProducts} onCompare={onCompare} productsLoading={productsLoading} />
    </div>
  );
}

export default function Component({ products = [], productsLoading = false, categoryId = "smoke-alarms" }: { products?: Product[]; productsLoading?: boolean; categoryId?: string }) {
  // Checkbox states for all filters
  const [checkboxStates, setCheckboxStates] = useState({
    battery10Year: false,
    batteryReplaceable: false,
    batteryACPlugIn: false,
    baseStation: false,
    wirelessInterconnected: false,
    wifi: false,
    standalone: false,
    waterLeak: false,
    heatAlarm: false,
    thermometerHygrometer: false,
    voiceAlarm: false,
    nightMode: false,
    magneticMount: false,
  });

  // State for sticky filter bar visibility
  const [showStickyFilter, setShowStickyFilter] = useState(false);
  const filterSectionRef = useRef<HTMLDivElement>(null);

  // Check if any checkbox is selected
  const hasAnyChecked = Object.values(checkboxStates).some(value => value);

  // Filter products based on checkbox states
  const filteredProducts = filterProducts(products, checkboxStates as any);

  // Reset all checkboxes
  const handleReset = () => {
    setCheckboxStates({
      battery10Year: false,
      batteryReplaceable: false,
      batteryACPlugIn: false,
      baseStation: false,
      wirelessInterconnected: false,
      wifi: false,
      standalone: false,
      waterLeak: false,
      heatAlarm: false,
      thermometerHygrometer: false,
      voiceAlarm: false,
      nightMode: false,
      magneticMount: false,
    });
  };

  // Scroll listener to show/hide sticky filter bar
  useEffect(() => {
    const handleScroll = () => {
      if (filterSectionRef.current) {
        const rect = filterSectionRef.current.getBoundingClientRect();
        // Show sticky bar only when the entire filter section (including all checkboxes and reset button) 
        // has scrolled past the bottom of the navigation bar (104px from top)
        // This means the bottom of the filter section should be above the nav bar
        setShowStickyFilter(rect.bottom < 104);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compare dialog state
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <div className="bg-white relative size-full" data-name="分类页/平铺_换行">
      <GlobalNav />
      {/* Sticky Filter Bar - animated slide in/out */}
      <div 
        className={`fixed top-[104px] left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          showStickyFilter 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <FilterBarOnly 
          hasAnyChecked={hasAnyChecked} 
          onReset={handleReset}
          checkboxStates={checkboxStates}
          setCheckboxStates={setCheckboxStates}
          isVisible={showStickyFilter}
          categoryId={categoryId}
        />
      </div>
      <div className="pt-[104px]">
        <Banner categoryId={categoryId} />
        <Container2 
          checkboxStates={checkboxStates}
          setCheckboxStates={setCheckboxStates}
          hasAnyChecked={hasAnyChecked}
          onReset={handleReset}
          filterSectionRef={filterSectionRef}
          filteredProducts={filteredProducts}
          productsLoading={productsLoading}
          onCompare={() => setCompareOpen(true)}
          products={products}
          categoryId={categoryId}
        />
      </div>
      <CompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} categoryId={categoryId} />
    </div>
  );
}