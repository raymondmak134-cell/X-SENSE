import React, { useEffect, useRef, useState, useCallback } from "react";
import { type Product, filterProducts, type CheckboxStates as CheckboxStatesType, defaultCheckboxStates as defaultCBStates, useCategories } from "../app/components/use-products";
import { SkuDropdown } from "../app/components/SkuDropdown";
import svgPaths from "./svg-7h0tlbncam";

import imgImage from "@/assets/placeholder-image-url";
import imgProductImage from "@/assets/placeholder-image-url";
import Footer from "./Footer";
import { ImageWithFallback } from "../app/components/figma/ImageWithFallback";
import MobileCompareDialog from "../app/components/mobile-compare-dialog";
import MobileNav from "../app/components/mobile-nav";
import { ProductFeatures as ProductFeaturesIcons } from "../app/components/feature-icons";
import discountSvg from "./svg-dh0xjw0cla";

/* ========== 横幅区域 ========== */

function TextContainer({ categoryId = "smoke-alarms" }: { categoryId?: string }) {
  const { categories, loading } = useCategories();
  const category = categories.find((c: any) => c.id === categoryId);
  const defaultName = categoryId === "smoke-alarms" ? "Smoke Detectors" : "CO Detectors";
  const defaultDesc = categoryId === "smoke-alarms"
    ? "X-SENSE smoke alarms offer fast, accurate alerts with practical features, keeping your home and family safe from smoke and fire dangers."
    : "X-SENSE CO alarms provide reliable carbon monoxide detection with advanced sensors, protecting your family from this invisible, odorless threat.";

  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-[353px]" data-name="Text Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-black w-full">{loading ? "\u00A0" : (category?.name || defaultName)}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] w-full">{loading ? "\u00A0" : (category?.description || defaultDesc)}</p>
    </div>
  );
}

function BannerImage({ categoryId = "smoke-alarms" }: { categoryId?: string }) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const { categories } = useCategories();
  const category = categories.find((c: any) => c.id === categoryId);
  const bannerSrc = category?.bannerMobileUrl || imgImage;

  useEffect(() => {
    let rafId = 0;
    let lastOpacity = -1;
    let lastTranslateY = -1;
    const bannerHeight = 262;

    const handleScroll = () => {
      rafId = 0;
      const el = bannerRef.current;
      if (!el) return;

      const scrollY = window.scrollY;

      // 超出可视范围后不再更新，减少无用计算
      if (scrollY > bannerHeight * 2) {
        if (lastOpacity !== 0) {
          el.style.opacity = '0';
          el.style.transform = 'translate3d(0,0,0)';
          lastOpacity = 0;
          lastTranslateY = 0;
        }
        return;
      }

      // 计算透明度和位移
      const opacity = Math.max(0, 1 - scrollY / bannerHeight);
      const translateY = (scrollY * 0.5 + 0.5) | 0; // 取整避免亚像素渲染

      // 值未变化则跳过DOM写入
      if (opacity === lastOpacity && translateY === lastTranslateY) return;
      lastOpacity = opacity;
      lastTranslateY = translateY;

      // 使用 translate3d 强制 GPU 合成层，避免主线程重排重绘
      el.style.transform = `translate3d(0,${translateY}px,0)`;
      el.style.opacity = String(opacity);
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(handleScroll);
      }
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
      className="relative content-stretch flex flex-col h-[262px] items-start overflow-clip p-[20px] w-full"
      data-name="Image"
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: 1000,
        WebkitPerspective: 1000,
      } as React.CSSProperties}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={bannerSrc} />
      <TextContainer categoryId={categoryId} />
    </div>
  );
}

/* ========== 筛选栏组件 ========== */

type FilterType = 'powerSource' | 'connectivity' | 'features' | null;

function FilterItemButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <div
      className="content-stretch flex gap-[4px] items-center relative shrink-0 cursor-pointer"
      data-name="Container"
      onClick={onClick}
    >
      <p className={`font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isActive ? 'text-[#ba0020]' : 'text-black'}`}>{label}</p>
      <div className="relative shrink-0 size-[20px]" data-name="icon/常规/下拉展开">
        <div className="absolute flex inset-[29.17%_16.67%_29.17%_8.33%] items-center justify-center">
          <div className={`flex-none h-[15px] w-[8.333px] transition-transform duration-200 ${isActive ? 'rotate-90' : '-rotate-90'}`}>
            <div className="relative size-full" data-name="Chevron">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 15">
                <path d={svgPaths.pbb72f00} fill={isActive ? '#ba0020' : 'black'} fillOpacity="0.9" id="Chevron" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileCheckbox({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div className="flex gap-[8px] items-start py-[10px] cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="shrink-0 size-[18px] relative mt-[2px]">
        {checked ? (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
            <rect fill="#BA0020" height="18" rx="4" width="18" />
            <path clipRule="evenodd" d="M7.83094 11.3177L14.0326 5L15 5.98548L8.31463 12.7959C8.04749 13.068 7.61438 13.068 7.34725 12.7959L4 9.38604L4.96738 8.40057L7.83094 11.3177Z" fill="white" fillRule="evenodd" />
          </svg>
        ) : (
          <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] border-solid inset-0 rounded-[4px]" />
        )}
      </div>
      <div className="flex flex-col gap-[4px] flex-1 min-w-0 justify-center">
        <span className="font-['Inter:Regular',sans-serif] font-normal text-[16px] leading-[22px] text-black select-none">{label}</span>
        {description && (
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-[rgba(0,0,0,0.4)]">{description}</p>
        )}
      </div>
    </div>
  );
}

interface CheckboxStates {
  battery10Year: boolean;
  batteryReplaceable: boolean;
  batteryACPlugIn: boolean;
  baseStation: boolean;
  wirelessInterconnected: boolean;
  wifi: boolean;
  standalone: boolean;
  voiceAlarm: boolean;
  nightMode: boolean;
  magneticMount: boolean;
  waterLeak: boolean;
  heatAlarm: boolean;
  thermometerHygrometer: boolean;
}

const defaultCheckboxStates: CheckboxStates = {
  battery10Year: false,
  batteryReplaceable: false,
  batteryACPlugIn: false,
  baseStation: false,
  wirelessInterconnected: false,
  wifi: false,
  standalone: false,
  voiceAlarm: false,
  nightMode: false,
  magneticMount: false,
  waterLeak: false,
  heatAlarm: false,
  thermometerHygrometer: false,
};

