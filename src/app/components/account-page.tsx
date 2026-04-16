import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { ConfigProvider, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import { State, City } from "country-state-city";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import Footer from "../../imports/Footer";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { useAuth } from "../hooks/use-auth";

const BRAND_BLUE = "#022542";
const ANT_THEME = {
  token: {
    colorPrimary: BRAND_BLUE,
    controlOutline: "rgba(2, 37, 66, 0.08)",
    borderRadius: 16,
    controlHeight: 52,
    fontSize: 16,
    fontFamily: "'Inter:Regular', sans-serif",
    colorBgContainer: "#ffffff",
  },
  components: {
    Select: {
      optionSelectedBg: "#f0f7ff",
      optionActiveBg: "#EDEDEE",
    },
  },
};

const FORM_FIELD_STYLE: React.CSSProperties = {
  height: 52,
  width: "100%",
  borderRadius: 16,
  fontSize: 16,
  backgroundColor: "#ffffff",
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
        package: "5-Pack+BaseStation",
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

/* ==================== Toast ==================== */

function SavedToast({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [visible, onDone]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`fixed top-[24px] left-1/2 z-[9999] flex items-center gap-[8px] px-[20px] py-[12px] rounded-[12px] bg-[#101820] shadow-lg transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[12px]"
      }`}
      style={{ transform: `translateX(-50%) translateY(${show ? 0 : -12}px)` }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4.16667 10.8333L7.5 14.1667L15.8333 5.83334"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white leading-[20px] whitespace-nowrap">
        Saved
      </span>
    </div>,
    document.body,
  );
}

/* ==================== Save Button ==================== */

type SaveState = "idle" | "saving" | "saved";

function SaveButton({ onClick, fullWidth }: { onClick: () => Promise<void>; fullWidth?: boolean }) {
  const [state, setState] = useState<SaveState>("idle");
  const [showToast, setShowToast] = useState(false);

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setShowToast(true);
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  const handleToastDone = useCallback(() => setShowToast(false), []);

  const label = state === "saving" ? "Saving..." : state === "saved" ? "Saved" : "Save";

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state !== "idle"}
        className={`content-stretch flex gap-[8px] items-center justify-center px-[40px] py-[16px] relative rounded-[53px] shrink-0 bg-[#BA0020] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#9a001a] transition-colors border-none ${fullWidth ? "w-full h-[48px]" : "w-[180px] h-[56px]"}`}
      >
        {state === "saving" && (
          <span className="text-white">
            <Spinner />
          </span>
        )}
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-white text-center tracking-[0.16px] whitespace-nowrap">
          {label}
        </p>
      </button>
      <SavedToast visible={showToast} onDone={handleToastDone} />
    </>
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
      <SkeletonPulse className="h-[52px] w-full rounded-[16px]" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full bg-[#f6f6f6] rounded-[16px] p-[24px]">
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

function MyProfileContent({ profileId, isMobile }: { profileId: string; isMobile?: boolean }) {
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
        {!isMobile && (
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
            My Profile
          </p>
        )}
        <ProfileSkeleton />
      </div>
    );
  }

  const fieldWidth = isMobile ? "w-full" : "w-[calc(50%-12px)]";
  const labelClass = "font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]";

  return (
    <ConfigProvider theme={ANT_THEME}>
    <div className={`content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-px relative ${isMobile ? "w-full" : "flex-[1_0_0]"}`}>
      {!isMobile && (
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          My Profile
        </p>
      )}

      <div className={`content-stretch flex flex-col items-start relative shrink-0 w-full bg-[#f6f6f6] rounded-[16px] ${isMobile ? "p-[16px] gap-[24px]" : "p-[24px] gap-[32px]"}`}>
        <div className={`content-stretch flex items-start relative w-full ${isMobile ? "flex-col gap-[24px]" : "flex-wrap gap-x-[24px] gap-y-[24px]"}`}>
          {/* Email (readonly) */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Email
            </p>
            <Input
              value={profile.email}
              disabled
              style={FORM_FIELD_STYLE}
            />
          </div>

          {!isMobile && <div className="w-[calc(50%-12px)]" />}

          {/* First Name */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              First Name<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={profile.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
              style={FORM_FIELD_STYLE}
            />
          </div>

          {/* Last Name */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Last Name<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={profile.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
              style={FORM_FIELD_STYLE}
            />
          </div>

          {/* Date of Birth */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Date of Birth
            </p>
            <DatePicker
              value={profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null}
              onChange={(_date: DatePickerProps["value"], dateString: string | string[]) => {
                updateField("dateOfBirth", Array.isArray(dateString) ? dateString[0] : dateString);
              }}
              format="MM/DD/YYYY"
              placeholder="MM/DD/YYYY"
              style={FORM_FIELD_STYLE}
              suffixIcon={<DropdownArrow />}
            />
          </div>

          {/* Phone Number */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Phone Number
            </p>
            <Input
              value={profile.phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              placeholder="Phone Number"
              style={FORM_FIELD_STYLE}
            />
          </div>

          {/* Country / Region */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Country / Region
            </p>
            <Select
              options={COUNTRY_OPTIONS}
              value={profile.countryRegion || undefined}
              onChange={(v) => updateField("countryRegion", v)}
              placeholder="Select country"
              style={FORM_FIELD_STYLE}
              suffixIcon={<DropdownArrow />}
            />
          </div>
        </div>

        <SaveButton onClick={handleSave} fullWidth={isMobile} />
      </div>
    </div>
    </ConfigProvider>
  );
}

/* ==================== Shipping Address ==================== */

function AddressSkeleton() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full bg-[#f6f6f6] rounded-[16px] p-[24px]">
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

function ShippingAddressContent({ profileId, isMobile }: { profileId: string; isMobile?: boolean }) {
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
        {!isMobile && (
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
            Shipping Address
          </p>
        )}
        <AddressSkeleton />
      </div>
    );
  }

  const fieldWidth = isMobile ? "w-full" : "w-[calc(50%-12px)]";
  const fieldWidthThird = isMobile ? "w-full" : "w-[calc(33.333%-16px)]";
  const labelClass = "font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]";

  return (
    <ConfigProvider theme={ANT_THEME}>
    <div className={`content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-px relative ${isMobile ? "w-full" : "flex-[1_0_0]"}`}>
      {!isMobile && (
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          Shipping Address
        </p>
      )}

      <div className={`content-stretch flex flex-col items-start relative shrink-0 w-full bg-[#f6f6f6] rounded-[16px] ${isMobile ? "p-[16px] gap-[24px]" : "p-[24px] gap-[32px]"}`}>
        <div className={`content-stretch flex items-start relative w-full ${isMobile ? "flex-col gap-[24px]" : "flex-wrap gap-x-[24px] gap-y-[24px]"}`}>
          {/* Address */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Address<span className="text-[#ba0020]">*</span>
            </p>
            <Input
              value={address.address}
              onChange={(e) => updateField("address", e.target.value)}
              placeholder="Enter an address"
              style={FORM_FIELD_STYLE}
            />
          </div>

          {/* Apartment */}
          <div className={`flex flex-col gap-[4px] ${fieldWidth}`}>
            <p className={labelClass}>
              Apartment
            </p>
            <Input
              value={address.apartment}
              onChange={(e) => updateField("apartment", e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
              style={FORM_FIELD_STYLE}
            />
          </div>

          {/* City */}
          <div className={`flex flex-col gap-[4px] ${fieldWidthThird}`}>
            <p className={labelClass}>
              City
            </p>
            <Select
              showSearch
              options={cityOptions}
              value={address.city || undefined}
              onChange={(v) => updateField("city", v)}
              placeholder="Enter a city"
              style={FORM_FIELD_STYLE}
              suffixIcon={<DropdownArrow />}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* State */}
          <div className={`flex flex-col gap-[4px] ${fieldWidthThird}`}>
            <p className={labelClass}>
              State
            </p>
            <Select
              showSearch
              options={US_STATES}
              value={address.state || undefined}
              onChange={handleStateChange}
              placeholder="Select state"
              style={FORM_FIELD_STYLE}
              suffixIcon={<DropdownArrow />}
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>

          {/* ZIP code */}
          <div className={`flex flex-col gap-[4px] ${fieldWidthThird}`}>
            <p className={labelClass}>
              ZIP code
            </p>
            <Input
              value={address.zipCode}
              onChange={(e) => updateField("zipCode", e.target.value)}
              placeholder="Enter an ZIPcode"
              style={FORM_FIELD_STYLE}
            />
          </div>
        </div>

        <SaveButton onClick={handleSave} fullWidth={isMobile} />
      </div>
    </div>
    </ConfigProvider>
  );
}

/* ==================== Password Changed Toast ==================== */

function PasswordChangedToast({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [visible, onDone]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`fixed top-[24px] left-1/2 z-[9999] flex items-center gap-[8px] px-[20px] py-[12px] rounded-[12px] bg-[#101820] shadow-lg transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[12px]"
      }`}
      style={{ transform: `translateX(-50%) translateY(${show ? 0 : -12}px)` }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4.16667 10.8333L7.5 14.1667L15.8333 5.83334"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white leading-[20px] whitespace-nowrap">
        Password Changed Successfully
      </span>
    </div>,
    document.body,
  );
}

/* ==================== Change Password Button ==================== */

type ChangePasswordState = "idle" | "saving" | "saved";

function ChangePasswordButton({ onClick, fullWidth }: { onClick: () => Promise<void>; fullWidth?: boolean }) {
  const [state, setState] = useState<ChangePasswordState>("idle");
  const [showToast, setShowToast] = useState(false);

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("saving");
    try {
      await onClick();
      setState("saved");
      setShowToast(true);
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  const handleToastDone = useCallback(() => setShowToast(false), []);

  const label =
    state === "saving" ? "Changing..." : state === "saved" ? "Password Changed" : "Change Password";

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state !== "idle"}
        className={`content-stretch flex gap-[8px] items-center justify-center px-[40px] py-[16px] relative rounded-[53px] shrink-0 bg-[#BA0020] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#9a001a] transition-colors border-none ${fullWidth ? "w-full h-[48px]" : "h-[56px]"}`}
      >
        {state === "saving" && (
          <span className="text-white">
            <Spinner />
          </span>
        )}
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[16px] text-white text-center tracking-[0.16px] whitespace-nowrap">
          {label}
        </p>
      </button>
      <PasswordChangedToast visible={showToast} onDone={handleToastDone} />
    </>
  );
}

/* ==================== Eye Icon ==================== */

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ==================== Manage Account ==================== */

function ManageAccountContent({ email, isMobile }: { email: string; isMobile?: boolean }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChangePassword = async () => {
    let valid = true;

    if (!currentPassword.trim()) {
      setCurrentPasswordError("Please enter your current password");
      valid = false;
    } else {
      setCurrentPasswordError("");
    }

    if (!newPassword.trim()) {
      setNewPasswordError("Please enter a new password");
      valid = false;
    } else if (newPassword.length < 6) {
      setNewPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setNewPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your new password");
      valid = false;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!valid) throw new Error("Validation failed");

    const res = await fetchWithRetry(`${API_BASE}/auth/change-password`, {
      method: "POST",
      headers: { ...AUTH_HEADER, "Content-Type": "application/json" },
      body: JSON.stringify({ email, currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 401) {
        setCurrentPasswordError("Current password is incorrect");
      }
      throw new Error(data.error || "Password change failed");
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  };

  const labelClass = "font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic text-[14px] text-[rgba(0,0,0,0.9)] tracking-[0.14px]";

  return (
    <ConfigProvider theme={ANT_THEME}>
      <div className={`content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-px relative ${isMobile ? "w-full" : "flex-[1_0_0]"}`}>
        {!isMobile && (
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
            Manage Account
          </p>
        )}

        <div className={`content-stretch flex flex-col items-start relative shrink-0 w-full bg-[#f6f6f6] rounded-[16px] ${isMobile ? "p-[16px] gap-[24px]" : "p-[24px] gap-[32px]"}`}>
          <div className={`content-stretch flex flex-col gap-[24px] items-start relative w-full ${isMobile ? "" : "max-w-[calc(50%-12px)]"}`}>
            {/* Email (readonly) */}
            <div className="flex flex-col gap-[4px] w-full">
              <p className={labelClass}>
                Email
              </p>
              <Input
                value={email}
                disabled
                style={FORM_FIELD_STYLE}
              />
            </div>

            {/* Current Password */}
            <div className="flex flex-col gap-[4px] w-full">
              <p className={labelClass}>
                Current Password<span className="text-[#ba0020]">*</span>
              </p>
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (currentPasswordError) setCurrentPasswordError("");
                }}
                placeholder="Current Password"
                status={currentPasswordError ? "error" : undefined}
                style={FORM_FIELD_STYLE}
                suffix={
                  <div className="cursor-pointer flex items-center" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <EyeIcon visible={showCurrentPassword} />
                  </div>
                }
              />
              {currentPasswordError && (
                <p className="text-[#ff4d4f] text-[12px] leading-[18px] font-['Inter:Regular',sans-serif]">{currentPasswordError}</p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-[4px] w-full">
              <p className={labelClass}>
                New Password<span className="text-[#ba0020]">*</span>
              </p>
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (newPasswordError) setNewPasswordError("");
                }}
                placeholder="New Password"
                status={newPasswordError ? "error" : undefined}
                style={FORM_FIELD_STYLE}
                suffix={
                  <div className="cursor-pointer flex items-center" onClick={() => setShowNewPassword(!showNewPassword)}>
                    <EyeIcon visible={showNewPassword} />
                  </div>
                }
              />
              {newPasswordError && (
                <p className="text-[#ff4d4f] text-[12px] leading-[18px] font-['Inter:Regular',sans-serif]">{newPasswordError}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-[4px] w-full">
              <p className={labelClass}>
                Confirm New Password<span className="text-[#ba0020]">*</span>
              </p>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
                placeholder="Confirm New Password"
                status={confirmPasswordError ? "error" : undefined}
                style={FORM_FIELD_STYLE}
                suffix={
                  <div className="cursor-pointer flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <EyeIcon visible={showConfirmPassword} />
                  </div>
                }
              />
              {confirmPasswordError && (
                <p className="text-[#ff4d4f] text-[12px] leading-[18px] font-['Inter:Regular',sans-serif]">{confirmPasswordError}</p>
              )}
            </div>
          </div>

          <ChangePasswordButton onClick={handleChangePassword} fullWidth={isMobile} />
        </div>
      </div>
    </ConfigProvider>
  );
}

/* ==================== Coupons ==================== */

type CouponTab = "available" | "used" | "expired";

interface Coupon {
  id: string;
  discount: string;
  code: string;
  expireDate?: string;
  status: CouponTab;
}

const MOCK_COUPONS: Coupon[] = [
  { id: "a1", discount: "30%", code: "WS24D3200US", expireDate: "08/12/2026 23:59", status: "available" },
  { id: "a2", discount: "30%", code: "WS24D3200US", expireDate: "08/12/2026 23:59", status: "available" },
  { id: "a3", discount: "30%", code: "WS24D3200US", expireDate: "08/12/2026 23:59", status: "available" },
  { id: "a4", discount: "30%", code: "WS24D3200US", expireDate: "08/12/2026 23:59", status: "available" },
  { id: "u1", discount: "30%", code: "WS24D3200US", status: "used" },
  { id: "u2", discount: "30%", code: "WS24D3200US", status: "used" },
  { id: "e1", discount: "30%", code: "WS24D3200US", expireDate: "01/12/2026 23:59", status: "expired" },
  { id: "e2", discount: "30%", code: "WS24D3200US", expireDate: "09/12/2026 23:59", status: "expired" },
  { id: "e3", discount: "30%", code: "WS24D3200US", expireDate: "01/12/2026 23:59", status: "expired" },
  { id: "e4", discount: "30%", code: "WS24D3200US", expireDate: "01/12/2026 23:59", status: "expired" },
  { id: "e5", discount: "30%", code: "WS24D3200US", expireDate: "09/12/2026 23:59", status: "expired" },
];

const COUPON_TABS: { key: CouponTab; label: string }[] = [
  { key: "available", label: "Available" },
  { key: "used", label: "Used" },
  { key: "expired", label: "Expired" },
];

function CouponTicketIcon() {
  return <img src="/images/coupon_icon.svg" width="20" height="20" alt="" />;
}

function CouponInfoIcon({ muted }: { muted?: boolean }) {
  const opacity = muted ? "0.4" : "0.6";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7.5" stroke="white" strokeOpacity={opacity} strokeWidth="1.2"/>
      <path d="M10 9.16667V13.3333" stroke="white" strokeOpacity={opacity} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="10" cy="7.08333" r="0.833" fill="white" fillOpacity={opacity}/>
    </svg>
  );
}

function CopiedToast({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onDone, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [visible, onDone]);

  if (!visible) return null;

  return createPortal(
    <div
      className={`fixed top-[24px] left-1/2 z-[9999] flex items-center gap-[8px] px-[20px] py-[12px] rounded-[12px] bg-[#101820] shadow-lg transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-[12px]"
      }`}
      style={{ transform: `translateX(-50%) translateY(${show ? 0 : -12}px)` }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4.16667 10.8333L7.5 14.1667L15.8333 5.83334" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-white leading-[20px] whitespace-nowrap">
        Code Copied
      </span>
    </div>,
    document.body,
  );
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const isAvailable = coupon.status === "available";
  const bgImage = isAvailable ? "/images/coupon-bg.png" : "/images/coupon-ex-bg.png";
  const [showToast, setShowToast] = useState(false);
  const handleToastDone = useCallback(() => setShowToast(false), []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setShowToast(true);
    } catch {
      /* fallback: silently fail */
    }
  };

  const buttonLabel = isAvailable ? "Copy CODE" : coupon.status === "used" ? "Used" : "Expired";

  return (
    <>
      <div
        className="relative w-[330px] h-[118px] rounded-[8px] overflow-hidden shrink-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Top-left: coupon icon */}
        <div className="absolute left-[16px] top-[11px]">
          <CouponTicketIcon />
        </div>

        {/* Top-right: info icon */}
        <div className="absolute right-[8px] top-[8px]">
          <CouponInfoIcon muted={!isAvailable} />
        </div>

        {/* Discount */}
        <div className="absolute left-[16px] top-[31px] flex items-baseline gap-[4px]">
          <span className="font-['Inter:Bold',sans-serif] font-bold text-[32px] leading-[44px] text-white tracking-[0.32px]">
            {coupon.discount}
          </span>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-white tracking-[0.18px]">
            OFF
          </span>
        </div>

        {/* Button */}
        <div className="absolute right-[24px] top-[41px]">
          {isAvailable ? (
            <button
              onClick={handleCopy}
              className="h-[36px] px-[16px] rounded-[53px] border-2 border-white bg-transparent cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-white tracking-[0.14px] whitespace-nowrap">
                {buttonLabel}
              </span>
            </button>
          ) : (
            <div className="h-[36px] px-[16px] rounded-[53px] border border-white/40 flex items-center justify-center">
              <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[20px] text-white/60 tracking-[0.14px] whitespace-nowrap">
                {buttonLabel}
              </span>
            </div>
          )}
        </div>

        {/* Bottom-left: COUPON CODE label + code */}
        <div className="absolute left-[16px] bottom-[15px] flex flex-col">
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[8px] leading-[12px] text-white/60 tracking-[0.8px] uppercase">
            COUPON CODE
          </span>
          <span className="font-['Inter:Medium',sans-serif] font-medium text-[12px] leading-[16px] text-white tracking-[0.12px]">
            {coupon.code}
          </span>
        </div>

        {/* Bottom-right: Expire date */}
        {coupon.expireDate && (
          <div className="absolute right-[26px] bottom-[15px] flex items-center gap-[4px]">
            <span className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-white/60 tracking-[0.12px]">
              Expire
            </span>
            <span className="font-['Inter:Regular',sans-serif] font-normal text-[12px] leading-[16px] text-white/60 tracking-[0.12px]">
              {coupon.expireDate}
            </span>
          </div>
        )}
      </div>
      <CopiedToast visible={showToast} onDone={handleToastDone} />
    </>
  );
}

function CouponTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: CouponTab;
  onTabChange: (tab: CouponTab) => void;
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const el = tabRefs.current[activeTab];
    const container = containerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div ref={containerRef} className="relative flex items-center gap-[32px] h-[60px]">
      {COUPON_TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[tab.key] = el; }}
            onClick={() => onTabChange(tab.key)}
            className={`relative h-full flex items-center justify-center bg-transparent border-none cursor-pointer px-0 transition-colors ${
              isActive
                ? "font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] text-[rgba(0,0,0,0.9)]"
                : "font-['Inter:Regular',sans-serif] font-normal text-[16px] text-[rgba(0,0,0,0.54)] hover:text-[rgba(0,0,0,0.7)]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
      <div
        className="absolute bottom-0 h-[2px] bg-[#ba0020] rounded-full transition-all duration-300 ease-in-out"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}

function CouponsContent({ isMobile }: { isMobile?: boolean }) {
  const [activeTab, setActiveTab] = useState<CouponTab>("available");
  const filtered = MOCK_COUPONS.filter((c) => c.status === activeTab);

  return (
    <div className={`content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-px relative ${isMobile ? "w-full" : "flex-[1_0_0]"}`}>
      {!isMobile && (
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          Coupons
        </p>
      )}

      <CouponTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="content-stretch flex flex-wrap gap-[32px] items-start relative w-full">
        {filtered.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
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
        <button onClick={() => window.open("https://pdflink.to/0c692a15/", "_blank")} className="border-2 border-[#101820] border-solid content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 bg-transparent cursor-pointer">
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

/* ==================== Protect-Premium ==================== */

function ProtectPremiumContent({ isMobile }: { isMobile?: boolean }) {
  const cardClass = isMobile
    ? "relative w-full h-[236px] rounded-[16px] overflow-hidden"
    : "relative w-[400px] h-[267px] rounded-[16px] overflow-hidden shrink-0";

  return (
    <div className={`content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-px relative ${isMobile ? "w-full" : "flex-[1_0_0]"}`}>
      {!isMobile && (
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] w-full">
          Protect-Premium
        </p>
      )}

      <div className={`content-stretch flex items-start relative w-full ${isMobile ? "flex-col gap-[20px]" : "gap-[32px]"}`}>
        {/* Protect + Card */}
        <div
          className={cardClass}
          style={{
            backgroundImage: "url(/images/protect-plus.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-[24px] right-[24px] bottom-[20px] flex items-end justify-between">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-white tracking-[0.18px]">
                Protect +
              </p>
              <div className="flex items-center gap-[4px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#22C55E"/>
                  <path d="M4.5 8L7 10.5L11.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-white tracking-[0.14px]">
                  You're Protected
                </span>
              </div>
            </div>
            <button
              disabled
              className="h-[36px] px-[16px] rounded-[53px] border-2 border-white/40 bg-transparent flex items-center justify-center cursor-default opacity-60"
            >
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-white/60 tracking-[0.14px] whitespace-nowrap">
                Subscribed
              </span>
            </button>
          </div>
        </div>

        {/* Ai Alert Card */}
        <div
          className={cardClass}
          style={{
            backgroundImage: "url(/images/ai-alert.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-[24px] right-[24px] bottom-[20px] flex items-end justify-between">
            <div className="flex flex-col gap-[4px]">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-white tracking-[0.18px]">
                Ai Alert
              </p>
              <div className="flex items-center gap-[4px]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="white" fillOpacity="0.4"/>
                  <path d="M8 4.5V9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="8" cy="11.5" r="0.75" fill="white"/>
                </svg>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-white tracking-[0.14px]">
                  Unsubscribed
                </span>
              </div>
            </div>
            <button className="h-[36px] px-[16px] rounded-[53px] border-2 border-white bg-transparent cursor-pointer flex items-center justify-center hover:bg-white/10 transition-colors">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-white tracking-[0.14px] whitespace-nowrap">
                Start Protection
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Mobile Components ==================== */

const MOBILE_TAB_ITEMS = MENU_ITEMS.filter(
  (item) => item.section !== "divider" && item.key !== "logout"
);

function MobileTabBar({
  activeKey,
  onSelect,
}: {
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const activeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const btn = activeRef.current;
      const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, scrollLeft), behavior: "smooth" });
    }
  }, [activeKey]);

  return (
    <div className="w-full bg-white">
      <div
        ref={scrollRef}
        className="flex gap-[8px] items-center overflow-x-auto px-[20px] py-[14px] scrollbar-hide"
      >
        {MOBILE_TAB_ITEMS.map((item) => {
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(item.key)}
              className={`shrink-0 h-[32px] px-[16px] rounded-[50px] cursor-pointer font-['Inter:Medium',sans-serif] font-medium text-[14px] leading-[20px] tracking-[0.14px] whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#022542] text-white border-none"
                  : "bg-[#f6f6f6] text-[rgba(0,0,0,0.54)] border-none"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MobileProductRow({ product }: { product: OrderProduct }) {
  return (
    <div className="flex gap-[8px] items-start w-full">
      <img
        src={product.image}
        alt={product.name}
        className="bg-[rgba(0,0,0,0.05)] rounded-[4px] shrink-0 size-[64px] object-contain"
      />
      <div className="flex flex-col gap-[8px] flex-[1_0_0] min-w-0">
        <div className="flex flex-col gap-[4px]">
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] leading-[22px] text-[rgba(0,0,0,0.9)] tracking-[0.16px]">
            {product.name}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[rgba(0,0,0,0.54)] tracking-[0.14px]">
            {product.package}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[8px] items-center font-['Inter:Medium',sans-serif] font-medium text-[16px] tracking-[0.16px]">
            <p className="text-[rgba(0,0,0,0.9)] leading-[22px]">{product.price}</p>
            {product.originalPrice && (
              <p className="text-[rgba(0,0,0,0.3)] leading-[22px] line-through">{product.originalPrice}</p>
            )}
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] leading-[22px] text-[rgba(0,0,0,0.9)] tracking-[0.16px] text-right">
            Qty:{product.quantity}
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileOrderCard({ order }: { order: Order }) {
  return (
    <div className="bg-[#f6f6f6] flex flex-col gap-[16px] items-start p-[16px] rounded-[16px] w-full">
      <div className="flex flex-col gap-[4px] w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.18px]">
            Order {order.id}
          </p>
          <StatusBadge status={order.status} />
        </div>
        <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] text-[rgba(0,0,0,0.54)] tracking-[0.14px]">
          Date: {order.date}
        </p>
      </div>

      {order.products.map((product, idx) => (
        <MobileProductRow key={idx} product={product} />
      ))}

      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] text-[rgba(0,0,0,0.9)] tracking-[0.18px] text-right w-full">
        Total: {order.total}
      </p>

      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-0.5px_0] border-t border-[rgba(0,0,0,0.08)]" />
      </div>

      <div className="flex gap-[16px] items-center w-full">
        <button onClick={() => window.open("https://pdflink.to/0c692a15/", "_blank")} className="flex-1 h-[48px] rounded-[53px] border-2 border-solid border-[#101820] bg-transparent flex items-center justify-center cursor-pointer">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-[#101820] text-center tracking-[0.14px] whitespace-nowrap">
            Invoice
          </p>
        </button>
        <button className="flex-1 h-[48px] rounded-[53px] border-2 border-solid border-[#101820] bg-transparent flex items-center justify-center cursor-pointer">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-[#101820] text-center tracking-[0.14px] whitespace-nowrap">
            Track order
          </p>
        </button>
      </div>
    </div>
  );
}

/* ==================== Main Page ==================== */

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [activeMenu, setActiveMenu] = useState("orders");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth < 1024);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

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

  const renderContent = (mobile = false) => {
    switch (activeMenu) {
      case "profile":
        return <MyProfileContent profileId={profileId} isMobile={mobile} />;
      case "address":
        return <ShippingAddressContent profileId={profileId} isMobile={mobile} />;
      case "manage":
        return <ManageAccountContent email={user.email} isMobile={mobile} />;
      case "coupons":
        return <CouponsContent isMobile={mobile} />;
      case "premium":
        return <ProtectPremiumContent isMobile={mobile} />;
      case "orders":
      default:
        return <MyOrdersContent />;
    }
  };

  const activeLabel = MOBILE_TAB_ITEMS.find((i) => i.key === activeMenu)?.label || "My Orders";

  if (isMobile) {
    return (
      <div className="bg-white w-full min-h-screen">
        <MobileNav />
        <div className="pt-[48px]">
          <MobileTabBar activeKey={activeMenu} onSelect={handleMenuSelect} />
          <div className="px-[20px] pb-[24px]">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[24px] leading-[34px] text-[rgba(0,0,0,0.9)] tracking-[0.24px] pt-[10px] pb-[18px]">
              {activeLabel}
            </p>
            {activeMenu === "orders" ? (
              <div className="flex flex-col gap-[16px]">
                {MOCK_ORDERS.map((order, idx) => (
                  <MobileOrderCard key={idx} order={order} />
                ))}
              </div>
            ) : (
              renderContent(true)
            )}
          </div>
          <Footer />
        </div>
      </div>
    );
  }

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
