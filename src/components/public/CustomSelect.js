export default function CustomSelect({
  id,
  label,
  labelClass,
  fieldClass,
  valueLabel,
  isOpen,
  onToggle,
  children,
  maxHeight = false,
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <button
          id={id}
          type="button"
          onClick={onToggle}
          className={`${fieldClass} flex cursor-pointer items-center justify-between pr-4 text-left`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span>{valueLabel}</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen ? (
          <div
            className={`absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] p-2 shadow-[0_18px_50px_rgba(28,27,26,0.14)] ${
              maxHeight ? "max-h-72" : ""
            }`}
            role="listbox"
          >
            <div className="flex flex-col gap-2">{children}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
