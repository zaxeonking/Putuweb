"use client";

import { motion } from "framer-motion";
import { Crown, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClassMember } from "@/types";

interface DutyStudentCardProps {
  student: ClassMember;
  isLead?: boolean;
  delay?: number;
}

export function DutyStudentCard({ student, isLead = false, delay = 0 }: DutyStudentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.35, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border p-5 text-center",
        "transition-colors duration-300 ease-ledger",
        isLead
          ? "border-marigold/50 bg-marigold/5 shadow-[0_16px_36px_-18px_rgba(232,163,61,0.4)] dark:bg-marigold/10"
          : "border-line bg-surface hover:border-marigold hover:shadow-[0_16px_36px_-16px_rgba(232,163,61,0.35)] dark:border-line-dark dark:bg-surface-dark dark:hover:shadow-[0_16px_36px_-16px_rgba(232,163,61,0.18)]",
      )}
    >
      {/* attendance number chip */}
      <span className="absolute right-3 top-3 rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted transition-colors group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:bg-paper-dark dark:text-muted-dark">
        No. {String(student.attendanceNumber).padStart(2, "0")}
      </span>

      {/* lead badge */}
      {isLead && (
        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-marigold px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white">
          <Crown className="h-2.5 w-2.5" />
          Lead
        </span>
      )}

      {/* photo placeholder */}
      <div
        className={cn(
          "relative mt-4 flex h-20 w-20 items-center justify-center rounded-full ring-1 transition-all duration-300 ease-ledger group-hover:scale-105 group-hover:ring-2 group-hover:ring-marigold sm:h-24 sm:w-24",
          isLead
            ? "bg-gradient-to-br from-marigold/30 to-ivy/20 ring-marigold/60"
            : "bg-gradient-to-br from-marigold/20 to-ivy/20 ring-line dark:ring-line-dark",
        )}
      >
        <span className="font-display text-2xl font-semibold text-ink/70 transition-opacity duration-300 group-hover:opacity-0 dark:text-ink-dark/70">
          {student.initials}
        </span>
        <UserRound className="absolute h-8 w-8 text-marigold opacity-0 transition-all duration-300 ease-ledger group-hover:scale-110 group-hover:opacity-100" />
      </div>

      <div className="flex min-h-[3.25rem] flex-col justify-start gap-1">
        <h3 className="font-display text-base font-semibold leading-tight text-ink dark:text-ink-dark">
          {student.name}
        </h3>
        {student.role && (
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
            {student.role}
          </span>
        )}
      </div>

      <span
        className={cn(
          "absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 bg-marigold transition-all duration-300 ease-ledger group-hover:w-2/3",
          isLead ? "w-2/3" : "w-0",
        )}
      />
    </motion.div>
  );
}
