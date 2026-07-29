import Link from "next/link";
import { Github, Instagram, Mail, Linkedin, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FOOTER_GROUPS, SITE, SOCIAL_LINKS } from "@/lib/constants";
import { SocialLink } from "@/types";

const ICONS: Record<SocialLink["icon"], typeof Github> = {
  github: Github,
  instagram: Instagram,
  mail: Mail,
  linkedin: Linkedin,
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rule mt-24 bg-gradient-to-b from-transparent to-line/10 dark:to-line-dark/10">
      <Container className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3">
          <span className="font-display text-xl font-semibold text-ink dark:text-ink-dark">
            {SITE.name}
            <span className="ml-2 font-mono text-xs font-normal uppercase tracking-widest text-muted dark:text-muted-dark">
              {SITE.classCode}
            </span>
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted dark:text-muted-dark">
            {SITE.tagline}
          </p>
          <div className="mt-2 flex gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = ICONS[social.icon];
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-marigold hover:text-marigold hover:shadow-sm active:scale-95 dark:border-line-dark dark:text-muted-dark"
                >
                  <Icon size={15} />
                </Link>
              );
            })}
          </div>
        </div>

        {FOOTER_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <span className="index-label">{group.index}</span>
            <span className="text-sm font-medium text-ink dark:text-ink-dark">
              {group.title}
            </span>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-marigold dark:text-muted-dark"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="rule">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted dark:text-muted-dark md:flex-row">
          <span>© {year} {SITE.name}. All rights reserved.</span>
          <span className="font-mono tracking-widest">MADE BY THE CLASS, FOR THE CLASS</span>
        </Container>
      </div>
    </footer>
  );
}
