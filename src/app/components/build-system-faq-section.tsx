import { useCallback, useState } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "My alarm is going off for no reason, what should I do?",
    answer:
      'The alarm "sounds" or displays an alarm signal when it detects smoke or other adverse conditions. The siren emits different sounds for different alarm types. See below:\n1. Smoke alarm sound or flashing red LED indicator\n2. CO alarm: sound or flashing red LED indicator\n3. Combination alarm: sound or flashing red LED indicator\n4. Heat alarm: sound or flashing red LED indicator\nIf there is no fire or gas leak, the alarm may be triggered by dust, steam, or cooking fumes. Ventilate the area and press the test/hush button if available.',
  },
  {
    id: "faq-2",
    question: "Where should I install my smoke detector?",
    answer:
      "Install smoke detectors on every level of your home, inside each bedroom, and outside sleeping areas. Mount them on the ceiling or high on a wall, at least 4 inches from the nearest wall if ceiling-mounted. Keep detectors at least 10 feet away from cooking appliances to reduce false alarms.",
  },
  {
    id: "faq-3",
    question: "Why is my alarm suddenly flashing and beeping? What do these alarm signals mean?",
    answer:
      "Flashing lights and beeping patterns indicate different conditions: a single chirp every 30–60 seconds usually means a low battery; a continuous loud alarm means smoke, CO, or another hazard has been detected; rapid flashing with beeping may indicate a malfunction. Refer to your product manual for the exact signal pattern of your model.",
  },
  {
    id: "faq-4",
    question: "Why doesn't my smoke detector respond when I test it?",
    answer:
      "If the test button does not trigger the alarm, check that the device is properly powered — replace batteries or confirm wired power. Ensure the detector is fully seated on its mounting bracket. If the unit still does not respond after battery replacement, the sensor may have reached end of life and the unit should be replaced.",
  },
  {
    id: "faq-5",
    question: "What is the lifespan of a smoke detector?",
    answer:
      "Most smoke detectors should be replaced every 10 years from the date of manufacture, regardless of whether they still pass a button test. The sensing chamber degrades over time and may not detect smoke reliably after the recommended service life.",
  },
  {
    id: "faq-6",
    question: "How often should I replace the batteries in my smoke detector?",
    answer:
      "Replace batteries at least once a year, or immediately when the low-battery chirp sounds. We recommend using the battery type specified in your product manual and testing the alarm monthly after replacement.",
  },
  {
    id: "faq-7",
    question: "What are the different types of smoke detectors available?",
    answer:
      "The two main sensor types are ionization and photoelectric. Ionization detectors respond faster to flaming fires, while photoelectric detectors respond faster to smoldering fires. Combination alarms detect both smoke and carbon monoxide. Choose the type best suited to each area of your home.",
  },
  {
    id: "faq-8",
    question: "How can I reduce false alarms from my smoke detector?",
    answer:
      "Install detectors away from kitchens, bathrooms, and HVAC vents. Use a photoelectric detector near cooking areas, keep the sensor clean of dust and insects, and ensure adequate ventilation when cooking or showering. Never disable an alarm — relocate it if false alarms persist.",
  },
];

function FaqChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 transition-transform duration-[400ms] ease-in-out"
      style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
      aria-hidden
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqAccordionItem({
  item,
  isExpanded,
  onToggle,
  isLast,
}: {
  item: FaqItem;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={!isLast ? "border-b border-[rgba(0,0,0,0.1)]" : undefined}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-[8px] py-[24px] text-left"
      >
        <span className="font-['Inter',sans-serif] text-[18px] font-semibold leading-[24px] text-[rgba(0,0,0,0.9)]">
          {item.question}
        </span>
        <FaqChevronIcon expanded={isExpanded} />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-[400ms] ease-in-out"
        style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-[24px]">
            <p className="whitespace-pre-line font-['Inter',sans-serif] text-[16px] font-normal leading-[22px] text-[rgba(0,0,0,0.9)]">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildSystemFaqSection() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-0 py-[64px]">
        <h2 className="font-['Inter',sans-serif] text-[32px] font-bold leading-[44px] text-[rgba(0,0,0,0.9)]">
          Questions? Answers.
        </h2>

        <div className="mt-[24px] rounded-[24px] bg-[#f6f6f6] px-[40px] pt-[16px] pb-[16px]">
          {FAQ_ITEMS.map((item, index) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isExpanded={expandedIds.has(item.id)}
              onToggle={() => handleToggle(item.id)}
              isLast={index === FAQ_ITEMS.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
