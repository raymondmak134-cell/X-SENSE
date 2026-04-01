import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useProducts,
  useProductCards,
  useGuides,
  useSpus,
  getMinPriceForCard,
  type ProductCardItem,
  type GuideItem,
  type Product,
  type Spu,
} from "./use-products";
import GlobalNav from "./global-nav";
import Footer from "../../imports/Footer";
import CompareDialog from "./compare-dialog";
import SplitText from "@/components/SplitText";

/* ========== Skeleton Loaders ========== */

function ProductCardSkeleton() {
  return (
    <div className="flex flex-[1_0_0] flex-col h-[480px] min-w-0 items-center justify-between overflow-clip p-[24px] relative rounded-[24px] bg-[#f0f0f0] animate-pulse">
      <div className="flex flex-col gap-[4px] items-start w-full">
        <div className="h-[34px] w-[160px] rounded-[8px] bg-[rgba(0,0,0,0.08)]" />
        <div className="h-[16px] w-[200px] rounded-[6px] bg-[rgba(0,0,0,0.06)] mt-[4px]" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="h-[24px] w-[120px] rounded-[6px] bg-[rgba(0,0,0,0.08)]" />
        <div className="h-[40px] w-[80px] rounded-full bg-[rgba(0,0,0,0.08)]" />
      </div>
    </div>
  );
}

function GuideCardSkeleton() {
  return (
    <div className="flex flex-[1_0_0] flex-col h-full items-start overflow-clip rounded-[24px] bg-[#f6f6f6] animate-pulse">
      <div className="flex flex-col gap-[4px] items-start p-[24px] w-full">
        <div className="h-[16px] w-[140px] rounded-[4px] bg-[rgba(0,0,0,0.06)]" />
        <div className="h-[34px] w-full rounded-[6px] bg-[rgba(0,0,0,0.08)] mt-[4px]" />
        <div className="h-[34px] w-[80%] rounded-[6px] bg-[rgba(0,0,0,0.08)]" />
      </div>
      <div className="flex-[1_0_0] w-full bg-[rgba(0,0,0,0.04)]" />
    </div>
  );
}

/* ========== Select Modal ========== */

type SmartChoice = "app" | "no-app";
type ConnectivityChoice = "interconnected" | "standalone";

const SELECTION_TO_CONNECTIVITY: Record<string, string> = {
  "app-interconnected": "Base Station Interconnected (App)",
  "app-standalone": "Wi-Fi (App)",
  "no-app-interconnected": "Wireless Interconnected",
  "no-app-standalone": "Standalone",
};

const CONNECTIVITY_TO_SELECTION: Record<
  string,
  { smart: SmartChoice; connectivity: ConnectivityChoice }
> = {
  "Base Station Interconnected (App)": { smart: "app", connectivity: "interconnected" },
  "Wi-Fi (App)": { smart: "app", connectivity: "standalone" },
  "Wireless Interconnected": { smart: "no-app", connectivity: "interconnected" },
  Standalone: { smart: "no-app", connectivity: "standalone" },
};

