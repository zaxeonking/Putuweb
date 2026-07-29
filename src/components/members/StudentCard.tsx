"use client";

import { motion } from "framer-motion";
import { UserRound } from "lucide-react";
import { ClassMember } from "@/types";

interface StudentCardProps {
  student: ClassMember;
  delay?: number;
  onSelect: (student: ClassMember) => void;
}

export function StudentCard({ student, delay = 0, onSelect }: StudentCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -5 }}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(student)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(student);
        }
      }}
      className="group relative flex cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-5 text-center transition-colors duration-300 ease-ledger hover:border-marigold hover:shadow-[0_16px_36px_-16px_rgba(232,163,61,0.35)] focus-visible:border-marigold dark:border-line-dark dark:bg-surface-dark dark:hover:shadow-[0_16px_36px_-16px_rgba(232,163,61,0.18)]"
    >
      {/* attendance number chip */}
      <span className="absolute right-3 top-3 rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted transition-colors group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:bg-paper-dark dark:text-muted-dark">
        No. {String(student.attendanceNumber).padStart(2, "0")}
      </span>

      {/* photo placeholder */}
      <div className="relative mt-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-marigold/20 to-ivy/20 ring-1 ring-line transition-all duration-300 ease-ledger group-hover:scale-105 group-hover:ring-2 group-hover:ring-marigold dark:ring-line-dark sm:h-24 sm:w-24">
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
          <span className="font-mono text-[10px] uppercase tracking-widest text-marigold">
            {student.role}
          </span>
        )}
      </div>

      <span className="absolute bottom-0 left-1/2 h-[3px] w-0 -translate-x-1/2 bg-marigold transition-all duration-300 ease-ledger group-hover:w-2/3" />
    </motion.div>
  );
}
