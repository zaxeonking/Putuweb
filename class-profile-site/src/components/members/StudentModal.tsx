"use client";

import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { ClassMember } from "@/types";

interface StudentModalProps {
  student: ClassMember | null;
  onClose: () => void;
}

export function StudentModal({ student, onClose }: StudentModalProps) {
  return (
    <Modal open={!!student} onClose={onClose} ariaLabel={student?.name} maxWidth="sm">
      {student && (
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="index-label">
            Attendance No. {String(student.attendanceNumber).padStart(2, "0")}
          </span>

          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-marigold/20 to-ivy/20 ring-2 ring-marigold">
            <span className="font-display text-3xl font-semibold text-ink/70 dark:text-ink-dark/70">
              {student.initials}
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              {student.name}
            </h3>
            {student.role && (
              <Badge tone="marigold" className="mt-2">
                {student.role}
              </Badge>
            )}
          </div>

          {student.bio && (
            <>
              <span className="rule w-full" />
              <p className="text-sm leading-relaxed text-muted dark:text-muted-dark">
                {student.bio}
              </p>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}