function FilterDropdownContent({
  activeFilter,
  checkboxStates,
  setCheckboxStates,
  categoryId,
}: {
  activeFilter: FilterType;
  checkboxStates: CheckboxStates;
  setCheckboxStates: React.Dispatch<React.SetStateAction<CheckboxStates>>;
  categoryId?: string;
}) {
  const isHomeAlarms = categoryId === "home-alarms";
  return (
    <div className="px-[20px] pb-[16px]">
      {activeFilter === 'powerSource' && (
        <div className="flex flex-col">
          <MobileCheckbox label="10-Year Sealed Lithium Battery" checked={checkboxStates.battery10Year} onChange={(v) => setCheckboxStates(prev => ({ ...prev, battery10Year: v }))} />
          <MobileCheckbox label="Replaceable Battery (Included)" checked={checkboxStates.batteryReplaceable} onChange={(v) => setCheckboxStates(prev => ({ ...prev, batteryReplaceable: v }))} />
          <MobileCheckbox label="AC Plug-in + Replaceable Battery Backup" checked={checkboxStates.batteryACPlugIn} onChange={(v) => setCheckboxStates(prev => ({ ...prev, batteryACPlugIn: v }))} />
        </div>
      )}
      {activeFilter === 'connectivity' && (
        <div className="flex flex-col">
          {isHomeAlarms ? (
            <>
              <MobileCheckbox label="Water Leak" checked={(checkboxStates as any).waterLeak} onChange={(v) => setCheckboxStates(prev => ({ ...prev, waterLeak: v }))} />
              <MobileCheckbox label="Heat Alarm" checked={(checkboxStates as any).heatAlarm} onChange={(v) => setCheckboxStates(prev => ({ ...prev, heatAlarm: v }))} />
              <MobileCheckbox label="Thermometer & Hygrometer" checked={(checkboxStates as any).thermometerHygrometer} onChange={(v) => setCheckboxStates(prev => ({ ...prev, thermometerHygrometer: v }))} />
            </>
          ) : (
            <>
              <MobileCheckbox label="Base Station、Interconnected (App)" checked={checkboxStates.baseStation} onChange={(v) => setCheckboxStates(prev => ({ ...prev, baseStation: v }))} description="Connect alarms through a central base station hub with app control for monitoring, testing, and notifications across all connected devices." />
              <MobileCheckbox label="Wireless Interconnected" checked={checkboxStates.wirelessInterconnected} onChange={(v) => setCheckboxStates(prev => ({ ...prev, wirelessInterconnected: v }))} description="When one alarm detects danger, all wirelessly interconnected alarms sound simultaneously throughout your home without needing Wi-Fi." />
              <MobileCheckbox label="Wi-Fi (App)" checked={checkboxStates.wifi} onChange={(v) => setCheckboxStates(prev => ({ ...prev, wifi: v }))} description="Connect directly via WiFi, receive APP notifications, and manage remote test/silence with low battery alerts." />
              <MobileCheckbox label="Standalone" checked={checkboxStates.standalone} onChange={(v) => setCheckboxStates(prev => ({ ...prev, standalone: v }))} description="Independent alarm operation without connection to other devices or networks. Simple installation with no additional setup required." />
            </>
          )}
        </div>
      )}
      {activeFilter === 'features' && (
        <div className="flex flex-col">
          <MobileCheckbox label="Voice Alerts" checked={checkboxStates.voiceAlarm} onChange={(v) => setCheckboxStates(prev => ({ ...prev, voiceAlarm: v }))} />
          <MobileCheckbox label="Night Mode" checked={checkboxStates.nightMode} onChange={(v) => setCheckboxStates(prev => ({ ...prev, nightMode: v }))} />
          <MobileCheckbox label="Magnetic Mount" checked={checkboxStates.magneticMount} onChange={(v) => setCheckboxStates(prev => ({ ...prev, magneticMount: v }))} />
        </div>
      )}
    </div>
  );
}

