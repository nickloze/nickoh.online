import Link from "next/link";

/* 404 — an unknown /work/<slug> or any other stray path. Rendered outside the
   Shell, so it carries its own way home, in the site's voice. */
export default function NotFound() {
  return (
    <main className="flex h-dvh flex-col items-start justify-center gap-6 px-[var(--spacing-mobile-left)] tablet:px-frame">
      <p className="font-serif text-[28px] leading-[1.3] tablet:text-[40px]">
        Nothing <span className="italic">here</span>, yet.
      </p>
      <Link
        href="/"
        className="font-sans text-[14px] text-fg/50 outline-none transition-colors hover:text-fg focus-visible:text-fg focus-visible:underline focus-visible:underline-offset-4"
      >
        ← All work
      </Link>
    </main>
  );
}
