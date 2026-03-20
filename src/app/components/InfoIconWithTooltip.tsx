import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

const ARROW_SVG_PATH = "M0 0C0 1.85676 0.989822 3.57257 2.59668 4.50293L9.10059 8.26953C10.4309 9.0399 10.4309 10.9601 9.10059 11.7305L2.59668 15.4971C0.989822 16.4274 0 18.1432 0 20V0Z";

interface InfoIconWithTooltipProps {
  /** The SVG path data for the info icon */
  iconPath: string;
  /** Tooltip description text */
  tooltip: string;
}

export function InfoIconWithTooltip({ iconPath, tooltip }: InfoIconWithTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const iconRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = useCallback(() => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8, // 8px below icon
        left: rect.left + rect.width / 2, // center horizontally
      });
    }
  }, []);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setVisible(false), 100);
  }, []);

  // Update position on scroll/resize while visible
  useEffect(() => {
    if (!visible) return;
    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [visible, updatePosition]);

  return (
    <div
      ref={iconRef}
      className="overflow-hidden relative shrink-0 size-[20px]"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Info icon */}
      <div className="overflow-clip size-full cursor-pointer" data-name="Icon">
        <div className="absolute h-[17.5px] left-[6.25%] right-[6.25%] top-[1.25px]" data-name="Exclude">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <path d={iconPath} fill="var(--fill-0, black)" fillOpacity="0.4" id="Exclude" />
          </svg>
        </div>
      </div>

      {/* Tooltip rendered via portal to avoid overflow clipping */}
      {createPortal(
        <div
          className={`fixed z-[9999] flex flex-col items-center pointer-events-none transition-[opacity,transform] duration-200 ease-in-out ${
            visible
              ? "opacity-100"
              : "opacity-0"
          }`}
          style={{
            top: coords.top,
            left: coords.left,
            transform: `translateX(-50%) translateY(${visible ? "0" : "4px"})`,
            filter: "drop-shadow(0px 6px 30px rgba(0,0,0,0.12))",
          }}
        >
          {/* Arrow pointing up */}
          <div className="shrink-0 flex items-center justify-center h-[10px] overflow-visible">
            <div className="-rotate-90" style={{ width: "10.098px", height: "20px" }}>
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 10.0983 20"
              >
                <path d={ARROW_SVG_PATH} fill="white" />
              </svg>
            </div>
          </div>
          {/* Body */}
          <div className="bg-white rounded-[12px] p-[12px] w-[260px]">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic text-[12px] text-[rgba(0,0,0,0.54)]">
              {tooltip}
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}