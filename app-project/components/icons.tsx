import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconMegaphone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5V9L6 9H5a2 2 0 0 0-2 2Z" />
      <path d="M9 9l10-4v14L9 15" />
      <path d="M18 9a3 3 0 0 1 0 6" />
    </svg>
  );
}

export function IconNewspaper(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
      <path d="M19 8v9a2 2 0 0 0 2-2V8" />
      <path d="M7 8.5h6M7 12h6M7 15.5h4" />
    </svg>
  );
}

export function IconTrophy(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" />
      <path d="M12 13v3M9 20h6M10 20v-2.2a2 2 0 0 1 4 0V20" />
    </svg>
  );
}

export function IconMedal(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="15" r="5" />
      <path d="M9.5 5 7 12M14.5 5 17 12" />
      <path d="M12 13v4" />
    </svg>
  );
}

export function IconStar(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4l2.3 4.9 5.2.6-3.9 3.6.9 5.3L12 15.9 7.5 18.4l.9-5.3-3.9-3.6 5.2-.6L12 4Z" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6a2 2 0 0 1 2-2h6v16H6a2 2 0 0 0-2 2V6Z" />
      <path d="M20 6a2 2 0 0 0-2-2h-6v16h6a2 2 0 0 1 2 2V6Z" />
    </svg>
  );
}

export function IconUsers(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17.5" cy="9" r="2.5" />
      <path d="M15 12.2a5 5 0 0 1 6.5 4.8" />
    </svg>
  );
}

export function IconTarget(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconCake(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7" />
      <path d="M4 21h16" />
      <path d="M4 17c1.2 1 2.4 1 3.5 0s2.3-1 3.5 0 2.3 1 3.5 0 2.3-1 3.5 0" />
      <path d="M9 12V9M12 12V9M15 12V9" />
      <path d="M9 6.5c0-1 .7-1.3.7-2S9 3 9 3M12 6.5c0-1 .7-1.3.7-2S12 3 12 3M15 6.5c0-1 .7-1.3.7-2S15 3 15 3" />
    </svg>
  );
}

export function IconChevronDown(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconMail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

export function IconCheckCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5.4" />
    </svg>
  );
}

export function IconMessageSquare(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </svg>
  );
}

export function IconX(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconSend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12 20 4.5l-4.5 15.5-4-6.5-6.5-1.5Z" />
      <path d="M11.5 13.5 20 4.5" />
    </svg>
  );
}

export function IconSparkles(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M4.5 12h4M15.5 12h4" />
      <path d="M7 7l2 2M17 17l-2-2M17 7l-2 2M7 17l2-2" />
    </svg>
  );
}

export function IconHelpCircle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.5 2.5 0 1 1 3.7 2.2c-.9.5-1.2 1-1.2 2" />
      <circle cx="12" cy="16.3" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4 18v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="7.5" width="17" height="11" rx="2" />
      <path d="M8.5 7.5v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
      <path d="M3.5 12.5h17" />
    </svg>
  );
}

export function IconClipboardCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5.5" y="4.5" width="13" height="16" rx="2" />
      <path d="M9 4.5V4a2 2 0 0 1 2-1.5h2A2 2 0 0 1 15 4v.5" />
      <path d="M9 13l2 2 4-4.5" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10 8.5l6 3.5-6 3.5v-7Z" />
    </svg>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h4l2 2.5h7A1.5 1.5 0 0 1 20 9v8.5A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-11Z" />
    </svg>
  );
}

export function IconFileText(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h2" />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export const ACHIEVEMENT_ICONS = {
  trophy: IconTrophy,
  medal: IconMedal,
  star: IconStar,
  book: IconBook,
  users: IconUsers,
  target: IconTarget,
};
