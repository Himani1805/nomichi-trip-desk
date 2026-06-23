export default function JourneyCard({
  trip,
  selected,
  onSelect,
  getTripTitle,
  getTripLocation,
  formatTripDates,
  formatTripPrice,
}) {
  const title = getTripTitle(trip);
  const location = getTripLocation(trip);
  const imageSource =
    trip?.image_url || trip?.image || trip?.cover_image || trip?.photo_url || "";
  const totalSeats = trip?.total_seats || trip?.seats || trip?.capacity;
  const seatsLeft = trip?.seats_left || trip?.available_seats;
  const seatText =
    seatsLeft !== undefined && seatsLeft !== null && seatsLeft !== ""
      ? `${seatsLeft} seats left`
      : totalSeats
        ? `${totalSeats} curated seats`
        : "Small group seats";
  const statusText =
    seatsLeft !== undefined && seatsLeft !== null && Number(seatsLeft) <= 3
      ? "Few seats"
      : String(trip?.status || "open").toLowerCase() === "open"
        ? "Open"
        : "Closed";

  return (
    <article
      className={`group flex min-h-[470px] snap-start flex-col overflow-hidden rounded-[30px] border bg-[#FFFBF5] p-6 shadow-[0_18px_58px_-44px_rgba(28,27,26,0.24)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_78px_-52px_rgba(28,27,26,0.34)] sm:p-7 ${
        selected
          ? "border-[#D55D27] ring-1 ring-[#D55D27]"
          : "border-[#D1B788]/42 hover:border-[#D55D27]/35"
      }`}
    >
      {imageSource ? (
        <div className="relative mb-6 h-[210px] overflow-hidden rounded-[24px] bg-[#F4EFE6]">
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageSource})` }}
            role="img"
            aria-label={location}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1A]/55 via-[#1C1B1A]/10 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-[#FFFBF5]/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D55D27]">
            {formatTripDates(trip)}
          </div>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-5 border-b border-[#D1B788]/38 pb-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">
            {imageSource ? "Open journey" : formatTripDates(trip)}
          </p>
          <h3 className="mt-4 text-[30px] font-medium leading-[1.1] tracking-tight text-[#1C1B1A] sm:text-[32px]">
            {title}
          </h3>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1C1B1A]/45">
            {location}
          </p>
        </div>

        <span className="mt-1 shrink-0 rounded-full border border-[#D1B788]/50 bg-[#F4EFE6]/70 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#1C1B1A]/55">
          {imageSource ? formatTripDates(trip) : statusText}
        </span>
      </div>

      <p className="mt-6 text-[15px] leading-7 font-light text-[#1C1B1A]/68">
        {trip.description ||
          "An immersive micro-group itinerary built around community stays, heritage exploration, and decentralized regional paths."}
      </p>

      <div className="mt-auto pt-8">
        <div className="flex flex-col gap-5 rounded-[22px] border border-[#D1B788]/30 bg-[#F4EFE6]/45 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[22px] font-medium leading-tight tracking-tight text-[#1C1B1A] sm:whitespace-nowrap">
              {formatTripPrice(trip.price)}
            </div>
            <p className="mt-1 text-[11px] font-normal uppercase tracking-[0.16em] text-[#1C1B1A]/45">
              {seatText}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onSelect(trip.id)}
            className="min-h-11 rounded-full border border-[#D55D27] bg-[#D55D27] px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-[#FFFBF5] transition-all duration-300 hover:bg-[#1C1B1A] hover:border-[#1C1B1A] hover:shadow-[0_14px_32px_-20px_rgba(28,27,26,0.8)]"
          >
            Request Invite
          </button>
        </div>
      </div>
    </article>
  );
}
