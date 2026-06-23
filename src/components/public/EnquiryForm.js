import ConfirmationState from "./ConfirmationState";
import CustomSelect from "./CustomSelect";

export default function EnquiryForm({
  enquiryRef,
  success,
  formError,
  formData,
  submitting,
  openDropdown,
  setOpenDropdown,
  setFormData,
  handleInputChange,
  handleSubmit,
  labelClass,
  fieldClass,
  openTrips,
  groupOptions,
  selectedTripLabel,
  selectedGroupLabel,
  getTripTitle,
}) {
  return (
    <section
      id="enquiry"
      ref={enquiryRef}
      className="scroll-mt-24 bg-[#FFFBF5] pt-8 pb-16 w-full font-poppins sm:pt-12 sm:pb-24 md:pt-16 md:pb-28"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-12">
        <div className={`grid gap-8 sm:gap-10 items-start ${success ? "lg:grid-cols-1" : "lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"}`}>
          {!success ? (
            <div className="lg:sticky lg:top-32">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D55D27]">
              Send an Enquiry
            </p>
            <h2 className="max-w-xl text-3xl leading-[1.2] font-normal tracking-tight text-[#1C1B1A] sm:text-4xl md:text-5xl">
              Share a few details and we will help you choose well
            </h2>
            <div className="mt-6 h-[1px] w-12 bg-[#D55D27]/30" />
            <p className="mt-6 max-w-md text-sm leading-relaxed font-light text-[#1C1B1A]/65">
              This is not an automated booking flow. Your note helps our team
              understand the trip, pace, and group style that would suit you.
            </p>
            <div className="mt-6 grid max-w-md gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-1">
              {[
                [
                  "01",
                  "A real person reads it",
                  "We look at your pace, comfort, and the kind of group you want.",
                ],
                [
                  "02",
                  "We guide the next step",
                  "You will hear from the team with the most suitable route or opening.",
                ],
              ].map(([number, title, copy]) => (
                <div
                  key={title}
                  className="rounded-[22px] border border-[#D1B788]/35 bg-[#F4EFE6]/55 p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="h-px w-10 bg-[#D55D27]/40" />
                    <span className="text-xl font-light italic text-[#D55D27]/35">
                      {number}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-[#1C1B1A]">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs font-light leading-6 text-[#1C1B1A]/62">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
          ) : null}

          <div className="rounded-[28px] border border-[#D1B788]/25 bg-[#F4EFE6] p-5 sm:p-8 md:p-10 shadow-[0_24px_68px_-20px_rgba(28,27,26,0.05)] font-poppins">
            {success ? (
              <ConfirmationState />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {formError ? (
                  <div className="rounded-xl border border-[#D55D27]/20 bg-white/80 p-4 text-xs font-medium text-[#D55D27]">
                    {formError}
                  </div>
                ) : null}

                <div>
                  <label htmlFor="name" className={labelClass}>
                    Your name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={fieldClass}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <div className="grid grid-cols-[135px_1fr] gap-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown((current) =>
                            current === "country" ? null : "country",
                          )
                        }
                        className={`${fieldClass} flex cursor-pointer items-center justify-between pr-3 text-left`}
                        aria-haspopup="listbox"
                        aria-expanded={openDropdown === "country"}
                      >
                        <span>India (+91)</span>
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

                      {openDropdown === "country" ? (
                        <div
                          className="absolute z-50 mt-2 w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] p-2 shadow-[0_18px_50px_rgba(28,27,26,0.14)]"
                          role="listbox"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenDropdown(null)}
                            className="block w-full rounded-lg bg-[#1C1B1A] px-4 py-3 text-left text-sm text-[#FFFBF5] transition"
                            role="option"
                            aria-selected="true"
                          >
                            India (+91)
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={fieldClass}
                      placeholder="98765 43210"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email, optional
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={fieldClass}
                    placeholder="Your email address"
                    autoComplete="email"
                  />
                </div>

                <CustomSelect
                  id="trip_id"
                  label="Which trip"
                  labelClass={labelClass}
                  fieldClass={fieldClass}
                  valueLabel={selectedTripLabel}
                  isOpen={openDropdown === "trip"}
                  onToggle={() =>
                    setOpenDropdown((current) =>
                      current === "trip" ? null : "trip",
                    )
                  }
                  maxHeight
                >
                  {[{ id: "", name: "Not sure yet" }, ...openTrips].map(
                    (trip) => {
                      const value = trip.id;
                      const selected =
                        String(formData.trip_id || "") === String(value);

                      return (
                        <button
                          key={value || "not-sure"}
                          type="button"
                          onClick={() => {
                            setFormData((current) => ({
                              ...current,
                              trip_id: value,
                            }));
                            setOpenDropdown(null);
                          }}
                          className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "bg-[#1C1B1A] text-[#FFFBF5]"
                              : "text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-[#FFFBF5]"
                          }`}
                          role="option"
                          aria-selected={selected}
                        >
                          {value ? getTripTitle(trip) : trip.name}
                        </button>
                      );
                    },
                  )}
                </CustomSelect>

                <CustomSelect
                  id="group_type"
                  label="Who is travelling"
                  labelClass={labelClass}
                  fieldClass={fieldClass}
                  valueLabel={selectedGroupLabel}
                  isOpen={openDropdown === "group"}
                  onToggle={() =>
                    setOpenDropdown((current) =>
                      current === "group" ? null : "group",
                    )
                  }
                >
                  {groupOptions.map((option) => {
                    const selected = formData.group_type === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData((current) => ({
                            ...current,
                            group_type: option.value,
                          }));
                          setOpenDropdown(null);
                        }}
                        className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                          selected
                            ? "bg-[#1C1B1A] text-[#FFFBF5]"
                            : "text-[#1C1B1A] hover:bg-[#1C1B1A] hover:text-[#FFFBF5]"
                        }`}
                        role="option"
                        aria-selected={selected}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </CustomSelect>

                <div>
                  <label htmlFor="preferred_month" className={labelClass}>
                    Preferred month, optional
                  </label>
                  <input
                    id="preferred_month"
                    name="preferred_month"
                    type="text"
                    value={formData.preferred_month}
                    onChange={handleInputChange}
                    className={fieldClass}
                    placeholder="For example, October"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label htmlFor="note" className={labelClass}>
                    What are you hoping this trip feels like?
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={4}
                    value={formData.note}
                    onChange={handleInputChange}
                    className={`${fieldClass} resize-none leading-relaxed`}
                    placeholder="Tell us about the pace, mood, or experience you are looking for."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#D55D27] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFFBF5] transition-all duration-300 hover:bg-[#1C1B1A] hover:shadow-md disabled:cursor-not-allowed disabled:bg-[#D1B788]/50"
                  >
                    {submitting ? "Sending..." : "Send Enquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
