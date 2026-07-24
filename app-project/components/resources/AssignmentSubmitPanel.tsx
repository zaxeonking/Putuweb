"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { IconCheckCircle } from "@/components/icons";

export default function AssignmentSubmitPanel({ assignmentTitle }: { assignmentTitle: string }) {
  const [status, setStatus] = useState<"idle" | "confirming" | "submitted">("idle");

  if (status === "submitted") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        <IconCheckCircle className="h-5 w-5" />
        Submitted! Your teacher will see this in their review queue.
      </div>
    );
  }

  if (status === "confirming") {
    return (
      <div className="rounded-lg border border-ink-200 bg-ink-50 px-4 py-3">
        <p className="text-sm text-ink-700">Mark &ldquo;{assignmentTitle}&rdquo; as submitted?</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              console.log("[resources:assignment-submitted]", {
                assignmentTitle,
                at: new Date().toISOString(),
              });
              setStatus("submitted");
              toast.success("Assignment submitted");
            }}
            className="rounded-md bg-ink-900 px-3 py-1.5 text-sm font-semibold text-ink-50 hover:bg-ink-800"
          >
            Confirm submission
          </button>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="rounded-md border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-600 hover:border-ink-900"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setStatus("confirming")}
      className="inline-flex items-center gap-2 rounded-md bg-brass-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brass-600"
    >
      <IconCheckCircle className="h-4 w-4" />
      Mark as submitted
    </button>
  );
}
