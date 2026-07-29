"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
      className={cn(
        "sticky top-0 z-50 border-b bg-paper/80 backdrop-blur-md transition-shadow duration-300 dark:bg-paper-dark/80",
        scrolled
          ? "border-line shadow-[0_1px_0_0_rgba(0,0,0,0.03)] dark:border-line-dark"
          : "border-transparent",
      )}
    >
      <Container
        className={cn(
          "flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-14" : "h-16",
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all duration-200 hover:border-marigold hover:text-marigold active:scale-95 dark:border-line-dark dark:text-ink-dark md:hidden"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </Container>

      <Container>
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </Container>
    </motion.header>
  );
}
