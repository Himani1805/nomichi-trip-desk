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
  return (
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
          <div className="grid gap-6 lg:grid-cols-2">
            {openTrips.map((trip, index) => (
              <JourneyCard
                key={trip.id}
                trip={trip}
                index={index}
                selected={selectedTripId && String(selectedTripId) === String(trip.id)}
                onSelect={selectJourney}
                getTripTitle={getTripTitle}
                getTripLocation={getTripLocation}
                formatTripDates={formatTripDates}
                formatTripPrice={formatTripPrice}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
