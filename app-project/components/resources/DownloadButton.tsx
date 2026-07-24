"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { IconDownload } from "@/components/icons";

export default function DownloadButton({
  fileName,
  label = "Download",
  variant = "solid",
}: {
  fileName: string;
  label?: string;
  variant?: "solid" | "outline";
}) {
  const [pending, setPending] = useState(false);

  async function handleDownload() {
    if (pending) return;
    setPending(true);

    // Simulated download — a real integration would request a signed URL or
    // stream bytes here. Logged so the network call is easy to swap in later.
    console.log("[resources:download]", { fileName, at: new Date().toISOString() });
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast.success(`Downloading ${fileName}`);
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={pending}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60",
        variant === "solid"
          ? "bg-ink-900 text-ink-50 hover:bg-ink-800"
          : "border border-ink-300 text-ink-700 hover:border-ink-900 hover:text-ink-900"
      )}
    >
      <IconDownload className="h-4 w-4" />
      {pending ? "Preparing…" : label}
    </button>
  );
}
