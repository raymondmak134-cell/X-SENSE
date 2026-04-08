import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/svg-5ypi4qa4uc";
import menuSvg from "../../imports/svg-dhtqovvq16";
import { useCategories } from "./use-products";

export default function MobileNav() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [submenu, setSubmenu] = useState<"products" | null>(null);
  // "fade-out" = old layer fading out, "fade-in" = new layer fading in, null = idle
  const [submenuPhase, setSubmenuPhase] = useState<"fade-out" | "fade-in" | null>(null);
  const [submenuTarget, setSubmenuTarget] = useState<"products" | null>(null);

  const handleOpen = useCallback(() => {
    setMenuOpen(true);
    setVisible(true);
    setAnimating(true);
    setSubmenu(null);
    setSubmenuPhase(null);
    setSubmenuTarget(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimating(false);
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setMenuOpen(false);
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      setSubmenu(null);
      setSubmenuPhase(null);
      setSubmenuTarget(null);
    }, 300);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const handleNavigate = (path: string) => {
    handleClose();
    setTimeout(() => navigate(path), 310);
  };

  const PHASE_DURATION = 200;

  const handleEnterSubmenu = useCallback(() => {
    setSubmenuTarget("products");
    setSubmenuPhase("fade-out");
    setTimeout(() => {
      setSubmenu("products");
      setSubmenuPhase("fade-in");
      setTimeout(() => {
        setSubmenuPhase(null);
      }, PHASE_DURATION);
    }, PHASE_DURATION);
  }, []);

  const handleExitSubmenu = useCallback(() => {
    setSubmenuTarget(null);
    setSubmenuPhase("fade-out");
    setTimeout(() => {
      setSubmenu(null);
      setSubmenuPhase("fade-in");
      setTimeout(() => {
        setSubmenuPhase(null);
      }, PHASE_DURATION);
    }, PHASE_DURATION);
  }, []);

  const handleCategoryClick = useCallback(
    (catId: string, catSlug: string) => {
      const path =
        catId === "smoke-alarms" ? "/" : `/${catSlug || catId}`;
      handleClose();
      setTimeout(() => navigate(path), 310);
    },
    [handleClose, navigate]
  );

  const inSubmenu = submenu === "products";
  const isFadingOut = submenuPhase === "fade-out";
  const isFadingIn = submenuPhase === "fade-in";

  const showMainMenu = !inSubmenu;
  const showSubMenu = inSubmenu;

  // Main menu: visible when submenu is null
  // fade-out phase when entering submenu (target=products): main fades out
  // fade-in phase when exiting submenu (submenu just became null): main fades in
  const mainMenuOpacity =
    showMainMenu
      ? (isFadingOut && submenuTarget === "products" ? 0 : isFadingIn ? 1 : 1)
      : 0;
  const mainMenuTranslateX =
    showMainMenu
      ? (isFadingOut && submenuTarget === "products" ? "-4px" : "0px")
      : "-4px";

  // Sub menu: visible when submenu is "products"
  // fade-out phase when exiting submenu (target=null): sub fades out
  // fade-in phase when entering submenu (submenu just became products): sub fades in
  const subMenuOpacity =
    showSubMenu
      ? (isFadingOut && submenuTarget === null ? 0 : isFadingIn ? 1 : 1)
      : 0;
  const subMenuTranslateX =
    showSubMenu
      ? (isFadingOut && submenuTarget === null ? "4px" : "0px")
      : "4px";

  const menuItems = [
    { label: "Products", action: "submenu" as const },
    { label: "Support", path: "/support" },
    { label: "Explore", path: "/" },
    { label: "Partnership", path: "/", hasBorder: true },
  ];

  return (
    <>
      {/* Fixed Nav Bar */}
      <div className="fixed bg-white content-stretch flex items-center justify-between left-0 overflow-clip px-[20px] py-[12px] right-0 top-0 z-[201]">
        {/* Left: logo or back arrow */}
        <div className="relative shrink-0" style={{ width: 120, height: 24 }}>
          {/* Logo */}
          <motion.div
            className="content-stretch flex items-center absolute inset-0"
            initial={false}
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
              className="h-[16px] relative shrink-0 w-[120px] cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="absolute inset-[0_0.66%_0_0]">
                <svg
                  className="absolute block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 119.208 16.0001"
                >
                  <path d={svgPaths.p3dc89a80} fill="#101820" />
                  <path d={svgPaths.pbe0d00} fill="#101820" />
                  <path d={svgPaths.p3a591380} fill="#101820" />
                  <path d={svgPaths.pc0264f0} fill="#BA0020" />
                  <path d={svgPaths.p24b34f80} fill="#101820" />
                  <path d={svgPaths.p1064b600} fill="#101820" />
                  <path d={svgPaths.p14e36800} fill="#101820" />
                  <path d={svgPaths.p5d5ef00} fill="#101820" />
                  <path d={svgPaths.p3f49e400} fill="#101820" />
                  <path d={svgPaths.p74fa000} fill="#101820" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Back arrow (visible only in submenu) */}
          <div
            className="absolute left-0 top-0 flex items-center h-full cursor-pointer"
            style={{
              opacity: menuOpen && (inSubmenu || submenuTarget === "products") ? 1 : 0,
              pointerEvents: menuOpen && inSubmenu && !isFadingOut ? "auto" : "none",
              transition: `opacity ${PHASE_DURATION}ms ease-in-out`,
            }}
            onClick={handleExitSubmenu}
          >
            <div className="relative size-[24px]">
              <svg
                className="absolute block size-full"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="black"
                  strokeOpacity="0.9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
          {/* Search icon */}
          <motion.div
            className="overflow-clip relative shrink-0 size-[24px]"
            initial={false}
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="absolute inset-[8.33%]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20 20"
              >
                <path
                  d={svgPaths.p24af9800}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
                <path
                  d={svgPaths.p31519780}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </motion.div>

          {/* Cart icon */}
          <motion.div
            className="overflow-clip relative shrink-0 size-[24px]"
            initial={false}
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="absolute inset-[7.08%_10.67%_8.33%_5%]">
              <svg
                className="absolute block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20.2399 20.2998"
              >
                <path
                  d={svgPaths.p38729380}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
                <path
                  d={svgPaths.p1829b100}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
                <path
                  d={svgPaths.p18281200}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
                <path
                  d={svgPaths.p3f7e2080}
                  fill="var(--fill-0, black)"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
          </motion.div>

          {/* User icon */}
          <motion.div
            className="overflow-clip relative shrink-0 size-[24px] cursor-pointer"
            onDoubleClick={() => navigate("/admin")}
            initial={false}
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="absolute inset-[12.5%_16.67%]">
              <div className="absolute inset-[-4.44%_-5%]">
                <svg
                  className="block size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 17.6 19.6"
                >
                  <path
                    d={svgPaths.p2956c800}
                    stroke="var(--stroke-0, black)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.9"
                    strokeWidth="1.6"
                  />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Hamburger / Close icon */}
          <div
            className="relative shrink-0 size-[24px] cursor-pointer"
            onClick={menuOpen ? handleClose : handleOpen}
          >
            <svg
              className="absolute block size-full"
              fill="none"
              viewBox="0 0 24 24"
            >
              <motion.rect
                x="2.25"
                width="19.5"
                height="2"
                rx="1"
                fill="black"
                fillOpacity="0.9"
                initial={false}
                animate={{
                  y: menuOpen ? 11 : 5,
                  rotate: menuOpen ? 45 : 0,
                }}
                style={{ transformOrigin: "12px 12px" }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.rect
                x="2.25"
                y="11"
                width="19.5"
                height="2"
                rx="1"
                fill="black"
                fillOpacity="0.9"
                initial={false}
                animate={{
                  opacity: menuOpen ? 0 : 1,
                  scaleX: menuOpen ? 0.3 : 1,
                }}
                style={{ transformOrigin: "12px 12px" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              />
              <motion.rect
                x="2.25"
                width="19.5"
                height="2"
                rx="1"
                fill="black"
                fillOpacity="0.9"
                initial={false}
                animate={{
                  y: menuOpen ? 11 : 17,
                  rotate: menuOpen ? -45 : 0,
                }}
                style={{ transformOrigin: "12px 12px" }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Dropdown Menu Overlay */}
      {visible && (
        <div
          className={`fixed inset-0 z-[200] transition-all duration-300 ease-in-out ${
            menuOpen && !animating ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`bg-white flex flex-col size-full transition-transform duration-300 ease-in-out ${
              menuOpen && !animating ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            {/* Nav bar spacer */}
            <div className="shrink-0 h-[48px] w-full" />

            {/* Content area with two layers */}
            <div className="flex-1 overflow-hidden relative">
              {/* Main Menu Layer */}
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{
                  transform: `translateX(${mainMenuTranslateX})`,
                  opacity: mainMenuOpacity,
                  transition: `transform ${PHASE_DURATION}ms ease-in-out, opacity ${PHASE_DURATION}ms ease-in-out`,
                  pointerEvents: showMainMenu && !isFadingOut ? "auto" : "none",
                }}
              >
                <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
                  {menuItems.map((item) => (
                    <div
                      key={item.label}
                      className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
                      onClick={() => {
                        if (item.action === "submenu") {
                          handleEnterSubmenu();
                        } else if (item.path) {
                          handleNavigate(item.path);
                        }
                      }}
                    >
                      {"hasBorder" in item && item.hasBorder && (
                        <div
                          aria-hidden="true"
                          className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none"
                        />
                      )}
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
                          <p className="leading-[22px]">{item.label}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Account */}
                  <div
                    className="content-stretch flex gap-[8px] items-center py-[24px] relative shrink-0 w-full cursor-pointer"
                    onClick={() => handleNavigate("/admin")}
                  >
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[12.5%_16.67%]">
                        <div className="absolute inset-[-4.44%_-5%]">
                          <svg
                            className="block size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 17.6 19.6"
                          >
                            <path
                              d={menuSvg.p2956c800}
                              stroke="var(--stroke-0, black)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeOpacity="0.9"
                              strokeWidth="1.6"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0">
                      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
                        <p className="leading-[22px]">Accouont</p>
                      </div>
                    </div>
                  </div>

                  {/* United States (English) */}
                  <div className="content-stretch flex gap-[8px] items-center py-[24px] relative shrink-0 w-full cursor-pointer">
                    <div className="overflow-clip relative shrink-0 size-[24px]">
                      <div className="absolute inset-[5%]">
                        <svg
                          className="absolute block size-full"
                          fill="none"
                          preserveAspectRatio="none"
                          viewBox="0 0 21.5996 21.5996"
                        >
                          <path
                            d={menuSvg.p3d794f00}
                            fill="var(--fill-0, black)"
                            fillOpacity="0.9"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
                      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
                        <p className="leading-[22px]">United States (English)</p>
                      </div>
                    </div>
                    <div className="relative shrink-0 size-[20px]">
                      <div className="absolute bottom-[12.5%] flex items-center justify-center left-[33.33%] right-1/4 top-[12.5%]">
                        <div className="-scale-y-100 flex-none h-[15px] rotate-180 w-[8.33px]">
                          <div className="relative size-full">
                            <svg
                              className="absolute block size-full"
                              fill="none"
                              preserveAspectRatio="none"
                              viewBox="0 0 10 18"
                            >
                              <path
                                d={menuSvg.p2af95900}
                                fill="var(--fill-0, black)"
                                fillOpacity="0.9"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Submenu Layer */}
              <div
                className="absolute inset-0 overflow-y-auto"
                style={{
                  transform: `translateX(${subMenuTranslateX})`,
                  opacity: subMenuOpacity,
                  transition: `transform ${PHASE_DURATION}ms ease-in-out, opacity ${PHASE_DURATION}ms ease-in-out`,
                  pointerEvents: showSubMenu && !isFadingOut ? "auto" : "none",
                }}
              >
                <div className="content-stretch flex flex-col items-start px-[20px] relative w-full">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="content-stretch flex items-center justify-between py-[24px] relative shrink-0 w-full cursor-pointer"
                      onClick={() => handleCategoryClick(cat.id, cat.slug)}
                    >
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] whitespace-nowrap">
                          <p className="leading-[22px]">{cat.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
