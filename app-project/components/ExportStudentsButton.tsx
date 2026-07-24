"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { IconDownload } from "./icons";

export default function ExportStudentsButton({ query }: { query: string }) {
  const [pending, setPending] = useState(false);

  async function handleExport() {
    setPending(true);
    try {
      const response = await fetch(`/api/admin/students/export?${query}`);
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Student list exported.");
    } catch {
      toast.error("Couldn't export the student list.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-md border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900 disabled:opacity-60"
    >
      <IconDownload className="h-4 w-4" />
      {pending ? "Exporting…" : "Export CSV"}
    </button>
  );
}
