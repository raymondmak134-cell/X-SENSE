import { useState, useEffect, useCallback } from "react";
import MobileDesign from "../../imports/分类页首屏";
import DesktopDesign from "../../imports/分类页平铺换行";
import SmokeAlarmsNewPage from "./smoke-alarms-new-page";
import SmokeAlarmsNewPageMobile from "./smoke-alarms-new-page-mobile";
import { useProducts, type Product } from "./use-products";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const { products, loading } = useProducts();

  const smokeAlarmProducts = products.filter(
    (p) => !p.categoryId || p.categoryId === "smoke-alarms"
  );

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const [useNewPage, setUseNewPage] = useState(() => {
    try {
      return localStorage.getItem("pageVersion") !== "old";
    } catch {
      return true;
    }
  });

  const togglePageVersion = useCallback(() => {
    setUseNewPage((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("pageVersion", next ? "new" : "old");
      } catch {}
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen w-full">
      {useNewPage ? (
        isMobile ? <SmokeAlarmsNewPageMobile /> : <SmokeAlarmsNewPage />
      ) : isMobile ? (
        <MobileDesign products={smokeAlarmProducts} productsLoading={loading} />
      ) : (
        <DesktopDesign
          products={smokeAlarmProducts}
          productsLoading={loading}
        />
      )}

      {/* Floating page version toggle */}
      <div
        className="fixed right-[24px] bottom-[80px] z-[999] cursor-pointer select-none"
        onClick={togglePageVersion}
        title={useNewPage ? "Switch to classic listing" : "Switch to new listing"}
      >
        <div
          className={`
          w-[56px] h-[56px] rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300 ease-in-out
          hover:shadow-xl hover:scale-110 active:scale-95
          ${
            useNewPage
              ? "bg-[#ba0020] text-white"
              : "bg-white text-[#333] border border-[rgba(0,0,0,0.1)]"
          }
        `}
        >
          <div className="flex flex-col items-center gap-[2px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-[10px] font-semibold leading-none font-['Inter:Semi_Bold',sans-serif]">
              {useNewPage ? "V2" : "V1"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
