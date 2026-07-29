"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Droplets,
  Sparkles,
  SprayCan,
  Trash2,
  Users,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CLEANING_DUTY, STUDENTS, WEEKDAYS } from "@/lib/constants";
import { Weekday } from "@/types";
import { DutyStudentCard } from "@/components/cleaning-duty/DutyStudentCard";

const FOCUS_ICONS = {
  sparkles: Sparkles,
  trash: Trash2,
  spray: SprayCan,
  wind: Wind,
  droplets: Droplets,
};

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] as const } },
};

export function DutyExplorer() {
  const [currentDay, setCurrentDay] = useState<Weekday | null>(null);
  const [selectedDay, setSelectedDay] = useState<Weekday>("Monday");
  const hasSynced = useRef(false);

  useEffect(() => {
    // getDay(): 0 = Sunday ... 6 = Saturday. Map 1–5 onto Mon–Fri.
    const jsDay = new Date().getDay();
    const match = WEEKDAYS[jsDay - 1];
    const today = match ? match.day : null;
    setCurrentDay(today);
    if (today && !hasSynced.current) {
      setSelectedDay(today);
      hasSynced.current = true;
    }
  }, []);

  const dayIndex = WEEKDAYS.findIndex((w) => w.day === selectedDay);
  const goTo = (offset: number) => {
    const next = (dayIndex + offset + WEEKDAYS.length) % WEEKDAYS.length;
    setSelectedDay(WEEKDAYS[next].day);
  };

  const group = CLEANING_DUTY.find((g) => g.day === selectedDay) ?? CLEANING_DUTY[0];
  const FocusIcon = FOCUS_ICONS[group.icon];
  const members = group.memberNumbers
    .map((n) => STUDENTS.find((s) => s.attendanceNumber === n))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const lead = STUDENTS.find((s) => s.attendanceNumber === group.leadNumber);

  return (
    <div className="flex flex-col gap-8">
      {/* weekly navigation */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Previous day"
          onClick={() => goTo(-1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-marigold hover:text-marigold dark:border-line-dark dark:text-muted-dark"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
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
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{short}</span>
              {currentDay === day && selectedDay !== day && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-marigold" />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next day"
          onClick={() => goTo(1)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-marigold hover:text-marigold dark:border-line-dark dark:text-muted-dark"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="flex flex-col gap-8"
        >
          {/* focus banner + task list */}
          <div className="grid grid-cols-1 gap-6 rounded-2xl border border-line bg-surface p-6 dark:border-line-dark dark:bg-surface-dark sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-marigold/10 text-marigold dark:bg-marigold/15">
                  <FocusIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark">
                    {selectedDay}
                    {currentDay === selectedDay && (
                      <span className="ml-2 rounded-full bg-marigold px-1.5 py-0.5 text-[9px] text-white">
                        Today
                      </span>
                    )}
                  </p>
                  <h2 className="font-display text-xl font-semibold text-ink dark:text-ink-dark sm:text-2xl">
                    {group.focus}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
                <Users className="h-4 w-4 shrink-0" />
                <span>
                  {members.length} students on duty
                  {lead && (
                    <>
                      {" "}
                      · led by <span className="text-ink dark:text-ink-dark">{lead.name}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <motion.ul
              variants={listStagger}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-2.5"
            >
              {group.tasks.map((task) => (
                <motion.li
                  key={task}
                  variants={listItem}
                  className="flex items-start gap-2.5 text-sm leading-snug text-ink dark:text-ink-dark"
                >
                  <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-ivy dark:text-ivy-light" />
                  {task}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* student cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {members.map((student, i) => (
              <DutyStudentCard
                key={student.id}
                student={student}
                isLead={student.attendanceNumber === group.leadNumber}
                delay={i * 0.04}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
