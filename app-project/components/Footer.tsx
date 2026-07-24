import Link from "next/link";

const QUICK_LINKS = [
  { href: "/about", label: "About the Class" },
  { href: "/announcements", label: "Announcements" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/achievements", label: "Achievements" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_PLACEHOLDERS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "Email", href: "#" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink-100 bg-ink-900 text-ink-100">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-white">Class Site</h2>
          <p className="mt-2 text-sm text-ink-300">
            A shared home for our class&apos;s news, events, and memories.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-400">
            Quick Links
          </h3>
          <ul className="mt-3 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-ink-200 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-400">
            Follow Along
          </h3>
          <ul className="mt-3 flex gap-4">
            {SOCIAL_PLACEHOLDERS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  className="text-sm text-ink-200 hover:text-white"
                  aria-label={social.label}
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-page flex flex-col gap-2 py-4 text-xs text-ink-400 sm:flex-row sm:justify-between">
          <p>&copy; {year} Class Site. All rights reserved.</p>
          <p>Built by and for our class community.</p>
        </div>
      </div>
    </footer>
  );
}
