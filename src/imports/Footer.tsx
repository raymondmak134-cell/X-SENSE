import { useState, useCallback, useRef, useEffect } from "react";

function ToggleIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 lg:hidden"
    >
      <rect
        x="4"
        y="9.25"
        width="12"
        height="1.5"
        rx="0.75"
        fill="white"
        className="transition-opacity duration-300 ease-in-out"
        style={{ opacity: 1 }}
      />
      <rect
        x="9.25"
        y="4"
        width="1.5"
        height="12"
        rx="0.75"
        fill="white"
        className="transition-transform duration-300 ease-in-out origin-center"
        style={{
          transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          transformOrigin: "10px 10px",
        }}
      />
    </svg>
  );
}

function CollapsibleSection({
  title,
  children,
  expanded,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col gap-0 lg:gap-[24px] items-start w-full lg:min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className="lg:pointer-events-none flex items-center justify-between w-full bg-transparent border-none p-0 cursor-pointer lg:cursor-default"
      >
        <h4 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-[24px] text-white">
          {title}
        </h4>
        <ToggleIcon expanded={expanded} />
      </button>
      <div
        className="grid w-full transition-[grid-template-rows] duration-300 ease-in-out lg:!grid-rows-[1fr]"
        style={{
          gridTemplateRows: expanded ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-[16px] lg:pt-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className="transition-colors duration-200 ease-in-out"
    >
      <rect
        width="18"
        height="18"
        rx="4"
        fill={checked ? "#BA0020" : "transparent"}
        stroke={checked ? "none" : "rgba(255,255,255,0.4)"}
        strokeWidth={checked ? 0 : 1.5}
        className="transition-all duration-200 ease-in-out"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.83094 11.3177L14.0326 5L15 5.98548L8.31463 12.7959C8.04749 13.068 7.61438 13.068 7.34725 12.7959L4 9.38604L4.96738 8.40057L7.83094 11.3177Z"
        fill="white"
        className="transition-opacity duration-200 ease-in-out"
        style={{ opacity: checked ? 1 : 0 }}
      />
    </svg>
  );
}

function Toast({
  message,
  visible,
  type,
}: {
  message: string;
  visible: boolean;
  type: "success" | "error";
}) {
  return (
    <div
      className="fixed top-[24px] left-1/2 z-[9999] flex items-center gap-[8px] px-[16px] py-[12px] rounded-[8px] shadow-lg transition-all duration-300 ease-in-out pointer-events-none"
      style={{
        transform: visible
          ? "translate(-50%, 0)"
          : "translate(-50%, -20px)",
        opacity: visible ? 1 : 0,
        backgroundColor: type === "error" ? "#ff4d4f" : "#52c41a",
      }}
    >
      <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-[20px] text-white whitespace-nowrap">
        {message}
      </span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2.5"
        fill="none"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Footer() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [agreed, setAgreed] = useState(true);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error") => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ message, type, visible: true });
      toastTimerRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleSubscribe = useCallback(() => {
    if (!agreed || isLoading) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsLoading(true);
    const duration = 1500 + Math.random() * 1000;
    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      showToast("Subscription Successful!", "success");
    }, duration);
  }, [agreed, isLoading, email, showToast]);

  const toggle = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <>
    <Toast message={toast.message} visible={toast.visible} type={toast.type} />
    <div
      className="bg-[#101820] flex flex-col gap-[40px] lg:gap-[56px] items-center px-[20px] lg:px-[120px] py-[40px] w-full"
      data-name="Footer"
    >
      {/* Subscribe Section */}
      <div className="flex flex-col gap-[24px] items-center max-w-[1312px] w-full">
        <div className="flex flex-col gap-[12px] items-center text-center w-full">
          <h2 className="font-['Inter',sans-serif] font-bold text-[24px] lg:text-[32px] leading-[32px] lg:leading-[44px] text-[#f2f0ed] w-full">
            Subscribe for Updates
          </h2>
          <p className="font-['Inter',sans-serif] font-normal text-[14px] lg:text-[16px] leading-[20px] lg:leading-[22px] text-white/90 w-full">
            Get safety tips, product updates, and exclusive 12% offers.
          </p>
        </div>

        <div className="flex flex-col gap-[12px] items-center w-full">
          {/* Email Input */}
          <div className="bg-white/10 flex gap-[16px] lg:gap-[24px] items-center overflow-hidden pl-[16px] pr-[4px] py-[4px] rounded-[58px] w-full max-w-[480px]">
            <div className="flex flex-1 gap-[4px] items-center min-w-0">
              <div className="shrink-0 size-[24px] overflow-hidden relative">
                <img
                  alt=""
                  className="absolute inset-[13%_5%] w-[90%] h-[74%]"
                  src="/images/footer/email-icon.svg"
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubscribe();
                }}
                placeholder="Enter Your Email Address"
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-['Inter',sans-serif] font-normal text-[14px] lg:text-[16px] leading-[22px] text-white placeholder:text-white/40"
                style={{ caretColor: "#BA0020" }}
              />
            </div>
            <button
              disabled={!agreed || isLoading}
              onClick={handleSubscribe}
              className={`flex gap-[4px] h-[40px] items-center justify-center rounded-[50px] shrink-0 border-none transition-all duration-300 ${
                isLoading
                  ? "bg-[#ba0020] w-[40px] px-0"
                  : agreed
                    ? "bg-[#ba0020] cursor-pointer hover:bg-[#a0001b] px-[16px]"
                    : "bg-white/20 cursor-not-allowed px-[16px]"
              }`}
              style={{
                minWidth: isLoading ? "40px" : undefined,
              }}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <span
                  className={`font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-center whitespace-nowrap transition-colors ${
                    agreed ? "text-white" : "text-white/40"
                  }`}
                >
                  Subscribe
                </span>
              )}
            </button>
          </div>

          {/* Checkbox + Terms */}
          <div className="flex gap-[10px] items-start w-full max-w-[480px]">
            <button
              type="button"
              onClick={() => setAgreed((prev) => !prev)}
              className="flex items-center justify-center p-[4px] shrink-0 size-[24px] bg-transparent border-none cursor-pointer"
            >
              <CheckboxIcon checked={agreed} />
            </button>
            <div className="flex-1 font-['Inter',sans-serif] font-normal text-[13px] lg:text-[14px] leading-[18px] lg:leading-[20px] text-white/90 min-w-0">
              <p className="mb-0">
                I agree to receive marketing emails from X-SENSE, including
                product updates, safety tips, and promotions. I understand I can
                unsubscribe at any time. For more details, please see our
              </p>
              <p>
                <span className="text-[#ba0020]">Terms of Use</span>
                <span>{` and `}</span>
                <span className="text-[#ba0020]">Privacy Policy</span>
                <span>.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px max-w-[1312px] w-full bg-white/10" />

      {/* Footer Content */}
      <div className="flex flex-col gap-[48px] lg:gap-[64px] items-start max-w-[1312px] w-full">
        {/* 4-Column Links */}
        <div className="flex flex-col lg:flex-row gap-[32px] lg:gap-[11px] items-start w-full lg:justify-center">
          {/* Products */}
          <CollapsibleSection
            title="Products"
            expanded={!!expandedSections["products"]}
            onToggle={() => toggle("products")}
          >
            <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full">
              <FooterLink>Smoke Alarms</FooterLink>
              <FooterLink>CO Alarms</FooterLink>
              <FooterLink>Combination Alarms</FooterLink>
              <FooterLink>Home Alarms</FooterLink>
            </div>
          </CollapsibleSection>

          {/* Support */}
          <CollapsibleSection
            title="Support"
            expanded={!!expandedSections["support"]}
            onToggle={() => toggle("support")}
          >
            <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full">
              <FooterLink>Contact Us</FooterLink>
              <FooterLink>FAQs</FooterLink>
              <FooterLink>Order Tracking</FooterLink>
              <FooterLink>Products Manual</FooterLink>
              <FooterLink>Developer APIs</FooterLink>
              <FooterLink>Data Management</FooterLink>
            </div>
          </CollapsibleSection>

          {/* Explore */}
          <CollapsibleSection
            title="Explore"
            expanded={!!expandedSections["explore"]}
            onToggle={() => toggle("explore")}
          >
            <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full">
              <FooterLink>About Us</FooterLink>
              <FooterLink>Safety Hub</FooterLink>
              <FooterLink>Affiliate Program</FooterLink>
              <FooterLink>Protect+</FooterLink>
            </div>
          </CollapsibleSection>

          {/* Contact us */}
          <CollapsibleSection
            title="Contact us"
            expanded={!!expandedSections["contact"]}
            onToggle={() => toggle("contact")}
          >
            <div className="flex flex-col gap-[16px] w-full">
              {/* Phone */}
              <div className="flex gap-[8px] items-start w-full">
                <div className="shrink-0 size-[20px] overflow-hidden relative">
                  <img
                    alt=""
                    className="absolute inset-[5%] w-[90%] h-[90%]"
                    src="/images/footer/phone-icon.svg"
                  />
                </div>
                <span className="flex-1 font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white/54 min-w-0 whitespace-pre-wrap">
                  {`Tel: United States  +1 (833) 952-1880`}
                </span>
              </div>
              {/* Email */}
              <div className="flex gap-[8px] items-start w-full">
                <div className="shrink-0 size-[20px] overflow-hidden relative">
                  <img
                    alt=""
                    className="absolute inset-[12%_4%] w-[92%] h-[76%]"
                    src="/images/footer/email-contact.svg"
                  />
                </div>
                <span className="flex-1 font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white/54 min-w-0">
                  Customer Service: service@x-sense.com
                </span>
              </div>
              {/* Working Time */}
              <div className="flex gap-[8px] items-start w-full">
                <div className="shrink-0 size-[20px] overflow-hidden relative">
                  <img
                    alt=""
                    className="absolute inset-[1%_5%_4%_4%] w-[91%] h-[95%]"
                    src="/images/footer/clock-icon.svg"
                  />
                </div>
                <div className="flex-1 font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white/54 min-w-0">
                  <p className="mb-0">{`working time: `}</p>
                  <p>Mon-Fri 9 AM–5 PM (US Eastern Time)</p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-[12px] items-start w-full mt-[24px]">
              <a className="shrink-0 size-[32px] cursor-pointer">
                <img
                  alt="Facebook"
                  className="size-full"
                  src="/images/footer/social-facebook.svg"
                />
              </a>
              <a className="shrink-0 size-[32px] cursor-pointer">
                <img
                  alt="Instagram"
                  className="size-full"
                  src="/images/footer/social-instagram.svg"
                />
              </a>
              <a className="shrink-0 size-[32px] cursor-pointer">
                <img
                  alt="YouTube"
                  className="size-full"
                  src="/images/footer/social-youtube.svg"
                />
              </a>
              <a className="shrink-0 size-[32px] cursor-pointer">
                <img
                  alt="Reddit"
                  className="size-full"
                  src="/images/footer/social-reddit.svg"
                />
              </a>
            </div>
          </CollapsibleSection>
        </div>

        {/* Payment + Policy + Copyright */}
        <div className="flex flex-col gap-[24px] w-full">
          {/* Payment & Policy */}
          <div className="flex flex-col gap-[16px] w-full">
            {/* Payment Icons */}
            <div className="flex flex-wrap gap-[12px] items-start w-full">
              <PaymentIcon src="/images/footer/pay-amex.svg" alt="Amex" />
              <ApplePayIcon />
              <PaymentIcon src="/images/footer/pay-gpay.svg" alt="Google Pay" />
              <PaymentIcon
                src="/images/footer/pay-mastercard.svg"
                alt="Mastercard"
              />
              <PaymentIcon src="/images/footer/pay-paypal.svg" alt="PayPal" />
              <PaymentIcon src="/images/footer/pay-shop.svg" alt="Shop Pay" />
              <PaymentIcon
                src="/images/footer/pay-unionpay.svg"
                alt="UnionPay"
              />
              <PaymentIcon src="/images/footer/pay-visa.svg" alt="Visa" />
            </div>

            {/* Policy Links */}
            <div className="flex flex-wrap gap-[8px] items-center w-full">
              <PolicyLink>Shipping Policy</PolicyLink>
              <PolicyDivider />
              <PolicyLink>{`Return & Warranty Policy`}</PolicyLink>
              <PolicyDivider />
              <PolicyLink>Terms of Use</PolicyLink>
              <PolicyDivider />
              <PolicyLink>Privacy Policy</PolicyLink>
              <PolicyDivider />
              <PolicyLink>Cookie Preferences</PolicyLink>
            </div>
          </div>

          {/* Bottom Divider */}
          <div className="h-px w-full bg-white/10" />

          {/* Copyright + Locale */}
          <div className="flex flex-col lg:flex-row gap-[12px] lg:gap-0 items-start lg:items-center lg:justify-between w-full">
            <div className="lg:flex-1 lg:min-w-0">
              <span className="font-['Inter',sans-serif] font-normal text-[13px] leading-[normal] text-white/54">
                Copyright © 2025 X-Sense. All Rights Reserved.
              </span>
            </div>
            <div className="flex gap-[6px] items-center shrink-0">
              <img
                alt=""
                className="size-[16px]"
                src="/images/footer/globe-icon.svg"
              />
              <span className="font-['Inter',sans-serif] font-normal text-[13px] leading-[normal] text-white/54 whitespace-nowrap">
                United States (English)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function FooterLink({ children }: { children: React.ReactNode }) {
  return (
    <a className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white/54 w-full cursor-pointer hover:text-white/80 transition-colors">
      {children}
    </a>
  );
}

function PaymentIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-[24px] w-[38px] shrink-0 relative">
      <img alt={alt} className="absolute inset-0 block size-full" src={src} />
    </div>
  );
}

function ApplePayIcon() {
  return (
    <div className="h-[24px] w-[38px] shrink-0 relative overflow-hidden">
      <img
        alt=""
        className="absolute block size-full"
        style={{ inset: "0 0.67%" }}
        src="/images/footer/pay-applepay-bg.svg"
      />
      <img
        alt=""
        className="absolute block"
        style={{ inset: "3.33% 2.78%" }}
        src="/images/footer/pay-applepay-fg.svg"
      />
      <img
        alt=""
        className="absolute block"
        style={{ inset: "27.6% 67.09% 33.99% 13.18%" }}
        src="/images/footer/pay-applepay-g1.svg"
      />
      <img
        alt="Apple Pay"
        className="absolute block"
        style={{ inset: "30.3% 13.42% 24.7% 39.36%" }}
        src="/images/footer/pay-applepay-g2.svg"
      />
    </div>
  );
}

function PolicyLink({ children }: { children: React.ReactNode }) {
  return (
    <a className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white/54 whitespace-nowrap cursor-pointer hover:text-white/80 transition-colors">
      {children}
    </a>
  );
}

function PolicyDivider() {
  return <div className="h-[15.5px] w-px bg-white/10 shrink-0" />;
}
