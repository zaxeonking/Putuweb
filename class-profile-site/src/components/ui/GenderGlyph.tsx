interface GenderGlyphProps {
  gender: "mars" | "venus";
  size?: number;
  className?: string;
}

/**
 * Renders the Mars (♂) / Venus (♀) symbol as plain text rather than
 * importing icons from lucide-react. Those two specific icons aren't
 * reliably present across every lucide-react release — without a lockfile
 * pinning an exact version, a fresh install can silently resolve one that
 * doesn't export them, which breaks the production build. This sidesteps
 * that risk entirely while keeping the same visual result and the same
 * `size`/`className` API the lucide icons offered.
 */
export function GenderGlyph({ gender, size = 16, className }: GenderGlyphProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: "inline-block" }}
    >
      {gender === "mars" ? "♂" : "♀"}
    </span>
  );
}
