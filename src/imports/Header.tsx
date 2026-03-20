interface HeaderProps {
  hasAnyChecked: boolean;
  onReset: () => void;
  productCount?: number;
  onCompare?: () => void;
}

function Frame1({ onReset, productCount = 8 }: { onReset: () => void; productCount?: number }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center leading-[20px] relative shrink-0 text-[14px] whitespace-nowrap">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-black">{productCount} item{productCount === 1 ? '' : 's'} found</p>
      <button onClick={onReset} className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#ba0020] cursor-pointer bg-transparent border-none p-0">Reset</button>
    </div>
  );
}

function Frame({ hasAnyChecked, onReset, productCount }: { hasAnyChecked: boolean; onReset: () => void; productCount?: number }) {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] min-w-full relative shrink-0 text-[32px] text-black w-[min-content]">Explore Products</p>
      {hasAnyChecked && <Frame1 onReset={onReset} productCount={productCount} />}
    </div>
  );
}

export default function Header({ hasAnyChecked, onReset, productCount, onCompare }: HeaderProps) {
  return (
    <div className="content-stretch flex gap-[48px] items-center relative size-full" data-name="Header">
      <Frame hasAnyChecked={hasAnyChecked} onReset={onReset} productCount={productCount} />
      <div
        className="content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[53px] shrink-0 cursor-pointer"
        data-name="原子控件/Web/Button/描边Button"
        onClick={onCompare}
      >
        <div aria-hidden="true" className="absolute border-2 border-[#101820] border-solid inset-0 pointer-events-none rounded-[53px]" />
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[#101820] text-[14px] text-center whitespace-nowrap">Compare</p>
      </div>
    </div>
  );
}