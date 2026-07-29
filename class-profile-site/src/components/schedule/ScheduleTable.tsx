"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SCHEDULE, SUBJECT_COLORS, WEEKDAYS } from "@/lib/constants";
import { Weekday } from "@/types";

interface ScheduleTableProps {
  currentDay: Weekday | null;
}

export function ScheduleTable({ currentDay }: ScheduleTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-line dark:border-line-dark md:block">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-surface dark:bg-surface-dark">
            <th className="w-36 border-b border-line px-4 py-3 text-left font-mono text-xs uppercase tracking-widest text-muted dark:border-line-dark dark:text-muted-dark">
              Time
            </th>
            {WEEKDAYS.map(({ day, short }) => (
              <th
                key={day}
                className={cn(
                  "border-b border-line px-4 py-3 text-left font-display text-sm font-semibold transition-colors duration-300 dark:border-line-dark",
                  currentDay === day
                    ? "bg-marigold/10 text-marigold dark:text-marigold-light"
                    : "text-ink dark:text-ink-dark",
                )}
              >
                <span className="hidden lg:inline">{day}</span>
                <span className="lg:hidden">{short}</span>
                {currentDay === day && (
                  <span className="ml-2 inline-block rounded-full bg-marigold px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white">
                    Today
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SCHEDULE.map((row, i) =>
            row.type === "break" ? (
              <motion.tr
                key={`break-${row.time}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.02 }}
                className="bg-paper dark:bg-paper-dark"
              >
                <td className="border-b border-line px-4 py-2 font-mono text-xs text-muted dark:border-line-dark dark:text-muted-dark">
                  {row.time}
                </td>
                <td
                  colSpan={5}
                  className="border-b border-line px-4 py-2 text-center font-mono text-xs uppercase tracking-widest text-muted dark:border-line-dark dark:text-muted-dark"
                >
                  {row.label}
                </td>
              </motion.tr>
            ) : (
              <motion.tr
                key={`period-${row.period}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.02, ease: [0.65, 0, 0.35, 1] }}
                className="transition-colors hover:bg-paper/60 dark:hover:bg-paper-dark/60"
              >
                <td className="border-b border-line px-4 py-3 align-top font-mono text-xs text-muted dark:border-line-dark dark:text-muted-dark">
                  <span className="index-label mr-2">{String(row.period).padStart(2, "0")}</span>
                  {row.time}
                </td>
                {WEEKDAYS.map(({ day }) => {
                  const entry = row.entries[day];
                  const colors = entry ? SUBJECT_COLORS[entry.colorKey] : undefined;
                  return (
                    <td
                      key={day}
                      className={cn(
                        "border-b border-line px-3 py-2.5 align-top transition-colors duration-300 dark:border-line-dark",
                        currentDay === day && "bg-marigold/5",
                      )}
                    >
                      {entry ? (
                        <div
                          className={cn(
                            "flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-transform duration-300 hover:-translate-y-0.5",
                            colors?.chip,
                          )}
                        >
                          <span className="flex items-center gap-1.5 font-medium leading-tight">
                            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", colors?.dot)} />
                            {entry.subject}
                          </span>
                          {entry.teacher && (
                            <span className="pl-3 text-[11px] leading-tight opacity-80">{entry.teacher}</span>
                          )}
                        </div>
                      ) : (
                        <span className="block px-3 py-2 text-center text-xs italic text-muted/60 dark:text-muted-dark/60">
                          {day === "Friday" ? "Early dismissal" : "—"}
                        </span>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
