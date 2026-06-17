export type BuildSystemLayout = {
  isMobile: boolean;
  viewportScale: number;
  navSpacer: number;
  bgImageW: number;
  bgCenterX: number;
  vpCenterX: number;
  overlayH: number;
  BG_IMAGE_START: number;
  BG_IMAGE_END: number;
  ZOOM_SCALE: number;
  ZOOM_X: number;
  ZOOM_Y: number;
  PHASE3_OFFSET_Y: number;
  PHASE3_SCALE: number;
  PHASE3_X: number;
  PHASE3_Y: number;
  STATION_CX: number;
  STATION_CY: number;
  STATION_DOT: number;
  /** Floor-plan shrink origin in bgImageRef coords (matches PC: 637, 439 @ 1920) */
  BG_IMG_ORIGIN_X: number;
  BG_IMG_ORIGIN_Y: number;
  RINGS: { radius: number }[];
  SUB_DEVICES: {
    id: string;
    left: number;
    top: number;
    size: number;
    width: number;
    height: number;
    spreadX: number;
    spreadY: number;
  }[];
  /** Phase 3 floor-plan shrink completes within this fraction of phase 3 (PC: 0.3) */
  PHASE3_BG_SHRINK_WINDOW: number;
  /** Phase 3 bgImageRef scale ease (PC: power2.inOut) */
  PHASE3_STATION_EASE: string;
  RING_STROKE: number;
  RING_COLOR_RGB: string;
  RING_OPACITIES: number[];
  STATION_VP_CENTER: { x: number; y: number };
  DEVICE_LINE_ENDS: { id: string; x: number; y: number }[];
  PHASE4A_SCALE: number;
  PHASE4A_X: number;
  PHASE4A_Y: number;
  PHASE4A_BG_INIT_SCALE: number;
  PHASE4B_WIN_W: number;
  PHASE4B_CLIP_RADIUS: number;
  PHASE4B_TITLE_LEFT: number;
  PHASE4B_TITLE_BOTTOM: number;
  PHASE4B_TITLE_W: number;
  PHASE4C_DEVICE_RING_MIN: number;
  PHASE4C_DEVICE_RING_MAX: number;
  PHASE4C_VIEWPORT_EXPAND: number;
  PHASE4C_FIGMA_WIN_W: number;
  PHASE4C_FIGMA_WIN_H: number;
  BG_NUMBER: { left: number; top: number; width: number; fontSize: number; lineHeight: number };
  DASHED_LINE_CLIP_RADIUS: number;
  PHONE_W: number;
  PHONE_H: number;
  PHASE5_PHONE_GAP: number;
  PHASE5_UNIFIED_SCROLL: number;
  PHASE4D_VIEWPORT_SHIFT: number;
  PHASE1_SCROLL: number;
  sectionTitleTop: number;
  phaseTitleTop: number;
  getStationScreenPos: (containerW: number) => { x: number; y: number };
  getPhase4bClip: (containerW: number, containerH: number) => {
    clipTop: number;
    clipRight: number;
    clipBottom: number;
    clipLeft: number;
    winW: number;
    winH: number;
  };
};

const RING_COLOR_RGB = "6, 122, 217";
const RING_OPACITIES = [0.2, 0.1, 0.05, 0.03];
const MOBILE_FIGMA_W = 393;
const MOBILE_FIGMA_CONTENT_H = 647;
const MOBILE_BG_IMAGE_DESIGN_W = 617;
const STATION_DOT = 24;
/** Station position in source image (1920px-wide coordinate space) */
const BG_IMG_STATION_X = 637;
const BG_IMG_STATION_Y = 439;
/** Figma mobile phase-1 station dot at 393px viewport width */
const MOBILE_STATION_DOT = 8;

