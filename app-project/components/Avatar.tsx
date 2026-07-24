import clsx from "clsx";

const PALETTE = [
  "bg-brass-100 text-brass-700",
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-purple-50 text-purple-700",
  "bg-ink-100 text-ink-700",
  "bg-red-50 text-red-700",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initialsFor(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-20 w-20 text-xl",
};

/**
 * Renders a student/teacher's photo when one is available (`photoUrl`), and
 * falls back to a deterministic initials badge otherwise. Mock data ships
 * with no photos, so every avatar currently renders via the fallback —
 * dropping in a real `photoUrl` (e.g. from an upload pipeline) needs no
 * other changes.
 */
export default function Avatar({
  name,
  photoUrl,
  size = "md",
  className,
}: {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={name}
        className={clsx("flex-shrink-0 rounded-full object-cover", SIZES[size], className)}
      />
    );
  }

  const palette = PALETTE[hashString(name) % PALETTE.length];

  return (
    <div
      className={clsx(
        "flex flex-shrink-0 items-center justify-center rounded-full font-display font-semibold",
        SIZES[size],
        palette,
        className
      )}
      aria-hidden
    >
      {initialsFor(name)}
    </div>
  );
}
