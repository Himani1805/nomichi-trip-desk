import Image from "next/image";

export default function BannerSection() {
  return (
    <section
      aria-label="Journey and perspectives"
      className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-12"
    >
      <div className="overflow-hidden rounded-[34px] border border-[#D1B788]/35 bg-[#F4EFE6] shadow-[0_28px_80px_-58px_rgba(28,27,26,0.45)]">
        <div className="relative h-[220px] sm:h-[320px] lg:h-[420px]">
          <Image
            src="/banner.png"
            alt="Journey and perspectives"
            fill
            sizes="(max-width: 1024px) 100vw, 1280px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
