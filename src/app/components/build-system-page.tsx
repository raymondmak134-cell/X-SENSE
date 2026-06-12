import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GlobalNav from "./global-nav";
import SplitText from "@/components/SplitText";
import BundleSection, { type BundleSectionHandle } from "./bundle-section";

gsap.registerPlugin(ScrollTrigger);

const BG_IMAGE_START = 384;
const BG_IMAGE_END = -215;

// Phase 2 zoom target values derived from Figma (node 18941:33356)
// Figma bg image: 5236×4570 at (-810, -689) in a 1920×1080 frame
const ZOOM_SCALE = 5236 / 1920;
const ZOOM_X = -810;
const ZOOM_Y = -(689 + BG_IMAGE_START);

// Phase 3 zoom target values derived from Figma (node 18945:33316)
// Station device: 520×520 at (700, 560+80) with 80px vertical offset
const PHASE3_OFFSET_Y = 80;
const PHASE3_SCALE = 520 / 24;
const PHASE3_X = 700 - 637 * PHASE3_SCALE;
const PHASE3_Y = (560 + PHASE3_OFFSET_Y) - BG_IMAGE_START - 439 * PHASE3_SCALE;

// Station center in bgImageRef local coordinates
const STATION_CX = 637 + 12;
const STATION_CY = 439 + 12;

// Convert Figma viewport coords → bgImageRef local coords
const fxToLocal = (fx: number) => (fx - PHASE3_X) / PHASE3_SCALE;
const fyToLocal = (fy: number) => (fy - BG_IMAGE_START - PHASE3_Y) / PHASE3_SCALE;

// Ring diameters from Figma (node 19114:61705), evenly spaced, all centered on station
const RING_MIN_D = 735;
const RING_MAX_D = 1060;
const RING_STEP = (RING_MAX_D - RING_MIN_D) / 3;
const RINGS = [0, 1, 2, 3].map((i) => {
  const diameter = RING_MIN_D + i * RING_STEP;
  const radius = diameter / (2 * PHASE3_SCALE);
  return { radius };
});

// Sub-device positions from Figma (node 19114:61705)
const SUB_DEVICES_FIGMA = [
  { id: "01", x: 550, y: 473, s: 87 },
  { id: "02", x: 1244, y: 440, s: 100.12 },
  { id: "03", x: 1350, y: 923, s: 100.12 },
  { id: "04", x: 577, y: 1023, s: 100.12 },
  { id: "05", x: 452, y: 841, s: 100.12 },
  { id: "06", x: 897, y: 335, s: 126 },
  { id: "07", x: 563, y: 640, s: 114 },
  { id: "08", x: 1180, y: 1009, s: 114 },
  { id: "09", x: 1311, y: 663, s: 114 },
];
const SUB_DEVICES = SUB_DEVICES_FIGMA.map((d) => ({
  id: d.id,
  left: fxToLocal(d.x),
  top: fyToLocal(d.y + PHASE3_OFFSET_Y),
  size: d.s / PHASE3_SCALE,
}));

// Ring stroke: 4px at final viewport scale, opacity from inner to outer
const RING_STROKE = 4 / PHASE3_SCALE;
const RING_OPACITIES = [0.2, 0.1, 0.05, 0.03];

// Sub-device / station viewport centers (with Phase 3 vertical offset)
const STATION_VP_CENTER = { x: 960, y: 820 + PHASE3_OFFSET_Y };
const DEVICE_CENTERS = SUB_DEVICES_FIGMA.map((d) => ({
  id: d.id,
  x: d.x + d.s / 2,
  y: d.y + d.s / 2 + PHASE3_OFFSET_Y,
}));

// Dashed line endpoints: expanded 15% outward from station center
const DEVICE_LINE_ENDS = DEVICE_CENTERS.map((d) => ({
  id: d.id,
  x: STATION_VP_CENTER.x + (d.x - STATION_VP_CENTER.x) * 1.15,
  y: STATION_VP_CENTER.y + (d.y - STATION_VP_CENTER.y) * 1.15,
}));

