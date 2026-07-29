"use client";

import { FileBadge2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_BADGES } from "@/lib/constants";
import { Certificate } from "@/types";

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  return (
    <Modal open={!!certificate} onClose={onClose} ariaLabel={certificate?.title} maxWidth="md">
      {certificate && (
        <div className="flex flex-col gap-5">
          <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-line bg-gradient-to-br from-paper via-surface to-marigold/10 dark:border-line-dark dark:from-paper-dark dark:via-surface-dark dark:to-marigold/10">
            <div className="skeleton absolute inset-0 opacity-[0.3]" />
            <div className="pointer-events-none absolute inset-4 rounded-lg border border-dashed border-line/70 dark:border-line-dark/70" />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-paper/70 text-marigold dark:border-line-dark dark:bg-paper-dark/60">
              <FileBadge2 className="h-7 w-7" />
            </div>
            <span className="relative z-10 font-mono text-[11px] uppercase tracking-widest text-muted dark:text-muted-dark">
              Certificate scan coming soon
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Badge
              size="sm"
              className="self-start"
              colorClassName={CATEGORY_BADGES[certificate.category] ?? "border-line text-muted dark:border-line-dark dark:text-muted-dark"}
            >
              {certificate.category}
            </Badge>
            <h3 className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
              {certificate.title}
            </h3>
            <div className="flex flex-col gap-1 text-sm text-muted dark:text-muted-dark">
              <p>
                Awarded to <span className="text-ink dark:text-ink-dark">{certificate.recipient}</span>
              </p>
              <p>
                Issued by <span className="text-ink dark:text-ink-dark">{certificate.issuer}</span>, {certificate.year}
              </p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
