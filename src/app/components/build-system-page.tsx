import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobalNav from "./global-nav";
import MobileNav from "./mobile-nav";
import SplitText from "@/components/SplitText";
import BundleSection, { type BundleSectionHandle } from "./bundle-section";
import CustomSystemSection, { type CustomSystemSectionHandle } from "./custom-system-section";
import BuildSystemFaqSection from "./build-system-faq-section";
import Footer from "../../imports/Footer";
import {
  getBuildSystemLayout,
  getScrollDistance,
  DESKTOP_FIGMA_H,
  PHASE2_SCROLL,
  PHASE3_SCROLL,
  PHASE4_SCROLL,
  PHASE4A_SCROLL,
  PHASE4B_SCROLL,
  PHASE4C_SCROLL,
  PHASE4D_SCROLL,
  PHASE5_SCROLL,
  PHASE6_SCROLL,
  PHASE7_SCROLL,
  PHASE7_CUSTOM_REVEAL_AT,
  PHASE5_BUNDLE_SLIDE_START,
  PHASE5_BUNDLE_REVEAL_AT,
  PHASE4C_RING_COUNT,
  PHASE4C_CYCLES,
  PHASE4C_VIEWPORT_CYCLES,
  PHASE4C_RING_COLOR,
  PHASE4C_RING_STROKE,
  PHASE4D_DEVICE_CYCLE_TRIGGER,
  PHASE4D_PHONE_ENTER_RATIO,
  PHASE4D_SCREEN_ANIM_DURATION,
  PHASE5_BG,
  PHONE_SCREEN_X,
  PHONE_SCREEN_Y,
  PHONE_SCREEN_W,
  PHONE_SCREEN_H,
  PHONE_ALERT_Y,
  PHONE_ALERT_H,
  SCROLL_SCRUB_LAG,
} from "./build-system-layout";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

function getIsMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
}

function ringPhase(cycleT: number, index: number, count: number) {
  let t = cycleT - index / count;
  while (t < 0) t += 1;
  while (t >= 1) t -= 1;
  return t;
}