// Phase 4a target values derived from Figma (node 19227:33508)
// Station: 72×72 at (924, 503) in 1920×1080 viewport
const PHASE4A_SCALE = 88 / 24;
const PHASE4A_X = 916 - 637 * PHASE4A_SCALE;
const PHASE4A_Y = 495 - BG_IMAGE_START - 439 * PHASE4A_SCALE;

// Phase 4a bg initial scale — synced with station shrinking to create binding effect
const PHASE4A_BG_INIT_SCALE = PHASE3_SCALE / PHASE4A_SCALE;

// Phase 4b clip-path target: 16:9 ratio, max width 1200px (computed from actual viewport)
const PHASE4B_WIN_W = 1200;
const PHASE4B_CLIP_RADIUS = 24;

function getPhase4bClip(containerW: number, containerH: number) {
  const winW = Math.min(PHASE4B_WIN_W, containerW);
  const winH = Math.min(winW * (9 / 16), containerH);
  const clipLeft = (containerW - winW) / 2;
  const clipRight = clipLeft;
  const clipTop = (containerH - winH) / 2;
  const clipBottom = clipTop;
  return { clipTop, clipRight, clipBottom, clipLeft, winW, winH };
}

// Phase 4c pulse rings from Figma (node 19238:104357)
const PHASE4C_RING_COUNT = 3;
const PHASE4C_CYCLES = 5; // 1 device-only + 4 viewport cycles
const PHASE4C_VIEWPORT_CYCLES = 4;
const PHASE4C_RING_COLOR = "rgba(232, 78, 98, 1)";
const PHASE4C_RING_STROKE = 3;
const PHASE4C_DEVICE_RING_MIN = 88;
const PHASE4C_DEVICE_RING_MAX = 160;
const PHASE4C_VIEWPORT_EXPAND = 160; // px per ring step (both sides total) in Figma 1236×694 frame
const PHASE4C_FIGMA_WIN_W = 1236;
const PHASE4C_FIGMA_WIN_H = 694;

function getStationScreenPos(containerW: number) {
  return {
    x: containerW / 2 - 960 + PHASE4A_X + STATION_CX * PHASE4A_SCALE,
    y: BG_IMAGE_START + PHASE4A_Y + STATION_CY * PHASE4A_SCALE,
  };
}

function ringPhase(cycleT: number, index: number, count: number) {
  let t = cycleT - index / count;
  while (t < 0) t += 1;
  while (t >= 1) t -= 1;
  return t;
}

// Phase 4d phone mockup from Figma (node 19286:40993)
const PHONE_W = 385;
const PHONE_H = 657;
const PHONE_SCREEN_X = 54;
const PHONE_SCREEN_Y = 9;
const PHONE_SCREEN_W = 227;
const PHONE_SCREEN_H = 492;
const PHONE_ALERT_Y = 217;
const PHONE_ALERT_H = 275;
const PHASE4D_DEVICE_CYCLE_TRIGGER = 1.5;
const PHASE4D_PHONE_ENTER_RATIO = 0.5;
const PHASE4D_VIEWPORT_SHIFT = 48; // px upward parallax while phone enters
const PHASE4D_SCREEN_ANIM_DURATION = 0.45; // 450ms trigger animation for mask + alert

// Phase 5 content panel from Figma (node 19306:40666)
const PHASE5_BG = "#F5F5F5";
const PHASE5_PHONE_GAP = 570;
const PHASE5_UNIFIED_SCROLL = 600;

const PHASE1_SCROLL = BG_IMAGE_START - BG_IMAGE_END;
const PHASE2_SCROLL = 800;
const PHASE3_SCROLL = 800;
const PHASE4_SCROLL = 800;
const PHASE4A_SCROLL = 800;
const PHASE4B_SCROLL = 800;
const PHASE4C_SCROLL = 800;
const PHASE4D_SCROLL = 800;
const PHASE5_SCROLL = 800;
const PHASE6_SCROLL = 800;
const PHASE5_BUNDLE_SLIDE_START = 0.55;
// Phase 4d starts at 1.5 device cycles (30% into phase 4c), overlapping the tail of phase 4c
const SCROLL_DISTANCE =
  PHASE1_SCROLL +
  PHASE2_SCROLL +
  PHASE3_SCROLL +
  PHASE4_SCROLL +
  PHASE4A_SCROLL +
  PHASE4B_SCROLL +
  PHASE4C_SCROLL +
  PHASE4D_SCROLL -
  0.7 * PHASE4C_SCROLL +
  PHASE5_SCROLL +
  PHASE6_SCROLL;

