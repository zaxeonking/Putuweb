"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SCHEDULE, SUBJECT_COLORS, WEEKDAYS } from "@/lib/constants";
import { Weekday } from "@/types";

interface ScheduleMobileListProps {
  currentDay: Weekday | null;
}

export function ScheduleMobileList({ currentDay }: ScheduleMobileListProps) {
  const [selectedDay, setSelectedDay] = useState<Weekday>("Monday");
  const hasSynced = useRef(false);

  // Once we know which day it actually is client-side, jump to it — but
  // only the first time, so a manual tap never gets overridden.
  useEffect(() => {
    if (currentDay && !hasSynced.current) {
      setSelectedDay(currentDay);
      hasSynced.current = true;
    }
  }, [currentDay]);

  const dayRows = SCHEDULE.filter(
    (row) => row.type === "break" || row.entries[selectedDay],
  );

  return (
    <div className="flex flex-col gap-5 md:hidden">
      {/* day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {WEEKDAYS.map(({ day, short }) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={cn(
              "relative shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors duration-300",
              selectedDay === day
                ? "border-marigold bg-marigold text-white"
                : "border-line text-muted hover:border-marigold hover:text-marigold dark:border-line-dark dark:text-muted-dark",
            )}
          >
            {short}
            {currentDay === day && selectedDay !== day && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-marigold" />
            )}
          </button>
        ))}
      </div>

      {/* selected day's list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
          className="flex flex-col gap-2.5"
        >
          {dayRows.map((row, i) =>
            row.type === "break" ? (
              <div
                key={`break-${row.time}`}
                className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5 dark:bg-paper-dark"
              >
                <span className="font-mono text-xs text-muted dark:text-muted-dark">{row.time}</span>
                <span className="font-mono text-xs uppercase tracking-widest text-muted dark:text-muted-dark">
                  {row.label}
                </span>
              </div>
            ) : (
              (() => {
                const entry = row.entries[selectedDay];
                if (!entry) return null;
                const colors = SUBJECT_COLORS[entry.colorKey];
                return (
                  <motion.div
                    key={`period-${row.period}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
                      colors?.chip,
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", colors?.dot)} />
                      <div>
                        <p className="font-medium leading-tight">{entry.subject}</p>
                        {entry.teacher && (
                          <p className="text-[11px] leading-tight opacity-80">{entry.teacher}</p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] opacity-80">{row.time}</span>
                  </motion.div>
                );
              })()
            ),
          )}

          {selectedDay === "Friday" && (
            <p className="px-1 pt-1 text-center text-xs italic text-muted dark:text-muted-dark">
              Early dismissal after Period 6 for congregational prayer.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
