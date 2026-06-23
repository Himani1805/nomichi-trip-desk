export default function JourneyCard({
  trip,
  index,
  selected,
  onSelect,
  getTripTitle,
  getTripLocation,
  formatTripDates,
  formatTripPrice,
}) {
  const featured = index === 0;

  return (
    <article
      className={`group rounded-[24px] border p-6 transition-all duration-300 bg-[#FFFBF5] ${
        selected
          ? "border-[#D55D27] ring-1 ring-[#D55D27]"
          : "border-[#1C1B1A]/10 hover:border-[#1C1B1A]/30"
      } ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className={`grid gap-6 ${featured ? "md:grid-cols-[1fr_260px]" : ""}`}>
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
            onClick={() => onSelect(trip.id)}
            className="mt-6 min-h-11 w-full rounded-xl border border-[#D55D27] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#D55D27] transition-all duration-300 hover:bg-[#D55D27] hover:text-white"
          >
            Request Invite
          </button>
        </div>
      </div>
    </article>
  );
}
