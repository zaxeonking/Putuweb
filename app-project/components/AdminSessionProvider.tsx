"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface AdminSessionContextValue {
  username: string;
  logout: () => Promise<void>;
}

const AdminSessionContext = createContext<AdminSessionContextValue | null>(null);

// How often to poll for an expired/invalidated session while the tab is open.
const SESSION_CHECK_INTERVAL_MS = 60_000;

export function useAdminSession() {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }
  return ctx;
}

export default function AdminSessionProvider({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out.");
    router.push("/login");
    router.refresh();
  }

  // Passive inactivity check: if the server-side session has expired or
  // been invalidated, bounce back to login instead of leaving a stale UI up.
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          toast.error("Your session expired. Please sign in again.");
          router.push("/login");
        }
      } catch {
        // Network hiccup — don't log the user out over a transient failure.
      }
    }, SESSION_CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <AdminSessionContext.Provider value={{ username, logout }}>
      {children}
    </AdminSessionContext.Provider>
  );
}
