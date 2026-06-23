import Image from "next/image";

export default function HeroSection({ enquiryRef, journeysRef, scrollTo }) {
  return (
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
  );
}
