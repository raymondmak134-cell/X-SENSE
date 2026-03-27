import svgPaths from "./svg-j7io6l51ec";
import imgSmokeAlarms from "@/assets/placeholder-image-url";
import imgImage from "@/assets/placeholder-image-url";
import SharedFooter from "./Footer";

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

function Footer() {
  return <SharedFooter />;
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