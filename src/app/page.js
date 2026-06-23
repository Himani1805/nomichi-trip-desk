"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import FloatingActions from "@/components/FloatingActions";
import EnquiryForm from "@/components/public/EnquiryForm";
import Footer from "@/components/public/Footer";
import HeroSection from "@/components/public/HeroSection";
import JourneySection from "@/components/public/JourneySection";

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  trip_id: "",
  group_type: "",
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

      <HeroSection
        enquiryRef={enquiryRef}
        journeysRef={journeysRef}
        scrollTo={scrollTo}
      />

      <section
        id="why-nomichi"
        className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12"
      >
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

      <JourneySection
        journeysRef={journeysRef}
        tripsLoading={tripsLoading}
        tripsError={tripsError}
        openTrips={openTrips}
        selectedTripId={formData.trip_id}
        enquiryRef={enquiryRef}
        scrollTo={scrollTo}
        selectJourney={selectJourney}
        getTripTitle={getTripTitle}
        getTripLocation={getTripLocation}
        formatTripDates={formatTripDates}
        formatTripPrice={formatTripPrice}
      />

      <EnquiryForm
        enquiryRef={enquiryRef}
        success={success}
        formError={formError}
        formData={formData}
        submitting={submitting}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        labelClass={labelClass}
        fieldClass={fieldClass}
        openTrips={openTrips}
        groupOptions={groupOptions}
        selectedTripLabel={selectedTripLabel}
        selectedGroupLabel={selectedGroupLabel}
        getTripTitle={getTripTitle}
      />

      <FloatingActions />
      <Footer />
    </main>
  );
}
