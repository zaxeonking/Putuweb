"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { STUDENTS } from "@/lib/constants";
import { ClassMember } from "@/types";
import { MembersFilterBar } from "@/components/members/MembersFilterBar";
import { StudentCard } from "@/components/members/StudentCard";
import { StudentModal } from "@/components/members/StudentModal";

export function MembersExplorer() {
  const [search, setSearch] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [selected, setSelected] = useState<ClassMember | null>(null);

  const filtered = useMemo(() => {
    return STUDENTS.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesAttendance =
        attendanceFilter === "all" || student.attendanceNumber === Number(attendanceFilter);
      return matchesSearch && matchesAttendance;
    });
  }, [search, attendanceFilter]);

  return (
    <div className="flex flex-col gap-10">
      <MembersFilterBar
        search={search}
        onSearchChange={setSearch}
        attendanceFilter={attendanceFilter}
        onAttendanceFilterChange={setAttendanceFilter}
        totalCount={STUDENTS.length}
        resultCount={filtered.length}
      />

      {filtered.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((student, i) => (
              <StudentCard
                key={student.id}
                student={student}
                delay={Math.min(i, 12) * 0.03}
                onSelect={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line py-16 text-center dark:border-line-dark">
          <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
            No names match that search.
          </p>
          <p className="text-sm text-muted dark:text-muted-dark">
            Try a different name or reset the attendance filter.
          </p>
        </div>
      )}

      <StudentModal student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
