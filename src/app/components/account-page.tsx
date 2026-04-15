import { useState } from "react";
import GlobalNav from "./global-nav";
import Footer from "../../imports/Footer";

type OrderStatus = "Processing" | "Shipped" | "Delivered";

interface OrderProduct {
  name: string;
  image: string;
  package: string;
  originalPrice?: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  products: OrderProduct[];
  total: string;
}

const MENU_ITEMS = [
  { key: "orders", label: "My Orders", section: "header" },
  { key: "divider-1", label: "", section: "divider" },
  { key: "profile", label: "My Profile", section: "list" },
  { key: "address", label: "Shipping Address", section: "list" },
  { key: "manage", label: "Manage Account", section: "list" },
  { key: "divider-2", label: "", section: "divider" },
  { key: "coupons", label: "Coupons", section: "list" },
  { key: "divider-3", label: "", section: "divider" },
  { key: "premium", label: "Protect-Premium", section: "list" },
] as const;

const STATUS_COLORS: Record<OrderStatus, string> = {
  Processing: "#022542",
  Shipped: "#067ad9",
  Delivered: "#16dd00",
};

const MOCK_ORDERS: Order[] = [
  {
    id: "#32844EN",
    date: "December 19, 2025",
    status: "Processing",
    products: [
      {
        name: "XH02-M Interconnected Smart Heat Alarm (100% off)",
        image: "/images/order-XH02-M.jpg",
        package: "1-PACK",
        price: "$0.00",
        quantity: 1,
      },
      {
        name: "XC01-M Interconnected Smart Carbon Monoxide Alarm",
        image: "/images/order-XC01-M.jpg",
        package: "5*Alarm+1*SBS50 Base Station(XC07-MR51)",
        originalPrice: "$199.00",
        price: "$170.00",
        quantity: 1,
      },
      {
        name: "SWS0A Ultra-thin Smart Water Leak Alarm",
        image: "/images/order-SWS0A.jpg",
        package: "1-PACK",
        price: "$11.99",
        quantity: 2,
      },
    ],
    total: "$351.99",
  },
  {
    id: "#32845EN",
    date: "December 19, 2025",
    status: "Shipped",
    products: [
      {
        name: "SBS50 Base Station",
        image: "/images/order-SBS50.jpg",
        package: "1-PACK",
        originalPrice: "$199.00",
        price: "$22.99",
        quantity: 1,
      },
    ],
    total: "$22.99",
  },
  {
    id: "#32845EN",
    date: "December 19, 2025",
    status: "Delivered",
    products: [
      {
        name: "SC07-WX Smart Smoke and CO Alarm",
        image: "/images/order-SC07-WX.jpg",
        package: "1-PACK",
        originalPrice: "$45.99",
        price: "$32.99",
        quantity: 1,
      },
    ],
    total: "$32.99",
  },
];

function Menu({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[12px] items-start pb-[16px] relative rounded-[16px] shrink-0 w-[180px]">
      {MENU_ITEMS.map((item) => {
        if (item.section === "divider") {
          return (
            <div key={item.key} className="h-0 relative shrink-0 w-full">
              <div className="absolute inset-[-0.5px_0] border-t border-[rgba(0,0,0,0.08)]" />
            </div>
          );
        }

        const isActive = item.key === activeKey;

        return (
          <div
            key={item.key}
            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
          >
            <div
              className={`content-stretch flex items-center justify-center px-[12px] py-[16px] relative shrink-0 w-full cursor-pointer ${
                isActive ? "bg-[#f6f6f6] rounded-[12px]" : "hover:bg-[#fafafa] rounded-[12px]"
              }`}
              onClick={() => onSelect(item.key)}
            >
              <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <div
      className="content-stretch flex gap-[4px] h-[16px] items-center justify-center overflow-clip px-[4px] relative rounded-[4px] shrink-0"
      style={{ backgroundColor: STATUS_COLORS[status] }}
    >
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white tracking-[0.1px] whitespace-nowrap">
        <p className="leading-[14px]">{status}</p>
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: OrderProduct }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <img
        src={product.image}
        alt={product.name}
        className="bg-[rgba(0,0,0,0.05)] rounded-[4px] shrink-0 size-[64px] object-contain"
      />

      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative">
        {/* Product Name & Price */}
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
          <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic relative text-[16px] text-[rgba(0,0,0,0.9)] tracking-[0.16px]">
            {product.name}
          </p>
          <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium gap-[8px] items-center justify-end leading-[24px] relative shrink-0 w-[140px] whitespace-nowrap text-[16px] tracking-[0.16px]">
            {product.originalPrice && (
              <p className="line-through decoration-solid relative shrink-0 text-[rgba(0,0,0,0.3)]">
                {product.originalPrice}
              </p>
            )}
            <p className="relative shrink-0 text-[rgba(0,0,0,0.9)]">
              {product.price}
            </p>
          </div>
        </div>

        {/* Package & Quantity */}
        <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[4px] items-start not-italic relative shrink-0 w-full">
          <p className="flex-[1_0_0] leading-[20px] min-h-px min-w-px relative text-[14px] text-[rgba(0,0,0,0.54)] tracking-[0.14px]">
            {product.package}
          </p>
          <p className="leading-[22px] relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] text-right tracking-[0.16px] w-[140px]">
            Qty:{product.quantity}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-[#f6f6f6] content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] shrink-0 w-full">
      {/* Order Header */}
      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
          <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-h-px min-w-px not-italic relative text-[18px] text-[rgba(0,0,0,0.9)] tracking-[0.18px]">
            Order {order.id}
          </p>
          <StatusBadge status={order.status} />
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] tracking-[0.14px] whitespace-nowrap">
          Date: {order.date}
        </p>
      </div>

      {/* Products */}
      {order.products.map((product, idx) => (
        <ProductRow key={idx} product={product} />
      ))}

      {/* Total */}
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] text-right tracking-[0.18px] w-full">
        Total: {order.total}
      </p>

      {/* Divider */}
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0] border-t border-[rgba(0,0,0,0.08)]" />
      </div>

      {/* Action Buttons */}
      <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0 w-full">
        <button className="border-2 border-[#101820] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 bg-transparent cursor-pointer">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[#101820] text-center tracking-[0.14px] whitespace-nowrap">
            Invoice
          </p>
        </button>
        <button className="border-2 border-[#101820] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 bg-transparent cursor-pointer">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[#101820] text-center tracking-[0.14px] whitespace-nowrap">
            Track order
          </p>
        </button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [activeMenu, setActiveMenu] = useState("orders");

  return (
    <div className="bg-white w-full min-h-screen">
      <GlobalNav />
      <div className="pt-[104px]">
        <div
          className="content-stretch flex flex-col items-center w-full"
          style={{ padding: "48px clamp(24px, 8vw, 120px)" }}
        >
          <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] relative w-full">
            {/* Left Sidebar */}
            <Menu activeKey={activeMenu} onSelect={setActiveMenu} />

            {/* Right Content */}
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
                My Orders
              </p>

              {MOCK_ORDERS.map((order, idx) => (
                <OrderCard key={idx} order={order} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