function buildDesktopLayout(): BuildSystemLayout {
  const BG_IMAGE_START = 384;
  const BG_IMAGE_END = -215;
  const ZOOM_SCALE = 5236 / 1920;
  const ZOOM_X = -810;
  const ZOOM_Y = -(689 + BG_IMAGE_START);
  const PHASE3_OFFSET_Y = 80;
  const PHASE3_SCALE = 520 / STATION_DOT;
  const PHASE3_X = 700 - 637 * PHASE3_SCALE;
  const PHASE3_Y = (560 + PHASE3_OFFSET_Y) - BG_IMAGE_START - 439 * PHASE3_SCALE;
  const STATION_CX = 637 + 12;
  const STATION_CY = 439 + 12;

  const fxToLocal = (fx: number) => (fx - PHASE3_X) / PHASE3_SCALE;
  const fyToLocal = (fy: number) => (fy - BG_IMAGE_START - PHASE3_Y) / PHASE3_SCALE;

  const RING_MIN_D = 735;
  const RING_MAX_D = 1060;
  const RING_STEP = (RING_MAX_D - RING_MIN_D) / 3;
  const RINGS = [0, 1, 2, 3].map((i) => {
    const diameter = RING_MIN_D + i * RING_STEP;
    return { radius: diameter / (2 * PHASE3_SCALE) };
  });

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

  const SUB_DEVICES = SUB_DEVICES_FIGMA.map((d) => {
    const left = fxToLocal(d.x);
    const top = fyToLocal(d.y + PHASE3_OFFSET_Y);
    const size = d.s / PHASE3_SCALE;
    const cx = left + size / 2;
    const cy = top + size / 2;
    return {
      id: d.id,
      left,
      top,
      size,
      width: size,
      height: size,
      spreadX: (cx - STATION_CX) * 0.15,
      spreadY: (cy - STATION_CY) * 0.15,
    };
  });

  const STATION_VP_CENTER = { x: 960, y: 820 + PHASE3_OFFSET_Y };
  const DEVICE_CENTERS = SUB_DEVICES_FIGMA.map((d) => ({
    id: d.id,
    x: d.x + d.s / 2,
    y: d.y + d.s / 2 + PHASE3_OFFSET_Y,
  }));
  const DEVICE_LINE_ENDS = DEVICE_CENTERS.map((d) => ({
    id: d.id,
    x: STATION_VP_CENTER.x + (d.x - STATION_VP_CENTER.x) * 1.15,
    y: STATION_VP_CENTER.y + (d.y - STATION_VP_CENTER.y) * 1.15,
  }));

  const PHASE4A_SCALE = 88 / STATION_DOT;
  const PHASE4A_X = 916 - 637 * PHASE4A_SCALE;
  const PHASE4A_Y = 495 - BG_IMAGE_START - 439 * PHASE4A_SCALE;

  return {
    isMobile: false,
    viewportScale: 1,
    navSpacer: 104,
    bgImageW: 1920,
    bgCenterX: 960,
    vpCenterX: 960,
    overlayH: 1080,
    BG_IMAGE_START,
    BG_IMAGE_END,
    ZOOM_SCALE,
    ZOOM_X,
    ZOOM_Y,
    PHASE3_OFFSET_Y,
    PHASE3_SCALE,
    PHASE3_X,
    PHASE3_Y,
    STATION_CX,
    STATION_CY,
    STATION_DOT,
    BG_IMG_ORIGIN_X: BG_IMG_STATION_X,
    BG_IMG_ORIGIN_Y: BG_IMG_STATION_Y,
    RINGS,
    SUB_DEVICES,
    RING_STROKE: 4 / PHASE3_SCALE,
    RING_COLOR_RGB,
    RING_OPACITIES,
    STATION_VP_CENTER,
    DEVICE_LINE_ENDS,
    PHASE4A_SCALE,
    PHASE4A_X,
    PHASE4A_Y,
    PHASE4A_BG_INIT_SCALE: PHASE3_SCALE / PHASE4A_SCALE,
    PHASE4B_WIN_W: 1200,
    PHASE4B_CLIP_RADIUS: 24,
    PHASE4B_TITLE_LEFT: 48,
    PHASE4B_TITLE_BOTTOM: 48,
    PHASE4B_TITLE_W: 496,
    PHASE4C_DEVICE_RING_MIN: 88,
    PHASE4C_DEVICE_RING_MAX: 160,
    PHASE4C_VIEWPORT_EXPAND: 160,
    PHASE4C_FIGMA_WIN_W: 1236,
    PHASE4C_FIGMA_WIN_H: 694,
    BG_NUMBER: {
      left: 413,
      top: 335 + PHASE3_OFFSET_Y,
      width: 1094,
      fontSize: 460,
      lineHeight: 541,
    },
    DASHED_LINE_CLIP_RADIUS: 630,
    PHONE_W: 385,
    PHONE_H: 657,
    PHASE5_PHONE_GAP: 570,
    PHASE5_UNIFIED_SCROLL: 600,
    PHASE4D_VIEWPORT_SHIFT: 48,
    PHASE1_SCROLL: BG_IMAGE_START - BG_IMAGE_END,
    sectionTitleTop: 104 + 900,
    phaseTitleTop: 224,
    PHASE3_BG_SHRINK_WINDOW: 0.3,
    PHASE3_STATION_EASE: "power2.inOut",
    getStationScreenPos: (containerW: number) => ({
      x: containerW / 2 - 960 + PHASE4A_X + STATION_CX * PHASE4A_SCALE,
      y: BG_IMAGE_START + PHASE4A_Y + STATION_CY * PHASE4A_SCALE,
    }),
    getPhase4bClip: (containerW: number, containerH: number) => {
      const winW = Math.min(1200, containerW);
      const winH = Math.min(winW * (9 / 16), containerH);
      const clipLeft = (containerW - winW) / 2;
      const clipTop = (containerH - winH) / 2;
      return {
        clipTop,
        clipRight: clipLeft,
        clipBottom: clipTop,
        clipLeft,
        winW,
        winH,
      };
    },
  };
}

