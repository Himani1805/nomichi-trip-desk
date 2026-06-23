"use client";

import { useEffect, useRef, useState } from "react";
import JourneyCard from "./JourneyCard";

export default function JourneySection({
  journeysRef,
  tripsLoading,
  tripsError,
  openTrips,
  selectedTripId,
  enquiryRef,
  scrollTo,
  selectJourney,
  getTripTitle,
  getTripLocation,
  formatTripDates,
  formatTripPrice,
}) {
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrowState() {
    const carousel = carouselRef.current;

    if (!carousel) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    setCanScrollLeft(carousel.scrollLeft > 8);
    setCanScrollRight(carousel.scrollLeft < maxScrollLeft - 8);
  }

  function scrollCarousel(direction) {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.86,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateArrowState();
    window.addEventListener("resize", updateArrowState);

    return () => {
      window.removeEventListener("resize", updateArrowState);
    };
  }, [openTrips]);

  return (
    <section
      id="journeys"
      ref={journeysRef}
      className="scroll-mt-24 bg-[#FFFBF5] py-16"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#D1B788]/40 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D55D27]">
              Current Expeditions
            </p>
            <h2 className="max-w-3xl text-3xl font-light tracking-wide text-[#1C1B1A] md:text-5xl">
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
                We are currently scouting remote stays and mapping local trails
                for our next group layouts. Drop your preferences to get early
                access before dates go public.
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
          <div className="relative">
            {canScrollLeft ? (
              <button
                type="button"
                onClick={() => scrollCarousel(-1)}
                className="absolute left-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D55D27]/45 bg-[#FFFBF5] text-[#D55D27] shadow-[0_18px_45px_-24px_rgba(28,27,26,0.55)] transition-all duration-300 hover:bg-[#D55D27] hover:text-[#FFFBF5] md:left-0 md:-translate-x-1/2"
                aria-label="View previous journeys"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : null}

            <div
              ref={carouselRef}
              onScroll={updateArrowState}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
            >
              {openTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="w-[86vw] max-w-[420px] shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)] md:max-w-none xl:w-[calc((100%-3rem)/3)]"
                >
                  <JourneyCard
                    trip={trip}
                    selected={
                      selectedTripId &&
                      String(selectedTripId) === String(trip.id)
                    }
                    onSelect={selectJourney}
                    getTripTitle={getTripTitle}
                    getTripLocation={getTripLocation}
                    formatTripDates={formatTripDates}
                    formatTripPrice={formatTripPrice}
                  />
                </div>
              ))}
            </div>

            {canScrollRight ? (
              <button
                type="button"
                onClick={() => scrollCarousel(1)}
                className="absolute right-2 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#D55D27]/45 bg-[#FFFBF5] text-[#D55D27] shadow-[0_18px_45px_-24px_rgba(28,27,26,0.55)] transition-all duration-300 hover:bg-[#D55D27] hover:text-[#FFFBF5] md:right-0 md:translate-x-1/2"
                aria-label="View more journeys"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
