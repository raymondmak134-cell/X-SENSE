import svgPaths from "./svg-j7io6l51ec";
import imgSmokeAlarms from "@/assets/placeholder-image-url";
import imgImage from "@/assets/placeholder-image-url";

function Component() {
  return (
    <div className="absolute inset-[0_0.66%_0_0]" data-name="图层 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 119.208 16.0001">
        <g id="å¾å± 1">
          <path d={svgPaths.p3dc89a80} fill="var(--fill-0, #101820)" id="Vector" />
          <path d={svgPaths.pbe0d00} fill="var(--fill-0, #101820)" id="Vector_2" />
          <path d={svgPaths.p3a591380} fill="var(--fill-0, #101820)" id="Vector_3" />
          <path d={svgPaths.pc0264f0} fill="var(--fill-0, #BA0020)" id="Vector_4" />
          <path d={svgPaths.p24b34f80} fill="var(--fill-0, #101820)" id="Vector_5" />
          <path d={svgPaths.p1064b600} fill="var(--fill-0, #101820)" id="Vector_6" />
          <path d={svgPaths.p14e36800} fill="var(--fill-0, #101820)" id="Vector_7" />
          <path d={svgPaths.p5d5ef00} fill="var(--fill-0, #101820)" id="Vector_8" />
          <path d={svgPaths.p3f49e400} fill="var(--fill-0, #101820)" id="Vector_9" />
          <path d={svgPaths.p74fa000} fill="var(--fill-0, #101820)" id="Vector_10" />
        </g>
      </svg>
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute contents inset-[0_0.66%_0_0]" data-name="图层 3">
      <Component />
    </div>
  );
}

function Right() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Right">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/排序">
        <div className="absolute inset-[20.83%_13.33%_20.83%_16.67%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.7998 14">
            <path d={svgPaths.p3c599000} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
      <div className="h-[16px] relative shrink-0 w-[120px]" data-name="通用/控件/Logo">
        <Component1 />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0">
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/搜索 Search">
        <div className="absolute inset-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <g id="Vector">
              <path d={svgPaths.p24af9800} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p31519780} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/购物车">
        <div className="-translate-x-1/2 absolute aspect-[18.594295501708984/18.5591983795166] bottom-[8.33%] left-1/2 top-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p26bff00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Vector" />
          </svg>
        </div>
      </div>
      <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/常规/用户">
        <div className="-translate-x-1/2 absolute aspect-[14.665620803833008/16] bottom-[8.33%] left-1/2 top-[8.33%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 20">
            <g id="Vector">
              <path d={svgPaths.p2a0cae80} fill="var(--fill-0, black)" fillOpacity="0.9" />
              <path d={svgPaths.p1cdecf00} fill="var(--fill-0, black)" fillOpacity="0.9" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start not-italic relative shrink-0 text-center w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] relative shrink-0 text-[32px] text-black w-full">XS0B-MR</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">{`View Manuals >`}</p>
    </div>
  );
}

function Product() {
  return (
    <div className="content-stretch flex flex-col items-center min-w-[168.5px] relative shrink-0 w-full" data-name="Product">
      <div className="relative shrink-0 size-[240px]" data-name="Smoke Alarms">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgSmokeAlarms} />
        </div>
      </div>
      <Frame4 />
    </div>
  );
}

