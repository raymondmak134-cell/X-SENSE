const CLOSE_ICON_PATH =
  "M16.6667 0C25.8714 0 33.3333 7.46192 33.3333 16.6667C33.3333 25.8714 25.8714 33.3333 16.6667 33.3333C7.46192 33.3333 0 25.8714 0 16.6667C0 7.46192 7.46192 0 16.6667 0ZM16.6667 14.5707L11.8236 9.72765L9.72765 11.8218L14.5725 16.6667L9.72765 21.5133L11.8218 23.6075L16.6667 18.7609L21.5133 23.6075L23.6075 21.5115L18.7627 16.6667L23.6075 11.8236L22.5604 10.7747L21.5115 9.72765L16.6667 14.5707Z";

export default function ModalCloseButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        className ??
        "absolute top-[32px] right-[32px] z-10 shrink-0 size-[40px] opacity-40 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
      }
    >
      <svg width="33" height="33" viewBox="0 0 33.3333 33.3333" fill="none">
        <path
          clipRule="evenodd"
          d={CLOSE_ICON_PATH}
          fill="black"
          fillOpacity="0.54"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
