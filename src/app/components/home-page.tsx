import { useState, useEffect } from "react";
import MobileDesign from "../../imports/分类页首屏";
import DesktopDesign from "../../imports/分类页平铺换行";
import { useProducts, type Product } from "./use-products";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const { products, loading } = useProducts();

  // Only show products belonging to the "smoke-alarms" category
  // Products without categoryId default to "smoke-alarms" (legacy data)
  const smokeAlarmProducts = products.filter(p => !p.categoryId || p.categoryId === "smoke-alarms");

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return (
    <div className="min-h-screen w-full">
      {isMobile ? (
        <MobileDesign products={smokeAlarmProducts} productsLoading={loading} />
      ) : (
        <DesktopDesign products={smokeAlarmProducts} productsLoading={loading} />
      )}
    </div>
  );
}