import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ConfigProvider, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import { State, City } from "country-state-city";
import GlobalNav from "./global-nav";
import Footer from "../../imports/Footer";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { useAuth } from "../hooks/use-auth";

const BRAND_BLUE = "#022542";
const ANT_THEME = {
  token: {
    colorPrimary: BRAND_BLUE,
    controlOutline: "rgba(2, 37, 66, 0.08)",
    borderRadius: 10,
    controlHeight: 52,
    fontSize: 16,
    fontFamily: "'Inter:Regular', sans-serif",
  },
  components: {
    Select: {
      optionSelectedBg: "#f0f7ff",
      optionActiveBg: "#EDEDEE",
    },
  },
};

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69c33f4c`;
const AUTH_HEADER = { Authorization: `Bearer ${publicAnonKey}` };

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, delay = 1500): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}

/* ==================== Types ==================== */

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

interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  countryRegion: string;
}

interface AddressData {
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
}

/* ==================== Constants ==================== */

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
  { key: "divider-4", label: "", section: "divider" },
  { key: "logout", label: "Log Out", section: "list" },
] as const;

const STATUS_COLORS: Record<OrderStatus, string> = {
  Processing: "#022542",
  Shipped: "#067ad9",
  Delivered: "#16dd00",
};

const COUNTRY_OPTIONS = [
  { value: "United States", label: "United States" },
  { value: "Deutschland (Deutsch)", label: "Deutschland (Deutsch)" },
  { value: "France (Français)", label: "France (Français)" },
];

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

const DEFAULT_PROFILE: ProfileData = {
  email: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  phoneNumber: "",
  countryRegion: "",
};

const DEFAULT_ADDRESS: AddressData = {
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
};

const US_STATES = State.getStatesOfCountry("US").map((s) => ({
  value: s.isoCode,
  label: s.name,
}));

function getCityOptions(stateCode: string) {
  if (!stateCode) return [];
  return City.getCitiesOfState("US", stateCode).map((c) => ({
    value: c.name,
    label: c.name,
  }));
}

/* ==================== Save Button ==================== */

type SaveState = "idle" | "saving" | "saved";

function SaveButton({ onClick }: { onClick: () => Promise<void> }) {
  const [state, setState] = useState<SaveState>("idle");

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  const label = state === "saving" ? "Saving..." : state === "saved" ? "Saved" : "Save";

  return (
    <button
      onClick={handleClick}
      disabled={state !== "idle"}
      className="border-2 border-[#101820] border-solid content-stretch flex gap-[8px] items-center justify-center px-[40px] py-[16px] relative rounded-[53px] shrink-0 bg-transparent cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#101820] hover:text-white transition-colors group w-[180px] h-[56px]"
    >
      {state === "saving" && (
        <span className="text-[#101820] group-hover:text-white">
          <Spinner />
        </span>
      )}
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-[#101820] text-center tracking-[0.16px] whitespace-nowrap group-hover:text-white">
        {label}
      </p>
    </button>
  );
}

/* ==================== Dropdown Arrow ==================== */

function DropdownArrow({ open }: { open?: boolean }) {
  return (
    <div className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <svg className="shrink-0" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="black"
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ==================== Loading Spinner ==================== */

function Spinner() {
  return (
    <svg className="animate-spin size-[20px]" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ==================== My Profile Form ==================== */

function SkeletonPulse({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-[6px] bg-[rgba(0,0,0,0.06)] ${className ?? ""}`} />;
}

function SkeletonField({ width = "w-[calc(50%-12px)]" }: { width?: string }) {
  return (
    <div className={`flex flex-col gap-[4px] ${width}`}>
      <SkeletonPulse className="h-[20px] w-[80px]" />
      <SkeletonPulse className="h-[52px] w-full rounded-[10px]" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-wrap gap-x-[24px] gap-y-[24px] items-start relative w-full">
        <SkeletonField />
        <div className="w-[calc(50%-12px)]" />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
        <SkeletonField />
      </div>
      <SkeletonPulse className="h-[56px] w-[180px] rounded-[53px]" />
    </div>
  );
}

