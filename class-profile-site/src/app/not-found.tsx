import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Name Not Found — ${SITE.name} (${SITE.fullName})`,
  description: "This page isn't on the roll call.",
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <span className="index-label">?? — Off the Roll Call</span>

      <p className="font-display text-7xl font-semibold leading-none tracking-tight text-ink dark:text-ink-dark sm:text-8xl">
        404
      </p>

      <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
        This name isn&apos;t on the list.
      </h1>

      <p className="max-w-md text-base leading-relaxed text-muted dark:text-muted-dark">
        Whatever you were looking for isn&apos;t part of the {SITE.fullName} record —
        at least not at this address. Let&apos;s get you back to a page that is.
      </p>

      <ButtonLink href="/" variant="primary" size="md" className="mt-2">
        Back to Roll Call
      </ButtonLink>
    </Container>
  );
}
