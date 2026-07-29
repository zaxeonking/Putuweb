"use client";

import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrgMember } from "@/types";

interface MemberCardProps {
  member: OrgMember;
  delay?: number;
  size?: "lg" | "md";
}

export function MemberCard({ member, delay = 0, size = "md" }: MemberCardProps) {
  const isLarge = size === "lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-6 text-center",
        "transition-colors duration-300 ease-ledger hover:border-marigold hover:shadow-[0_18px_40px_-16px_rgba(232,163,61,0.35)]",
        "dark:border-line-dark dark:bg-surface-dark dark:hover:shadow-[0_18px_40px_-16px_rgba(232,163,61,0.18)]",
        isLarge && "sm:p-8",
      )}
    >
      {/* index label, top-left */}
      <span className="index-label absolute left-5 top-5">{member.index}</span>

      {/* photo placeholder */}
      <div
        className={cn(
          "relative mt-2 flex items-center justify-center rounded-full",
          "bg-gradient-to-br from-marigold/20 to-ivy/20",
          "ring-1 ring-line transition-all duration-300 ease-ledger",
          "group-hover:ring-2 group-hover:ring-marigold group-hover:scale-105",
          "dark:ring-line-dark",
          isLarge ? "h-28 w-28 sm:h-32 sm:w-32" : "h-20 w-20 sm:h-24 sm:w-24",
        )}
      >
        <span
          className={cn(
            "font-display font-semibold text-ink/70 transition-opacity duration-300 group-hover:opacity-0 dark:text-ink-dark/70",
            isLarge ? "text-3xl" : "text-2xl",
          )}
        >
          {member.initials}
        </span>
        <UserRound
          className={cn(
            "absolute text-marigold opacity-0 transition-all duration-300 ease-ledger",
            "group-hover:opacity-100 group-hover:scale-110",
            isLarge ? "h-10 w-10" : "h-8 w-8",
          )}
        />
      </div>

      <div>
        <h3
          className={cn(
            "font-display font-semibold text-ink dark:text-ink-dark",
            isLarge ? "text-xl sm:text-2xl" : "text-base sm:text-lg",
          )}
        >
          {member.name}
        </h3>
        <p
          className={cn(
            "mt-1 font-mono uppercase tracking-widest text-muted transition-colors group-hover:text-marigold dark:text-muted-dark",
            isLarge ? "text-xs" : "text-[11px]",
          )}
        >
          {member.role}
        </p>
      </div>

      {/* bottom accent line that grows on hover */}
      <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-marigold transition-all duration-300 ease-ledger group-hover:w-2/3" />
    </motion.div>
  );
}
