import svgPaths from "./svg-2p42bpp8ks";

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center mb-[-0.1px] relative shrink-0 w-full">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none">
          <div className="h-[10.1px] relative w-[20px]" data-name="Arrow">
            <div className="absolute flex h-[10.098px] items-center justify-center left-[0.05px] top-0 w-[20px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "20" } as React.CSSProperties}>
              <div className="flex-none rotate-90">
                <div className="h-[20px] relative w-[10.098px]" data-name="Subtract">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.0983 20">
                    <path d={svgPaths.p8e09a00} fill="var(--fill-0, white)" id="Subtract" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Information() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.1px] relative shadow-[0px_6px_30px_0px_rgba(0,0,0,0.12)] size-full" data-name="详情浮层 Information">
      <Frame />
      <div className="bg-white content-stretch flex flex-col items-center mb-[-0.1px] p-[12px] relative rounded-[12px] shrink-0 w-[260px]" data-name="Body/off">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">Connect directly via WiFi, receive APP notifications, and manage remote test/silence with low battery alerts.</p>
      </div>
    </div>
  );
}