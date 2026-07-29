"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <span className="index-label">{index}</span>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink dark:text-ink-dark sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-xl text-base text-muted dark:text-muted-dark",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
