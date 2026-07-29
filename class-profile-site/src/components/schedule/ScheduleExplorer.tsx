"use client";

import { useEffect, useState } from "react";
import { ScheduleLegend } from "@/components/schedule/ScheduleLegend";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { ScheduleMobileList } from "@/components/schedule/ScheduleMobileList";
import { WEEKDAYS } from "@/lib/constants";
import { Weekday } from "@/types";

export function ScheduleExplorer() {
  const [currentDay, setCurrentDay] = useState<Weekday | null>(null);

  useEffect(() => {
    // getDay(): 0 = Sunday ... 6 = Saturday. Map 1–5 onto Mon–Fri.
    const jsDay = new Date().getDay();
    const match = WEEKDAYS[jsDay - 1];
    setCurrentDay(match ? match.day : null);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <ScheduleLegend />
      <ScheduleTable currentDay={currentDay} />
      <ScheduleMobileList currentDay={currentDay} />
    </div>
  );
}
