/* Figma-style section header: lowercase tracked label + a hairline rule that
   fills the remaining width, with an optional right-aligned counter.
   Ported from project/components.jsx (RuleHeader). */

export default function RuleHeader({ label, right }: { label: string; right?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span
        style={{
          fontSize: 11,
          color: "var(--zinc-500)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: "var(--border-section)" }} />
      {right && (
        <span className="tabular" style={{ fontSize: 10, color: "var(--zinc-600)" }}>
          {right}
        </span>
      )}
    </div>
  );
}
