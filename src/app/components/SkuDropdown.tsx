import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { SkuOption } from "./use-products";

interface SkuDropdownProps {
  options: SkuOption[];
  /** Called when user selects a different SKU */
  onSelect?: (index: number) => void;
}

export function SkuDropdown({ options, onSelect }: SkuDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selected = options[selectedIndex]?.name || "";

  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();

    const handleScrollOrResize = () => updateDropdownPosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, updateDropdownPosition]);

  if (options.length === 0) return null;

  const isInteractive = options.length > 1;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive) setIsOpen((v) => !v);
  };

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setIsOpen(false);
    onSelect?.(index);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`h-[40px] relative rounded-[10px] shrink-0 w-full group ${isInteractive ? "cursor-pointer" : ""}`}
        data-name="Product Options"
        onClick={handleToggle}
      >
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[6px] relative size-full">
            <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[22px] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-[rgba(0,0,0,0.54)] text-ellipsis whitespace-nowrap">
              {selected}
            </p>
            {isInteractive && (
              <div className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
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
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`absolute border border-solid inset-0 pointer-events-none rounded-[10px] transition-colors duration-150 ${
            isOpen
              ? "border-[rgba(0,0,0,0.4)]"
              : isInteractive
                ? "border-[rgba(0,0,0,0.1)] group-hover:border-[rgba(0,0,0,0.3)]"
                : "border-[rgba(0,0,0,0.1)]"
          }`}
        />
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white rounded-[10px] border border-[rgba(0,0,0,0.1)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
                maxHeight: 240,
                overflowY: "auto",
              }}
            >
              {options.map((option, i) => (
                <div
                  key={i}
                  className={`px-[12px] py-[10px] cursor-pointer transition-colors duration-100 font-['Inter:Regular',sans-serif] font-normal text-[14px] leading-[20px] flex items-center justify-between gap-[8px] ${
                    i === selectedIndex
                      ? "bg-[#F0F7FF] text-black"
                      : "text-[rgba(0,0,0,0.7)] hover:bg-[#EDEDEE]"
                  }`}
                  onClick={() => handleSelect(i)}
                >
                  <span className="flex-1 min-w-0 truncate">{option.name}</span>
                  {option.price && (
                    <span className="shrink-0 text-[13px] text-[rgba(0,0,0,0.4)]">${option.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}