function TitleAndProducts() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full" data-name="Title and Products">
      <div className="content-stretch flex flex-col items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <Product />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Header">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Get Started</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">{`Setup & Installation`}</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Watch the installation video to quickly set up your alarm detector</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full">{`Learn More >`}</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-[353px] relative rounded-[16px]" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
          <div className="absolute inset-[4.33%_3.43%_5%_5%]" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.9771 21.7593">
              <path d={svgPaths.p1c1a700} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
            </svg>
          </div>
        </div>
        <Frame5 />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">App</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Official X-SENSE applications with thelatest features.</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full">{`Download >`}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-[353px] relative rounded-[16px]" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Icon">
          <div className="absolute inset-[5%_21.67%]" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5996 21.5996">
              <path d={svgPaths.p12fc9c0} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
            </svg>
          </div>
        </div>
        <Frame7 />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">FAQ</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Browse FAQs and solutions to quickly resolve common issues.</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full">{`View Now >`}</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-[353px] relative rounded-[16px]" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
        <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon">
          <div className="absolute inset-[8.09%_10.01%_8.09%_10.02%]" data-name="Union">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.1924 20.1191">
              <path d={svgPaths.p1dc39180} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
            </svg>
          </div>
        </div>
        <Frame8 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Frame">
          <path d={svgPaths.p31b57480} id="Vector" stroke="var(--stroke-0, black)" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M6 6H3" id="Vector_2" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M6 9.99844H3" id="Vector_3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M6 14.0016H3" id="Vector_4" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M6 18H3" id="Vector_5" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M21 6H18" id="Vector_6" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M21 9.99844H18" id="Vector_7" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M21 14.0016H18" id="Vector_8" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
          <path d="M21 18H18" id="Vector_9" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.602" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] text-black w-full">Specs</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">View product specifications and detailed parameters.</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#5e0000] text-[14px] w-full">{`View Now >`}</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#f6f6f6] flex-[1_0_0] min-h-px min-w-[353px] relative rounded-[16px]" data-name="Container">
      <div className="content-stretch flex gap-[8px] items-start min-w-[inherit] px-[32px] py-[24px] relative w-full">
        <Frame />
        <Frame9 />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-start flex flex-wrap gap-[16px] items-start relative shrink-0 w-full">
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center max-w-[inherit] px-[20px] py-[32px] relative w-full">
          <Header />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] not-italic relative shrink-0 text-[24px] text-black text-center w-full">Contact Us</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0 w-full" data-name="Container">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-full">Still can’t resolve the issue?</p>
      <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full whitespace-pre-wrap">
        <p className="mb-0">{`Sorry for the inconvenience. `}</p>
        <p>Please contact us for assistance. We will reply within 24 hours.</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <div className="bg-[#ba0020] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0" data-name="原子控件/Web/Button/填充Button">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">Contact</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[#f2f0ed] max-w-[1312px] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-col justify-center max-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[12px] items-start justify-center max-w-[inherit] p-[16px] relative w-full">
          <div className="h-[119px] relative shrink-0 w-[120px]" data-name="Image">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-full left-[-4.12%] max-w-none top-0 w-[135.44%]" src={imgImage} />
            </div>
          </div>
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function IconContainer() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[56px]" data-name="Icon Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 overflow-clip size-[40px] top-1/2" data-name="Email Icon">
        <div className="absolute inset-[13.33%_5%]" data-name="Email">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36.0002 29.333">
            <path d={svgPaths.p3abc4d00} fill="var(--fill-0, black)" fillOpacity="0.9" id="Email" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EmailContactsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[16px] relative shrink-0 w-full" data-name="Email Contacts Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <IconContainer />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Email Contacts</p>
    </div>
  );
}

function CustomerServiceContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[16px] relative shrink-0 w-full" data-name="Customer Service Contacts">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Customer Service</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">service@x-sense.com</p>
    </div>
  );
}

function BulkOrderContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[16px] relative shrink-0 w-full" data-name="Bulk Order Contacts">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Small Bulk Order</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">smallbulk@x-sense.com</p>
    </div>
  );
}

function PartnershipContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[16px] relative shrink-0 w-full" data-name="Partnership Contacts">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">Business Partnership</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">partners@x-sense.com</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative rounded-[16px] shrink-0 w-full" data-name="Container" style={{ backgroundImage: "linear-gradient(90deg, rgb(246, 246, 246) 0%, rgb(246, 246, 246) 100%), linear-gradient(90deg, rgba(94, 127, 156, 0.1) 0%, rgba(94, 127, 156, 0.1) 100%)" }}>
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
          <EmailContactsContainer />
          <CustomerServiceContacts />
          <BulkOrderContacts />
          <PartnershipContacts />
        </div>
      </div>
    </div>
  );
}

function IconContainer1() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[56px]" data-name="Icon Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+0.33px)] overflow-clip size-[40px] top-1/2" data-name="Phone Icon">
        <div className="absolute inset-[5.36%_5.42%_6.02%_5.64%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.5774 35.4491">
            <path d={svgPaths.p2a142700} fill="var(--fill-0, black)" fillOpacity="0.9" id="Union" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PhoneContactsContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[12px] relative shrink-0 w-full" data-name="Phone Contacts Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <IconContainer1 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Phone Contacts</p>
    </div>
  );
}

function UsPhoneContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full" data-name="US Phone Contacts">
      <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="mb-0">United States</p>
        <p>(Mon-Fri 9 AM-5 PM (US Eastern Time)</p>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+1(833)952-1880</p>
    </div>
  );
}

function UkPhoneContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full" data-name="UK Phone Contacts">
      <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="mb-0">United Kingdom</p>
        <p>Mon-Fri 9 AM-5 PM (GMT)</p>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+44 (0) 808 501 5078</p>
    </div>
  );
}

function GermanyPhoneContacts() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full" data-name="Germany Phone Contacts">
      <div className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">
        <p className="mb-0">Germany</p>
        <p>Mon-Fri9 AM-5 PM (CET)</p>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">+49 (0) 800 1821 385</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-[rgba(94,127,156,0.1)] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
          <PhoneContactsContainer />
          <UsPhoneContacts />
          <UkPhoneContacts />
          <GermanyPhoneContacts />
        </div>
      </div>
    </div>
  );
}

function IconContainer2() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[56px]" data-name="Icon Container">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.33px)] overflow-clip size-[40px] top-1/2" data-name="Office Icon">
        <div className="absolute inset-[35.48%_5.44%_5.42%_5.39%]" data-name="Subtract">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.667 23.6416">
            <path d={svgPaths.p117d5f00} fill="var(--fill-0, black)" id="Subtract" />
          </svg>
        </div>
        <div className="absolute inset-[10.21%_24.43%_5.42%_24.37%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.4805 33.75">
            <path d={svgPaths.p3ace9800} fill="var(--fill-0, black)" id="Union" />
          </svg>
        </div>
        <div className="absolute inset-[22.08%_38.7%_34.77%_38.64%]" data-name="Union">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.0625 17.2568">
            <path d={svgPaths.p1977300} fill="var(--fill-0, black)" id="Union" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function OfficeLocationContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[12px] relative shrink-0 w-full" data-name="Office Location Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.1)] border-b border-solid inset-0 pointer-events-none" />
      <IconContainer2 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] min-w-full not-italic relative shrink-0 text-[18px] text-[rgba(0,0,0,0.9)] w-[min-content]">Office Location</p>
    </div>
  );
}

function UsaOfficeLocation() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start not-italic py-[12px] relative shrink-0 w-full" data-name="USA Office Location">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] relative shrink-0 text-[#5e0000] text-[16px] w-full">X-SENSE USA LLC</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-[rgba(0,0,0,0.54)] w-full">1209 Orange St, Wilmington,DE 19801, United States</p>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[rgba(217,190,161,0.15)] relative rounded-[16px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center p-[16px] relative w-full">
          <OfficeLocationContainer />
          <UsaOfficeLocation />
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <Container5 />
      <Container8 />
      <Container9 />
      <Container10 />
    </div>
  );
}

