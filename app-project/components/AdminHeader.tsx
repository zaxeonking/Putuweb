"use client";

import { useAdminSession } from "@/components/AdminSessionProvider";

export default function AdminHeader() {
  const { username, logout } = useAdminSession();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900">Admin Dashboard</h1>
        <p className="text-sm text-ink-500">Signed in as {username}</p>
      </div>
      <button
        type="button"
        onClick={logout}
        className="rounded-md border border-ink-300 px-3 py-1.5 text-sm font-medium text-ink-700 hover:border-ink-900 hover:text-ink-900"
      >
        Sign out
      </button>
    </div>
  );
}