// Figma node 19496:34979 — Phase 3 final layout
const MOBILE_PHASE3_DEVICES = [
  { id: "01", x: 12, y: 316, w: 40, h: 39 },
  { id: "02", x: 323, y: 301, w: 45, h: 45 },
  { id: "03", x: 370, y: 517, w: 46, h: 45 },
  { id: "04", x: 25, y: 562, w: 44, h: 44 },
  { id: "05", x: -31, y: 480, w: 45, h: 45 },
  { id: "06", x: 168, y: 254, w: 56, h: 56 },
  { id: "07", x: 18, y: 391, w: 51, h: 50 },
  { id: "08", x: 295, y: 555, w: 50, h: 51 },
  { id: "09", x: 353, y: 400, w: 51, h: 52 },
];

// Figma node 19496:35041 — Phase 4 spread layout
const MOBILE_PHASE4_DEVICES = [
  { id: "01", x: 3, y: 307, w: 41, h: 41 },
  { id: "02", x: 332, y: 290, w: 47, h: 49 },
  { id: "03", x: 383, y: 520, w: 47, h: 48 },
  { id: "04", x: 16, y: 568, w: 47, h: 47 },
  { id: "05", x: -44, y: 480, w: 48, h: 49 },
  { id: "06", x: 168, y: 241, w: 59, h: 60 },
  { id: "07", x: 8, y: 386, w: 54, h: 54 },
  { id: "08", x: 301, y: 561, w: 55, h: 54 },
  { id: "09", x: 364, y: 396, w: 55, h: 55 },
];

