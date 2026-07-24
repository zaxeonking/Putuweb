import type { Metadata } from "next";
import { Suspense } from "react";
import { issueCsrfToken } from "@/lib/csrf";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Class Site",
};

export default function LoginPage() {
  const csrfToken = issueCsrfToken();

  return (
    <div className="container-page flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 font-display text-lg font-semibold text-brass-300">
            CS
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Admin Login
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            Sign in to manage the class site.
          </p>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
          <Suspense fallback={null}>
            <LoginForm csrfToken={csrfToken} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
