import { useNavigate, useLocation } from "react-router";
import svgPaths from "../../imports/svg-wbn2vrrkrc";

// Safe hooks that won't crash outside Router context (e.g. Figma preview)
function useSafeNavigate() {
  try {
    return useNavigate();
  } catch {
    return (path: string) => { window.location.href = path; };
  }
}

function useSafeLocation() {
  try {
    return useLocation();
  } catch {
    return { pathname: "/" };
  }
}

function Left() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[40px] items-center min-h-px min-w-px opacity-0 relative" data-name="Left">
      <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic relative shrink-0 text-[14px] text-white tracking-[0.14px]">Fast and Free Delivery</p>
    </div>
  );
}

function MidSaleInfo() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-h-px min-w-px relative" data-name="Mid">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic overflow-hidden relative text-[12px] text-[rgba(0,0,0,0.9)] text-center text-ellipsis whitespace-nowrap">{`Back to School Sale | Up to 40% Off | Shop Now >>`}</p>
    </div>
  );
}

function RightLanguage() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-[40px] items-center justify-end min-h-px min-w-px relative" data-name="Right">
      <div className="overflow-clip relative shrink-0 size-[24px]">
        <div className="absolute inset-[5%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5996 21.5996">
            <path d={svgPaths.p3d794f00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)]">United States (English)</p>
    </div>
  );
}

function TopTipBody() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[1312px] relative shrink-0 w-full">
      <Left />
      <MidSaleInfo />
      <RightLanguage />
    </div>
  );
}

function Logo() {
  const navigate = useSafeNavigate();
  return (
    <div className="content-stretch flex flex-col h-full items-start justify-center relative shrink-0 w-[150px] cursor-pointer" data-name="logo" onClick={() => navigate("/")}>
      <div className="h-[20px] relative shrink-0 w-[150px]">
        <div className="absolute contents inset-[0_0.66%_0_0]">
          <div className="absolute inset-[0_0.66%_0_0]">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 149.011 20.0002">
              <g>
                <path d={svgPaths.p31609b00} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p279ad300} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.pfa12100} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p11a37f80} fill="var(--fill-0, #BA0020)" />
                <path d={svgPaths.pda74d00} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p17346f00} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p1f1eec00} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p23550c00} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.pcd76280} fill="var(--fill-0, #101820)" />
                <path d={svgPaths.p683100} fill="var(--fill-0, #101820)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV_TABS = [
  { label: "Smoke Alarms", path: "/" },
  { label: "CO Alarms", path: "/co-alarms" },
  { label: "Combination Alarms", path: "/" },
  { label: "Home Alarms", path: "/" },
  { label: "Support", path: "/support" },
  { label: "Explore", path: "/" },
  { label: "Partnership", path: "/" },
];

function Tab() {
  const navigate = useSafeNavigate();
  const location = useSafeLocation();

  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[12px] h-full items-center min-h-px min-w-px relative" data-name="Tab">
      {NAV_TABS.map((tab) => {
        const isActive = tab.path !== "/" && location.pathname === tab.path;
        return (
          <div
            key={tab.label}
            className="h-full relative shrink-0 cursor-pointer"
            data-name="Web/Tab Bar"
            onClick={() => navigate(tab.path)}
          >
            <div className="flex flex-row items-center justify-center size-full">
              <div className={`content-stretch flex gap-[10px] h-full items-center justify-center px-[12px] py-[10px] relative group`}>
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.9)]">{tab.label}</p>
                <span className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#ba0020] transition-all duration-300 ease-out group-hover:w-full" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IconGroup() {
  const navigate = useSafeNavigate();
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="icon Group">
      <div className="overflow-clip relative shrink-0 size-[24px]">
        <div className="absolute inset-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g>
              <path d={svgPaths.p24af9800} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p31519780} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]">
        <div className="-translate-x-1/2 absolute aspect-[18.594295501708984/18.5591983795166] bottom-[8.33%] left-1/2 top-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p26bff00} fill="var(--fill-0, black)" fillOpacity="0.9" />
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px] cursor-pointer" onDoubleClick={() => navigate("/admin")}>
        <div className="-translate-x-1/2 absolute aspect-[14.665620803833008/16] bottom-[8.33%] left-1/2 top-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20"><g><path></path><path></path></g><g>
              <path d={svgPaths.p2a0cae80} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p1cdecf00} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g></svg>
        </div>
      </div>
    </div>
  );
}

function NavBody() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center max-w-[1312px] min-h-px min-w-px relative w-full">
      <div className="content-stretch flex flex-[1_0_0] gap-[32px] h-full items-center min-h-px min-w-px relative">
        <Logo />
        <Tab />
      </div>
      <div className="content-stretch flex items-center relative shrink-0">
        <IconGroup />
      </div>
    </div>
  );
}

export default function GlobalNav() {
  return (
    <div className="fixed content-stretch flex flex-col items-start left-0 right-0 top-0 z-50" data-name="GlobalNav">
      <div className="bg-[#f6f6f6] relative shrink-0 w-full" data-name="Top Tips">
        <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex flex-col items-center justify-center w-full" style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
            <TopTipBody />
          </div>
        </div>
      </div>
      <div className="bg-white h-[64px] relative shrink-0 w-full" data-name="Nav">
        <div className="flex flex-col items-center justify-center size-full">
          <div className="content-stretch flex flex-col items-center justify-center relative size-full" style={{ padding: "0 clamp(24px, 8vw, 120px)" }}>
            <NavBody />
          </div>
        </div>
      </div>
    </div>
  );
}