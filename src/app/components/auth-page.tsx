import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { ConfigProvider, Input } from "antd";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import { useAuth } from "../hooks/use-auth";

const BRAND_RED = "#BA0020";
const LINK_RED = "#5e0000";
const INPUT_RADIUS = 16;
const ANT_THEME = {
  token: {
    colorPrimary: "#022542",
    controlOutline: "rgba(2, 37, 66, 0.08)",
    borderRadius: INPUT_RADIUS,
    controlHeight: 52,
    fontSize: 16,
    fontFamily: "'Inter:Regular', sans-serif",
    colorBorder: "rgba(0,0,0,0.1)",
    colorBgContainer: "transparent",
  },
};

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/* ==================== Toast ==================== */

function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-[120px] left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-[12px] shadow-lg text-[14px] text-white bg-[#f59e0b] whitespace-nowrap">
      {message}
    </div>
  );
}

/* ==================== Shared Icons ==================== */

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

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin size-[20px]" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <div className="size-[80px] rounded-full bg-[#22c55e] flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M10 20L17 27L30 13" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ==================== Tab Bar ==================== */

function TabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: "login" | "signup";
  onTabChange: (tab: "login" | "signup") => void;
}) {
  return (
    <div className="flex items-center justify-center gap-[32px] h-[44px] w-full">
      <button
        onClick={() => onTabChange("login")}
        className={`relative h-full w-[80px] flex items-center justify-center cursor-pointer bg-transparent border-none font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] transition-colors ${
          activeTab === "login" ? "text-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.38)]"
        }`}
      >
        Log in
        {activeTab === "login" && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ba0020]" />
        )}
      </button>
      <button
        onClick={() => onTabChange("signup")}
        className={`relative h-full w-[80px] flex items-center justify-center cursor-pointer bg-transparent border-none font-['Inter:Semi_Bold',sans-serif] font-semibold text-[18px] leading-[24px] transition-colors ${
          activeTab === "signup" ? "text-[rgba(0,0,0,0.9)]" : "text-[rgba(0,0,0,0.38)]"
        }`}
      >
        Sign up
        {activeTab === "signup" && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ba0020]" />
        )}
      </button>
    </div>
  );
}

/* ==================== Shared Form State ==================== */

interface SharedFormState {
  email: string;
  setEmail: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  signupPassword: string;
  setSignupPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loginAgreed: boolean;
  setLoginAgreed: (v: boolean) => void;
  signupAgreed: boolean;
  setSignupAgreed: (v: boolean) => void;
}

/* ==================== Login Form ==================== */

