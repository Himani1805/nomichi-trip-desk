const storyNotes = [
  "A name shaped from Nomad and Michi, the Japanese word for way or path.",
  "Built for solo travellers and pairs who want something slower, warmer, and more human.",
  "Small circles, shared stories, local tables, and journeys that feel like they were waiting for you.",
];

export default function AboutNomichiSection() {
  return (
    <section
      id="about-nomichi"
      className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12"
    >
      <div className="relative overflow-hidden rounded-[40px] border border-[#D1B788]/30 bg-[#F4EFE6] p-7 shadow-[0_30px_90px_-68px_rgba(28,27,26,0.34)] sm:p-10 lg:p-14">
        <div
          className="pointer-events-none absolute right-[-80px] top-[-120px] h-72 w-72 rounded-full border border-[#D1B788]/35"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-[-90px] left-[-90px] h-56 w-56 rounded-full bg-[#D1B788]/20"
          aria-hidden="true"
        />

        <div className="mb-10 grid gap-6 border-b border-[#D1B788]/55 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#D55D27]">
              About Nomichi
            </p>
            <h2 className="max-w-3xl text-3xl font-light leading-[1.15] tracking-wide text-[#1C1B1A] md:text-5xl">
              Every journey starts with a story
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-7 text-[#1C1B1A]/62 lg:justify-self-end">
            Here is ours, before you wander, connect, and belong.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="relative rounded-[30px] border border-[#D1B788]/45 bg-[#FFFBF5]/72 p-6 sm:p-8">
            <span
              className="absolute right-8 top-6 text-7xl font-light leading-none text-[#D55D27]/12"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">
              Our Story
            </p>
            <blockquote className="mt-5 text-2xl font-light leading-[1.35] tracking-tight text-[#1C1B1A] md:text-3xl">
              The truest journeys lead you home, even if home is a circle of
              strangers on the road.
            </blockquote>
            <p className="mt-7 text-sm font-light leading-7 text-[#1C1B1A]/68">
              Nomichi was born from years on the road, chasing landscapes,
              stories, and the feeling of something real. We noticed that
              travel often felt packaged, social but surface-level, curated but
              disconnected. We wanted something deeper, more honest, and more
              human.
            </p>
          </article>

          <article className="rounded-[30px] border border-[#D1B788]/38 bg-[#FFFBF5]/34 p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D55D27]">
              Our Mission
            </p>
            <h3 className="mt-4 text-3xl font-light leading-tight tracking-wide text-[#1C1B1A]">
              Travel that finds you
            </h3>
            <p className="mt-6 text-sm font-light leading-7 text-[#1C1B1A]/68">
              We see travel as a way to return, back to connection, back to
              culture, back to yourself. Every itinerary is built around people
              and stories, with a pace that leaves room to actually feel a
              place.
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {storyNotes.map((note) => (
            <p
              key={note}
              className="rounded-[22px] border border-[#D1B788]/35 bg-[#FFFBF5]/48 p-5 text-sm font-light leading-7 text-[#1C1B1A]/66"
            >
              <span className="mb-4 block h-px w-12 bg-[#D55D27]/45" />
              {note}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
