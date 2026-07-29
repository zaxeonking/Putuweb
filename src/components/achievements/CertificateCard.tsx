"use client";

import { motion } from "framer-motion";
import { FileBadge2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_BADGES } from "@/lib/constants";
import { Certificate } from "@/types";

interface CertificateCardProps {
  certificate: Certificate;
  delay?: number;
  onSelect: (certificate: Certificate) => void;
}

export function CertificateCard({ certificate, delay = 0, onSelect }: CertificateCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(certificate)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -5 }}
      className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 text-left transition-colors duration-300 ease-ledger hover:border-marigold hover:shadow-[0_16px_36px_-18px_rgba(232,163,61,0.35)] dark:border-line-dark dark:bg-surface-dark dark:hover:shadow-[0_16px_36px_-18px_rgba(232,163,61,0.18)]"
    >
      {/* placeholder certificate art */}
      <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-paper via-surface to-marigold/10 dark:border-line-dark dark:from-paper-dark dark:via-surface-dark dark:to-marigold/10">
        <div className="skeleton absolute inset-0 opacity-[0.3]" />
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-line/70 dark:border-line-dark/70" />
        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper/70 text-marigold transition-transform duration-300 ease-ledger group-hover:scale-110 dark:border-line-dark dark:bg-paper-dark/60">
          <FileBadge2 className="h-5 w-5" />
        </div>
        <span className="relative z-10 font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
          Certificate scan coming soon
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <Badge
          size="sm"
          className="self-start"
          colorClassName={
            CATEGORY_BADGES[certificate.category] ??
            "border-line bg-paper text-muted dark:border-line-dark dark:bg-paper-dark dark:text-muted-dark"
          }
        >
          {certificate.category}
        </Badge>
        <h3 className="font-display text-base font-semibold leading-snug text-ink dark:text-ink-dark">
          {certificate.title}
        </h3>
        <p className="text-xs text-muted dark:text-muted-dark">
          {certificate.recipient} · {certificate.year}
        </p>
      </div>
    </motion.button>
  );
}