export default function BuildSystemPage() {
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const [viewportSize, setViewportSize] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth : 393,
    h: typeof window !== "undefined" ? window.innerHeight : 695,
  }));
  const layout = getBuildSystemLayout(isMobile, viewportSize.w, viewportSize.h);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const iconRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const sectionTitleRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const subDevicesRef = useRef<HTMLDivElement>(null);
  const phase3TitleRef = useRef<HTMLDivElement>(null);
  const dashedLinesRef = useRef<SVGSVGElement>(null);
  const bgNumberRef = useRef<HTMLDivElement>(null);
  const phase4TitleRef = useRef<HTMLDivElement>(null);
  const phase4aWrapperRef = useRef<HTMLDivElement>(null);
  const phase4aBgRef = useRef<HTMLImageElement>(null);
  const phase4bTitleRef = useRef<HTMLDivElement>(null);
  const devicePulseRingsRef = useRef<HTMLDivElement>(null);
  const viewportPulseRingsRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneMaskRef = useRef<HTMLImageElement>(null);
  const phoneAlertRef = useRef<HTMLImageElement>(null);
  const bottomStackRef = useRef<HTMLDivElement>(null);
  const phase5TitleRef = useRef<HTMLHeadingElement>(null);
  const phase5DescRef = useRef<HTMLParagraphElement>(null);
  const phase5RatingsRef = useRef<HTMLImageElement>(null);
  const bundleSectionRef = useRef<BundleSectionHandle>(null);
  const bundleOverlayRef = useRef<HTMLDivElement>(null);
  const customSystemWrapperRef = useRef<HTMLDivElement>(null);
  const customSystemRef = useRef<CustomSystemSectionHandle>(null);

  useEffect(() => {
    const updateViewport = () => {
      if (pageRef.current) {
        const { width, height } = pageRef.current.getBoundingClientRect();
        setViewportSize({ w: width, h: height });
      }
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, [isMobile]);

  useLayoutEffect(() => {
    const containerW = pageRef.current?.getBoundingClientRect().width ?? viewportSize.w;
    const containerH = pageRef.current?.getBoundingClientRect().height ?? viewportSize.h;
    const L = getBuildSystemLayout(isMobile, containerW, containerH);
    const {
      BG_IMAGE_START,
      BG_IMAGE_END,
      ZOOM_SCALE,
      ZOOM_X,
      ZOOM_Y,
      PHASE3_SCALE,
      PHASE3_X,
      PHASE3_Y,
      STATION_CX,
      STATION_CY,
      STATION_DOT,
      BG_IMG_ORIGIN_X,
      BG_IMG_ORIGIN_Y,
      SUB_DEVICES,
      PHASE4A_SCALE,
      PHASE4A_X,
      PHASE4A_Y,
      PHASE4A_BG_INIT_SCALE,
      PHASE4B_CLIP_RADIUS,
      STATION_VP_CENTER,
      PHASE4C_DEVICE_RING_MIN,
      PHASE4C_DEVICE_RING_MAX,
      PHASE4C_VIEWPORT_EXPAND,
      PHASE4C_FIGMA_WIN_W,
      PHASE4C_FIGMA_WIN_H,
      PHASE5_PHONE_GAP,
      PHASE5_UNIFIED_SCROLL,
      PHASE4D_VIEWPORT_SHIFT,
      PHASE1_SCROLL,
      PHONE_W,
      PHONE_H,
      DASHED_LINE_CLIP_RADIUS,
      PHASE3_BG_SHRINK_WINDOW,
      PHASE3_STATION_EASE,
      viewportScale,
    } = L;

    const designFrameH = isMobile ? 695 : DESKTOP_FIGMA_H;
    const dpx = (v: number) => (isMobile ? v : v * viewportScale);

    const measureCustomContentScroll = () => {
      const wrapper = customSystemWrapperRef.current;
      const containerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;
      if (!wrapper) return 0;
      // Exact distance so footer bottom aligns with viewport bottom at phase 8 end
      return Math.max(0, wrapper.scrollHeight - containerH);
    };

    let phase8ScrollDist = measureCustomContentScroll();
    let SCROLL_DISTANCE = getScrollDistance(PHASE1_SCROLL, phase8ScrollDist);
    const phoneScreenScale = PHONE_W / 385;
    const phoneScreenHScaled = PHONE_SCREEN_H * phoneScreenScale;
    const phoneAlertYScaled = PHONE_ALERT_Y * phoneScreenScale;

    const scrollNormalizer = ScrollTrigger.normalizeScroll({
      allowNestedScroll: true,
      lockAxis: false,
      type: "touch,wheel,pointer",
      momentum: (self) => Math.min(3, Math.abs(self.velocityY) / 700),
    });

    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    entranceTl
      .fromTo(
        iconRef.current,
        { opacity: 0, y: dpx(60) },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: dpx(40) },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.4"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: dpx(30) },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        bgRef.current,
        { opacity: 0, y: dpx(80) },
        { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" },
        "-=0.8"
      );

    ScrollTrigger.getById("build-system-main")?.kill(true);

    const clampScrollToEnd = (st: ScrollTrigger) => {
      if (window.scrollY > st.end + 1) {
        st.scroll(st.end);
      }
    };

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        id: "build-system-main",
        trigger: pageRef.current,
        start: "top top",
        end: () => `+=${SCROLL_DISTANCE}`,
        scrub: SCROLL_SCRUB_LAG,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          clampScrollToEnd(self);
        },
        onLeave: (self) => {
          if (self.direction === 1) {
            self.scroll(self.end);
          }
        },
      },
    });

    // Phase 1: background image slides up, content fades out
    scrollTl.to(
      bgImageRef.current,
      { y: BG_IMAGE_END - BG_IMAGE_START, duration: 1, ease: "none" },
      0
    );

    scrollTl.to(
      contentRef.current,
      { opacity: 0, duration: 0.6, ease: "power1.in" },
      0
    );

    // Phase 1 at 80%: section title fades in
    scrollTl.fromTo(
      sectionTitleRef.current,
      { opacity: 0, y: dpx(20) },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
      0.8
    );

    const p2Ratio = PHASE2_SCROLL / PHASE1_SCROLL;

    // Phase 2: section title drifts up and fades out (parallax)
    scrollTl.to(
      sectionTitleRef.current,
      { opacity: 0, y: dpx(-60), duration: p2Ratio * 0.4, ease: "power1.in" },
      1
    );

    // Phase 2: background image (with station) zooms in to Figma target
    scrollTl.to(
      bgImageRef.current,
      {
        scale: ZOOM_SCALE,
        x: ZOOM_X,
        y: ZOOM_Y,
        duration: p2Ratio,
        ease: "power2.inOut",
      },
      1
    );

    // Phase 3: station continues to zoom, bg image shrinks and fades
    const p3Ratio = PHASE3_SCROLL / PHASE1_SCROLL;
    const phase3Start = 1 + p2Ratio;

    // Phase 3: bgImageRef continues scaling so station reaches final size/position
    scrollTl.to(
      bgImageRef.current,
      {
        scale: PHASE3_SCALE,
        x: PHASE3_X,
        y: PHASE3_Y,
        duration: p3Ratio,
        ease: PHASE3_STATION_EASE,
      },
      phase3Start
    );

    // Phase 3: bg image shrinks (centered on station) and fades
    // Compensate for bgImageRef scale increase so net floor-plan scale never grows (same as PC intent)
    const stationEaseFn = gsap.parseEase(PHASE3_STATION_EASE);
    const bgImgOrigin = `${BG_IMG_ORIGIN_X}px ${BG_IMG_ORIGIN_Y}px`;

    const getPhase3ParentScale = (phase3LocalT: number) => {
      const easedT = stationEaseFn(Math.max(0, Math.min(1, phase3LocalT)));
      return gsap.utils.interpolate(ZOOM_SCALE, PHASE3_SCALE, easedT);
    };

    const applyPhase3BgImg = (phase3LocalT: number) => {
      if (!bgImgRef.current) return;

      if (phase3LocalT <= 0) {
        gsap.set(bgImgRef.current, {
          scale: 1,
          opacity: 1,
          transformOrigin: bgImgOrigin,
        });
        return;
      }

      const parentScale = getPhase3ParentScale(phase3LocalT);
      const shrinkT = Math.min(1, phase3LocalT / PHASE3_BG_SHRINK_WINDOW);
      const targetShrink = gsap.utils.interpolate(1, 0.3, shrinkT);
      const bgImgScale = (ZOOM_SCALE / parentScale) * targetShrink;
      const opacity = shrinkT >= 1 ? 0 : gsap.utils.interpolate(1, 0, shrinkT);

      gsap.set(bgImgRef.current, {
        scale: bgImgScale,
        opacity,
        transformOrigin: bgImgOrigin,
      });
    };

    if (bgImgRef.current) {
      gsap.set(bgImgRef.current, { scale: 1, opacity: 1, transformOrigin: bgImgOrigin });
    }

    const phase3BgProxy = { t: 0 };
    scrollTl.to(
      phase3BgProxy,
      {
        t: 1,
        duration: p3Ratio,
        ease: "none",
        onUpdate: () => applyPhase3BgImg(phase3BgProxy.t),
      },
      phase3Start
    );

    // Phase 3 at 40%: rings appear from inner to outer
    const ringEls = ringsRef.current!.querySelectorAll(".phase3-ring");
    scrollTl.fromTo(
      ringEls,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: p3Ratio * 0.05,
        stagger: p3Ratio * 0.03,
        ease: "power1.out",
      },
      phase3Start + p3Ratio * 0.4
    );

    // Phase 3 at 60%–95%: sub-devices appear one by one
    const deviceEls = subDevicesRef.current!.querySelectorAll(".phase3-device");
    scrollTl.fromTo(
      deviceEls,
      { opacity: 0, scaleX: 0.5, scaleY: 0.5, transformOrigin: "center center" },
      {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        duration: p3Ratio * 0.05,
        stagger: p3Ratio * 0.0375,
        ease: "power2.out",
        transformOrigin: "center center",
      },
      phase3Start + p3Ratio * 0.6
    );

    // Phase 3 at 80%–95%: Phase 3 title appears from below
    scrollTl.fromTo(
      phase3TitleRef.current,
      { opacity: 0, y: dpx(40) },
      { opacity: 1, y: 0, duration: p3Ratio * 0.15, ease: "power2.out" },
      phase3Start + p3Ratio * 0.8
    );

    // ── Phase 4: dashed lines radiate, "1700" counter, new title ──
    const p4Ratio = PHASE4_SCROLL / PHASE1_SCROLL;
    const phase4Start = phase3Start + p3Ratio;

    // Phase 4 0%–15%: rings fade out
    scrollTl.to(
      ringEls,
      { opacity: 0, duration: p4Ratio * 0.15, ease: "power1.in" },
      phase4Start
    );

    // Phase 4 0%–15%: Phase 3 title drifts up and fades out
    scrollTl.to(
      phase3TitleRef.current,
      { opacity: 0, y: dpx(-40), duration: p4Ratio * 0.15, ease: "power1.in" },
      phase4Start
    );

    // Phase 4 15%–80%: dashed lines grow outward from station center via clip-path
    const vpCY = STATION_VP_CENTER.y;
    scrollTl.fromTo(
      dashedLinesRef.current,
      { clipPath: `circle(0px at ${L.vpCenterX}px ${vpCY}px)` },
      {
        clipPath: `circle(${DASHED_LINE_CLIP_RADIUS}px at ${L.vpCenterX}px ${vpCY}px)`,
        duration: p4Ratio * 0.65,
        ease: "none",
      },
      phase4Start + p4Ratio * 0.15
    );

    // Phase 4 ~35%: "1700" background number fades in (after lines grow 30%)
    const lineGrowStart = p4Ratio * 0.15;
    const numberStart = lineGrowStart + p4Ratio * 0.65 * 0.3;
    scrollTl.fromTo(
      bgNumberRef.current,
      { opacity: 0, y: dpx(30) },
      { opacity: 1, y: 0, duration: p4Ratio * 0.1, ease: "power2.out" },
      phase4Start + numberStart
    );

    const counter = { val: 0 };
    scrollTl.to(
      counter,
      {
        val: 1700,
        duration: p4Ratio * 0.35,
        ease: "power1.out",
        onUpdate: () => {
          if (bgNumberRef.current) {
            bgNumberRef.current.textContent = Math.round(counter.val).toString();
          }
        },
      },
      phase4Start + numberStart
    );

    // Phase 4: sub-devices spread to Figma phase-4 positions (bound to station layout)
    const deviceElsArr = Array.from(deviceEls);
    SUB_DEVICES.forEach((d, i) => {
      if (deviceElsArr[i]) {
        scrollTl.to(
          deviceElsArr[i],
          { x: d.spreadX, y: d.spreadY, duration: p4Ratio * 0.45, ease: "power2.out" },
          phase4Start + numberStart
        );
      }
    });

    // Phase 4 at 80%–95%: Phase 4 title appears from below
    scrollTl.fromTo(
      phase4TitleRef.current,
      { opacity: 0, y: dpx(40) },
      { opacity: 1, y: 0, duration: p4Ratio * 0.15, ease: "power2.out" },
      phase4Start + p4Ratio * 0.8
    );

    // ── Phase 4a: station shrinks/moves to target, other content fades, bg appears ──
    const p4aRatio = PHASE4A_SCROLL / PHASE1_SCROLL;
    const phase4aStart = phase4Start + p4Ratio;

    // Phase 4a 0%–100%: bgImageRef scales down from Phase3 to Phase4a target
    scrollTl.to(
      bgImageRef.current,
      {
        scale: PHASE4A_SCALE,
        x: PHASE4A_X,
        y: PHASE4A_Y,
        duration: p4aRatio,
        ease: "power2.inOut",
      },
      phase4aStart
    );

    // Phase 4a 0%–30%: sub-devices fade out in place
    scrollTl.to(
      deviceEls,
      { opacity: 0, duration: p4aRatio * 0.3, ease: "power1.in" },
      phase4aStart
    );

    // Phase 4a 0%–30%: dashed lines fade out in place
    scrollTl.to(
      dashedLinesRef.current,
      { opacity: 0, duration: p4aRatio * 0.3, ease: "power1.in" },
      phase4aStart
    );

    // Phase 4a 0%–30%: "1700" background number fades out in place
    scrollTl.to(
      bgNumberRef.current,
      { opacity: 0, duration: p4aRatio * 0.3, ease: "power1.in" },
      phase4aStart
    );

    // Phase 4a 0%–30%: Phase 4 title moves up and fades out
    scrollTl.to(
      phase4TitleRef.current,
      { opacity: 0, y: dpx(-60), duration: p4aRatio * 0.3, ease: "power1.in" },
      phase4aStart
    );

    // Phase 4a 0%–100%: phase4a bg scales from zoomed-in to 1 (synced with station shrink)
    scrollTl.fromTo(
      phase4aBgRef.current,
      { scale: PHASE4A_BG_INIT_SCALE },
      { scale: 1, duration: p4aRatio, ease: "power2.inOut" },
      phase4aStart
    );

    // Phase 4a at 60%–90%: phase4a background fades in
    scrollTl.to(
      phase4aBgRef.current,
      { opacity: 1, duration: p4aRatio * 0.3, ease: "power2.out" },
      phase4aStart + p4aRatio * 0.6
    );

    // ── Phase 4b: viewport window shrinks, title appears ──
    const p4bRatio = PHASE4B_SCROLL / PHASE1_SCROLL;
    const phase4bStart = phase4aStart + p4aRatio;

    const readPhase4bClip = () => {
      const el = pageRef.current;
      if (!el) {
        return { clipTop: 0, clipRight: 0, clipBottom: 0, clipLeft: 0, winW: 0, winH: 0 };
      }
      const { width, height } = el.getBoundingClientRect();
      return L.getPhase4bClip(width, height);
    };

    const applyPhase4bTitlePosition = () => {
      const clip = readPhase4bClip();
      if (phase4bTitleRef.current) {
        gsap.set(phase4bTitleRef.current, {
          left: clip.clipLeft + L.PHASE4B_TITLE_LEFT,
          bottom: clip.clipBottom + L.PHASE4B_TITLE_BOTTOM,
        });
      }
    };

    const applyPhase4bClip = (t: number) => {
      const clip = readPhase4bClip();
      const top = clip.clipTop * t;
      const right = clip.clipRight * t;
      const bottom = clip.clipBottom * t;
      const left = clip.clipLeft * t;
      const radius = PHASE4B_CLIP_RADIUS * t;
      const path = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
      gsap.set(phase4aWrapperRef.current, { clipPath: path });
      gsap.set(bgRef.current, { clipPath: path });
      gsap.set(devicePulseRingsRef.current, { clipPath: path });
    };

    applyPhase4bTitlePosition();

    const clipProxy = { t: 0 };
    scrollTl.to(
      clipProxy,
      {
        t: 1,
        duration: p4bRatio,
        ease: "power2.inOut",
        onUpdate: () => applyPhase4bClip(clipProxy.t),
      },
      phase4bStart
    );

    // Phase 4b at 80%–95%: title and subtitle appear from below
    scrollTl.fromTo(
      phase4bTitleRef.current,
      { opacity: 0, y: dpx(40) },
      { opacity: 1, y: 0, duration: p4bRatio * 0.15, ease: "power2.out" },
      phase4bStart + p4bRatio * 0.8
    );

    // ── Phase 4c: device pulse rings, then viewport pulse rings ──
    const p4cRatio = PHASE4C_SCROLL / PHASE1_SCROLL;
    const phase4cStart = phase4bStart + p4bRatio;

    const deviceRingEls = devicePulseRingsRef.current
      ? Array.from(devicePulseRingsRef.current.querySelectorAll(".phase4c-device-ring"))
      : [];
    const viewportRingEls = viewportPulseRingsRef.current
      ? Array.from(viewportPulseRingsRef.current.querySelectorAll(".phase4c-viewport-ring"))
      : [];

    const applyPhase4cRings = (p4cProgress: number) => {
      if (p4cProgress <= 0) {
        deviceRingEls.forEach((el) => gsap.set(el, { opacity: 0 }));
        if (viewportPulseRingsRef.current) {
          gsap.set(viewportPulseRingsRef.current, { opacity: 0 });
        }
        return;
      }

      const clip = readPhase4bClip();
      const { winW, winH, clipLeft, clipTop } = clip;
      const scaleW = winW / PHASE4C_FIGMA_WIN_W;
      const scaleH = winH / PHASE4C_FIGMA_WIN_H;
      const expandStepW = PHASE4C_VIEWPORT_EXPAND * scaleW;
      const expandStepH = PHASE4C_VIEWPORT_EXPAND * scaleH;

      const totalT = p4cProgress * PHASE4C_CYCLES;
      const cycleIndex = Math.floor(totalT);
      const cycleT = totalT - cycleIndex;

      const pageW = pageRef.current?.getBoundingClientRect().width ?? containerW;
      const station = L.getStationScreenPos(pageW);

      applyPhase4bClip(1);

      deviceRingEls.forEach((el, i) => {
        const t = ringPhase(cycleT, i, PHASE4C_RING_COUNT);
        const diameter =
          PHASE4C_DEVICE_RING_MIN + t * (PHASE4C_DEVICE_RING_MAX - PHASE4C_DEVICE_RING_MIN);
        const opacity = Math.max(0, (1 - t) * 0.7);
        const radius = diameter / 2;
        gsap.set(el, {
          left: station.x - radius,
          top: station.y - radius,
          width: diameter,
          height: diameter,
          opacity,
          borderWidth: PHASE4C_RING_STROKE * viewportScale,
          borderStyle: "solid",
          boxShadow: `0 0 ${8 + t * 12}px rgba(232, 78, 98, ${opacity * 0.4})`,
        });
      });

      const viewportActive = cycleIndex >= 1 && cycleIndex < 1 + PHASE4C_VIEWPORT_CYCLES;
      if (viewportPulseRingsRef.current) {
        gsap.set(viewportPulseRingsRef.current, {
          opacity: viewportActive ? 1 : 0,
          left: clipLeft,
          top: clipTop,
          width: winW,
          height: winH,
        });
      }

      viewportRingEls.forEach((el, i) => {
        if (!viewportActive) {
          gsap.set(el, { opacity: 0 });
          return;
        }
        const t = ringPhase(cycleT, i, PHASE4C_RING_COUNT);
        const expandW = expandStepW * t;
        const expandH = expandStepH * t;
        const opacity = Math.max(0, (1 - t) * 0.5);
        gsap.set(el, {
          left: -expandW / 2,
          top: -expandH / 2,
          width: winW + expandW,
          height: winH + expandH,
          opacity,
          borderWidth: PHASE4C_RING_STROKE * viewportScale,
          borderStyle: "solid",
          borderRadius: PHASE4B_CLIP_RADIUS + (expandW + expandH) / 4,
          boxShadow: `0 0 ${12 + t * 16}px rgba(232, 78, 98, ${opacity * 0.3})`,
        });
      });
    };

    const phase4cProxy = { p: 0 };
    scrollTl.to(
      phase4cProxy,
      {
        p: 1,
        duration: p4cRatio,
        ease: "none",
        onUpdate: () => applyPhase4cRings(phase4cProxy.p),
      },
      phase4cStart
    );

    // ── Phase 4d: phone mockup rises from bottom at 1.5 device ring cycles ──
    const p4dRatio = PHASE4D_SCROLL / PHASE1_SCROLL;
    const phase4dStart =
      phase4cStart + (PHASE4D_DEVICE_CYCLE_TRIGGER / PHASE4C_CYCLES) * p4cRatio;

    const viewportParallaxEls = [
      phase4aWrapperRef,
      viewportPulseRingsRef,
      devicePulseRingsRef,
      bgRef,
    ];

    const applyViewportParallax = (viewportY: number) => {
      viewportParallaxEls.forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { y: viewportY });
      });
    };

    let phoneScreenAnimTl: gsap.core.Timeline | null = null;
    let phoneScreenAnimTriggered = false;

    const resetPhoneScreenAnim = () => {
      phoneScreenAnimTl?.kill();
      phoneScreenAnimTl = null;
      phoneScreenAnimTriggered = false;
      if (phoneMaskRef.current) gsap.set(phoneMaskRef.current, { opacity: 0 });
      if (phoneAlertRef.current) {
        gsap.set(phoneAlertRef.current, { opacity: 0, top: phoneScreenHScaled });
      }
    };

    const playPhoneScreenAnim = () => {
      if (phoneScreenAnimTriggered) return;
      phoneScreenAnimTriggered = true;

      phoneScreenAnimTl = gsap.timeline();
      if (phoneMaskRef.current) {
        phoneScreenAnimTl.to(
          phoneMaskRef.current,
          { opacity: 1, duration: PHASE4D_SCREEN_ANIM_DURATION, ease: "power2.out" },
          0
        );
      }
      if (phoneAlertRef.current) {
        phoneScreenAnimTl.fromTo(
          phoneAlertRef.current,
          { opacity: 0, top: phoneScreenHScaled },
          {
            opacity: 1,
            top: phoneAlertYScaled,
            duration: PHASE4D_SCREEN_ANIM_DURATION,
            ease: "power2.out",
          },
          0
        );
      }
    };

    const applyPhoneMockup = (p4dProgress: number) => {
      if (!phoneRef.current) return;

      const containerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;
      const phoneScale = Math.min(1, (containerH * 0.65) / PHONE_H);

      if (p4dProgress <= 0) {
        resetPhoneScreenAnim();
        gsap.set(phoneRef.current, { opacity: 0, y: dpx(80), scale: phoneScale });
        applyViewportParallax(0);
        return;
      }

      const enterT = Math.min(1, p4dProgress / PHASE4D_PHONE_ENTER_RATIO);
      const viewportY = -enterT * PHASE4D_VIEWPORT_SHIFT;
      applyViewportParallax(viewportY);

      let phoneOpacity = 0;
      let phoneY = 80;
      if (p4dProgress < PHASE4D_PHONE_ENTER_RATIO) {
        resetPhoneScreenAnim();
        phoneOpacity = enterT;
        phoneY = (1 - enterT) * 80;
      } else {
        phoneOpacity = 1;
        phoneY = 0;
        playPhoneScreenAnim();
      }

      gsap.set(phoneRef.current, {
        opacity: phoneOpacity,
        y: phoneY,
        scale: phoneScale,
        xPercent: -50,
      });
    };

    const phase4dProxy = { p: 0 };
    scrollTl.to(
      phase4dProxy,
      {
        p: 1,
        duration: p4dRatio,
        ease: "none",
        onUpdate: () => applyPhoneMockup(phase4dProxy.p),
      },
      phase4dStart
    );

    // ── Phase 5: panel slides up, then unified scroll + content reveal ──
    const p5Ratio = PHASE5_SCROLL / PHASE1_SCROLL;
    const phase5Start = phase4dStart + p4dRatio;

    const getPhoneMetrics = (containerH: number) => {
      const phoneScale = Math.min(1, (containerH * 0.65) / PHONE_H);
      const phoneHeight = PHONE_H * phoneScale;
      const phoneTop = containerH - phoneHeight;
      return { phoneScale, phoneHeight, phoneTop };
    };

    const resetPhase5Content = () => {
      [phase5TitleRef, phase5DescRef, phase5RatingsRef].forEach((ref) => {
        if (ref.current) gsap.set(ref.current, { opacity: 0, y: dpx(32) });
      });
    };

    const applyPhase5ContentFade = (progress: number) => {
      const items = [
        { ref: phase5TitleRef, start: 0, end: 0.25 },
        { ref: phase5DescRef, start: 0, end: 0.25 },
        { ref: phase5RatingsRef, start: 0.15, end: 0.4 },
      ];
      items.forEach(({ ref, start, end }) => {
        if (!ref.current) return;
        const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        gsap.set(ref.current, { opacity: t, y: (1 - t) * 32 });
      });
    };

    const getBundleMetrics = () => {
      const stack = bottomStackRef.current;
      if (!stack || stack.children.length < 2) {
        return { ratingsH: 300, bundleH: 600 };
      }
      const ratingsH = (stack.children[0] as HTMLElement).offsetHeight;
      const bundleH = (stack.children[1] as HTMLElement).offsetHeight;
      return { ratingsH, bundleH };
    };

    let bundleRevealed = false;

    const applyPhase5 = (p5Progress: number) => {
      const containerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;
      const { phoneScale, phoneTop } = getPhoneMetrics(containerH);
      const handoffSlide = Math.max(0, containerH - phoneTop - PHASE5_PHONE_GAP);
      const unifiedScroll = PHASE5_UNIFIED_SCROLL * (containerH / designFrameH);
      const totalSlide = handoffSlide + unifiedScroll;
      const slide = p5Progress * totalSlide;
      const baseViewportY = -PHASE4D_VIEWPORT_SHIFT;

      if (!bottomStackRef.current) return;

      if (p5Progress <= 0) {
        gsap.set(bottomStackRef.current, { y: containerH, visibility: "hidden" });
        resetPhase5Content();
        bundleRevealed = false;
        bundleSectionRef.current?.resetAnimations();
        return;
      }

      gsap.set(bottomStackRef.current, { visibility: "visible" });

      if (slide <= handoffSlide) {
        applyViewportParallax(baseViewportY - slide);
        gsap.set(bottomStackRef.current, { y: containerH - slide });
        resetPhase5Content();
        bundleRevealed = false;
        bundleSectionRef.current?.resetAnimations();
        if (phoneRef.current) {
          gsap.set(phoneRef.current, {
            y: 0,
            scale: phoneScale,
            opacity: 1,
            xPercent: -50,
          });
        }
      } else {
        const extraSlide = slide - handoffSlide;
        const unifiedP = extraSlide / unifiedScroll;
        const { bundleH } = getBundleMetrics();
        const earlyBundleP = Math.max(
          0,
          (unifiedP - PHASE5_BUNDLE_SLIDE_START) / (1 - PHASE5_BUNDLE_SLIDE_START)
        );
        const earlyBundleSlide = earlyBundleP * bundleH * 0.45;

        applyViewportParallax(baseViewportY - slide - earlyBundleSlide);
        gsap.set(bottomStackRef.current, { y: containerH - slide - earlyBundleSlide });
        if (phoneRef.current) {
          gsap.set(phoneRef.current, {
            y: -extraSlide - earlyBundleSlide,
            scale: phoneScale,
            opacity: 1,
            xPercent: -50,
          });
        }
        applyPhase5ContentFade(unifiedP);

        if (earlyBundleP >= PHASE5_BUNDLE_REVEAL_AT && !bundleRevealed) {
          bundleRevealed = true;
          bundleSectionRef.current?.playReveal();
        }
      }
    };

    const phase5Proxy = { p: 0 };
    scrollTl.to(
      phase5Proxy,
      {
        p: 1,
        duration: p5Ratio,
        ease: "none",
        onUpdate: () => applyPhase5(phase5Proxy.p),
      },
      phase5Start
    );

    const initContainerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;
    if (bottomStackRef.current) {
      gsap.set(bottomStackRef.current, { y: initContainerH, visibility: "hidden" });
    }
    resetPhase5Content();

    // ── Phase 6: bundle section slides up, trigger-based header + card reveals ──
    const p6Ratio = PHASE6_SCROLL / PHASE1_SCROLL;
    const phase6Start = phase5Start + p5Ratio;

    const getPhase5EndSlide = (containerH: number) => {
      const { phoneTop } = getPhoneMetrics(containerH);
      const handoffSlide = Math.max(0, containerH - phoneTop - PHASE5_PHONE_GAP);
      const unifiedScroll = PHASE5_UNIFIED_SCROLL * (containerH / designFrameH);
      return { handoffSlide, unifiedScroll, totalSlide: handoffSlide + unifiedScroll };
    };

    const applyPhase6 = (p6Progress: number) => {
      const containerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;
      const { phoneScale } = getPhoneMetrics(containerH);
      const { handoffSlide, totalSlide } = getPhase5EndSlide(containerH);
      const { bundleH } = getBundleMetrics();
      const phase5EarlyBundleSlide = bundleH * 0.45;
      const slideDistance = bundleH * 0.55;

      if (!bottomStackRef.current) return;

      const bundleSlide = p6Progress * slideDistance;
      const phoneExtraSlide = totalSlide - handoffSlide;
      const totalEarlySlide = phase5EarlyBundleSlide + bundleSlide;
      const totalStackY = containerH - totalSlide - totalEarlySlide;

      if (p6Progress <= 0) {
        const unifiedP = 1;
        const earlyBundleP = Math.max(
          0,
          (unifiedP - PHASE5_BUNDLE_SLIDE_START) / (1 - PHASE5_BUNDLE_SLIDE_START)
        );
        const earlyBundleSlide = earlyBundleP * bundleH * 0.45;
        gsap.set(bottomStackRef.current, {
          visibility: "visible",
          y: containerH - totalSlide - earlyBundleSlide,
        });
        applyViewportParallax(-PHASE4D_VIEWPORT_SHIFT - totalSlide - earlyBundleSlide);
        if (phoneRef.current) {
          gsap.set(phoneRef.current, {
            y: -phoneExtraSlide - earlyBundleSlide,
            scale: phoneScale,
            opacity: 1,
            xPercent: -50,
          });
        }
        return;
      }

      gsap.set(bottomStackRef.current, { visibility: "visible", y: totalStackY });
      applyViewportParallax(-PHASE4D_VIEWPORT_SHIFT - totalSlide - totalEarlySlide);
      applyPhase4bClip(1);

      if (phoneRef.current) {
        gsap.set(phoneRef.current, {
          y: -phoneExtraSlide - totalEarlySlide,
          scale: phoneScale,
          opacity: 1,
          xPercent: -50,
        });
      }

      if (!bundleRevealed) {
        bundleRevealed = true;
        bundleSectionRef.current?.playReveal();
      }
    };

    const phase6Proxy = { p: 0 };
    scrollTl.to(
      phase6Proxy,
      {
        p: 1,
        duration: p6Ratio,
        ease: "none",
        onUpdate: () => applyPhase6(phase6Proxy.p),
      },
      phase6Start
    );

    // ── Phase 7: custom system section slides up over bundle + ratings ──
    // Start Phase 7 at 40% through Phase 6 so the custom section appears earlier
    const p7Ratio = PHASE7_SCROLL / PHASE1_SCROLL;
    const phase7Start = phase6Start + p6Ratio * 0.4;

    const applyPhase7 = (p7Progress: number) => {
      const containerH = pageRef.current?.getBoundingClientRect().height ?? designFrameH;

      if (!customSystemWrapperRef.current) return;

      if (p7Progress <= 0) {
        gsap.set(customSystemWrapperRef.current, { y: containerH, visibility: "hidden" });
        customSystemRef.current?.resetAnimations();
        if (bundleOverlayRef.current) {
          gsap.set(bundleOverlayRef.current, { opacity: 0 });
        }
        return;
      }

      gsap.set(customSystemWrapperRef.current, { visibility: "visible" });
      const slideY = containerH * (1 - p7Progress);
      gsap.set(customSystemWrapperRef.current, { y: slideY });

      if (bundleOverlayRef.current) {
        gsap.set(bundleOverlayRef.current, { opacity: p7Progress * 0.8 });
      }

      const bannerFadeP = Math.max(
        0,
        Math.min(1, (p7Progress - PHASE7_CUSTOM_REVEAL_AT) / 0.25)
      );
      customSystemRef.current?.applyBannerFade(bannerFadeP);
    };

    const phase7Proxy = { p: 0 };
    scrollTl.to(
      phase7Proxy,
      {
        p: 1,
        duration: p7Ratio,
        ease: "none",
        onUpdate: () => applyPhase7(phase7Proxy.p),
      },
      phase7Start
    );

    if (customSystemWrapperRef.current) {
      gsap.set(customSystemWrapperRef.current, { y: initContainerH, visibility: "hidden" });
    }
    if (bundleOverlayRef.current) {
      gsap.set(bundleOverlayRef.current, { opacity: 0 });
    }

    // ── Phase 8: continue scrolling through custom system section content ──
    const p8Ratio = phase8ScrollDist / PHASE1_SCROLL;
    const phase8Start = phase7Start + p7Ratio;

    const applyPhase8 = (p8Progress: number) => {
      if (!customSystemWrapperRef.current) return;

      const p = Math.min(1, Math.max(0, p8Progress));
      gsap.set(customSystemWrapperRef.current, { visibility: "visible" });
      gsap.set(customSystemWrapperRef.current, { y: -p * phase8ScrollDist });
    };

    const phase8Proxy = { p: 0 };
    scrollTl.to(
      phase8Proxy,
      {
        p: 1,
        duration: p8Ratio,
        ease: "none",
        onUpdate: () => applyPhase8(phase8Proxy.p),
      },
      phase8Start
    );

    const blockScrollPastEnd = (e: Event) => {
      const st = scrollTl.scrollTrigger;
      if (!st || window.scrollY < st.end - 2) return;
      if (e instanceof WheelEvent && e.deltaY > 0) {
        e.preventDefault();
        return;
      }
      if (e instanceof TouchEvent && e.type === "touchmove" && e.touches.length > 0) {
        const deltaY = e.touches[0].clientY - touchStartY;
        if (deltaY < 0) {
          e.preventDefault();
        }
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onWindowScroll = () => {
      const st = scrollTl.scrollTrigger;
      if (st) clampScrollToEnd(st);
    };

    const syncPhase8ScrollDistance = () => {
      const next = measureCustomContentScroll();
      if (Math.abs(next - phase8ScrollDist) < 1) return;
      phase8ScrollDist = next;
      SCROLL_DISTANCE = getScrollDistance(PHASE1_SCROLL, phase8ScrollDist);
      ScrollTrigger.refresh();
      const st = scrollTl.scrollTrigger;
      if (st) clampScrollToEnd(st);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(syncPhase8ScrollDistance);
    });

    window.addEventListener("scroll", onWindowScroll, { passive: false });
    window.addEventListener("wheel", blockScrollPastEnd, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", blockScrollPastEnd, { passive: false });
    document.documentElement.style.overscrollBehaviorY = "none";

    const handleResize = () => {
      applyPhase4bTitlePosition();
      const total = scrollTl.duration();
      const progress = scrollTl.progress();
      const elapsed = progress * total;
      if (elapsed >= phase4bStart) {
        const phase4bProgress = Math.min(1, (elapsed - phase4bStart) / p4bRatio);
        applyPhase4bClip(phase4bProgress);
      } else if (elapsed >= phase3Start) {
        const phase3Progress = Math.min(1, (elapsed - phase3Start) / p3Ratio);
        applyPhase3BgImg(phase3Progress);
      }
      if (elapsed >= phase4cStart) {
        const phase4cProgress = Math.min(1, (elapsed - phase4cStart) / p4cRatio);
        applyPhase4cRings(phase4cProgress);
      }
      if (elapsed >= phase8Start) {
        const phase8Progress = Math.min(1, (elapsed - phase8Start) / p8Ratio);
        applyPhase8(phase8Progress);
      } else if (elapsed >= phase7Start) {
        const phase7Progress = Math.min(1, (elapsed - phase7Start) / p7Ratio);
        applyPhase7(phase7Progress);
      } else if (elapsed >= phase6Start) {
        const phase6Progress = Math.min(1, (elapsed - phase6Start) / p6Ratio);
        applyPhase6(phase6Progress);
      } else if (elapsed >= phase5Start) {
        const phase5Progress = Math.min(1, (elapsed - phase5Start) / p5Ratio);
        applyPhase5(phase5Progress);
      } else if (elapsed >= phase4dStart) {
        const phase4dProgress = Math.min(1, (elapsed - phase4dStart) / p4dRatio);
        applyPhoneMockup(phase4dProgress);
      }
      ScrollTrigger.refresh();
      syncPhase8ScrollDistance();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      document.documentElement.style.overscrollBehaviorY = "";
      window.removeEventListener("scroll", onWindowScroll);
      window.removeEventListener("wheel", blockScrollPastEnd);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", blockScrollPastEnd);
      window.removeEventListener("resize", handleResize);
      scrollNormalizer?.kill();
      phoneScreenAnimTl?.kill();
      bundleSectionRef.current?.resetAnimations();
      customSystemRef.current?.resetAnimations();
      entranceTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill(true));
    };
  }, [isMobile, viewportSize.w, viewportSize.h]);

  const overlayFrameStyle = {
    left: layout.isMobile ? 0 : `calc(50% - ${layout.vpCenterX}px)`,
    top: 0,
    width: layout.isMobile ? "100%" : `${layout.bgImageW}px`,
    height: `${layout.overlayH}px`,
  };

  const phoneScale = layout.PHONE_W / 385;
  const phoneScreenX = PHONE_SCREEN_X * phoneScale;
  const phoneScreenY = PHONE_SCREEN_Y * phoneScale;
  const phoneScreenW = PHONE_SCREEN_W * phoneScale;
  const phoneScreenH = PHONE_SCREEN_H * phoneScale;
  const phoneAlertY = PHONE_ALERT_Y * phoneScale;
  const phoneAlertH = PHONE_ALERT_H * phoneScale;

  return (
    <div className="bg-white w-full relative overscroll-y-none">
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="hidden md:block">
        <GlobalNav />
      </div>

      <div
        key={isMobile ? "build-system-mobile" : "build-system-desktop"}
        ref={pageRef}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Main content - z-[1], behind background image */}
        <div
          ref={contentRef}
          className="absolute inset-0 w-full h-full flex flex-col items-center z-[1]"
        >
          <div className="shrink-0" style={{ height: layout.navSpacer }} />

          <div
            className="flex flex-col items-center w-full px-5 md:px-0 max-w-[1440px]"
            style={{ paddingTop: layout.isMobile ? 64 : 180 * layout.viewportScale }}
          >
            <div
              ref={iconRef}
              className="shrink-0 opacity-0"
              style={{
                width: layout.isMobile ? 80 : 80 * layout.viewportScale,
                height: layout.isMobile ? 80 : 80 * layout.viewportScale,
              }}
            >
              <img
                src="/images/build_system _main.svg"
                alt="Build system icon"
                className="w-full h-full"
              />
            </div>

            <div className="mt-[12px]">
              <SplitText
                key={isMobile ? "hero-title-mobile" : "hero-title-desktop"}
                text={isMobile ? "Build My System" : "Build Your System"}
                className="font-['Inter:Bold',sans-serif] font-bold not-italic text-[rgba(0,0,0,0.9)] text-center text-[28px] leading-[44px] md:text-[60px] md:leading-[72px]"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
            </div>

            <p
              ref={subtitleRef}
              className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] md:text-[16px] text-center text-[rgba(0,0,0,0.6)] mt-[12px] opacity-0"
            >
              Create your own custom home safety system in minutes.
            </p>

            <button
              ref={buttonRef}
              className="mt-[24px] w-[180px] h-[56px] rounded-full border-[2px] border-[rgba(0,0,0,0.9)] bg-transparent flex items-center justify-center cursor-pointer opacity-0"
            >
              <span className="font-['Inter',sans-serif] font-medium text-[16px] leading-[20px] text-[rgba(0,0,0,0.9)]">
                Try to Build
              </span>
            </button>
          </div>
        </div>

        <div
          ref={sectionTitleRef}
          className="absolute left-0 right-0 flex justify-center z-[1] opacity-0 px-5 md:px-0"
          style={{ top: `${layout.sectionTitleTop}px` }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center text-black">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] leading-[44px] md:text-[56px] md:leading-[72px] w-full">
              Why Choose Our Base Station System?
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] md:text-[16px] w-full">
              It All Starts with a Base Station - All Devices, One App, Total Control.
            </p>
          </div>
        </div>

        <div
          ref={phase3TitleRef}
          className="absolute left-0 right-0 flex justify-center z-[3] opacity-0 px-5 md:px-0"
          style={{ top: `${layout.phaseTitleTop}px` }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center text-black">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] leading-[44px] md:text-[56px] md:leading-[72px] w-full">
              Supports Up to <span className="text-[#ba0020]">50</span> Devices
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] md:text-[16px] w-full">
              Effortlessly manage multiple devices with one powerful Base Staiton.
            </p>
          </div>
        </div>

        <div
          className="absolute flex justify-center z-[1] pointer-events-none"
          style={overlayFrameStyle}
        >
          <div
            ref={bgNumberRef}
            className="absolute font-['Inter:Bold',sans-serif] font-bold text-center opacity-0 bg-clip-text"
            style={{
              left: `${layout.BG_NUMBER.left}px`,
              top: `${layout.BG_NUMBER.top}px`,
              width: `${layout.BG_NUMBER.width}px`,
              fontSize: `${layout.BG_NUMBER.fontSize}px`,
              lineHeight: `${layout.BG_NUMBER.lineHeight}px`,
              background: "linear-gradient(to bottom, #F0F0F0, #FFFFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            0
          </div>
        </div>

        <svg
          ref={dashedLinesRef}
          className="absolute z-[1] pointer-events-none"
          style={{
            ...overlayFrameStyle,
            clipPath: `circle(0px at ${layout.STATION_VP_CENTER.x}px ${layout.STATION_VP_CENTER.y}px)`,
          }}
        >
          {layout.DEVICE_LINE_ENDS.map((d) => (
            <line
              key={d.id}
              x1={layout.STATION_VP_CENTER.x}
              y1={layout.STATION_VP_CENTER.y}
              x2={d.x}
              y2={d.y}
              stroke={`rgba(${layout.RING_COLOR_RGB}, 0.5)`}
              strokeWidth={layout.viewportScale}
              strokeDasharray="8 6"
              fill="none"
            />
          ))}
        </svg>

        <div
          ref={phase4TitleRef}
          className="absolute left-0 right-0 flex justify-center z-[3] opacity-0 px-5 md:px-0"
          style={{ top: `${layout.phaseTitleTop}px` }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[28px] leading-[44px] md:text-[56px] md:leading-[72px] w-full text-[rgba(0,0,0,0.9)]">
              <span className="text-[#ba0020]">1700</span> ft Wide Signal Coverage
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] md:text-[16px] w-full text-black">
              Reliable connectivity reaches every corner of your home
            </p>
          </div>
        </div>

        {/* Phase 4c viewport pulse rings — outside clip, expands from viewport border */}
        <div
          ref={viewportPulseRingsRef}
          className="absolute pointer-events-none z-[1] opacity-0"
        >
          {Array.from({ length: PHASE4C_RING_COUNT }).map((_, i) => (
            <div
              key={i}
              className="phase4c-viewport-ring absolute border-solid opacity-0"
              style={{ borderColor: PHASE4C_RING_COLOR, borderWidth: PHASE4C_RING_STROKE }}
            />
          ))}
        </div>

        {/* Phase 4a/4b wrapper — clip-path animates on this container */}
        <div
          ref={phase4aWrapperRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          style={{ clipPath: "inset(0px 0px 0px 0px round 0px)" }}
        >
          <img
            ref={phase4aBgRef}
            src="/images/phase4a_bg.jpg"
            alt="Phase 4a background"
            className="absolute inset-0 w-full h-full object-cover opacity-0"
            style={{ transformOrigin: "50% 50%" }}
          />
          {/* Phase 4b title — bottom-left of clip window, 48px margin (position set in scroll effect) */}
          <div
            ref={phase4bTitleRef}
            className="absolute flex flex-col gap-[12px] opacity-0"
            style={{ width: `${layout.PHASE4B_TITLE_W}px` }}
          >
            <h2 className="font-['Inter',sans-serif] font-bold text-[24px] leading-[32px] md:text-[48px] md:leading-[56px] text-white">
              For Full-Home Protection
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[14px] leading-[22px] md:text-[16px] text-[rgba(255,255,255,0.8)]">
              Smoke, CO, combination, and heat detectors work together - when one sounds, all respond.
            </p>
          </div>
        </div>

        {/* Phase 4c device pulse rings — above bg image, below station */}
        <div
          ref={devicePulseRingsRef}
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ clipPath: "inset(0px round 0px)" }}
        >
          {Array.from({ length: PHASE4C_RING_COUNT }).map((_, i) => (
            <div
              key={i}
              className="phase4c-device-ring absolute rounded-full"
              style={{
                borderStyle: "solid",
                borderColor: PHASE4C_RING_COLOR,
                borderWidth: PHASE4C_RING_STROKE * layout.viewportScale,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Background image layer - z-[4], station on top of pulse rings */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-0 overflow-visible z-[4]"
        >
          <div
            ref={bgImageRef}
            className="absolute"
            style={{
              width: `${layout.bgImageW}px`,
              minWidth: `${layout.bgImageW}px`,
              left: `calc(50% - ${layout.bgCenterX}px)`,
              top: `${layout.BG_IMAGE_START}px`,
              transformOrigin: "0 0",
            }}
          >
            <img
              ref={bgImgRef}
              src="/images/build_system_main_image.png"
              alt="Home safety system overview"
              className="w-full h-auto"
            />
            {/* Phase 3 rings — SVG circles centered on station, inner to outer */}
            <div ref={ringsRef} className="absolute inset-0">
              {layout.RINGS.map((ring, i) => (
                <svg
                  key={i}
                  className="phase3-ring absolute opacity-0"
                  style={{
                    left: `${layout.STATION_CX - ring.radius}px`,
                    top: `${layout.STATION_CY - ring.radius}px`,
                    width: `${ring.radius * 2}px`,
                    height: `${ring.radius * 2}px`,
                    overflow: "visible",
                  }}
                >
                  <circle
                    cx={ring.radius}
                    cy={ring.radius}
                    r={ring.radius - layout.RING_STROKE / 2}
                    fill="none"
                    stroke={`rgba(${layout.RING_COLOR_RGB}, ${layout.RING_OPACITIES[i]})`}
                    strokeWidth={layout.RING_STROKE}
                  />
                </svg>
              ))}
            </div>

            <div ref={subDevicesRef} className="absolute inset-0">
              {layout.SUB_DEVICES.map((d) => (
                <img
                  key={d.id}
                  className="phase3-device absolute opacity-0"
                  src={`/images/build_system_support_${d.id}.png`}
                  alt={`Support device ${d.id}`}
                  style={{
                    left: `${d.left}px`,
                    top: `${d.top}px`,
                    width: `${d.width}px`,
                    height: `${d.height}px`,
                    objectFit: "contain",
                    transformOrigin: "center center",
                  }}
                />
              ))}
            </div>

            {/* Station device — always on top */}
            <img
              src="/images/build_system_main_image_station.png"
              alt="Station device"
              className="absolute z-[1]"
              style={{
                left: `${layout.STATION_CX - layout.STATION_DOT / 2}px`,
                top: `${layout.STATION_CY - layout.STATION_DOT / 2}px`,
                width: `${layout.STATION_DOT}px`,
                height: `${layout.STATION_DOT}px`,
              }}
            />
          </div>
        </div>

        {/* Phase 5 + Bundle stack — ratings (gray) flush above bundle (white) */}
        <div
          ref={bottomStackRef}
          className="absolute left-0 right-0 top-0 z-[6] invisible"
        >
          <div
            className="w-full pt-[24px] pb-[48px] md:pt-[32px] md:pb-[64px]"
            style={{ backgroundColor: PHASE5_BG }}
          >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-5 md:px-6 lg:px-0">
              <h2
                ref={phase5TitleRef}
                className="w-full text-center font-['Inter',sans-serif] text-[24px] font-bold leading-[32px] md:text-[36px] md:leading-[44px] text-white opacity-0"
              >
                Real-Time Alerts, One-App Control
              </h2>
              <p
                ref={phase5DescRef}
                className="mt-[10px] w-full text-center font-['Inter',sans-serif] text-[14px] font-light leading-[22px] md:text-[16px] text-[rgba(255,255,255,0.6)] opacity-0"
              >
                Get notified and take control anytime, anywhere.
              </p>
              <img
                ref={phase5RatingsRef}
                src="/images/app_ratings.svg"
                alt="4.8 App Store Reviews"
                className="mt-[24px] md:mt-[32px] h-[80px] w-[149px] md:h-[114px] md:w-[212px] opacity-0"
              />
            </div>
          </div>
          <div className="relative">
            <BundleSection ref={bundleSectionRef} />
            <div
              ref={bundleOverlayRef}
              className="pointer-events-none absolute inset-0 z-[1] bg-[#000000] opacity-0"
              aria-hidden
            />
          </div>
        </div>

        {/* Phase 7: Custom System Section — slides up over bundle + ratings */}
        <div
          ref={customSystemWrapperRef}
          className="absolute left-0 right-0 top-0 z-[7] invisible"
          style={{ minHeight: "100vh" }}
        >
          <CustomSystemSection ref={customSystemRef} />
          <BuildSystemFaqSection />
          <Footer />
        </div>

        {/* Phase 4d phone mockup — fixed at bottom center */}
        <div
          ref={phoneRef}
          className="absolute left-1/2 bottom-0 z-[5] pointer-events-none opacity-0"
          style={{
            width: `${layout.PHONE_W}px`,
            height: `${layout.PHONE_H}px`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${phoneScreenX}px`,
              top: `${phoneScreenY}px`,
              width: `${phoneScreenW}px`,
              height: `${phoneScreenH}px`,
            }}
          >
            <img
              src="/images/phone_homepage.png"
              alt="Phone homepage"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img
              ref={phoneMaskRef}
              src="/images/phone_mask.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0"
            />
            <img
              ref={phoneAlertRef}
              src="/images/phone_alert_panel.png"
              alt="Smoke alarm alert"
              className="absolute left-0 w-full object-cover opacity-0"
              style={{
                height: `${phoneAlertH}px`,
                top: `${phoneScreenH}px`,
              }}
            />
          </div>
          <img
            src="/images/phone_mockup_bg.png"
            alt="Phone mockup"
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
