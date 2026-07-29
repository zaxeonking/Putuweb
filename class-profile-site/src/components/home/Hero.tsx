"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { ClassPhoto } from "@/components/home/ClassPhoto";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { SITE } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.65, 0, 0.35, 1] as const },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Oversized watermark numeral — the one bold accent of the page */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 select-none font-display text-[13rem] font-semibold leading-none text-ink/[0.03] dark:text-ink-dark/[0.04] sm:text-[18rem]"
      >
        {SITE.classCode}
      </span>

      <Container className="relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="index-label"
          >
            00 — Class Profile
          </motion.span>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.05}
            className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted dark:border-line-dark dark:text-muted-dark"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ivy" />
            {SITE.fullName}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="font-display text-6xl font-semibold leading-[0.95] tracking-tight text-ink dark:text-ink-dark sm:text-7xl lg:text-8xl"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.18}
            className="font-display text-xl italic text-marigold dark:text-marigold-light"
          >
            &ldquo;{SITE.motto}&rdquo;
          </motion.p>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.24}
            className="max-w-md text-base leading-relaxed text-muted dark:text-muted-dark"
          >
            {SITE.welcome}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.32}
          >
            <ButtonLink href="/class" variant="primary" size="lg">
              About Our Class
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </ButtonLink>
          </motion.div>
        </div>

        <ClassPhoto />
      </Container>

      <ScrollIndicator />
    </section>
  );
}
