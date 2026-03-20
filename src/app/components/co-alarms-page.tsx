import { useState, useEffect } from "react";
import MobileDesign from "../../imports/分类页首屏";
import DesktopDesign from "../../imports/分类页平铺换行";
import { useProducts, type Product } from "./use-products";

const CATEGORY_ID = "co-alarms";

export default function CoAlarmsPage() {
  const [isMobile, setIsMobile] = useState(false);
  const { products, loading } = useProducts();

  // Only show products belonging to the "co-alarms" category
  const coAlarmProducts = products.filter(p => p.categoryId === CATEGORY_ID);

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
        <MobileDesign products={coAlarmProducts} productsLoading={loading} categoryId={CATEGORY_ID} />
      ) : (
        <DesktopDesign products={coAlarmProducts} productsLoading={loading} categoryId={CATEGORY_ID} />
      )}
    </div>
  );
}