function FilterDropdownPanel({
  activeFilter,
  isSticky,
  checkboxStates,
  setCheckboxStates,
  hasAnyChecked,
  onReset,
  categoryId,
}: {
  activeFilter: FilterType;
  isSticky: boolean;
  checkboxStates: CheckboxStates;
  setCheckboxStates: React.Dispatch<React.SetStateAction<CheckboxStates>>;
  hasAnyChecked: boolean;
  onReset: () => void;
  categoryId?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  // 保留上一次打开的筛选项，用于关闭动画期间继续显示内容
  const [displayFilter, setDisplayFilter] = useState<FilterType>(null);

  // 当 activeFilter 变化时，更新 displayFilter
  useEffect(() => {
    if (activeFilter) {
      setDisplayFilter(activeFilter);
    }
    // 关闭时不立即清除 displayFilter，等动画结束后在 onTransitionEnd 中清除
  }, [activeFilter]);

  // 当 displayFilter 变化后（内容已渲染），测量高度
  useEffect(() => {
    if (displayFilter && activeFilter) {
      requestAnimationFrame(() => {
        if (contentRef.current) {
          setContentHeight(contentRef.current.scrollHeight);
        }
      });
    }
  }, [displayFilter, activeFilter, isSticky, hasAnyChecked]);

  // activeFilter 关闭时，将高度设为 0 触发收起动画
  useEffect(() => {
    if (!activeFilter) {
      setContentHeight(0);
    }
  }, [activeFilter]);

  const handleTransitionEnd = () => {
    if (!activeFilter) {
      setDisplayFilter(null);
    }
  };

  const isOpen = !!activeFilter;
  const bgColor = isSticky ? '#ffffff' : '#f6f6f6';
  const shadow = isSticky && isOpen ? '0px 4px 12px rgba(0, 0, 0, 0.08)' : 'none';

  // 非吸顶时在文档流中（推开内容），吸顶时绝对定位覆盖内容
  const positionClass = isSticky
    ? 'absolute left-0 right-0 z-[8]'
    : 'w-full';

  return (
    <div
      className={positionClass}
      style={{
        backgroundColor: bgColor,
        boxShadow: shadow,
        height: isOpen ? contentHeight : 0,
        overflow: 'hidden',
        transition: 'height 300ms ease-in-out, box-shadow 300ms ease-in-out',
        // 裁掉顶部投影溢出，只保留底部和两侧投影
        clipPath: isSticky && isOpen ? 'inset(0px -20px -20px -20px)' : 'none',
        // 吸顶时向上偏移1px，消除亚像素染导致的间隙
        ...(isSticky ? { top: 'calc(100% - 1px)', paddingTop: 1 } : {}),
      }}
      onTransitionEnd={handleTransitionEnd}
    >
      <div ref={contentRef}>
        {displayFilter && (
          <FilterDropdownContent
            activeFilter={displayFilter}
            checkboxStates={checkboxStates}
            setCheckboxStates={setCheckboxStates}
            categoryId={categoryId}
          />
        )}
        {isSticky && hasAnyChecked && displayFilter && (
          <div className="px-[20px] pb-[16px]">
            <div
              className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ba0020] text-[16px] text-right w-full cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation();
                onReset();
              }}
            >
              <p className="leading-[22px]">Reset all filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getFilterCounts(checkboxStates: CheckboxStates, categoryId?: string) {
  const isHomeAlarms = categoryId === "home-alarms";
  return {
    powerSource: [checkboxStates.battery10Year, checkboxStates.batteryReplaceable, checkboxStates.batteryACPlugIn].filter(Boolean).length,
    connectivity: isHomeAlarms
      ? [checkboxStates.waterLeak, checkboxStates.heatAlarm, checkboxStates.thermometerHygrometer].filter(Boolean).length
      : [checkboxStates.baseStation, checkboxStates.wirelessInterconnected, checkboxStates.wifi, checkboxStates.standalone].filter(Boolean).length,
    features: [checkboxStates.voiceAlarm, checkboxStates.nightMode, checkboxStates.magneticMount].filter(Boolean).length,
  };
}

function FilterOptions({ activeFilter, onFilterToggle, checkboxStates, categoryId }: { activeFilter: FilterType; onFilterToggle: (f: FilterType) => void; checkboxStates: CheckboxStates; categoryId?: string }) {
  const isHomeAlarms = categoryId === "home-alarms";
  const counts = getFilterCounts(checkboxStates, categoryId);
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center min-w-0 relative ml-[-20px] pl-[20px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mr-[-20px] pr-[20px]">
      <FilterItemButton label={`Power Source${counts.powerSource > 0 ? ` (${counts.powerSource})` : ''}`} isActive={activeFilter === 'powerSource'} onClick={() => onFilterToggle('powerSource')} />
      <FilterItemButton label={`${isHomeAlarms ? 'Sensor Type' : 'Connectivity'}${counts.connectivity > 0 ? ` (${counts.connectivity})` : ''}`} isActive={activeFilter === 'connectivity'} onClick={() => onFilterToggle('connectivity')} />
      <FilterItemButton label={`Features${counts.features > 0 ? ` (${counts.features})` : ''}`} isActive={activeFilter === 'features'} onClick={() => onFilterToggle('features')} />
    </div>
  );
}

function FilterBar({ checkboxStates, setCheckboxStates, categoryId }: { checkboxStates: CheckboxStates; setCheckboxStates: React.Dispatch<React.SetStateAction<CheckboxStates>>; categoryId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const stickyTop = 48; // 导航栏高度

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= stickyTop + 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 点击外部关闭下拉面板
  useEffect(() => {
    if (!activeFilter) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilter]);

  const handleFilterToggle = useCallback((filter: FilterType) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  }, []);

  const handleReset = useCallback(() => {
    setCheckboxStates(defaultCheckboxStates);
  }, []);

  // 所有筛选项被清空时，自动收起下拉面板
  useEffect(() => {
    if (!Object.values(checkboxStates).some(v => v)) {
      setActiveFilter(null);
    }
  }, [checkboxStates]);

  const bgColor = isSticky ? '#ffffff' : '#f6f6f6';
  const hasAnyChecked = Object.values(checkboxStates).some(v => v);

  return (
    <div
      ref={containerRef}
      className="content-stretch flex flex-col sticky top-[48px] shrink-0 w-full z-[9] transition-colors duration-300"
      data-name="Container"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <div className="flex h-[60px] items-center px-[20px] relative z-[10] bg-inherit">
        <FilterOptions activeFilter={activeFilter} onFilterToggle={handleFilterToggle} checkboxStates={checkboxStates} categoryId={categoryId} />
      </div>
      <FilterDropdownPanel
        activeFilter={activeFilter}
        isSticky={isSticky}
        checkboxStates={checkboxStates}
        setCheckboxStates={setCheckboxStates}
        hasAnyChecked={hasAnyChecked}
        onReset={handleReset}
        categoryId={categoryId}
      />
    </div>
  );
}

/* ========== Header 区域 ========== */

function ProductInfoContainer({ productCount, onReset }: { productCount: number; onReset?: () => void }) {
  if (productCount === 0 && !onReset) return null;
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[20px] relative shrink-0 text-[14px] whitespace-nowrap" data-name="Product Info Container">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-black">{productCount} item{productCount === 1 ? '' : 's'} found</p>
      {onReset && (
        <span
          className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] relative shrink-0 text-[#ba0020] cursor-pointer"
          onMouseDown={(e) => {
            e.stopPropagation();
            onReset();
          }}
        >Reset</span>
      )}
    </div>
  );
}

function HeaderContainer({ productCount, hasAnyChecked, onReset }: { productCount: number; hasAnyChecked: boolean; onReset?: () => void }) {
  return (
    <div className="content-stretch flex flex-col gap-[3px] items-start justify-center relative shrink-0" data-name="Header Container">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">Explore Products</p>
      {hasAnyChecked && <ProductInfoContainer productCount={productCount} onReset={onReset} />}
    </div>
  );
}

function Header({ productCount, hasAnyChecked, onReset, onCompare }: { productCount: number; hasAnyChecked: boolean; onReset?: () => void; onCompare?: () => void }) {
  return (
    <div className="content-stretch flex h-[57px] items-center justify-between max-w-[1312px] relative shrink-0 w-full" data-name="Header">
      <HeaderContainer productCount={productCount} hasAnyChecked={hasAnyChecked} onReset={onReset} />
      <div
        className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 cursor-pointer"
        data-name="原子控件/Web/Button/描边Button"
        onClick={onCompare}
      >
        <div aria-hidden="true" className="absolute border-2 border-[#101820] border-solid inset-0 pointer-events-none rounded-[53px]" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101820] text-[14px] text-center whitespace-nowrap">Compare</p>
      </div>
    </div>
  );
}