function LoginForm({
  onSuccess,
  onToast,
  onForgotPassword,
  shared,
  isMobile,
}: {
  onSuccess: () => void;
  onToast: (msg: string) => void;
  onForgotPassword: () => void;
  shared: SharedFormState;
  isMobile?: boolean;
}) {
  const { login, loading } = useAuth();
  const { email, setEmail, loginPassword: password, setLoginPassword: setPassword, loginAgreed: agreed, setLoginAgreed: setAgreed } = shared;
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Please enter your email address");
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!agreed) {
      onToast("Please read and agree to the terms before continuing.");
      return;
    }
    const emailValid = validateEmail(email);
    let valid = emailValid;
    if (!password.trim()) {
      setPasswordError("Please enter your password");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!valid) return;
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err: any) {
      setServerError(err.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
          setServerError("");
        }}
        onBlur={() => email && validateEmail(email)}
        placeholder="Enter email"
        status={emailError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
      />
      {emailError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">{emailError}</p>
      )}

      <Input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError("");
          setServerError("");
        }}
        placeholder="Enter password"
        status={passwordError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
        suffix={
          <div className="cursor-pointer flex items-center" onClick={() => setShowPassword(!showPassword)}>
            <EyeIcon visible={showPassword} />
          </div>
        }
      />
      {passwordError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">{passwordError}</p>
      )}

      {serverError && (
        <p className="text-[#ff4d4f] text-[13px] leading-[18px] -mt-[12px] font-['Inter:Regular',sans-serif]">{serverError}</p>
      )}

      <a
        href="#"
        className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] no-underline"
        style={{ color: LINK_RED }}
        onClick={(e) => {
          e.preventDefault();
          onForgotPassword();
        }}
      >
        Forgot password?
      </a>

      <label className="flex items-center gap-[10px] cursor-pointer select-none">
        <div className="relative shrink-0 size-[24px]" onClick={() => setAgreed(!agreed)}>
          <div
            className={`absolute inset-[12.5%] rounded-[4px] border-[1.3px] flex items-center justify-center transition-colors ${
              agreed ? "bg-[#ba0020] border-[#ba0020]" : "bg-transparent border-[rgba(0,0,0,0.3)]"
            }`}
          >
            {agreed && <CheckIcon />}
          </div>
        </div>
        <span className="font-['Inter:Regular',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.54)]">
          I have read and agree to the{" "}
          <a href="#" className="font-['Inter:Semi_Bold',sans-serif] font-semibold no-underline" style={{ color: LINK_RED }} onClick={(e) => e.preventDefault()}>Terms of Use</a>
          {" "}and{" "}
          <a href="#" className="font-['Inter:Semi_Bold',sans-serif] font-semibold no-underline" style={{ color: LINK_RED }} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          .
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${isMobile ? "min-h-[48px] py-[13px]" : "min-h-[56px] py-[16px]"} rounded-[50px] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[22px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-none px-[24px]`}
        style={{ backgroundColor: BRAND_RED }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#9a001a")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND_RED)}
      >
        {loading && <Spinner />}
        Log in
      </button>
    </div>
  );
}

/* ==================== Forgot Password Form ==================== */

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ForgotPasswordForm({
  onBack,
  onToast,
  email: initialEmail,
  isMobile,
}: {
  onBack: () => void;
  onToast: (msg: string) => void;
  email: string;
  isMobile?: boolean;
}) {
  const { forgotPassword, loading } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Please enter your email address");
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    setServerError("");
    const emailValid = validateEmail(email);
    if (!emailValid) return;
    try {
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      const msg = err.message || "Failed to send reset email";
      if (msg.toLowerCase().includes("not registered") || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("no user")) {
        onToast("This email is not registered. Please sign up first.");
      } else {
        setServerError(msg);
      }
    }
  };

  if (submitted) {
    const maskedEmail = email.replace(
      /(.{2})(.*)(@.*)/,
      (_m, a, b, c) => a + b.replace(/./g, "*") + c,
    );
    return (
      <div
        className={
          isMobile
            ? "w-full flex flex-col items-center px-[24px] pt-[24px] pb-[32px] rounded-[20px]"
            : "w-[480px] max-w-[calc(100vw-48px)] flex flex-col items-center px-[48px] pt-[32px] pb-[48px] rounded-[24px]"
        }
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(11px)",
          WebkitBackdropFilter: "blur(11px)",
        }}
      >
        <SuccessIcon />
        <p
          className={`font-['Inter:Bold',sans-serif] font-bold ${
            isMobile ? "text-[20px] leading-[28px]" : "text-[24px] leading-[34px]"
          } text-[rgba(0,0,0,0.9)] tracking-[0.24px] text-center mt-[24px]`}
        >
          Reset Your Password
        </p>
        <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.54)] text-center mt-[24px] w-full">
          We've sent a password reset email to {maskedEmail}. Please check your inbox and follow the instructions to reset your password.
        </p>
        <button
          onClick={onBack}
          className={`w-full ${
            isMobile ? "min-h-[48px] py-[13px]" : "min-h-[56px] py-[16px]"
          } rounded-[50px] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[22px] flex items-center justify-center cursor-pointer transition-colors border-none mt-[24px] px-[24px]`}
          style={{ backgroundColor: BRAND_RED }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#9a001a")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = BRAND_RED)
          }
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        isMobile
          ? "w-full flex flex-col gap-[20px] items-start px-[24px] pt-[24px] pb-[32px] rounded-[20px]"
          : "w-[480px] max-w-[calc(100vw-48px)] flex flex-col gap-[24px] items-start px-[48px] pt-[32px] pb-[48px] rounded-[24px]"
      }
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(11px)",
        WebkitBackdropFilter: "blur(11px)",
      }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-[4px] bg-transparent border-none cursor-pointer p-0 font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] leading-[20px] text-[rgba(0,0,0,0.9)] transition-colors self-start"
      >
        <BackArrow />
        Back
      </button>

      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
          setServerError("");
        }}
        onBlur={() => email && validateEmail(email)}
        placeholder="Enter email"
        status={emailError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
      />
      {emailError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">
          {emailError}
        </p>
      )}

      {serverError && (
        <p className="text-[#ff4d4f] text-[13px] leading-[18px] -mt-[12px] font-['Inter:Regular',sans-serif]">
          {serverError}
        </p>
      )}

      <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.54)] m-0">
        We'll send you an email with a link to reset your password.
      </p>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${
          isMobile ? "min-h-[48px] py-[13px]" : "min-h-[56px] py-[16px]"
        } rounded-[50px] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[22px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-none px-[24px]`}
        style={{ backgroundColor: BRAND_RED }}
        onMouseEnter={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = "#9a001a")
        }
        onMouseLeave={(e) =>
          !loading && (e.currentTarget.style.backgroundColor = BRAND_RED)
        }
      >
        {loading && <Spinner />}
        Send Reset Link
      </button>
    </div>
  );
}

