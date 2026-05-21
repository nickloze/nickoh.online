interface TagPillProps {
  children: React.ReactNode;
  /** "lg" matches the About section tags; "sm" matches the smaller Work tags. */
  size?: "lg" | "sm";
}

/** Rounded chip used for areas of practice and project tags. */
export default function TagPill({ children, size = "lg" }: TagPillProps) {
  const typography = size === "lg" ? "fs-primary" : "fs-small";
  return (
    <span
      className={`${typography} inline-flex shrink-0 items-center whitespace-nowrap rounded-[40px] bg-surface px-4 py-2 tracking-[-0.02em] text-ink`}
    >
      {children}
    </span>
  );
}