function buildMobileLayout(containerW: number, containerH: number): BuildSystemLayout {
  const s = containerW / MOBILE_FIGMA_W;
  const sy = containerH / MOBILE_FIGMA_CONTENT_H;

  const bgImageW = MOBILE_BG_IMAGE_DESIGN_W * s;
  const bgCenterX = bgImageW / 2;
  const vpCenterX = containerW / 2;
  const overlayH = MOBILE_FIGMA_CONTENT_H * sy;

  const BG_IMAGE_START = 304 * sy;
  const BG_IMAGE_END = 0;

  const ZOOM_SCALE = 1472 / MOBILE_BG_IMAGE_DESIGN_W;
  const ZOOM_X = -188 * s;
  // Figma 19496:34945 — zoomed image top at y=-45 in content frame (after phase 1 scroll to y=0)
  const ZOOM_Y = -BG_IMAGE_START - 45 * sy;

  const PHASE3_OFFSET_Y = 0;
  const stationDot = MOBILE_STATION_DOT * s;
  const STATION_FINAL = 319 * s;
  const PHASE3_SCALE = STATION_FINAL / stationDot;

  // Station center at design (208, 145); 8×8 dot top-left at (204, 141) — bound to bg image
  const STATION_CX = 208 * s;
  const STATION_CY = 145 * s;

  const STATION_VP_CENTER = { x: 196.5 * s, y: 470.5 * sy };

  const bgLeft = containerW / 2 - bgCenterX;
  const PHASE3_X_VAL = STATION_VP_CENTER.x - bgLeft - STATION_CX * PHASE3_SCALE;
  const PHASE3_Y_VAL = STATION_VP_CENTER.y - BG_IMAGE_START - STATION_CY * PHASE3_SCALE;

  const viewportToLocal = (vx: number, vy: number, vw: number, vh: number) => {
    const px = vx * s;
    const py = vy * sy;
    const width = (vw * s) / PHASE3_SCALE;
    const height = (vh * sy) / PHASE3_SCALE;
    const left = (px - bgLeft - PHASE3_X_VAL) / PHASE3_SCALE;
    const top = (py - BG_IMAGE_START - PHASE3_Y_VAL) / PHASE3_SCALE;
    const size = Math.max(width, height);
    return { left, top, width, height, size };
  };

  const MOBILE_RING_DIAMETERS = [328, 378, 426, 474];
  const RINGS = MOBILE_RING_DIAMETERS.map((diameter) => ({
    radius: (diameter * s) / (2 * PHASE3_SCALE),
  }));

  const phase4ById = Object.fromEntries(MOBILE_PHASE4_DEVICES.map((d) => [d.id, d]));

  const SUB_DEVICES = MOBILE_PHASE3_DEVICES.map((d) => {
    const phase3 = viewportToLocal(d.x, d.y, d.w, d.h);
    const phase4 = phase4ById[d.id];
    const phase4Local = viewportToLocal(phase4.x, phase4.y, phase4.w, phase4.h);
    return {
      id: d.id,
      left: phase3.left,
      top: phase3.top,
      size: phase3.size,
      width: phase3.width,
      height: phase3.height,
      spreadX: phase4Local.left - phase3.left,
      spreadY: phase4Local.top - phase3.top,
    };
  });

  const DEVICE_CENTERS = MOBILE_PHASE4_DEVICES.map((d) => ({
    id: d.id,
    x: (d.x + d.w / 2) * s,
    y: (d.y + d.h / 2) * sy,
  }));
  const DEVICE_LINE_ENDS = DEVICE_CENTERS.map((d) => ({
    id: d.id,
    x: STATION_VP_CENTER.x + (d.x - STATION_VP_CENTER.x) * 1.15,
    y: STATION_VP_CENTER.y + (d.y - STATION_VP_CENTER.y) * 1.15,
  }));

  const PHASE4A_SCALE = (56 * s) / stationDot;
  const phase4aStationX = 168 * s;
  const phase4aStationY = 248 * sy;
  const PHASE4A_X = phase4aStationX - bgLeft - STATION_CX * PHASE4A_SCALE;
  const PHASE4A_Y = phase4aStationY - BG_IMAGE_START - STATION_CY * PHASE4A_SCALE;

  return {
    isMobile: true,
    viewportScale: s,
    navSpacer: 48,
    bgImageW,
    bgCenterX,
    vpCenterX,
    overlayH,
    BG_IMAGE_START,
    BG_IMAGE_END,
    ZOOM_SCALE,
    ZOOM_X,
    ZOOM_Y,
    PHASE3_OFFSET_Y,
    PHASE3_SCALE,
    PHASE3_X: PHASE3_X_VAL,
    PHASE3_Y: PHASE3_Y_VAL,
    STATION_CX,
    STATION_CY,
    STATION_DOT: stationDot,
    BG_IMG_ORIGIN_X: (BG_IMG_STATION_X / 1920) * bgImageW,
    BG_IMG_ORIGIN_Y: (BG_IMG_STATION_Y / 1920) * bgImageW,
    RINGS,
    SUB_DEVICES,
    RING_STROKE: 4 / PHASE3_SCALE,
    RING_COLOR_RGB,
    RING_OPACITIES,
    STATION_VP_CENTER,
    DEVICE_LINE_ENDS,
    PHASE4A_SCALE,
    PHASE4A_X,
    PHASE4A_Y,
    PHASE4A_BG_INIT_SCALE: PHASE3_SCALE / PHASE4A_SCALE,
    PHASE4B_WIN_W: 353 * s,
    PHASE4B_CLIP_RADIUS: 16 * s,
    PHASE4B_TITLE_LEFT: 20 * s,
    PHASE4B_TITLE_BOTTOM: 20 * sy,
    PHASE4B_TITLE_W: 313 * s,
    PHASE4C_DEVICE_RING_MIN: 56 * s,
    PHASE4C_DEVICE_RING_MAX: 104 * s,
    PHASE4C_VIEWPORT_EXPAND: 56 * s,
    PHASE4C_FIGMA_WIN_W: 353 * s,
    PHASE4C_FIGMA_WIN_H: 198 * sy,
    BG_NUMBER: {
      left: 62 * s,
      top: 286 * sy,
      width: 269 * s,
      fontSize: 113 * s,
      lineHeight: 133 * sy,
    },
    DASHED_LINE_CLIP_RADIUS: 200 * s,
    PHONE_W: 280 * s,
    PHONE_H: 478 * sy,
    PHASE5_PHONE_GAP: 320 * sy,
    PHASE5_UNIFIED_SCROLL: 480 * sy,
    PHASE4D_VIEWPORT_SHIFT: 32 * sy,
    PHASE1_SCROLL: BG_IMAGE_START - BG_IMAGE_END,
    sectionTitleTop: 408 * sy,
    phaseTitleTop: 72 * sy,
    PHASE3_BG_SHRINK_WINDOW: 0.52,
    PHASE3_STATION_EASE: "power2.in",
    getStationScreenPos: (cw: number) => {
      const left = cw / 2 - bgCenterX;
      return {
        x: left + PHASE4A_X + STATION_CX * PHASE4A_SCALE,
        y: BG_IMAGE_START + PHASE4A_Y + STATION_CY * PHASE4A_SCALE,
      };
    },
    getPhase4bClip: (cw: number, ch: number) => {
      const sc = cw / MOBILE_FIGMA_W;
      const winW = Math.min(353 * sc, cw - 40 * sc);
      const winH = Math.min(winW * (9 / 16), ch - 80 * sy);
      const clipLeft = (cw - winW) / 2;
      const clipTop = (ch - winH) / 2;
      return {
        clipTop,
        clipRight: clipLeft,
        clipBottom: clipTop,
        clipLeft,
        winW,
        winH,
      };
    },
  };
}