function TitleAndProducts1() {
  return (
    <div className="bg-white max-w-[1312px] relative shrink-0 w-full" data-name="Title and Products">
      <div className="content-stretch flex flex-col gap-[24px] items-start max-w-[inherit] px-[20px] py-[32px] relative w-full">
        <Header1 />
        <Frame3 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] w-[68.48px]">
        <p className="leading-[normal]">Products</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p1c75eb80} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="iconify-icon">
      <Svg />
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container12 />
        <IconifyIcon />
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] w-[61.31px]">
        <p className="leading-[normal]">Support</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p1c75eb80} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="iconify-icon">
      <Svg1 />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container14 />
        <IconifyIcon1 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] w-[57.44px]">
        <p className="leading-[normal]">Explore</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p1c75eb80} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="iconify-icon">
      <Svg2 />
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container16 />
        <IconifyIcon2 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#333] text-[16px] w-[123.73px]">
        <p className="leading-[normal]">{`Privacy & Terms`}</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p1c75eb80} id="Vector" stroke="var(--stroke-0, #333333)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="iconify-icon">
      <Svg3 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container18 />
        <IconifyIcon3 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-px px-[20px] relative w-full">
        <Container11 />
        <Container13 />
        <Container15 />
        <Container17 />
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0a0] text-[14px] w-full">
        <p className="leading-[normal]">Enter Your Email Address</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[16px] relative size-full">
          <Container21 />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[16.68%_8.33%_16.65%_8.33%]" data-name="Group">
      <div className="absolute inset-[-6.27%_-5%_-6.23%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3335 15">
          <g id="Group">
            <path d={svgPaths.p1c536a80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            <path d={svgPaths.p1f83e600} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Group />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e6e6e6] h-full relative shrink-0 w-[56px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Svg4 />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Border">
      <div className="content-stretch flex items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container20 />
        <Background />
      </div>
      <div aria-hidden="true" className="absolute border border-[#e8e8e8] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d="M10 3L4.5 8.5L2 6" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#c33] content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 size-[16px]" data-name="Background">
      <Svg5 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[16px]" data-name="Margin">
      <Background1 />
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[44.12px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[37px] justify-center leading-[18.2px] not-italic relative shrink-0 text-[#444] text-[13px] w-[266.88px]">
        <p className="mb-0">Exclusive updates delivered directly to your</p>
        <p>mailbox!</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Container23 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[10px] px-[20px] relative w-full">
        <Border />
        <Container22 />
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_4161_661)" id="SVG">
          <path d={svgPaths.p35fcb100} fill="var(--fill-0, #1877F2)" id="Vector" />
          <path d={svgPaths.p21ded800} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4161_661">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconifyIcon4() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="iconify-icon">
      <Svg6 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path d={svgPaths.p36f00780} fill="url(#paint0_radial_4161_656)" id="Vector" />
          <path d={svgPaths.p36f00780} fill="url(#paint1_radial_4161_656)" id="Vector_2" />
          <path d={svgPaths.pe918680} fill="var(--fill-0, white)" id="Vector_3" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(6.375 25.8485) rotate(-90) scale(23.7858 22.1227)" gradientUnits="userSpaceOnUse" id="paint0_radial_4161_656" r="1">
            <stop stopColor="#FFDD55" />
            <stop offset="0.1" stopColor="#FFDD55" />
            <stop offset="0.5" stopColor="#FF543E" />
            <stop offset="1" stopColor="#C837AB" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(-4.02008 1.7289) rotate(78.68) scale(10.6324 43.827)" gradientUnits="userSpaceOnUse" id="paint1_radial_4161_656" r="1">
            <stop stopColor="#3771C8" />
            <stop offset="0.128" stopColor="#3771C8" />
            <stop offset="1" stopColor="#6600FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

function IconifyIcon5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="iconify-icon">
      <Svg7 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="h-[24px] relative shrink-0 w-[34.31px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.31 24">
        <g clipPath="url(#clip0_4161_699)" id="SVG">
          <path d={svgPaths.p11e23f80} fill="var(--fill-0, #FF0000)" id="Vector" />
          <path d={svgPaths.p23061240} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4161_699">
            <rect fill="white" height="24" width="34.31" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconifyIcon6() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="iconify-icon">
      <Svg8 />
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_4161_631)" id="SVG">
          <path d={svgPaths.p27eddc00} fill="var(--fill-0, #FF4500)" id="Vector" />
          <path d={svgPaths.p289cfa00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4161_631">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconifyIcon7() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative self-stretch shrink-0" data-name="iconify-icon">
      <Svg9 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex gap-[16px] items-start pb-[24px] px-[20px] relative size-full">
        <IconifyIcon4 />
        <IconifyIcon5 />
        <IconifyIcon6 />
        <IconifyIcon7 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[14px] w-full">
          <p className="leading-[normal]">Copyright © 2026 X-Sense. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.31%_8.33%_8.35%_8.33%]" data-name="Group">
      <div className="absolute inset-[-4.98%_-5%_-5.02%_-5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 12.8333">
          <g id="Group">
            <path d={svgPaths.p3e4c6ec0} id="Vector" stroke="var(--stroke-0, #555555)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
            <path d={svgPaths.p3bd5e900} id="Vector_2" stroke="var(--stroke-0, #555555)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg10() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="SVG">
      <Group1 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="iconify-icon">
      <Svg10 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[14px] w-[150.56px]">
        <p className="leading-[normal]">United States (English)</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative">
        <IconifyIcon8 />
        <Container27 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[40px] pt-[25px] px-[20px] relative w-full">
        <Container25 />
        <Container26 />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Footer">
      <HorizontalBorder />
      <Container19 />
      <Container24 />
      <HorizontalBorder1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 right-0 top-[48px]">
      <TitleAndProducts />
      <Container />
      <TitleAndProducts1 />
      <Footer />
    </div>
  );
}

export default function Support() {
  return (
    <div className="bg-white relative size-full" data-name="Support">
      <div className="absolute bg-white content-stretch flex items-center justify-between left-0 overflow-clip px-[20px] py-[12px] right-0 top-0" data-name="Mobile/全局/导航">
        <Right />
        <Frame1 />
      </div>
      <Frame2 />
    </div>
  );
}