/* ========== 产品卡片组件 ========== */

function ProductFeatures({ features }: { features: string[] }) {
  return (
    <div className="content-stretch flex flex-col font-['Inter:Regular',sans-serif] font-normal gap-[2px] h-[52px] items-start leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full" data-name="Product Features">
      {features.map((feature, i) => (
        <ul key={i} className="block relative shrink-0 w-full">
          <li className="list-disc ms-[18px] whitespace-pre-wrap">
            <span className="leading-[16px]">{feature}</span>
          </li>
        </ul>
      ))}
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
      <ProductFeatures features={["Voice Alarm with Location", "Real-Time App Alerts", "Interconnected Alarm with Base Station"]} />
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
        
      </div>
    </div>
  );
}

/* ========== 第二张产品卡片（复制） ========== */

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
        
      </div>
    </div>
  );
}

/* ========== 产品列表容器 ========== */

const CORNER_PATH = "M0 24C0 10.7452 10.7452 0 24 0H0V24Z";

function MobileConnectivityBadge({ connectivity }: { connectivity?: string[] }) {
  if (!connectivity?.length) return null;
  const type = connectivity[0];

  let bg: string;
  let textColor: string;
  let fillColor: string;
  let label: string;

  switch (type) {
    case "Base Station Interconnected (App)":
      bg = "bg-[#700013]";
      textColor = "text-white";
      fillColor = "#700013";
      label = "Base-connected (App)";
      break;
    case "Wi-Fi (App)":
      bg = "bg-[#067ad9]";
      textColor = "text-white";
      fillColor = "#067AD9";
      label = "Wi-Fi (App)";
      break;
    case "Wireless Interconnected":
      bg = "bg-[#022542]";
      textColor = "text-white";
      fillColor = "#022542";
      label = "Wireless Interconnected";
      break;
    case "Standalone":
      bg = "bg-[#f2f0ed]";
      textColor = "text-[#101820]";
      fillColor = "#F2F0ED";
      label = "Standalone";
      break;
    default:
      return null;
  }

  return (
    <div className="absolute left-0 top-0 z-[5]" style={{ pointerEvents: "none" }}>
      <div className={`${bg} flex items-center justify-center overflow-clip pl-[20px] pr-[16px] py-[8px] rounded-tl-[32px] rounded-br-[14px]`}>
        <p className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[14px] ${textColor} whitespace-nowrap`}>
          {label}
        </p>
      </div>
      <div className="absolute top-0 size-[24px]" style={{ left: "100%" }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={CORNER_PATH} fill={fillColor} />
        </svg>
      </div>
      <div className="absolute left-0 size-[24px]" style={{ top: "100%" }}>
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={CORNER_PATH} fill={fillColor} />
        </svg>
      </div>
    </div>
  );
}

function MobileProductCardSkeleton() {
  return (
    <div className="bg-white relative rounded-[32px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
            {/* Image placeholder */}
            <div className="aspect-[307/307] relative shrink-0 w-full rounded-[16px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            {/* Product Info */}
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              {/* Name: 2 lines */}
              <div className="flex flex-col gap-[6px] w-full">
                <div className="h-[20px] w-[85%] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
                <div className="h-[20px] w-[55%] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
              </div>
              {/* Features: 3 lines */}
              <div className="flex flex-col gap-[4px] w-full h-[52px]">
                <div className="h-[12px] w-[70%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
                <div className="h-[12px] w-[55%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
                <div className="h-[12px] w-[65%] rounded-[4px] animate-pulse bg-[rgba(0,0,0,0.04)]" />
              </div>
              {/* SKU dropdown */}
              <div className="h-[40px] w-full rounded-[10px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            </div>
          </div>
          {/* Price Container */}
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <div className="h-[28px] w-[90px] rounded-[6px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
            <div className="h-[40px] w-[96px] rounded-[50px] animate-pulse bg-[rgba(0,0,0,0.06)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileProductCard({ product }: { product: Product }) {
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0);
  const selectedSku = product.options[selectedSkuIndex];
  const displayPrice = selectedSku?.price ? `$${selectedSku.price}` : product.price;
  const displayImage = selectedSku?.imageUrl || product.imageUrl;

  // Discount calculation
  const hasDiscount = selectedSku?.discountEnabled && selectedSku.discountPercent && selectedSku.price;
  const discountedPrice = hasDiscount
    ? `$${(parseFloat(selectedSku.price) * (1 - parseInt(selectedSku.discountPercent, 10) / 100)).toFixed(2)}`
    : null;

  return (
    <div className="bg-white relative rounded-[32px] shrink-0 w-full" data-name="Product Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <MobileConnectivityBadge connectivity={product.connectivity} />
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Product Container">
            <div className="aspect-[307/307] relative shrink-0 w-full" data-name="Product Image">
              <ImageWithFallback alt={product.name} className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={displayImage} />
            </div>
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Product Info">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black w-full">{product.name}</p>
              <div className="relative shrink-0 w-full" data-name="Product Features" style={{ minHeight: '52px' }}>
                <ProductFeaturesIcons features={product.features} />
              </div>
              {product.options.length > 0 && (
                <SkuDropdown options={product.options} iconSize="sm" onSelect={setSelectedSkuIndex} />
              )}
            </div>
            {product.isHot && (
              <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic right-[32px] text-[#ba0020] text-[18px] top-[-4px] translate-x-full whitespace-nowrap">Hot</p>
            )}
          </div>
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Price Container">
            {hasDiscount ? (
              <div className="flex gap-[4px] h-[34px] items-center relative shrink-0">
                <div className="flex flex-col h-[34px] items-start justify-end relative shrink-0 whitespace-nowrap">
                  <p className="[text-decoration-skip-ink:none] decoration-solid font-['Inter:Regular',sans-serif] font-normal leading-[16px] line-through relative shrink-0 text-[12px] text-[rgba(0,0,0,0.3)]">{displayPrice}</p>
                  <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-[#ba0020] relative shrink-0">{discountedPrice}</p>
                </div>
                <div className="h-[20px] relative shrink-0 w-[74px]">
                  <div className="absolute h-[18px] left-[0.41px] top-px w-[73.595px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 73.5947 18">
                      <path d={discountSvg.p3a8ae7c0} fill="#BA0020" />
                    </svg>
                  </div>
                  <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic right-[64px] text-[14px] text-white top-0 translate-x-full whitespace-nowrap">{selectedSku.discountPercent}% OFF</p>
                </div>
              </div>
            ) : (
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic text-[24px] text-black whitespace-nowrap">{displayPrice}</p>
            )}
            <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 w-[96px]" data-name="原子控/Web/Button/填充Button">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductListContainer({ products, productsLoading }: { products: Product[]; productsLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-full" data-name="Product List Container">
      {productsLoading ? (
        [0, 1, 2].map((i) => <MobileProductCardSkeleton key={`skeleton-${i}`} />)
      ) : (
        products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}

/* ========== 主内容区域 ========== */

function MainContainer({ productCount, hasAnyChecked, onReset, filteredProducts, onCompare, productsLoading }: { productCount: number; hasAnyChecked: boolean; onReset: () => void; filteredProducts: Product[]; onCompare?: () => void; productsLoading?: boolean }) {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-start px-[20px] w-full" data-name="Main Container">
      <Header productCount={productCount} hasAnyChecked={hasAnyChecked} onReset={onReset} onCompare={onCompare} />
      <ProductListContainer products={filteredProducts} productsLoading={productsLoading} />
    </div>
  );
}

/* ========== 页面根组件 ========== */

export default function Component({ products = [], productsLoading = false, categoryId = "smoke-alarms" }: { products?: Product[]; productsLoading?: boolean; categoryId?: string }) {
  const [checkboxStates, setCheckboxStates] = useState<CheckboxStates>(defaultCheckboxStates);
  const hasAnyChecked = Object.values(checkboxStates).some(v => v);
  const [compareOpen, setCompareOpen] = useState(false);

  // Filter products based on checkbox states
  const filteredProducts = filterProducts(products, checkboxStates as any);

  const handleReset = useCallback(() => {
    setCheckboxStates(defaultCheckboxStates);
  }, []);

  return (
    <>
      {/* 固定导航栏 */}
      <MobileNav />

      <div className="bg-[#f6f6f6] relative min-h-screen w-full overflow-x-clip" data-name="分类页 / 首屏">
        {/* 导航栏占位 (48px) */}
        <div className="h-[48px] w-full shrink-0" />

        {/* 横幅图片 */}
        <BannerImage categoryId={categoryId} />

        {/* 筛选栏 + 内容区域：背景遮盖视差Banner */}
        <div className="relative z-[1] bg-[#f6f6f6]">
          {/* 筛选栏 - 吸顶 */}
          <FilterBar checkboxStates={checkboxStates} setCheckboxStates={setCheckboxStates} categoryId={categoryId} />

          {/* 主内容区域 - 自然流式布局 */}
          <div className="pt-[20px] pb-[40px]">
            <MainContainer productCount={filteredProducts.length} hasAnyChecked={hasAnyChecked} onReset={handleReset} filteredProducts={filteredProducts} onCompare={() => setCompareOpen(true)} productsLoading={productsLoading} />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* 移动端比较对话框 */}
      <MobileCompareDialog open={compareOpen} onClose={() => setCompareOpen(false)} categoryId={categoryId} />
    </>
  );
}