function MyProfileContent({ profileId }: { profileId: string }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ ...DEFAULT_PROFILE, email: user?.email || "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithRetry(`${API_BASE}/profile/${profileId}`, { headers: AUTH_HEADER });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile({ ...DEFAULT_PROFILE, email: user?.email || "", ...data.profile });
          }
        }
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    })();
  }, [profileId, user?.email]);

  const handleSave = async () => {
    const res = await fetchWithRetry(`${API_BASE}/profile/${profileId}`, {
      method: "POST",
      headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          My Profile
        </p>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <ConfigProvider theme={ANT_THEME}>
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
        My Profile
      </p>

      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-wrap gap-x-[24px] gap-y-[24px] items-start relative w-full">
          {/* Email (readonly) */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Email
            </p>
            <Input
              value={profile.email}
              disabled
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* Placeholder for right column of email row */}
          <div className="w-[calc(50%-12px)]" />

          {/* First Name */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              First Name<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={profile.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Last Name<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={profile.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Date of Birth
            </p>
            <DatePicker
              value={profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null}
              onChange={(_date: DatePickerProps["value"], dateString: string | string[]) => {
                updateField("dateOfBirth", Array.isArray(dateString) ? dateString[0] : dateString);
              }}
              format="MM/DD/YYYY"
              placeholder="MM/DD/YYYY"
              style={{ height: 52, width: "100%", borderRadius: 10, fontSize: 16 }}
              suffixIcon={<DropdownArrow />}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Phone Number
            </p>
            <Input
              value={profile.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="Phone Number"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* Country / Region */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Country / Region
            </p>
            <Select
              options={COUNTRY_OPTIONS}
              value={profile.countryRegion || undefined}
              onChange={(v) => updateField("countryRegion", v)}
              placeholder="Select country"
              style={{ height: 52, width: "100%", borderRadius: 10 }}
              suffixIcon={<DropdownArrow />}
            />
          </div>
        </div>

        <SaveButton onClick={handleSave} />
      </div>
    </div>
    </ConfigProvider>
  );
}

/* ==================== Shipping Address ==================== */

function AddressSkeleton() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-wrap gap-x-[24px] gap-y-[24px] items-start relative w-full">
        <SkeletonField />
        <SkeletonField />
        <SkeletonField width="w-[calc(33.333%-16px)]" />
        <SkeletonField width="w-[calc(33.333%-16px)]" />
        <SkeletonField width="w-[calc(33.333%-16px)]" />
      </div>
      <SkeletonPulse className="h-[56px] w-[180px] rounded-[53px]" />
    </div>
  );
}

function ShippingAddressContent({ profileId }: { profileId: string }) {
  const [address, setAddress] = useState<AddressData>(DEFAULT_ADDRESS);
  const [loading, setLoading] = useState(true);
  const [cityOptions, setCityOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchWithRetry(`${API_BASE}/address/${profileId}`, { headers: AUTH_HEADER });
        if (res.ok) {
          const data = await res.json();
          if (data.address) {
            const merged = { ...DEFAULT_ADDRESS, ...data.address };
            setAddress(merged);
            if (merged.state) {
              setCityOptions(getCityOptions(merged.state));
            }
          }
        }
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    const res = await fetchWithRetry(`${API_BASE}/address/${profileId}`, {
      method: "POST",
      headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify(address),
    });
    if (!res.ok) throw new Error("Save failed");
  };

  const updateField = (field: keyof AddressData, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleStateChange = (value: string) => {
    setAddress((prev) => ({ ...prev, state: value, city: "" }));
    setCityOptions(getCityOptions(value));
  };

  if (loading) {
    return (
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          Shipping Address
        </p>
        <AddressSkeleton />
      </div>
    );
  }

  return (
    <ConfigProvider theme={ANT_THEME}>
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
        Shipping Address
      </p>

      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-wrap gap-x-[24px] gap-y-[24px] items-start relative w-full">
          {/* Address */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Address<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={address.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Enter an address"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* Apartment */}
          <div className="flex flex-col gap-[4px] w-[calc(50%-12px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              Apartment
            </p>
            <Input
              value={address.apartment}
              onChange={(e) => updateField("apartment", e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>

          {/* City */}
          <div className="flex flex-col gap-[4px] w-[calc(33.333%-16px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              City
            </p>
            <Select
              showSearch
              options={cityOptions}
              value={address.city || undefined}
              onChange={(v) => updateField("city", v)}
              placeholder="Enter a city"
              style={{ height: 52, width: "100%", borderRadius: 10 }}
              suffixIcon={<DropdownArrow />}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* State */}
          <div className="flex flex-col gap-[4px] w-[calc(33.333%-16px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              State
            </p>
            <Select
              showSearch
              options={US_STATES}
              value={address.state || undefined}
              onChange={handleStateChange}
              placeholder="Select state"
              style={{ height: 52, width: "100%", borderRadius: 10 }}
              suffixIcon={<DropdownArrow />}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* ZIP code */}
          <div className="flex flex-col gap-[4px] w-[calc(33.333%-16px)]">
            <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]">
              ZIP code
            </p>
            <Input
              value={address.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="Enter an ZIPcode"
              style={{ height: 52, borderRadius: 10 }}
            />
          </div>
        </div>

        <SaveButton onClick={handleSave} />
      </div>
    </div>
    </ConfigProvider>
  );
}

/* ==================== Menu ==================== */

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

/* ==================== Order Components ==================== */

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

      {order.products.map((product, idx) => (
        <ProductRow key={idx} product={product} />
      ))}

      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] text-right tracking-[0.18px] w-full">
        Total: {order.total}
      </p>

      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0] border-t border-[rgba(0,0,0,0.08)]" />
      </div>

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

function MyOrdersContent() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
        My Orders
      </p>
      {MOCK_ORDERS.map((order, idx) => (
        <OrderCard key={idx} order={order} />
      ))}
    </div>
  );
}

/* ==================== Main Page ==================== */

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [activeMenu, setActiveMenu] = useState("orders");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  if (!user) return null;

  const profileId = user.id;

  const handleMenuSelect = (key: string) => {
    if (key === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveMenu(key);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return <MyProfileContent profileId={profileId} />;
      case "address":
        return <ShippingAddressContent profileId={profileId} />;
      case "orders":
      default:
        return <MyOrdersContent />;
    }
  };

  return (
    <div className="bg-white w-full min-h-screen">
      <GlobalNav />
      <div className="pt-[104px]">
        <div
          className="content-stretch flex flex-col items-center w-full"
          style={{ padding: "48px clamp(24px, 8vw, 120px)", minHeight: "calc(100vh - 104px)" }}
        >
          <div className="content-stretch flex gap-[48px] items-start max-w-[1312px] relative w-full">
            <Menu activeKey={activeMenu} onSelect={handleMenuSelect} />
            {renderContent()}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
