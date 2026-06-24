export default function Footer() {
  return (
    <footer className="w-full bg-[#1C1B1A] pt-14 pb-10 text-[#FFFBF5] font-poppins sm:pt-20 sm:pb-14 md:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:items-end">
          <div className="space-y-4">
            <span className="text-3xl font-medium tracking-[0.1em] text-white uppercase">
              Nomichi
            </span>
            <p className="max-w-xs text-[12px] font-light leading-relaxed tracking-wide text-[#FFFBF5]/50">
              Slow-crafted journeys for curious minds. We design experiences
              that stay with you long after the trip ends.
            </p>
          </div>

          <div className="lg:col-span-2 lg:text-right">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D55D27]">
              Beyond Itineraries
            </p>
            <h2 className="text-2xl font-light leading-tight tracking-tight text-[#FFFBF5] sm:text-3xl md:text-4xl lg:text-5xl">
              Where curiosity meets <br className="hidden sm:inline" />
              <span className="text-[#D55D27] font-normal">thoughtful</span>{" "}
              exploration
            </h2>
          </div>
        </div>

        <div className="mt-10 border-t border-[#FFFBF5]/10 sm:mt-12" />

        <div className="mt-5 flex flex-col gap-3 text-[11px] uppercase tracking-widest sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-[#FFFBF5]/60 sm:gap-8">
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
