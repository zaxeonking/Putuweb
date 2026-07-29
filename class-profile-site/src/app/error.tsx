"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the console in dev/prod so the failure is still traceable
    // even without a monitoring integration wired up yet.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="index-label">!! — Ledger Error</span>

      <h1 className="font-display text-3xl font-semibold text-ink dark:text-ink-dark sm:text-4xl">
        Something dropped off the record.
      </h1>

      <p className="max-w-md text-base leading-relaxed text-muted dark:text-muted-dark">
        An unexpected error interrupted this page. It&apos;s been logged — try
        again, and if it keeps happening, let {SITE.name} know.
      </p>

      <Button variant="primary" size="md" className="mt-2" onClick={() => reset()}>
        Try Again
      </Button>
    </Container>
  );
}
