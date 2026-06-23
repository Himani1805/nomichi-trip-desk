"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import FloatingActions from "@/components/FloatingActions";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  trip_id: "",
  group_type: "solo",
  preferred_month: "",
  note: "",
};

const labelClass =
  "block text-[11px] font-semibold tracking-[0.12em] uppercase text-[#1C1B1A]/50 mb-1.5 font-poppins";
const fieldClass =
  "w-full rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5]/90 px-4 py-3 text-sm font-light text-[#1C1B1A] placeholder-[#1C1B1A]/30 transition-all duration-300 focus:border-[#D55D27] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#D55D27]/5 font-poppins shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]";

const groupOptions = [
  { value: "solo", label: "Solo" },
  { value: "friends", label: "Friends" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
];

function getTripTitle(trip) {
  return trip?.title || trip?.name || "Nomichi Journey";
}

function getTripLocation(trip) {
  return trip?.location || trip?.destination || "Curated route";
}

function formatTripDates(trip) {
  const startValue = trip?.start_date || trip?.startDate || trip?.date_start;
  const endValue = trip?.end_date || trip?.endDate || trip?.date_end;

  if (startValue === undefined || startValue === null || startValue === "") {
    return "Dates shared after curation";
  }

  const start = new Date(startValue);
  const end = endValue ? new Date(endValue) : null;

  if (Number.isNaN(start.getTime())) {
    return String(startValue);
  }

  const dateOptions = { day: "numeric", month: "short", year: "numeric" };
  const startText = start.toLocaleDateString("en-IN", dateOptions);

  if (end === null || Number.isNaN(end.getTime())) {
    return startText;
  }

  return `${startText} - ${end.toLocaleDateString("en-IN", dateOptions)}`;
}

function formatTripPrice(price) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Price on request";
  }

  return `\u20B9${numericPrice.toLocaleString("en-IN")} incl. GST`;
}