/* ==================== Register Form ==================== */

function RegisterForm({
  onSuccess,
  onToast,
  shared,
  isMobile,
}: {
  onSuccess: (email: string) => void;
  onToast: (msg: string) => void;
  shared: SharedFormState;
  isMobile?: boolean;
}) {
  const { email, setEmail, signupPassword: password, setSignupPassword: setPassword, confirmPassword, setConfirmPassword, signupAgreed: agreed, setSignupAgreed: setAgreed } = shared;
  const { register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [serverError, setServerError] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("Please enter your email address");
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async () => {
    setServerError("");
    if (!agreed) {
      onToast("Please read and agree to the terms before continuing.");
      return;
    }
    const emailValid = validateEmail(email);
    let valid = emailValid;
    if (!password.trim()) {
      setPasswordError("Please enter a password");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (!confirmPassword.trim()) {
      setConfirmError("Please confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      valid = false;
    } else {
      setConfirmError("");
    }
    if (!valid) return;
    try {
      await register(email.trim(), password);
      onSuccess(email.trim());
    } catch (err: any) {
      const msg = err.message || "Registration failed";
      if (msg.toLowerCase().includes("already exists")) {
        onToast("This email is already registered. Please sign in.");
      } else {
        setServerError(msg);
      }
    }
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <Input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) validateEmail(e.target.value);
          setServerError("");
        }}
        onBlur={() => email && validateEmail(email)}
        placeholder="Enter email"
        status={emailError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
      />
      {emailError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">{emailError}</p>
      )}

      <Input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError("");
          setServerError("");
        }}
        placeholder="Enter password"
        status={passwordError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
        suffix={
          <div className="cursor-pointer flex items-center" onClick={() => setShowPassword(!showPassword)}>
            <EyeIcon visible={showPassword} />
          </div>
        }
      />
      {passwordError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">{passwordError}</p>
      )}

      <Input
        type={showConfirmPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (confirmError) setConfirmError("");
          setServerError("");
        }}
        placeholder="Please re-enter password"
        status={confirmError ? "error" : undefined}
        style={{ height: 52, borderRadius: INPUT_RADIUS }}
        suffix={
          <div className="cursor-pointer flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            <EyeIcon visible={showConfirmPassword} />
          </div>
        }
      />
      {confirmError && (
        <p className="text-[#ff4d4f] text-[12px] leading-[18px] -mt-[18px] font-['Inter:Regular',sans-serif]">{confirmError}</p>
      )}

      {serverError && (
        <p className="text-[#ff4d4f] text-[13px] leading-[18px] -mt-[12px] font-['Inter:Regular',sans-serif]">{serverError}</p>
      )}

      <label className="flex items-center gap-[10px] cursor-pointer select-none">
        <div className="relative shrink-0 size-[24px]" onClick={() => setAgreed(!agreed)}>
          <div
            className={`absolute inset-[12.5%] rounded-[4px] border-[1.3px] flex items-center justify-center transition-colors ${
              agreed ? "bg-[#ba0020] border-[#ba0020]" : "bg-transparent border-[rgba(0,0,0,0.3)]"
            }`}
          >
            {agreed && <CheckIcon />}
          </div>
        </div>
        <span className="font-['Inter:Regular',sans-serif] text-[14px] leading-[20px] text-[rgba(0,0,0,0.54)]">
          I have read and agree to the{" "}
          <a href="#" className="font-['Inter:Semi_Bold',sans-serif] font-semibold no-underline" style={{ color: LINK_RED }} onClick={(e) => e.preventDefault()}>Terms of Use</a>
          {" "}and{" "}
          <a href="#" className="font-['Inter:Semi_Bold',sans-serif] font-semibold no-underline" style={{ color: LINK_RED }} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          .
        </span>
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full ${isMobile ? "min-h-[48px] py-[13px]" : "min-h-[56px] py-[16px]"} rounded-[50px] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[22px] flex items-center justify-center gap-[8px] cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-none px-[24px]`}
        style={{ backgroundColor: BRAND_RED }}
        onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#9a001a")}
        onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = BRAND_RED)}
      >
        {loading && <Spinner />}
        Sign up
      </button>
    </div>
  );
}

/* ==================== Registration Success ==================== */

function RegistrationSuccess({ email, isMobile }: { email: string; isMobile?: boolean }) {
  const navigate = useNavigate();
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_m, a, b, c) => a + b.replace(/./g, "*") + c);

  return (
    <div
      className={
        isMobile
          ? "w-full flex flex-col items-center px-[24px] pt-[24px] pb-[32px] rounded-[20px]"
          : "w-[480px] max-w-[calc(100vw-48px)] flex flex-col items-center px-[48px] pt-[32px] pb-[48px] rounded-[24px]"
      }
      style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(11px)", WebkitBackdropFilter: "blur(11px)" }}
    >
      <SuccessIcon />
      <p className={`font-['Inter:Bold',sans-serif] font-bold ${isMobile ? "text-[20px] leading-[28px]" : "text-[24px] leading-[34px]"} text-[rgba(0,0,0,0.9)] tracking-[0.24px] text-center mt-[24px]`}>
        Registration Successful !
      </p>
      <p className="font-['Inter:Regular',sans-serif] text-[14px] leading-[22px] text-[rgba(0,0,0,0.54)] text-center mt-[24px] w-full">
        If you previously placed an order using {maskedEmail}, your order information will be automatically displayed in your account for easy access at any time.
      </p>
      <button
        onClick={() => navigate("/")}
        className={`w-full ${isMobile ? "min-h-[48px] py-[13px]" : "min-h-[56px] py-[16px]"} rounded-[50px] text-white font-['Inter:Semi_Bold',sans-serif] font-semibold text-[16px] leading-[22px] flex items-center justify-center cursor-pointer transition-colors border-none mt-[24px] px-[24px]`}
        style={{ backgroundColor: BRAND_RED }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9a001a")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND_RED)}
      >
        Go to Home
      </button>
    </div>
  );
}

/* ==================== Main Auth Page ==================== */

export default function AuthPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginAgreed, setLoginAgreed] = useState(false);
  const [signupAgreed, setSignupAgreed] = useState(false);

  const shared: SharedFormState = {
    email, setEmail,
    loginPassword, setLoginPassword,
    signupPassword, setSignupPassword,
    confirmPassword, setConfirmPassword,
    loginAgreed, setLoginAgreed,
    signupAgreed, setSignupAgreed,
  };

  const hideToast = useCallback(() => setToastMsg(null), []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isLoggedIn && !registeredEmail) {
      navigate("/account", { replace: true });
    }
  }, [isLoggedIn, navigate, registeredEmail]);

  const formPanel = registeredEmail ? (
    <RegistrationSuccess email={registeredEmail} isMobile={isMobile} />
  ) : showForgotPassword ? (
    <ForgotPasswordForm
      onBack={() => setShowForgotPassword(false)}
      onToast={setToastMsg}
      email={email}
      isMobile={isMobile}
    />
  ) : (
    <div
      className={
        isMobile
          ? "w-full flex flex-col gap-[20px] items-start px-[24px] pt-[24px] pb-[32px] rounded-[20px]"
          : "w-[480px] max-w-[calc(100vw-48px)] flex flex-col gap-[24px] items-start px-[48px] pt-[32px] pb-[48px] rounded-[24px]"
      }
      style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(11px)", WebkitBackdropFilter: "blur(11px)" }}
    >
      <TabBar activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); setToastMsg(null); }} />
      {activeTab === "login" ? (
        <LoginForm
          onSuccess={() => navigate("/account")}
          onToast={setToastMsg}
          onForgotPassword={() => setShowForgotPassword(true)}
          shared={shared}
          isMobile={isMobile}
        />
      ) : (
        <RegisterForm
          onSuccess={(e) => setRegisteredEmail(e)}
          onToast={setToastMsg}
          shared={shared}
          isMobile={isMobile}
        />
      )}
    </div>
  );

  if (isMobile) {
    return (
      <ConfigProvider theme={ANT_THEME}>
        <MobileNav />
        <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/Login.jpg')" }}>
          <div className="h-[48px] w-full shrink-0" />
          <div className="flex items-center justify-center px-[20px] py-[24px]" style={{ minHeight: "calc(100vh - 48px)" }}>
            {toastMsg && <Toast message={toastMsg} onClose={hideToast} />}
            {formPanel}
          </div>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={ANT_THEME}>
      <div className="w-full min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/Login.jpg')" }}>
        <GlobalNav />
        <div className="pt-[104px] flex items-center justify-center" style={{ minHeight: "calc(100vh)" }}>
          {toastMsg && <Toast message={toastMsg} onClose={hideToast} />}
          {formPanel}
        </div>
      </div>
    </ConfigProvider>
  );
}
