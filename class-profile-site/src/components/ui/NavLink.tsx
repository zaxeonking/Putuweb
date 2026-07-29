"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLink as NavLinkType } from "@/types";

export function NavLink({ index, label, href }: NavLinkType) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center gap-2 py-1 text-sm font-medium transition-colors",
        isActive
          ? "text-ink dark:text-ink-dark"
          : "text-muted hover:text-ink dark:text-muted-dark dark:hover:text-ink-dark",
      )}
    >
      <span className="index-label">{index}</span>
      <span>{label}</span>
      <span
        className={cn(
          "absolute -bottom-0.5 left-6 right-0 h-px origin-left scale-x-0 bg-marigold transition-transform duration-300 ease-ledger group-hover:scale-x-100",
          isActive && "scale-x-100",
        )}
      />
    </Link>
  );
}
