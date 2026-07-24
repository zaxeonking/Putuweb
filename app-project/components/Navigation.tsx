"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/resources", label: "Resources" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-ink-50/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink-900">
          Class Site
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-ink-900 text-ink-50"
                    : "text-ink-700 hover:bg-ink-100"
                )}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/login"
            className="rounded-md border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 transition-colors hover:border-ink-900 hover:text-ink-900"
          >
            Admin Login
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md p-2 text-ink-700 hover:bg-ink-100 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle menu</span>
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {isOpen && (
        <div className="border-t border-ink-100 bg-ink-50 md:hidden">
          <ul className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    "block rounded-md px-3 py-2 text-base font-medium",
                    isActive(link.href)
                      ? "bg-ink-900 text-ink-50"
                      : "text-ink-700 hover:bg-ink-100"
                  )}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block rounded-md border border-ink-300 px-3 py-2 text-base font-medium text-ink-700"
              >
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
