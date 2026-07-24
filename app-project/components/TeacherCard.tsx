"use client";

import { useState } from "react";
import type { Teacher } from "@/lib/types";
import Avatar from "./Avatar";
import { IconMail } from "./icons";

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const [expanded, setExpanded] = useState(false);
  const bioIsLong = teacher.bio.length > 140;
  const displayedBio = expanded || !bioIsLong ? teacher.bio : `${teacher.bio.slice(0, 140).trim()}…`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <Avatar name={teacher.name} photoUrl={teacher.photoUrl} size="lg" />
        <div>
          <p className="font-display text-base font-semibold text-ink-900">{teacher.name}</p>
          <p className="text-sm text-ink-500">{teacher.title}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {teacher.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-ink-600">{displayedBio}</p>
      {bioIsLong && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="self-start text-xs font-semibold text-brass-600 hover:text-brass-700"
        >
          {expanded ? "Show less" : "Read full bio"}
        </button>
      )}

      <div className="mt-1 space-y-1 border-t border-ink-100 pt-3 text-xs text-ink-500">
        <p className="flex items-center gap-1.5">
          <IconMail className="h-3.5 w-3.5" />
          <a href={`mailto:${teacher.email}`} className="hover:text-brass-600">
            {teacher.email}
          </a>
        </p>
        <p>{teacher.phone}</p>
        <p>Office hours: {teacher.officeHours}</p>
        <p>{teacher.yearsExperience} years of experience</p>
      </div>
    </div>
  );
}
