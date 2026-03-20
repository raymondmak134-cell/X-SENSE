import svgPaths from "./svg-v79km1d7wk";

function Container1() {
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

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container1 />
        <IconifyIcon />
      </div>
    </div>
  );
}

function Container3() {
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

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container3 />
        <IconifyIcon1 />
      </div>
    </div>
  );
}

function Container5() {
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

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container5 />
        <IconifyIcon2 />
      </div>
    </div>
  );
}

function Container7() {
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

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between py-[24px] relative w-full">
        <Container7 />
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
        <Container />
        <Container2 />
        <Container4 />
        <Container6 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#a0a0a0] text-[14px] w-full">
        <p className="leading-[normal]">Enter Your Email Address</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[16px] relative size-full">
          <Container10 />
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
        <Container9 />
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

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[44.12px] relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[37px] justify-center leading-[18.2px] not-italic relative shrink-0 text-[#444] text-[13px] w-[266.88px]">
        <p className="mb-0">Exclusive updates delivered directly to your</p>
        <p>mailbox!</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Margin />
      <Container12 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[24px] pt-[10px] px-[20px] relative w-full">
        <Border />
        <Container11 />
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_2012_645)" id="SVG">
          <path d={svgPaths.p35fcb100} fill="var(--fill-0, #1877F2)" id="Vector" />
          <path d={svgPaths.p21ded800} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_2012_645">
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
          <path d={svgPaths.p36f00780} fill="url(#paint0_radial_2012_634)" id="Vector" />
          <path d={svgPaths.p36f00780} fill="url(#paint1_radial_2012_634)" id="Vector_2" />
          <path d={svgPaths.pe918680} fill="var(--fill-0, white)" id="Vector_3" />
        </g>
        <defs>
          <radialGradient cx="0" cy="0" gradientTransform="translate(6.375 25.8485) rotate(-90) scale(23.7858 22.1227)" gradientUnits="userSpaceOnUse" id="paint0_radial_2012_634" r="1">
            <stop stopColor="#FFDD55" />
            <stop offset="0.1" stopColor="#FFDD55" />
            <stop offset="0.5" stopColor="#FF543E" />
            <stop offset="1" stopColor="#C837AB" />
          </radialGradient>
          <radialGradient cx="0" cy="0" gradientTransform="translate(-4.02008 1.7289) rotate(78.68) scale(10.6324 43.827)" gradientUnits="userSpaceOnUse" id="paint1_radial_2012_634" r="1">
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
        <g clipPath="url(#clip0_2012_630)" id="SVG">
          <path d={svgPaths.p11e23f80} fill="var(--fill-0, #FF0000)" id="Vector" />
          <path d={svgPaths.p23061240} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_2012_630">
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
        <g clipPath="url(#clip0_2012_626)" id="SVG">
          <path d={svgPaths.p27eddc00} fill="var(--fill-0, #FF4500)" id="Vector" />
          <path d={svgPaths.p289cfa00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_2012_626">
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

function Container13() {
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

function Container14() {
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

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#555] text-[14px] w-[150.56px]">
        <p className="leading-[normal]">United States (English)</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative">
        <IconifyIcon8 />
        <Container16 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#f0f0f0] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[16px] items-start pb-[40px] pt-[25px] px-[20px] relative w-full">
        <Container14 />
        <Container15 />
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Footer">
      <HorizontalBorder />
      <Container8 />
      <Container13 />
      <HorizontalBorder1 />
    </div>
  );
}