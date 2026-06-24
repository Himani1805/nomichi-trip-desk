"use client";

import { useEffect, useMemo, useState } from "react";

const whatsappMessage =
  "Hi Nomichi, I would like to enquire about your upcoming trips.";

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.76.46 3.48 1.34 4.99L2 22.25l5.48-1.44a9.88 9.88 0 0 0 4.56 1.1h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 19.05 5a9.83 9.83 0 0 0-7.01-3Zm0 18.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.25.85.87-3.17-.2-.33a8.2 8.2 0 1 1 7.07 3.98Zm4.5-6.14c-.25-.12-1.45-.72-1.68-.8-.22-.08-.38-.12-.55.12-.16.25-.63.8-.78.96-.14.17-.29.19-.54.07-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  const whatsappHref = useMemo(() => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(whatsappMessage);

    if (phone) {
      return `https://wa.me/${phone}?text=${encodedMessage}`;
    }

    return `https://wa.me/?text=${encodedMessage}`;
  }, []);

  useEffect(() => {
    function handleScroll() {
      setShowTop(window.scrollY > 420);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div
      className={`fixed right-4 z-40 flex flex-col items-center gap-3 transition-[bottom] duration-300 sm:right-6 ${
        nearFooter
          ? "bottom-[calc(env(safe-area-inset-bottom)+2.75rem)]"
          : "bottom-[calc(env(safe-area-inset-bottom)+1.25rem)]"
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-[#D55D27] text-[#FFFBF5] shadow-[0_16px_36px_rgba(28,27,26,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1C1B1A] focus:outline-none focus:ring-4 focus:ring-[#D55D27]/20 ${
          showTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUpIcon />
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open WhatsApp chat with Nomichi"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_18px_42px_rgba(37,211,102,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20BD5A] hover:shadow-[0_22px_52px_rgba(37,211,102,0.34)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
