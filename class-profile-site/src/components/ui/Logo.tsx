import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-baseline gap-2 font-display text-lg font-semibold tracking-tight text-ink dark:text-ink-dark"
    >
      <span>{SITE.name}</span>
      <span className="hidden font-mono text-[10px] font-normal uppercase tracking-widest text-muted group-hover:text-marigold dark:text-muted-dark sm:inline">
        {SITE.classCode}
      </span>
    </Link>
  );
}
