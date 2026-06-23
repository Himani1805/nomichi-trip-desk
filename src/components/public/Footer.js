export default function Footer() {
  return (
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
              <span className="text-[#D55D27] font-normal">thoughtful</span>{" "}
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
  );
}
