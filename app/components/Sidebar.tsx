"use client";

import { useState } from "react";
import { ArrowDownToLine } from "lucide-react";

const WHATSAPP_NUMBER = "+65 XXXX XXXX";
const WHATSAPP_HREF = "https://wa.me/65XXXXXXXX";
const EMAIL = "nicklozekoh@gmail.com";

export default function Sidebar() {
  const [contactsOpen, setContactsOpen] = useState(false);

  const scrollToTop = () => {
    const scroller = document.getElementById("works-scroll");
    scroller?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkClasses =
    "inline-flex w-fit items-center gap-[0.4167vw] text-[1.4583vw] leading-none tracking-[-0.01em] text-text-soft transition-colors duration-200 hover:text-white";

  return (
    <aside className="flex h-full flex-col gap-[0.8333vw] border-r-[0.0781vw] border-divider bg-page px-[1.6667vw] py-[1.6667vw]">
      <nav
        className="flex flex-col items-start gap-[0.8333vw]"
        aria-label="Section navigation"
      >
        <button type="button" onClick={scrollToTop} className={linkClasses}>
          Works
        </button>
        <a href="/resume.pdf" download className={linkClasses}>
          Resume
          <ArrowDownToLine
            className="h-[1.4583vw] w-[1.4583vw]"
            strokeWidth={1.5}
            aria-hidden
          />
        </a>
        <button
          type="button"
          onClick={() => setContactsOpen((v) => !v)}
          aria-expanded={contactsOpen}
          aria-controls="contacts-panel"
          className={linkClasses}
        >
          Contacts
        </button>
      </nav>
      {contactsOpen && (
        <div
          id="contacts-panel"
          className="flex flex-col gap-[0.4167vw] pl-[0.4167vw]"
        >
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[1.1458vw] leading-[1.3] tracking-[-0.01em] text-text-muted transition-colors duration-200 hover:text-white"
          >
            WhatsApp · {WHATSAPP_NUMBER}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="text-[1.1458vw] leading-[1.3] tracking-[-0.01em] text-text-muted transition-colors duration-200 hover:text-white break-all"
          >
            {EMAIL}
          </a>
        </div>
      )}
    </aside>
  );
}
