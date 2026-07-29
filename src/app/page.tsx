import { Container } from "@/components/ui/Container";
import { Hero } from "@/components/home/Hero";
import { QuickInfoGrid } from "@/components/home/QuickInfoGrid";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="rule">
        <Container className="flex flex-col gap-8 py-20">
          <div className="flex flex-col gap-2">
            <span className="index-label">01 — At a Glance</span>
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark sm:text-3xl">
              The class, in a few facts.
            </h2>
          </div>
          <QuickInfoGrid />
        </Container>
      </section>
    </>
  );
}
