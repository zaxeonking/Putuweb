"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
          className="overflow-hidden rule md:hidden"
        >
          <nav className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-2 py-2.5 text-base transition-colors active:bg-marigold/10",
                      isActive
                        ? "text-ink dark:text-ink-dark"
                        : "text-muted dark:text-muted-dark",
                    )}
                  >
                    <span className={cn("index-label", isActive && "text-marigold")}>{link.index}</span>
                    {link.label}
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-marigold" />}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