function SelectModal({
  open,
  onClose,
  card,
  products,
  spus,
}: {
  open: boolean;
  onClose: () => void;
  card: ProductCardItem;
  products: Product[];
  spus: Spu[];
}) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [smartChoice, setSmartChoice] = useState<SmartChoice | null>(null);
  const [connectivityChoice, setConnectivityChoice] = useState<ConnectivityChoice | null>(null);
  const [selectedSkuIdx, setSelectedSkuIdx] = useState(0);

  const cardSpus = useMemo(
    () => spus.filter((s) => card.spuIds.includes(s.id)),
    [spus, card.spuIds]
  );

  const availableCombinations = useMemo(() => {
    const combos = new Set<string>();
    for (const spu of cardSpus) {
      const sel = CONNECTIVITY_TO_SELECTION[spu.connectivity];
      if (sel) combos.add(`${sel.smart}-${sel.connectivity}`);
    }
    return combos;
  }, [cardSpus]);

  const availableSmartChoices = useMemo(() => {
    const choices: SmartChoice[] = [];
    if (connectivityChoice) {
      if (availableCombinations.has(`app-${connectivityChoice}`))
        choices.push("app");
      if (availableCombinations.has(`no-app-${connectivityChoice}`))
        choices.push("no-app");
    } else {
      for (const combo of availableCombinations) {
        if (combo.startsWith("app-") && !choices.includes("app"))
          choices.push("app");
        if (combo.startsWith("no-app-") && !choices.includes("no-app"))
          choices.push("no-app");
      }
    }
    return choices;
  }, [availableCombinations, connectivityChoice]);

  const availableConnectivityChoices = useMemo(() => {
    const choices: ConnectivityChoice[] = [];
    if (smartChoice) {
      if (availableCombinations.has(`${smartChoice}-interconnected`))
        choices.push("interconnected");
      if (availableCombinations.has(`${smartChoice}-standalone`))
        choices.push("standalone");
    } else {
      if ([...availableCombinations].some((c) => c.endsWith("-interconnected")))
        choices.push("interconnected");
      if ([...availableCombinations].some((c) => c.endsWith("-standalone")))
        choices.push("standalone");
    }
    return choices;
  }, [availableCombinations, smartChoice]);

  const handleSmartClick = useCallback(
    (choice: SmartChoice) => {
      setSmartChoice(choice);
      const validConn: ConnectivityChoice[] = [];
      if (availableCombinations.has(`${choice}-interconnected`))
        validConn.push("interconnected");
      if (availableCombinations.has(`${choice}-standalone`))
        validConn.push("standalone");
      if (connectivityChoice && !validConn.includes(connectivityChoice)) {
        setConnectivityChoice(
          validConn.length === 1 ? validConn[0] : null
        );
      } else if (!connectivityChoice && validConn.length === 1) {
        setConnectivityChoice(validConn[0]);
      }
    },
    [connectivityChoice, availableCombinations]
  );

  const handleConnectivityClick = useCallback(
    (choice: ConnectivityChoice) => {
      setConnectivityChoice(choice);
      const validSmart: SmartChoice[] = [];
      if (availableCombinations.has(`app-${choice}`))
        validSmart.push("app");
      if (availableCombinations.has(`no-app-${choice}`))
        validSmart.push("no-app");
      if (smartChoice && !validSmart.includes(smartChoice)) {
        setSmartChoice(
          validSmart.length === 1 ? validSmart[0] : null
        );
      } else if (!smartChoice && validSmart.length === 1) {
        setSmartChoice(validSmart[0]);
      }
    },
    [smartChoice, availableCombinations]
  );

  const targetConnectivity =
    smartChoice && connectivityChoice
      ? SELECTION_TO_CONNECTIVITY[`${smartChoice}-${connectivityChoice}`] || null
      : null;

  const matchedSpu = useMemo(
    () =>
      targetConnectivity
        ? spus.find(
            (s) =>
              card.spuIds.includes(s.id) &&
              s.connectivity === targetConnectivity
          ) || null
        : null,
    [targetConnectivity, spus, card.spuIds]
  );

  const matchedProducts = useMemo(
    () =>
      matchedSpu
        ? products.filter((p) => p.spuId === matchedSpu.id)
        : [],
    [matchedSpu, products]
  );

  const allSkuOptions = useMemo(
    () => matchedProducts.flatMap((p) => p.options),
    [matchedProducts]
  );

  const showSkuSection = allSkuOptions.length > 0;

  const selectedSku = showSkuSection
    ? allSkuOptions[selectedSkuIdx] || allSkuOptions[0]
    : null;

  const skuPrice = selectedSku
    ? parseFloat(selectedSku.price?.replace("$", "") || "0")
    : 0;
  const hasDiscount =
    selectedSku?.discountEnabled && !!selectedSku?.discountPercent;
  const discountPct = hasDiscount
    ? parseFloat(selectedSku.discountPercent)
    : 0;
  const discountedPrice = hasDiscount
    ? skuPrice * (1 - discountPct / 100)
    : skuPrice;

  useEffect(() => {
    setSelectedSkuIdx(0);
  }, [matchedSpu?.id]);

  useEffect(() => {
    if (open) {
      const cSpus = spus.filter((s) => card.spuIds.includes(s.id));
      const combos = new Set<string>();
      for (const spu of cSpus) {
        const sel = CONNECTIVITY_TO_SELECTION[spu.connectivity];
        if (sel) combos.add(`${sel.smart}-${sel.connectivity}`);
      }

      const smartOpts: SmartChoice[] = [];
      if ([...combos].some((c) => c.startsWith("app-")))
        smartOpts.push("app");
      if ([...combos].some((c) => c.startsWith("no-app-")))
        smartOpts.push("no-app");

      const autoSmart =
        smartOpts.length === 1 ? smartOpts[0] : null;
      setSmartChoice(autoSmart);

      if (autoSmart) {
        const connOpts: ConnectivityChoice[] = [];
        if (combos.has(`${autoSmart}-interconnected`))
          connOpts.push("interconnected");
        if (combos.has(`${autoSmart}-standalone`))
          connOpts.push("standalone");
        setConnectivityChoice(
          connOpts.length === 1 ? connOpts[0] : null
        );
      } else {
        setConnectivityChoice(null);
      }

      setSelectedSkuIdx(0);
      setVisible(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(false);
        });
      });
    }
  }, [open, spus, card.spuIds]);

  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  if (!visible) return null;

  const isOpen = open && !animating;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center px-[120px] transition-all duration-300 ease-in-out ${
        isOpen
          ? "bg-[rgba(0,0,0,0.2)] opacity-100"
          : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white flex flex-col items-center max-w-[720px] w-full overflow-clip rounded-[32px] max-h-[85vh] transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="content-stretch flex gap-[24px] items-start justify-center pb-[24px] pt-[32px] px-[32px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start justify-center min-h-px min-w-px relative">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] not-italic relative shrink-0 text-[32px] text-[#101820] w-full">
              {matchedSpu ? `Selected ${matchedSpu.name}` : `Select ${card.name}`}
            </p>
          </div>
          <button
            className="shrink-0 size-[40px] opacity-40 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
            onClick={handleClose}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                clipRule="evenodd"
                d="M16.6667 0C25.8714 0 33.3333 7.46192 33.3333 16.6667C33.3333 25.8714 25.8714 33.3333 16.6667 33.3333C7.46192 33.3333 0 25.8714 0 16.6667C0 7.46192 7.46192 0 16.6667 0ZM16.6667 14.5707L11.8236 9.72765L9.72765 11.8218L14.5725 16.6667L9.72765 21.5133L11.8218 23.6075L16.6667 18.7609L21.5133 23.6075L23.6075 21.5115L18.7627 16.6667L23.6075 11.8236L22.5604 10.7747L21.5115 9.72765L16.6667 14.5707Z"
                fill="black"
                fillOpacity="0.54"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 flex flex-col gap-[24px] items-start pb-[32px] px-[32px] relative w-full overflow-y-auto min-h-0">
          {/* Product image + selling point + power source */}
          <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full">
            <div className="relative rounded-[12px] shrink-0 size-[120px] bg-[#f6f6f6]">
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full"
                src={card.coverImageUrl}
              />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-h-px min-w-px relative gap-[4px]">
              {card.sellingPoint1 && (
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <div className="bg-[#ba0020] rounded-[27px] shrink-0 size-[8px]" />
                  <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.9)]">
                    {card.sellingPoint1}
                  </p>
                </div>
              )}
              {card.sellingPoint2 && (
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <div className="bg-[#067AD9] rounded-[27px] shrink-0 size-[8px]" />
                  <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.9)]">
                    {card.sellingPoint2}
                  </p>
                </div>
              )}
              <div
                className="w-full"
                style={{
                  display: "grid",
                  gridTemplateRows: matchedSpu?.powerSource ? "1fr" : "0fr",
                  transition:
                    "grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div className="overflow-hidden">
                  <div
                    className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full"
                    style={{
                      opacity: matchedSpu?.powerSource ? 1 : 0,
                      transition: "opacity 0.25s ease 0.1s",
                    }}
                  >
                    <div className="bg-[#022542] rounded-[27px] shrink-0 size-[8px]" />
                    <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] min-h-px min-w-px not-italic relative text-[12px] text-[rgba(0,0,0,0.9)]">
                      {matchedSpu?.powerSource}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart */}
          <div className="border-b border-solid border-[rgba(0,0,0,0.1)] content-stretch flex flex-col gap-[12px] items-start pb-[24px] relative shrink-0 w-full">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-[#101820] w-full">
              <span className="leading-[24px]">{"Smart. "}</span>
              <span className="leading-[24px] text-[rgba(0,0,0,0.4)]">
                Want to control it from your phone?
              </span>
            </p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {availableSmartChoices.includes("app") && (
                <div
                  className={`content-stretch flex items-center justify-center overflow-clip px-[16px] h-[56px] relative rounded-[12px] shrink-0 cursor-pointer transition-all duration-200 ${
                    smartChoice === "app"
                      ? "border-2 border-solid border-[#ba0020]"
                      : "border-2 border-solid border-[rgba(0,0,0,0.2)]"
                  }`}
                  onClick={() => handleSmartClick("app")}
                >
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    Need App Control
                  </p>
                </div>
              )}
              {availableSmartChoices.includes("no-app") && (
                <div
                  className={`content-stretch flex items-center justify-center overflow-clip px-[16px] h-[56px] relative rounded-[12px] shrink-0 cursor-pointer transition-all duration-200 ${
                    smartChoice === "no-app"
                      ? "border-2 border-solid border-[#ba0020]"
                      : "border-2 border-solid border-[rgba(0,0,0,0.2)]"
                  }`}
                  onClick={() => handleSmartClick("no-app")}
                >
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    No Need App Control
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Connectivity */}
          <div className={`${matchedSpu ? "border-b border-solid border-[rgba(0,0,0,0.1)] pb-[24px]" : ""} content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full`}>
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[18px] text-[#101820] w-full">
              <span className="leading-[24px]">{"Connectivity. "}</span>
              <span className="leading-[24px] text-[rgba(0,0,0,0.4)]">
                Which is best for you?
              </span>
            </p>
            <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
              {availableConnectivityChoices.includes("interconnected") && (
                <div
                  className={`content-stretch flex items-center justify-center overflow-clip px-[16px] h-[56px] relative rounded-[12px] shrink-0 cursor-pointer transition-all duration-200 ${
                    connectivityChoice === "interconnected"
                      ? "border-2 border-solid border-[#ba0020]"
                      : "border-2 border-solid border-[rgba(0,0,0,0.2)]"
                  }`}
                  onClick={() => handleConnectivityClick("interconnected")}
                >
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    Need Interconnected
                  </p>
                </div>
              )}
              {availableConnectivityChoices.includes("standalone") && (
                <div
                  className={`content-stretch flex items-center justify-center overflow-clip px-[16px] h-[56px] relative rounded-[12px] shrink-0 cursor-pointer transition-all duration-200 ${
                    connectivityChoice === "standalone"
                      ? "border-2 border-solid border-[#ba0020]"
                      : "border-2 border-solid border-[rgba(0,0,0,0.2)]"
                  }`}
                  onClick={() => handleConnectivityClick("standalone")}
                >
                  <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    Just Standalone
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Animated SKU Section */}
          <div
            className="w-full"
            style={{
              display: "grid",
              gridTemplateRows: showSkuSection ? "1fr" : "0fr",
              transition:
                "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div className="overflow-hidden">
              <div
                className="flex flex-col gap-[24px] w-full"
                style={{
                  opacity: showSkuSection ? 1 : 0,
                  transform: showSkuSection
                    ? "translateY(0)"
                    : "translateY(8px)",
                  transition:
                    "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s",
                }}
              >
                {/* Package */}
                <div className="border-b border-solid border-[rgba(0,0,0,0.1)] content-stretch flex flex-col gap-[12px] items-start pb-[24px] relative shrink-0 w-full">
                  <div className="content-stretch flex items-start relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] min-h-px min-w-px not-italic relative text-[18px] text-[#101820]">
                      <span className="leading-[24px]">
                        {"Package. "}
                      </span>
                      <span className="leading-[24px] text-[rgba(0,0,0,0.4)]">
                        How much space do you need?
                      </span>
                    </p>
                  </div>
                  <div className="content-start flex flex-wrap gap-[8px] items-start relative shrink-0 w-full">
                    {allSkuOptions.map((opt, i) => {
                      const isSelected = selectedSkuIdx === i;
                      const showDiscount =
                        opt.discountEnabled && !!opt.discountPercent;
                      return (
                        <div
                          key={i}
                          className={`content-stretch flex gap-[4px] items-center justify-center overflow-clip px-[16px] h-[56px] relative rounded-[12px] shrink-0 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-2 border-solid border-[#ba0020]"
                              : "border-2 border-solid border-[rgba(0,0,0,0.2)]"
                          }`}
                          onClick={() => setSelectedSkuIdx(i)}
                          style={{
                            opacity: showSkuSection ? 1 : 0,
                            transform: showSkuSection
                              ? "translateY(0)"
                              : "translateY(6px)",
                            transition: `opacity 0.25s ease ${0.2 + i * 0.04}s, transform 0.25s ease ${0.2 + i * 0.04}s`,
                          }}
                        >
                          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                            {opt.name}
                          </p>
                          {showDiscount && (
                            <div className="bg-[rgba(183,17,37,0.1)] content-stretch flex items-center justify-center overflow-clip px-[4px] py-[2px] relative rounded-[4px] shrink-0">
                              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[#ba0020] whitespace-nowrap">
                                {opt.discountPercent}% OFF
                              </p>
                            </div>
                          )}
                          {!opt.includeBaseStation &&
                            targetConnectivity ===
                              "Base Station Interconnected (App)" && (
                              <svg
                                className="shrink-0"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                              >
                                <circle
                                  cx="10"
                                  cy="10"
                                  r="7.5"
                                  stroke="rgba(0,0,0,0.4)"
                                  strokeWidth="1.2"
                                />
                                <path
                                  d="M10 9v4"
                                  stroke="rgba(0,0,0,0.4)"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                />
                                <circle
                                  cx="10"
                                  cy="7"
                                  r="0.75"
                                  fill="rgba(0,0,0,0.4)"
                                />
                              </svg>
                            )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="content-stretch flex h-[58px] items-center justify-between relative shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0">
                    <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                      {hasDiscount ? (
                        <>
                          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-[#ba0020] whitespace-nowrap">
                            ${discountedPrice.toFixed(2)}
                          </p>
                          <div className="bg-[rgba(183,17,37,0.1)] content-stretch flex items-center justify-center overflow-clip px-[4px] py-[2px] relative rounded-[4px] shrink-0">
                            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[#ba0020] whitespace-nowrap">
                              {discountPct}% OFF
                            </p>
                          </div>
                          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.3)] line-through whitespace-nowrap">
                            ${skuPrice.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[36px] not-italic relative shrink-0 text-[26px] text-[#101820] whitespace-nowrap">
                          {skuPrice > 0 ? `$${skuPrice.toFixed(2)}` : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
                    <button className="shadow-[inset_0_0_0_2px_#101820] content-stretch flex gap-[8px] items-center justify-center max-w-[240px] min-h-[56px] min-w-[180px] px-[24px] py-[16px] relative rounded-[50px] shrink-0 cursor-pointer bg-transparent border-none hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#101820"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-[#101820] text-center whitespace-nowrap">
                        Learn More
                      </p>
                    </button>
                    <button className="bg-[#ba0020] content-stretch flex gap-[8px] items-center justify-center max-w-[240px] min-h-[56px] min-w-[180px] px-[24px] py-[16px] relative rounded-[50px] shrink-0 cursor-pointer border-none hover:bg-[#a0001a] transition-colors">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[16px] text-white text-center whitespace-nowrap">
                        Add to Cart
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Product Card ========== */

function ModelCard({
  card,
  minPrice,
  onSelectClick,
}: {
  card: ProductCardItem;
  minPrice: string;
  onSelectClick: () => void;
}) {
  return (
    <div className="flex flex-[1_0_0] flex-row items-center self-stretch cursor-pointer" onClick={onSelectClick}>
      <div className="group content-stretch flex flex-[1_0_0] flex-col h-[480px] items-center justify-between min-h-px min-w-px overflow-clip p-[24px] relative rounded-[24px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full"
          src={card.coverImageUrl}
        />
        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full z-[1]">
          <div className="content-stretch flex gap-[4px] items-end not-italic relative shrink-0 w-full">
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[34px] relative shrink-0 text-[24px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
              {card.name}
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal h-[24px] leading-[22px] relative shrink-0 text-[16px] text-[#101820] w-[46px]">
              series
            </p>
          </div>
          {(card.sellingPoint1 || card.sellingPoint2) && (
            <div className="content-stretch flex flex-col items-start justify-end relative shrink-0 w-[279px] gap-[4px]">
              {card.sellingPoint1 && (
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <div className="bg-[#ba0020] rounded-[27px] shrink-0 size-[8px]" />
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    {card.sellingPoint1}
                  </p>
                </div>
              )}
              {card.sellingPoint2 && (
                <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                  <div className="bg-[#067AD9] rounded-[27px] shrink-0 size-[8px]" />
                  <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.9)] whitespace-nowrap">
                    {card.sellingPoint2}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full z-[1]">
          <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
            <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[18px] text-black whitespace-nowrap">
              {minPrice ? `From ${minPrice}` : "\u00A0"}
            </p>
            <div
              className="bg-[#ba0020] content-stretch flex gap-0 h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 hover:bg-[#a0001a] transition-all duration-300 ease-in-out group-hover:gap-[4px]"
            >
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white text-center whitespace-nowrap">
                Select
              </p>
              <svg
                className="shrink-0 overflow-hidden max-w-0 opacity-0 group-hover:max-w-[20px] group-hover:opacity-100 transition-all duration-300 ease-in-out"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.167 10h11.666M10.833 5l5 5-5 5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Shopping Guide Card ========== */

function GuideCard({ guide, onClick }: { guide: GuideItem; onClick?: () => void }) {
  return (
    <div className="group/guide flex flex-[1_0_0] flex-row items-center self-stretch cursor-pointer" onClick={onClick}>
      <div className="bg-[#f6f6f6] content-stretch flex flex-[1_0_0] flex-col h-full items-start min-h-px min-w-px overflow-clip relative rounded-[24px]">
        <div className="content-stretch flex flex-col gap-[4px] items-start p-[24px] relative shrink-0 w-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[12px] text-[rgba(0,0,0,0.54)] w-full">
            {guide.tag}
          </p>
          <div className="content-stretch flex items-end relative shrink-0 w-full">
            <p className="flex-[1_0_0] font-['Inter:Bold',sans-serif] font-bold leading-[34px] min-h-px min-w-px not-italic relative text-[24px] text-[rgba(0,0,0,0.9)]">
              {guide.title}
            </p>
          </div>
        </div>
        <div className="flex-[1_0_0] min-h-px min-w-px relative w-full overflow-hidden">
          {guide.coverImageUrl && (
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full transition-transform duration-300 ease-in-out group-hover/guide:scale-105"
              src={guide.coverImageUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ========== Guide Detail Dialog (PC) ========== */

function GuideDetailDialog({
  open,
  guide,
  onClose,
}: {
  open: boolean;
  guide: GuideItem;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(false));
      });
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      setAnimating(false);
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, handleClose]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [visible]);

  if (!visible) return null;

  const isOpen = open && !animating;
  const tocLines = guide.tableOfContents?.split("\n").filter((l) => l.trim()) ?? [];

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen ? "bg-[rgba(0,0,0,0.2)] opacity-100" : "bg-[rgba(0,0,0,0)] opacity-0"
      }`}
      style={{ padding: "0 clamp(24px, 8vw, 120px)" }}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
    >
      <div
        className={`bg-white flex flex-col items-center w-[720px] max-h-[90vh] overflow-clip rounded-[32px] transition-all duration-300 ease-in-out ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex items-start justify-end pt-[32px] px-[32px] shrink-0 w-full">
          <button
            className="shrink-0 size-[40px] opacity-40 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
            onClick={handleClose}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                clipRule="evenodd"
                d="M16.6667 0C25.8714 0 33.3333 7.46192 33.3333 16.6667C33.3333 25.8714 25.8714 33.3333 16.6667 33.3333C7.46192 33.3333 0 25.8714 0 16.6667C0 7.46192 7.46192 0 16.6667 0ZM16.6667 14.5707L11.8236 9.72765L9.72765 11.8218L14.5725 16.6667L9.72765 21.5133L11.8218 23.6075L16.6667 18.7609L21.5133 23.6075L23.6075 21.5115L18.7627 16.6667L23.6075 11.8236L22.5604 10.7747L21.5115 9.72765L16.6667 14.5707Z"
                fill="black"
                fillOpacity="0.54"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto w-full">
          <div className="flex flex-col gap-[24px] items-start px-[76px] pb-[32px] w-full">
            {/* Body Title */}
            {guide.bodyTitle && (
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[44px] text-[32px] text-[#101820] w-full">
                {guide.bodyTitle}
              </p>
            )}

            {/* Body Content */}
            {guide.bodyContent && (
              <div className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-black leading-[20px] w-full whitespace-pre-line">
                {guide.bodyContent}
              </div>
            )}

            {/* Table of Contents */}
            {tocLines.length > 0 && (
              <div className="bg-[#f6f6f6] flex flex-col gap-[12px] items-start p-[12px] rounded-[12px] text-[14px] text-black w-full">
                <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] w-full">
                  Table of Contents
                </p>
                <ul className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] list-disc w-full m-0 pl-[21px]">
                  {tocLines.map((line, i) => (
                    <li key={i} className="mb-0">
                      <span className="leading-[20px]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Link Text */}
            {guide.linkText && (
              guide.linkUrl ? (
                <a
                  href={guide.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] text-[#ba0020] whitespace-nowrap no-underline hover:underline"
                >
                  {guide.linkText}{" >"}
                </a>
              ) : (
                <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] text-[16px] text-[#ba0020] whitespace-nowrap">
                  {guide.linkText}{" >"}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Small Bulk Section ========== */

function SmallBulkSection() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] w-full">
        <span className="leading-[36px] text-[#067ad9] text-[26px]">
          Small Bulk.
        </span>
        <span className="leading-[36px] text-[26px]">&nbsp;</span>
        <span className="leading-[36px] text-[26px] text-[rgba(0,0,0,0.4)]">
          Bulk Buying, Bigger Savings
        </span>
      </p>
      <div className="h-[360px] relative shrink-0 w-full">
        <div
          className="content-stretch flex flex-col h-full items-start overflow-clip p-[24px] relative rounded-[24px]"
          style={{ width: "calc((100% - 24px) / 2)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[24px]"
          >
            <div className="absolute bg-[#f6f6f6] inset-0 rounded-[24px]" />
            <img
              alt=""
              className="absolute max-w-none object-cover rounded-[24px] size-full"
              src="/images/smallbulk-card-bg.jpg"
            />
          </div>
          <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full z-[1]">
            <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[rgba(255,255,255,0.9)] w-full" style={{ textShadow: "0px 0px 8px rgba(29,35,45,0.24)" }}>
              <div className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[32px] w-full">
                <p className="leading-[44px] mb-0">Bulk Buying.</p>
                <p className="leading-[44px]">Bigger Savings.</p>
              </div>
              <div className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[16px] w-full">
                <p className="leading-[22px] mb-0">
                  Self-serve wholesale ordering with exclusive bulk
                </p>
                <p className="leading-[22px]">
                  discounts and fast, streamlined checkout.
                </p>
              </div>
            </div>
            <div className="bg-[#067ad9] content-stretch flex gap-[4px] h-[40px] items-center justify-center px-[16px] py-[8px] relative rounded-[50px] shrink-0 cursor-pointer hover:bg-[#0568b8] transition-colors">
              <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-white text-center whitespace-nowrap">
                Learn More
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Tab Bar ========== */

type TabId = "models" | "guides" | "bulk";

function TabBar({
  activeTab,
  onTabClick,
}: {
  activeTab: TabId;
  onTabClick: (tab: TabId) => void;
}) {
  return (
    <div className="content-stretch flex gap-[24px] h-[64px] items-center relative shrink-0 w-full">
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("models")}
      >
        <p
          className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
            activeTab === "models"
              ? "text-[rgba(0,0,0,0.9)]"
              : "text-[rgba(0,0,0,0.54)]"
          }`}
        >
          All Models
        </p>
        {activeTab === "models" && (
          <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("guides")}
      >
        <p
          className={`font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
            activeTab === "guides"
              ? "text-[rgba(0,0,0,0.9)]"
              : "text-[rgba(0,0,0,0.54)]"
          }`}
        >
          Shopping guides
        </p>
        {activeTab === "guides" && (
          <div className="absolute bg-[#ba0020] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
      <div
        className="content-stretch flex gap-[10px] h-full items-center py-[10px] relative shrink-0 cursor-pointer"
        onClick={() => onTabClick("bulk")}
      >
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[#067ad9] whitespace-nowrap">
          Small Bulk
        </p>
        {activeTab === "bulk" && (
          <div className="absolute bg-[#067ad9] bottom-0 h-[2px] left-0 right-0" />
        )}
      </div>
    </div>
  );
}

/* ========== Main Page Component ========== */

export default function SmokeAlarmsNewPage() {
  const handleShopTitleAnimationComplete = useCallback(() => {
    console.log("All letters have animated!");
  }, []);
  const { products, loading: productsLoading } = useProducts();
  const { cards, loading: cardsLoading } = useProductCards();
  const { guides, loading: guidesLoading } = useGuides("smoke-alarms");
  const { spus } = useSpus();

  const smokeProducts = products.filter(
    (p) => !p.categoryId || p.categoryId === "smoke-alarms"
  );

  const [activeTab, setActiveTab] = useState<TabId>("models");
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [selectCard, setSelectCard] = useState<ProductCardItem | null>(null);
  const [guideDialogOpen, setGuideDialogOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const modelsRef = useRef<HTMLDivElement>(null);
  const guidesRef = useRef<HTMLDivElement>(null);
  const bulkRef = useRef<HTMLDivElement>(null);

  const handleTabClick = useCallback((tab: TabId) => {
    setActiveTab(tab);
    const refMap: Record<TabId, React.RefObject<HTMLDivElement | null>> = {
      models: modelsRef,
      guides: guidesRef,
      bulk: bulkRef,
    };
    const el = refMap[tab]?.current;
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offset = 140;
      const bulkTop = bulkRef.current?.getBoundingClientRect().top ?? Infinity;
      const guidesTop =
        guidesRef.current?.getBoundingClientRect().top ?? Infinity;
      if (bulkTop < offset) {
        setActiveTab("bulk");
      } else if (guidesTop < offset) {
        setActiveTab("guides");
      } else {
        setActiveTab("models");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white relative size-full">
      <GlobalNav />
      <div className="pt-[104px]">
        <div className="content-stretch flex flex-col items-center px-[120px] py-[60px] relative shrink-0 w-full">
          <div className="content-stretch flex flex-col gap-[32px] items-center max-w-[1312px] relative shrink-0 w-full">
            {/* Title */}
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
              <SplitText
                text="Shop Smoke Alarm"
                className="font-['Inter:Bold',sans-serif] font-bold leading-[72px] not-italic relative shrink-0 text-[56px] text-black whitespace-nowrap"
                delay={50}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleShopTitleAnimationComplete}
              />
            </div>

            {/* Tab Bar */}
            <TabBar activeTab={activeTab} onTabClick={handleTabClick} />

            {/* Sections Container */}
            <div className="content-stretch flex flex-col gap-[48px] items-start relative shrink-0 w-full">
              {/* All Models Section */}
              <div
                ref={modelsRef}
                className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
              >
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] w-full">
                  <span className="leading-[36px] text-[26px]">
                    All models.
                  </span>
                  <span className="leading-[36px] text-[26px] text-[rgba(0,0,0,0.4)]">
                    {" Take your pick."}
                  </span>
                </p>
                <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
                  {cardsLoading || productsLoading ? (
                    <>
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                      <ProductCardSkeleton />
                    </>
                  ) : cards.length > 0 ? (
                    cards.map((card) => (
                      <ModelCard
                        key={card.id}
                        card={card}
                        minPrice={getMinPriceForCard(card, smokeProducts)}
                        onSelectClick={() => {
                          setSelectCard(card);
                          setSelectModalOpen(true);
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-[rgba(0,0,0,0.4)] text-[16px] py-[40px]">
                      No product cards configured yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Shopping Guides Section */}
              <div
                ref={guidesRef}
                className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full"
              >
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[#101820] whitespace-nowrap">
                  <span className="leading-[36px] text-[26px]">
                    {"Shopping guides. "}
                  </span>
                  <span className="leading-[36px] text-[26px] text-[rgba(0,0,0,0.4)]">
                    Choose the Smoke Detector That Fits You Best
                  </span>
                </p>
                <div className="content-stretch flex gap-[24px] h-[374px] items-center relative shrink-0 w-full">
                  {guidesLoading ? (
                    <>
                      <GuideCardSkeleton />
                      <GuideCardSkeleton />
                      <GuideCardSkeleton />
                      <GuideCardSkeleton />
                    </>
                  ) : guides.length > 0 ? (
                    guides.map((guide) => (
                      <GuideCard
                        key={guide.id}
                        guide={guide}
                        onClick={() => {
                          if (guide.tag?.toUpperCase().includes("COMPARE")) {
                            setCompareOpen(true);
                          } else {
                            setSelectedGuide(guide);
                            setGuideDialogOpen(true);
                          }
                        }}
                      />
                    ))
                  ) : (
                    <p className="text-[rgba(0,0,0,0.4)] text-[16px] py-[40px]">
                      No shopping guides available.
                    </p>
                  )}
                </div>
              </div>

              {/* Small Bulk Section */}
              <div ref={bulkRef} className="w-full">
                <SmallBulkSection />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Select Modal */}
      {selectCard && (
        <SelectModal
          open={selectModalOpen}
          onClose={() => setSelectModalOpen(false)}
          card={selectCard}
          products={smokeProducts}
          spus={spus}
        />
      )}

      {/* Guide Detail Dialog */}
      {selectedGuide && (
        <GuideDetailDialog
          open={guideDialogOpen}
          guide={selectedGuide}
          onClose={() => setGuideDialogOpen(false)}
        />
      )}

      {/* Compare Dialog */}
      <CompareDialog
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        categoryId="smoke-alarms"
      />
    </div>
  );
}
