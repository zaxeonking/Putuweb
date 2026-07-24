"use client";

import { useState } from "react";
import clsx from "clsx";
import type { FaqItem } from "@/lib/types";
import { IconChevronDown } from "./icons";

function FaqRow({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-ink-100 last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${item.id}`}
          className="flex w-full items-center justify-between gap-4 py-4 text-left"
        >
          <span className="font-medium text-ink-900">{item.question}</span>
          <IconChevronDown
            className={clsx(
              "h-5 w-5 flex-shrink-0 text-ink-400 transition-transform duration-300",
              isOpen && "rotate-180 text-brass-600"
            )}
          />
        </button>
      </h3>
      <div
        id={`faq-answer-${item.id}`}
        role="region"
        className={clsx(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pr-8 text-sm leading-relaxed text-ink-600">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="font-display text-lg font-semibold text-ink-900">{category}</h2>
          <div className="mt-3 rounded-xl border border-ink-100 bg-white px-5 shadow-card">
            {items
              .filter((item) => item.category === category)
              .map((item) => (
                <FaqRow
                  key={item.id}
                  item={item}
                  isOpen={openIds.has(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
