import { useState, useEffect } from "react";
import svgPaths from "../../imports/svg-v12pasl9nn";

interface InteractiveCheckboxProps {
  label?: string;
  children?: React.ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function InteractiveCheckbox({ 
  label,
  children,
  defaultChecked = false,
  checked,
  onChange 
}: InteractiveCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  
  // Support controlled mode
  const isChecked = checked !== undefined ? checked : internalChecked;

  // Update internal state when controlled value changes
  useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const handleClick = () => {
    const newChecked = !isChecked;
    setInternalChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <div 
      className="content-stretch flex gap-[8px] items-center relative shrink-0 cursor-pointer group" 
      data-name="Container"
      onClick={handleClick}
    >
      <div className="relative shrink-0 size-[24px]" data-name="原子控件/通用/复选框 Checkbox">
        {isChecked ? (
          // Checked state
          <div className="content-stretch flex items-center justify-center p-[4px] relative size-full">
            <div className="relative shrink-0 size-[18px]" data-name="Checkbox 多选">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                <g id="Checkbox">
                  <rect fill="#ba0020" height="18" id="Rectangle" rx="4" width="18" />
                  <path clipRule="evenodd" d={svgPaths.p38e26540} fill="white" fillRule="evenodd" id="checkmark" />
                </g>
              </svg>
            </div>
          </div>
        ) : (
          // Unchecked state with hover effect
          <div className="absolute border-[1.3px] border-[rgba(0,0,0,0.3)] group-hover:border-[rgba(0,0,0,0.6)] border-solid inset-[12.5%] rounded-[4px] transition-colors" />
        )}
      </div>
      {children || (
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[16px] text-black select-none">
          {label}
        </p>
      )}
    </div>
  );
}