export default function BuildSystemPage() {
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

  useEffect(() => {
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    entranceTl
      .fromTo(
        iconRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.4"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        bgRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" },
        "-=0.8"
      );

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: pageRef.current,
        start: "top top",
        end: `+=${SCROLL_DISTANCE}`,
        scrub: true,
        pin: true,
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
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
      0.8
    );

    const p2Ratio = PHASE2_SCROLL / PHASE1_SCROLL;

    // Phase 2: section title drifts up and fades out (parallax)
    scrollTl.to(
      sectionTitleRef.current,
      { opacity: 0, y: -60, duration: p2Ratio * 0.4, ease: "power1.in" },
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
        ease: "power2.inOut",
      },
      phase3Start
    );

    // Phase 3: bg image shrinks (centered on station) and fades, completes at 30%
    scrollTl.to(
      bgImgRef.current,
      {
        scale: 0.3,
        opacity: 0,
        transformOrigin: "637px 439px",
        duration: p3Ratio * 0.3,
        ease: "power1.in",
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
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: p3Ratio * 0.05,
        stagger: p3Ratio * 0.0375,
        ease: "power2.out",
      },
      phase3Start + p3Ratio * 0.6
    );

    // Phase 3 at 80%–95%: Phase 3 title appears from below
    scrollTl.fromTo(
      phase3TitleRef.current,
      { opacity: 0, y: 40 },
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
      { opacity: 0, y: -40, duration: p4Ratio * 0.15, ease: "power1.in" },
      phase4Start
    );

    // Phase 4 15%–80%: dashed lines grow outward from station center via clip-path
    const vpCY = STATION_VP_CENTER.y;
    scrollTl.fromTo(
      dashedLinesRef.current,
      { clipPath: `circle(0px at 960px ${vpCY}px)` },
      {
        clipPath: `circle(630px at 960px ${vpCY}px)`,
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
      { opacity: 0, y: 30 },
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

    // Phase 4: sub-devices spread outward 15% along radial direction
    const deviceElsArr = Array.from(deviceEls);
    SUB_DEVICES.forEach((d, i) => {
      const cx = d.left + d.size / 2;
      const cy = d.top + d.size / 2;
      const dx = (cx - STATION_CX) * 0.15;
      const dy = (cy - STATION_CY) * 0.15;
      if (deviceElsArr[i]) {
        scrollTl.to(
          deviceElsArr[i],
          { x: dx, y: dy, duration: p4Ratio * 0.45, ease: "power2.out" },
          phase4Start + numberStart
        );
      }
    });

    // Phase 4 at 80%–95%: Phase 4 title appears from below
    scrollTl.fromTo(
      phase4TitleRef.current,
      { opacity: 0, y: 40 },
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
      { opacity: 0, y: -60, duration: p4aRatio * 0.3, ease: "power1.in" },
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
      if (!el) return { clipTop: 0, clipRight: 0, clipBottom: 0, clipLeft: 0 };
      const { width, height } = el.getBoundingClientRect();
      return getPhase4bClip(width, height);
    };

    const applyPhase4bTitlePosition = () => {
      const clip = readPhase4bClip();
      if (phase4bTitleRef.current) {
        gsap.set(phase4bTitleRef.current, {
          left: clip.clipLeft + 48,
          bottom: clip.clipBottom + 48,
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
      { opacity: 0, y: 40 },
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

      const pageW = pageRef.current?.getBoundingClientRect().width ?? 1920;
      const station = getStationScreenPos(pageW);

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
          borderWidth: PHASE4C_RING_STROKE,
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
          borderWidth: PHASE4C_RING_STROKE,
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
        gsap.set(phoneAlertRef.current, { opacity: 0, top: PHONE_SCREEN_H });
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
          { opacity: 0, top: PHONE_SCREEN_H },
          {
            opacity: 1,
            top: PHONE_ALERT_Y,
            duration: PHASE4D_SCREEN_ANIM_DURATION,
            ease: "power2.out",
          },
          0
        );
      }
    };

    const applyPhoneMockup = (p4dProgress: number) => {
      if (!phoneRef.current) return;

      const containerH = pageRef.current?.getBoundingClientRect().height ?? 1080;
      const phoneScale = Math.min(1, (containerH * 0.65) / PHONE_H);

      if (p4dProgress <= 0) {
        resetPhoneScreenAnim();
        gsap.set(phoneRef.current, { opacity: 0, y: 80, scale: phoneScale });
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
        if (ref.current) gsap.set(ref.current, { opacity: 0, y: 32 });
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

    const applyPhase5 = (p5Progress: number) => {
      const containerH = pageRef.current?.getBoundingClientRect().height ?? 1080;
      const { phoneScale, phoneTop } = getPhoneMetrics(containerH);
      const handoffSlide = Math.max(0, containerH - phoneTop - PHASE5_PHONE_GAP);
      const unifiedScroll = PHASE5_UNIFIED_SCROLL * (containerH / 1080);
      const totalSlide = handoffSlide + unifiedScroll;
      const slide = p5Progress * totalSlide;
      const baseViewportY = -PHASE4D_VIEWPORT_SHIFT;

      if (!bottomStackRef.current) return;

      if (p5Progress <= 0) {
        gsap.set(bottomStackRef.current, { y: containerH, visibility: "hidden" });
        resetPhase5Content();
        bundleSectionRef.current?.resetAnimations();
        return;
      }

      gsap.set(bottomStackRef.current, { visibility: "visible" });

      if (slide <= handoffSlide) {
        applyViewportParallax(baseViewportY - slide);
        gsap.set(bottomStackRef.current, { y: containerH - slide });
        resetPhase5Content();
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
        bundleSectionRef.current?.setRevealProgress(earlyBundleP * 0.55);
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

    const initContainerH = pageRef.current?.getBoundingClientRect().height ?? 1080;
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
      const unifiedScroll = PHASE5_UNIFIED_SCROLL * (containerH / 1080);
      return { handoffSlide, unifiedScroll, totalSlide: handoffSlide + unifiedScroll };
    };

    const applyPhase6 = (p6Progress: number) => {
      const containerH = pageRef.current?.getBoundingClientRect().height ?? 1080;
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
        bundleSectionRef.current?.setRevealProgress(earlyBundleP * 0.55);
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

      bundleSectionRef.current?.setRevealProgress(0.55 + p6Progress * 0.45);
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

    const handleResize = () => {
      applyPhase4bTitlePosition();
      const total = scrollTl.duration();
      const progress = scrollTl.progress();
      const elapsed = progress * total;
      if (elapsed >= phase4bStart) {
        const phase4bProgress = Math.min(1, (elapsed - phase4bStart) / p4bRatio);
        applyPhase4bClip(phase4bProgress);
      }
      if (elapsed >= phase4cStart) {
        const phase4cProgress = Math.min(1, (elapsed - phase4cStart) / p4cRatio);
        applyPhase4cRings(phase4cProgress);
      }
      if (elapsed >= phase6Start) {
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
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      phoneScreenAnimTl?.kill();
      bundleSectionRef.current?.resetAnimations();
      entranceTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="bg-white w-full relative">
      <GlobalNav />

      <div ref={pageRef} className="relative w-full h-screen overflow-hidden">
        {/* Main content - z-[1], behind background image */}
        <div
          ref={contentRef}
          className="absolute inset-0 w-full h-full flex flex-col items-center z-[1]"
        >
          {/* Spacer for nav (Top Tips 40px + Nav 64px) */}
          <div className="shrink-0 h-[104px]" />

          {/* Content body */}
          <div className="flex flex-col items-center w-full max-w-[1440px] pt-[180px]">
            {/* Icon */}
            <div ref={iconRef} className="shrink-0 w-[80px] h-[80px] opacity-0">
              <img
                src="/images/build_system _main.svg"
                alt="Build system icon"
                className="w-full h-full"
              />
            </div>

            {/* Title with SplitText animation */}
            <div className="mt-[12px]">
              <SplitText
                text="Build Your System"
                className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] not-italic text-[60px] text-[rgba(0,0,0,0.9)] text-center"
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

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              className="font-['Inter',sans-serif] font-normal text-[16px] leading-[22px] text-center text-[rgba(0,0,0,0.6)] mt-[12px] opacity-0"
            >
              Create your own custom home safety system in minutes.
            </p>

            {/* CTA Button */}
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

        {/* Section title - z-[1], fixed position below nav+900px, covered by bg image */}
        <div
          ref={sectionTitleRef}
          className="absolute left-0 right-0 flex justify-center z-[1] opacity-0"
          style={{ top: `${104 + 900}px` }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center text-black">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[56px] leading-[72px] w-full">
              Why Choose Our Base Station System?
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[22px] w-full">
              It All Starts with a Base Station - All Devices,One App, Total Control.
            </p>
          </div>
        </div>

        {/* Phase 3 title — fixed viewport position, appears at 80% of Phase 3 */}
        <div
          ref={phase3TitleRef}
          className="absolute left-0 right-0 flex justify-center z-[3] opacity-0"
          style={{ top: "224px" }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center text-black">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[56px] leading-[72px] w-full">
              Supports Up to 50 Devices
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[22px] w-full">
              Effortlessly manage multiple devices with one powerful Base Staiton.
            </p>
          </div>
        </div>

        {/* Phase 4: "1700" background number — behind device */}
        <div
          className="absolute flex justify-center z-[1] pointer-events-none"
          style={{ left: "calc(50% - 960px)", top: 0, width: "1920px", height: "1080px" }}
        >
          <div
            ref={bgNumberRef}
            className="absolute font-['Inter:Bold',sans-serif] font-bold text-center opacity-0 bg-clip-text"
            style={{
              left: "413px",
              top: `${335 + PHASE3_OFFSET_Y}px`,
              width: "1094px",
              fontSize: "460px",
              lineHeight: "541px",
              background: "linear-gradient(to bottom, #F0F0F0, #FFFFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            0
          </div>
        </div>

        {/* Phase 4: dashed lines from station center to sub-devices */}
        <svg
          ref={dashedLinesRef}
          className="absolute z-[1] pointer-events-none"
          style={{
            left: "calc(50% - 960px)",
            top: 0,
            width: "1920px",
            height: "1080px",
            clipPath: `circle(0px at ${STATION_VP_CENTER.x}px ${STATION_VP_CENTER.y}px)`,
          }}
        >
          {DEVICE_LINE_ENDS.map((d) => (
            <line
              key={d.id}
              x1={STATION_VP_CENTER.x}
              y1={STATION_VP_CENTER.y}
              x2={d.x}
              y2={d.y}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={1}
              strokeDasharray="8 6"
              fill="none"
            />
          ))}
        </svg>

        {/* Phase 4 title */}
        <div
          ref={phase4TitleRef}
          className="absolute left-0 right-0 flex justify-center z-[3] opacity-0"
          style={{ top: "224px" }}
        >
          <div className="w-full max-w-[1440px] flex flex-col items-center gap-[12px] text-center">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-[56px] leading-[72px] w-full text-[rgba(0,0,0,0.9)]">
              <span className="text-[#ba0020]">1700</span> ft Wide Signal Coverage
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[22px] w-full text-black">
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
            style={{ width: "496px" }}
          >
            <h2 className="font-['Inter',sans-serif] font-bold text-[48px] leading-[56px] text-white">
              For Full-Home<br />Protection
            </h2>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[22px] text-[rgba(255,255,255,0.8)]">
              Smoke, CO, combination, and heat detectors work together -<br />when one sounds, all respond.
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
                borderWidth: PHASE4C_RING_STROKE,
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
            className="absolute w-[1920px] min-w-[1920px]"
            style={{ left: 'calc(50% - 960px)', top: `${BG_IMAGE_START}px`, transformOrigin: '0 0' }}
          >
            <img
              ref={bgImgRef}
              src="/images/build_system_main_image.png"
              alt="Home safety system overview"
              className="w-full h-auto"
            />
            {/* Phase 3 rings — SVG circles centered on station, inner to outer */}
            <div ref={ringsRef} className="absolute inset-0">
              {RINGS.map((ring, i) => (
                <svg
                  key={i}
                  className="phase3-ring absolute opacity-0"
                  style={{
                    left: `${STATION_CX - ring.radius}px`,
                    top: `${STATION_CY - ring.radius}px`,
                    width: `${ring.radius * 2}px`,
                    height: `${ring.radius * 2}px`,
                    overflow: "visible",
                  }}
                >
                  <circle
                    cx={ring.radius}
                    cy={ring.radius}
                    r={ring.radius - RING_STROKE / 2}
                    fill="none"
                    stroke={`rgba(232, 78, 98, ${RING_OPACITIES[i]})`}
                    strokeWidth={RING_STROKE}
                  />
                </svg>
              ))}
            </div>

            {/* Phase 3 sub-devices */}
            <div ref={subDevicesRef} className="absolute inset-0">
              {SUB_DEVICES.map((d) => (
                <img
                  key={d.id}
                  className="phase3-device absolute opacity-0"
                  src={`/images/build_system_support_${d.id}.png`}
                  alt={`Support device ${d.id}`}
                  style={{
                    left: `${d.left}px`,
                    top: `${d.top}px`,
                    width: `${d.size}px`,
                    height: `${d.size}px`,
                    objectFit: "contain",
                  }}
                />
              ))}
            </div>

            {/* Station device — always on top */}
            <img
              src="/images/build_system_main_image_station.png"
              alt="Station device"
              className="absolute w-[24px] h-[24px] z-[1]"
              style={{ left: '637px', top: '439px' }}
            />
          </div>
        </div>

        {/* Phase 5 + Bundle stack — ratings (gray) flush above bundle (white) */}
        <div
          ref={bottomStackRef}
          className="absolute left-0 right-0 top-0 z-[6] invisible"
        >
          <div
            className="w-full pt-[32px] pb-[64px]"
            style={{ backgroundColor: PHASE5_BG }}
          >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 lg:px-0">
              <h2
                ref={phase5TitleRef}
                className="w-full text-center font-['Inter',sans-serif] text-[36px] font-bold leading-[44px] text-[rgba(0,0,0,0.9)] opacity-0"
              >
                Real-Time Alerts, One-App Control
              </h2>
              <p
                ref={phase5DescRef}
                className="mt-[10px] w-full text-center font-['Inter',sans-serif] text-[16px] font-normal leading-[22px] text-[rgba(0,0,0,0.6)] opacity-0"
              >
                Get notified and take control anytime, anywhere.
              </p>
              <img
                ref={phase5RatingsRef}
                src="/images/app_ratings.svg"
                alt="4.8 App Store Reviews"
                className="mt-[32px] h-[114px] w-[212px] opacity-0"
              />
            </div>
          </div>
          <BundleSection ref={bundleSectionRef} />
        </div>

        {/* Phase 4d phone mockup — fixed at bottom center */}
        <div
          ref={phoneRef}
          className="absolute left-1/2 bottom-0 z-[5] pointer-events-none opacity-0"
          style={{ width: `${PHONE_W}px`, height: `${PHONE_H}px`, transformOrigin: "bottom center" }}
        >
          {/* Screen popup container */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${PHONE_SCREEN_X}px`,
              top: `${PHONE_SCREEN_Y}px`,
              width: `${PHONE_SCREEN_W}px`,
              height: `${PHONE_SCREEN_H}px`,
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
                height: `${PHONE_ALERT_H}px`,
                top: `${PHONE_SCREEN_H}px`,
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