export default function PublicLeadCapturePage() {
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [tripsError, setTripsError] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNavShadow, setShowNavShadow] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const journeysRef = useRef(null);
  const enquiryRef = useRef(null);

  useEffect(() => {
    function handleScroll() {
      setShowNavShadow(window.scrollY === 0);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openTrips = useMemo(() => {
    return trips.filter(
      (trip) => String(trip.status || "open").toLowerCase() === "open",
    );
  }, [trips]);

  const selectedTrip = openTrips.find(
    (trip) => String(trip.id) === String(formData.trip_id),
  );
  const selectedTripLabel = selectedTrip
    ? getTripTitle(selectedTrip)
    : "Not sure yet";
  const selectedGroupLabel =
    groupOptions.find((option) => option.value === formData.group_type)
      ?.label || "Solo";

  useEffect(() => {
    let active = true;

    async function loadTrips() {
      setTripsLoading(true);
      setTripsError("");

      try {
        const response = await fetch("/api/trips", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const payload = await response.json();

        if (response.ok === false) {
          throw new Error(
            payload.error || "We could not load journeys right now.",
          );
        }

        const fetchedTrips = Array.isArray(payload.data) ? payload.data : [];
        const firstOpenTrip = fetchedTrips.find(
          (trip) => String(trip.status || "open").toLowerCase() === "open",
        );

        if (active === true) {
          setTrips(fetchedTrips);
          setFormData((current) => ({
            ...current,
            trip_id: current.trip_id || firstOpenTrip?.id || "",
          }));
        }
      } catch (error) {
        if (active === true) {
          setTripsError(
            error.message || "We could not load journeys right now.",
          );
        }
      } finally {
        if (active === true) {
          setTripsLoading(false);
        }
      }
    }

    loadTrips();

    return () => {
      active = false;
    };
  }, []);

  function scrollTo(ref) {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function selectJourney(tripId) {
    setFormData((current) => ({ ...current, trip_id: tripId }));
    scrollTo(enquiryRef);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSubmitting(true);

    const cleanPhone = formData.phone.replace(/[^0-9]/g, "");

    if (formData.name.trim() === "" || cleanPhone.length < 10) {
      setFormError("Please share your name and a valid phone number.");
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || `guest-${cleanPhone}@nomichi.invalid`,
      trip_id: formData.trip_id || null,
      preferred_month: formData.preferred_month.trim(),
      note: formData.note.trim(),
    };

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (response.ok === false) {
        throw new Error(
          result.error || "We could not send your enquiry. Please try again.",
        );
      }

      setSuccess(true);
      setFormData(initialFormData);
    } catch (error) {
      setFormError(
        error.message || "We could not send your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FFFBF5] text-[#1C1B1A]"
      style={{ fontFamily: '"Poppins", sans-serif' }}
    >
      <nav className="relative z-50 bg-[#FFFBF5]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-1 text-2xl font-light tracking-[0.22em] text-[#1C1B1A]"
          >
            <span>NOMICHI</span>
            <span
              className="mt-1 h-2.5 w-2.5 rounded-full bg-[#D55D27]"
              aria-hidden="true"
            />
          </Link>

          <div className="flex items-center gap-4 sm:gap-8">
            <Link
              href="/admin"
              className="hidden min-h-11 items-center text-[13px] font-medium tracking-[0.08em] text-[#1C1B1A] transition hover:text-[#D55D27] sm:inline-flex"
            >
              Admin Dashboard
            </Link>
            <button
              type="button"
              onClick={() => scrollTo(enquiryRef)}
              className="min-h-11 rounded-md border border-[#D55D27] px-5 py-2.5 text-[13px] font-semibold tracking-[0.06em] text-[#D55D27] transition hover:border-[#D55D27] hover:bg-[#D55D27] hover:text-[#FFFBF5] sm:px-7"
            >
              Enquire Now
            </button>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[#D1B788]/45 transition-opacity duration-300 ${
            showNavShadow ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-full h-8 bg-gradient-to-b from-[#D1B788]/18 to-transparent transition-opacity duration-300 ${
            showNavShadow ? "opacity-100" : "opacity-0"
          }`}
        />
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pt-10 pb-14 sm:px-10 md:pt-14 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-16">
          <div className="relative z-20 flex w-full max-w-[540px] flex-col justify-center py-6 lg:col-span-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D55D27]">
              CRAFTING MEANINGFUL JOURNEYS FOR THE THOUGHTFUL TRAVELER
            </p>

            <h1 className="text-4xl font-light leading-[1.2] tracking-tight text-[#1C1B1A] sm:text-5xl md:text-[54px] lg:text-6xl">
              Stop just moving. <br />
              <span className="text-[#D55D27] font-medium">
                Start belonging
              </span>{" "}
              <br />
              to the world.
            </h1>

            <p className="mt-6 max-w-[460px] text-sm font-light leading-7 text-[#1C1B1A]/70">
              Experience travel the way it was meant to be, intentional,
              immersive, and deeply personal. With{" "}
              <span className="font-medium text-[#1C1B1A]">Nomichi</span>, step
              into hand-picked heritage stays and curated trails led by local
              hosts. We design journeys that stay with you long after you return
              home.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => scrollTo(enquiryRef)}
                className="rounded-xl bg-[#D55D27] px-8 py-4 text-sm font-semibold text-[#FFFBF5] shadow-[0_18px_34px_rgba(213,93,39,0.22)] transition hover:bg-[#1C1B1A]"
              >
                Send an Enquiry
              </button>

              <button
                type="button"
                onClick={() => scrollTo(journeysRef)}
                className="group inline-flex items-center gap-3 px-2 py-3 text-sm font-semibold text-[#1C1B1A] transition hover:text-[#D55D27]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D55D27]/10 text-[#D55D27] transition-all duration-300 group-hover:bg-[#D55D27] group-hover:text-white">
                  <span className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-[#D55D27] transition-colors duration-300 group-hover:border-l-white" />
                </span>
                <span className="font-semibold">View Open Trips</span>
              </button>
            </div>
          </div>

          <div className="relative flex min-h-[460px] lg:min-h-[500px] w-full items-stretch justify-center lg:col-span-6 overflow-visible">
            <div className="pointer-events-none absolute inset-0 z-0 rounded-tl-[72px] rounded-tr-[138px] rounded-br-[32px] rounded-bl-[72px] bg-[#F4EFE6]" />

            <div className="pointer-events-none absolute -bottom-[15px] z-20 h-[135%] md:h-[145%] w-[120%] select-none">
              <Image
                src="/hero-traveler.png"
                alt="Nomichi Traveler"
                fill
                priority
                sizes="(max-w-lg) 100vw, 50vw"
                className="object-contain object-bottom select-none drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="why-nomichi" className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="rounded-[40px] bg-[#F4EFE6] p-8 sm:p-12 lg:p-16">
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
            {[
              [
                "01",
                "Not a checklist, an emotion",
                "We swap rushed tourist traps for slower mornings, hidden local alleys, and days that let you actually breathe and absorb the destination.",
              ],
              [
                "02",
                "Scouted by real feet",
                "Every homestay, secret viewpoint, and native host is personally vetted by us. No algorithmic recommendations, just pure, lived experiences.",
              ],
              [
                "03",
                "With you, all the way",
                "We don’t just book tickets and disappear. From managing unexpected detours to finding a midnight local tea stall, our team is on the ground with you.",
              ],
            ].map(([number, title, copy]) => (
              <article
                key={title}
                className="group relative flex flex-col pt-8"
              >
                <div className="absolute top-0 left-0 h-[1px] w-12 bg-[#D55D27]/40 transition-all duration-500 group-hover:w-full group-hover:bg-[#D55D27]" />
                <div className="flex items-baseline justify-between gap-2">
                  <h2 className="text-lg font-medium tracking-tight text-[#1C1B1A] sm:text-xl">
                    {title}
                  </h2>
                  <span className="text-2xl font-light italic text-[#D55D27]/30 transition-colors duration-300 group-hover:text-[#D55D27]/80">
                    {number}
                  </span>
                </div>
                <p className="mt-4 text-[14px] leading-7 font-light text-[#1C1B1A]/70 antialiased">
                  {copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="journeys"
        ref={journeysRef}
        className="scroll-mt-24 bg-[#FFFBF5] py-14"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#1C1B1A]/10 pb-6 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D55D27]">
                Current Expeditions
              </p>
              <h2 className="text-3xl font-light tracking-wide text-[#1C1B1A] md:text-5xl">
                Our Active Seasonal Routes
              </h2>
            </div>
            <div className="text-xs font-normal tracking-wide text-[#1C1B1A]/50">
              {tripsLoading
                ? "Syncing calendar..."
                : `${openTrips?.length || 0} pathways available`}
            </div>
          </div>

          {tripsLoading ? (
            <div className="rounded-[24px] border border-[#1C1B1A]/10 bg-[#FFFBF5] p-8 text-center text-sm font-normal text-[#1C1B1A]/65">
              Fetching our upcoming seasonal schedules...
            </div>
          ) : tripsError ? (
            <div className="rounded-[24px] border border-[#D55D27]/30 bg-[#FFFBF5] p-8 text-center text-sm font-normal text-[#D55D27]">
              {tripsError}
            </div>
          ) : !openTrips || openTrips.length === 0 ? (
            <div className="grid gap-6 rounded-[24px] border border-[#1C1B1A]/10 bg-[#FFFBF5] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D55D27]">
                  In the Works
                </p>
                <h3 className="mt-2 text-2xl font-light tracking-wide text-[#1C1B1A] md:text-3xl">
                  Designing new slow-travel chapters
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed font-light text-[#1C1B1A]/60">
                  We are currently scouting remote stays and mapping local
                  trails for our next group layouts. Drop your preferences to
                  get early access before dates go public.
                </p>
              </div>
              <button
                type="button"
                onClick={() => scrollTo(enquiryRef)}
                className="rounded-xl bg-[#D55D27] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FFFBF5] shadow-sm transition hover:bg-[#1C1B1A]"
              >
                Register Preference
              </button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {openTrips.map((trip, index) => {
                const featured = index === 0;
                const selected =
                  formData?.trip_id &&
                  String(formData.trip_id) === String(trip.id);

                return (
                  <article
                    key={trip.id}
                    className={`group rounded-[24px] border p-6 transition-all duration-300 bg-[#FFFBF5] ${
                      selected
                        ? "border-[#D55D27] ring-1 ring-[#D55D27]"
                        : "border-[#1C1B1A]/10 hover:border-[#1C1B1A]/30"
                    } ${featured ? "lg:col-span-2" : ""}`}
                  >
                    <div
                      className={`grid gap-6 ${featured ? "md:grid-cols-[1fr_260px]" : ""}`}
                    >
                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D55D27]">
                            {formatTripDates(trip)}
                          </p>
                          <h3 className="mt-2 text-2xl font-medium tracking-tight text-[#1C1B1A] md:text-3xl">
                            {getTripTitle(trip)}
                          </h3>
                          <p className="mt-1 text-xs font-normal uppercase tracking-wider text-[#1C1B1A]/50">
                            {getTripLocation(trip)}
                          </p>
                          <p className="mt-4 text-sm leading-relaxed font-light text-[#1C1B1A]/70">
                            {trip.description ||
                              "An immersive micro-group itinerary built around community stays, heritage exploration, and decentralized regional paths."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-[18px] border border-[#1C1B1A]/10 bg-[#FFFBF5] p-5 text-left transition-colors group-hover:border-[#1C1B1A]/20">
                        <div>
                          <div className="text-xl font-medium tracking-tight text-[#1C1B1A]">
                            {formatTripPrice(trip.price)}
                          </div>
                          <p className="mt-1 text-[11px] font-normal text-[#1C1B1A]/40">
                            Shared Cost / Micro-Group
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => selectJourney(trip.id)}
                          className="mt-6 min-h-11 w-full rounded-xl border border-[#D55D27] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#D55D27] transition-all duration-300 hover:bg-[#D55D27] hover:text-white"
                        >
                          Request Invite
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section
        id="enquiry"
        ref={enquiryRef}
        className="scroll-mt-24 bg-[#FFFBF5] pt-16 pb-28 w-full font-poppins"
      >
        <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12 ">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 items-start">
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
            </div>

            <div className="rounded-[28px] border border-[#D1B788]/25 bg-[#F4EFE6] p-6 sm:p-10 shadow-[0_24px_68px_-20px_rgba(28,27,26,0.05)] font-poppins">
              {success ? (
                <div className="rounded-[20px] bg-white/60 p-8 text-center md:py-12">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D55D27]">
                    Enquiry Received
                  </p>
                  <h3 className="mt-4 text-2xl font-normal tracking-tight text-[#1C1B1A]">
                    Thank you for sharing your travel plans
                  </h3>
                  <p className="mt-3 mx-auto max-w-md text-sm leading-relaxed font-light text-[#1C1B1A]/70">
                    The Nomichi team will read your note and reach out with a
                    thoughtful next step.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
                    <label htmlFor="trip_id" className={labelClass}>
                      Which trip
                    </label>
                    <div className="relative">
                      <button
                        id="trip_id"
                        type="button"
                        onClick={() =>
                          setOpenDropdown((current) =>
                            current === "trip" ? null : "trip",
                          )
                        }
                        className={`${fieldClass} flex cursor-pointer items-center justify-between pr-4 text-left`}
                        aria-haspopup="listbox"
                        aria-expanded={openDropdown === "trip"}
                      >
                        <span>{selectedTripLabel}</span>
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

                      {openDropdown === "trip" ? (
                        <div
                          className="absolute z-50 mt-2 max-h-72 w-full overflow-hidden rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] p-2 shadow-[0_18px_50px_rgba(28,27,26,0.14)]"
                          role="listbox"
                        >
                          <div className="flex flex-col gap-2">
                            {[
                              { id: "", name: "Not sure yet" },
                              ...openTrips,
                            ].map((trip) => {
                              const value = trip.id;
                              const selected =
                                String(formData.trip_id || "") ===
                                String(value);

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
                            })}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="group_type" className={labelClass}>
                      Who is travelling
                    </label>
                    <div className="relative">
                      <button
                        id="group_type"
                        type="button"
                        onClick={() =>
                          setOpenDropdown((current) =>
                            current === "group" ? null : "group",
                          )
                        }
                        className={`${fieldClass} flex cursor-pointer items-center justify-between pr-4 text-left`}
                        aria-haspopup="listbox"
                        aria-expanded={openDropdown === "group"}
                      >
                        <span>{selectedGroupLabel}</span>
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

                      {openDropdown === "group" ? (
                        <div
                          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#1C1B1A]/10 bg-[#FFFBF5] p-2 shadow-[0_18px_50px_rgba(28,27,26,0.14)]"
                          role="listbox"
                        >
                          <div className="flex flex-col gap-2">
                            {groupOptions.map((option) => {
                              const selected =
                                formData.group_type === option.value;

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
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

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

      <FloatingActions />

      <footer className="w-full bg-[#1C1B1A] pt-20 pb-28 text-[#FFFBF5] font-poppins sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-end">
            <div className="space-y-4">
              <span className="text-3xl font-medium tracking-[0.1em] text-white uppercase">
                Nomichi
              </span>
              <p className="max-w-xs text-xs font-light leading-relaxed tracking-wide text-[#FFFBF5]/50">
                Slow-crafted journeys for curious minds. We design experiences
                that stay with you long after the trip ends.
              </p>
            </div>

            <div className="lg:col-span-2 lg:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D55D27] mb-2">
                Beyond Itineraries
              </p>
              <h2 className="text-3xl font-light tracking-tight sm:text-5xl text-[#FFFBF5] leading-tight">
                Where curiosity meets <br className="hidden sm:inline" />
                <span className="text-[#D55D27] font-normal">
                  thoughtful
                </span>{" "}
                exploration
              </h2>
            </div>
          </div>

          <div className="mt-16 border-t border-[#FFFBF5]/10" />

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-[11px] tracking-widest uppercase">
            <div className="flex gap-8 text-[#FFFBF5]/60">
              <a
                href="#enquiry"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("enquiry")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-[#D55D27] font-medium"
              >
                Plan a Journey
              </a>
              <a
                href="#why-nomichi"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("why-nomichi")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex min-h-11 items-center transition-colors duration-300 hover:text-[#D55D27]"
              >
                Our Story
              </a>
            </div>

            <p className="text-[#FFFBF5]/40 font-light normal-case tracking-normal">
              &copy; {new Date().getFullYear()} Nomichi Explorers India. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
