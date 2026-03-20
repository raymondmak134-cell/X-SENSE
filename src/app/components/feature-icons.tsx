/**
 * Shared Product Feature Icons — maps each predefined feature string to
 * a 20×20 colored circle with a white SVG icon inside, exactly matching Figma.
 */
import svgPaths from "../../imports/svg-ow31en9uwy";
import voiceAlarmSvg from "../../imports/svg-awqhbhth5d";
import magneticMountSvg from "../../imports/svg-dmx20k5wmr";
import tenYearBatterySvg from "../../imports/svg-3lfrymixoc";
import replaceableBatterySvg from "../../imports/svg-queadpsrtj";

/* ---- All 6 predefined feature labels ---- */
export const ALL_FEATURES = [
  "Voice Alarm with Location",
  "Easy Magnetic Mount",
  "10-Year Battery (NEVER-CHANGE)",
  "Replaceable Battery (Included)",
  "HARDWIRED+9V Battery Backup",
  "Plug-In",
] as const;

export const MULTI_SELECT_FEATURES = ["Voice Alarm with Location", "Easy Magnetic Mount"];
export const POWER_FEATURES = [
  "10-Year Battery (NEVER-CHANGE)",
  "Replaceable Battery (Included)",
  "HARDWIRED+9V Battery Backup",
  "Plug-In",
];

/* ---- Color per feature ---- */
const FEATURE_COLORS: Record<string, string> = {
  "Voice Alarm with Location": "#BA0020",
  "Easy Magnetic Mount": "#067AD9",
  "10-Year Battery (NEVER-CHANGE)": "#022542",
  "Replaceable Battery (Included)": "#022542",
  "HARDWIRED+9V Battery Backup": "#022542",
  "Plug-In": "#022542",
};

/* ---- Individual Icon SVGs (white on colored circle) ---- */

function VoiceAlarmIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" fill="#BA0020" r="10" />
        <g>
          <path d={voiceAlarmSvg.p373f2c00} fill="white" />
          <path d={voiceAlarmSvg.p3beb0180} fill="white" />
          <path clipRule="evenodd" d={voiceAlarmSvg.p19762f00} fill="white" fillRule="evenodd" />
          <path clipRule="evenodd" d={voiceAlarmSvg.p3b024a80} fill="white" fillRule="evenodd" />
        </g>
      </svg>
    </div>
  );
}

function MagneticMountIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 20 20.1244">
        <circle cx="10" cy="10" fill="#067AD9" r="10" />
        <g clipPath="url(#featureMagneticClip)">
          <path d={magneticMountSvg.pca6d200} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={magneticMountSvg.p9e15200} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={magneticMountSvg.p1013ac80} fill="white" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
        </g>
        <path d={magneticMountSvg.p2c9fb500} fill="white" />
        <defs>
          <clipPath id="featureMagneticClip">
            <rect fill="white" height="14" transform="translate(7 1) rotate(30)" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TenYearBatteryIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#022542" />
        <g clipPath="url(#clip_10yr_battery)">
          <g>
            <path d={tenYearBatterySvg.p341cde00} fill="white" />
            <path d={tenYearBatterySvg.p1a8b3740} fill="white" />
          </g>
          <path d={tenYearBatterySvg.p34a1b100} fill="white" />
          <path d={tenYearBatterySvg.p32ccdc40} stroke="white" strokeLinecap="round" />
        </g>
        <defs>
          <clipPath id="clip_10yr_battery">
            <rect fill="white" height="16" transform="translate(2 1.5)" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ReplaceableBatteryIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#022542" />
        <g clipPath="url(#clip_replaceable_battery)">
          <path d={replaceableBatterySvg.pefc4a80} fill="white" />
          <path d={replaceableBatterySvg.p32ccdc40} stroke="white" strokeLinecap="round" />
          <g>
            <path d={replaceableBatterySvg.p2df565e0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
            <path d={replaceableBatterySvg.p25748f00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          </g>
        </g>
        <defs>
          <clipPath id="clip_replaceable_battery">
            <rect fill="white" height="16" transform="translate(2 1.5)" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function HardwiredIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#022542" />
        <g>
          <path d={svgPaths.pe93c100} fill="white" />
          <path d={svgPaths.p34049d71} fill="white" />
          <path d={svgPaths.p1e04c500} fill="white" />
          <path d={svgPaths.p1488a780} fill="white" />
          <path d={svgPaths.p230a3f00} fill="white" />
          <path d={svgPaths.p859c300} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function PlugInIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="10" fill="#022542" />
        <defs>
          <clipPath id="featurePlugClip">
            <rect fill="white" height="14" transform="translate(9.9999 0.098927) rotate(45)" width="14" />
          </clipPath>
        </defs>
        <g clipPath="url(#featurePlugClip)">
          <path d={svgPaths.p60fd280} stroke="white" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={svgPaths.p12f45580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={svgPaths.p68ce340} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={svgPaths.p22a82380} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
          <path d={svgPaths.p12e4d450} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.07" />
        </g>
      </svg>
    </div>
  );
}

/* ---- Map feature label → icon component ---- */
const ICON_MAP: Record<string, () => JSX.Element> = {
  "Voice Alarm with Location": VoiceAlarmIcon,
  "Easy Magnetic Mount": MagneticMountIcon,
  "10-Year Battery (NEVER-CHANGE)": TenYearBatteryIcon,
  "Replaceable Battery (Included)": ReplaceableBatteryIcon,
  "HARDWIRED+9V Battery Backup": HardwiredIcon,
  "Plug-In": PlugInIcon,
};

/**
 * Renders a single feature row: colored circle icon + label text.
 */
export function FeatureItem({ feature }: { feature: string }) {
  const IconComp = ICON_MAP[feature];
  if (!IconComp) return null;
  return (
    <div className="flex gap-[4px] items-center">
      <IconComp />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
        {feature}
      </p>
    </div>
  );
}

/**
 * Renders the full features list for a product card.
 * Filters to only show predefined features, preserving display order.
 */
export function ProductFeatures({ features }: { features: string[] }) {
  // Display in the canonical order defined in ALL_FEATURES
  const ordered = ALL_FEATURES.filter((f) => features.includes(f));
  if (ordered.length === 0) return null;
  return (
    <div className="flex flex-col gap-[6px]">
      {ordered.map((f) => (
        <FeatureItem key={f} feature={f} />
      ))}
    </div>
  );
}