export function getBuildSystemLayout(
  isMobile: boolean,
  containerW = isMobile ? MOBILE_FIGMA_W : 1920,
  containerH = isMobile ? MOBILE_FIGMA_CONTENT_H : 1080,
): BuildSystemLayout {
  return isMobile ? buildMobileLayout(containerW, containerH) : buildDesktopLayout();
}

// Shared scroll phase distances — transition logic unchanged
export const SCROLL_SCRUB_LAG = 0.1;
export const PHASE2_SCROLL = 800;
export const PHASE3_SCROLL = 800;
export const PHASE4_SCROLL = 800;
export const PHASE4A_SCROLL = 800;
export const PHASE4B_SCROLL = 800;
export const PHASE4C_SCROLL = 800;
export const PHASE4D_SCROLL = 800;
export const PHASE5_SCROLL = 800;
export const PHASE6_SCROLL = 800;
export const PHASE7_SCROLL = 800;
export const PHASE8_SCROLL = 800;
export const PHASE7_CUSTOM_REVEAL_AT = 0.15;
export const PHASE5_BUNDLE_SLIDE_START = 0.32;
export const PHASE5_BUNDLE_REVEAL_AT = 0.08;
export const PHASE4C_RING_COUNT = 3;
export const PHASE4C_CYCLES = 5;
export const PHASE4C_VIEWPORT_CYCLES = 4;
export const PHASE4C_RING_COLOR = "rgba(232, 78, 98, 1)";
export const PHASE4C_RING_STROKE = 3;
export const PHASE4D_DEVICE_CYCLE_TRIGGER = 1.5;
export const PHASE4D_PHONE_ENTER_RATIO = 0.5;
export const PHASE4D_SCREEN_ANIM_DURATION = 0.45;
export const PHASE5_BG = "#022542";

export const PHONE_SCREEN_X = 54;
export const PHONE_SCREEN_Y = 9;
export const PHONE_SCREEN_W = 227;
export const PHONE_SCREEN_H = 492;
export const PHONE_ALERT_Y = 217;
export const PHONE_ALERT_H = 275;

export function getScrollDistance(phase1Scroll: number, phase8Scroll = PHASE8_SCROLL) {
  return (
    phase1Scroll +
    PHASE2_SCROLL +
    PHASE3_SCROLL +
    PHASE4_SCROLL +
    PHASE4A_SCROLL +
    PHASE4B_SCROLL +
    PHASE4C_SCROLL +
    PHASE4D_SCROLL -
    0.7 * PHASE4C_SCROLL +
    PHASE5_SCROLL +
    PHASE6_SCROLL +
    PHASE7_SCROLL +
    phase8Scroll
  );
}
