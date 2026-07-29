"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Instagram, ArrowUpRight } from "lucide-react";
import { ContactChannel } from "@/types";

const ICONS: Record<ContactChannel["icon"], typeof Mail> = {
  mail: Mail,
  phone: Phone,
  instagram: Instagram,
};

interface ContactCardProps {
  channel: ContactChannel;
  delay?: number;
}

export function ContactCard({ channel, delay = 0 }: ContactCardProps) {
  const Icon = ICONS[channel.icon];

  return (
    <motion.a
      href={channel.href}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.65, 0, 0.35, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors duration-300 ease-ledger hover:border-marigold dark:border-line-dark dark:bg-surface-dark"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 ease-ledger group-hover:scale-105 group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:text-muted-dark">
        <Icon size={17} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted dark:text-muted-dark">
          {channel.label}
        </span>
        <span className="truncate font-display text-base font-semibold text-ink dark:text-ink-dark">
          {channel.value}
        </span>
      </div>

      <ArrowUpRight
        size={15}
        className="shrink-0 text-muted opacity-0 transition-all duration-300 ease-ledger group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-marigold group-hover:opacity-100 dark:text-muted-dark"
      />
    </motion.a>
  );
}
