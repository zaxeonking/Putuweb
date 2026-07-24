import clsx from "clsx";
import type { ClassOfficerWithStudent } from "@/lib/types";
import Avatar from "./Avatar";
import { IconMail } from "./icons";

const ROLE_STYLES: Record<string, string> = {
  "Class President": "bg-brass-100 text-brass-700",
  "Vice President": "bg-blue-50 text-blue-700",
  Secretary: "bg-emerald-50 text-emerald-700",
  Treasurer: "bg-purple-50 text-purple-700",
  "Line Leader": "bg-red-50 text-red-700",
  "Materials Manager": "bg-ink-100 text-ink-700",
};

export default function OfficerCard({ officer }: { officer: ClassOfficerWithStudent }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-3">
        <Avatar name={officer.student.name} photoUrl={officer.student.photoUrl} size="lg" />
        <div>
          <p className="font-display text-base font-semibold text-ink-900">{officer.student.name}</p>
          <p className="text-xs text-ink-400">{officer.student.classSection}</p>
          <span
            className={clsx(
              "mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
              ROLE_STYLES[officer.role] ?? "bg-ink-100 text-ink-700"
            )}
          >
            {officer.role}
          </span>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Responsibilities</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-600">
          {officer.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-500">
        <span>{officer.termLabel}</span>
        <a href={`mailto:${officer.contactEmail}`} className="flex items-center gap-1 hover:text-brass-600">
          <IconMail className="h-3.5 w-3.5" />
          Contact
        </a>
      </div>
    </div>
  );
}
