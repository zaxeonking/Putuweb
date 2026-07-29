# PUTU — Class X-7 Profile Site

A modern, minimal class-profile website for **PUTU (Class X-7)**. No login,
no database, no backend — all content lives as typed dummy data in
`src/lib/constants.ts`, ready to be swapped for the real thing.

## Stack

- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Framer Motion**
- **next-themes** for dark/light mode
- **lucide-react** for icons

## Design concept: "Roll call"

The site borrows from a classroom ledger / roll-call sheet: hairline rules,
a monospace "index number" (`01`, `02`...) attached to every nav item and
footer group, and a pen-underline hover effect on links. Numbering is used
because it's true to the content — a class roster is literally a numbered
list — not as decoration.

**Palette**

| Token       | Light      | Dark        | Use                       |
| ----------- | ---------- | ----------- | -------------------------- |
| `paper`     | `#F3F4F1`  | `#14171F`   | Page background            |
| `surface`   | `#FFFFFF`  | `#1B1F2A`   | Cards / raised panels      |
| `ink`       | `#1F2430`  | `#E7E6E1`   | Primary text               |
| `muted`     | `#6B7080`  | `#9498A6`   | Secondary text             |
| `line`      | `#D8D6CC`  | `#2C3140`   | Hairline rules / borders   |
| `marigold`  | `#E8A33D`  | `#F0B45B`   | Accent / hover / active    |
| `ivy`       | `#3F6B52`  | `#6FA98A`   | Secondary accent           |

**Type**

- Display: `Fraunces` (headings, used with restraint)
- Body: `Inter`
- Utility/mono: `JetBrains Mono` (index numbers, captions, labels)

## Pages

| Route            | Description                                              |
| ----------------- | --------------------------------------------------------- |
| `/`               | Home — hero + at-a-glance quick info                       |
| `/class`          | About, class info, contact, history, vision, mission, philosophy, motto, timeline |
| `/organization`   | Homeroom teacher + class leadership structure               |
| `/members`        | Searchable/filterable roll call of all 36 students          |
| `/schedule`       | Weekly Mon–Fri lesson schedule                              |
| `/cleaning-duty`  | Weekly Mon–Fri cleaning duty roster                          |
| `/achievements`   | Class + student achievements, competition awards, certificates |
| `/gallery`        | Filterable photo gallery (categorized placeholders)          |

The nav's "Timeline" and "Contact" entries link to anchored sections within
`/class` (`/class#timeline`, `/class#contact`) rather than separate routes,
since that content already lives there.

## Folder structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout: fonts, metadata, ThemeProvider, Navbar/Footer shell
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Global route loading UI
│   ├── not-found.tsx      # Custom 404
│   ├── error.tsx          # Root error boundary
│   ├── icon.tsx            # Generated favicon (next/og)
│   ├── apple-icon.tsx      # Generated apple-touch-icon (next/og)
│   ├── manifest.ts         # Web app manifest
│   ├── sitemap.ts          # Generated sitemap.xml
│   ├── robots.ts           # Generated robots.txt
│   ├── globals.css         # Design tokens applied as base styles
│   ├── class/page.tsx
│   ├── organization/page.tsx
│   ├── members/page.tsx
│   ├── schedule/page.tsx
│   ├── cleaning-duty/page.tsx
│   ├── achievements/page.tsx
│   └── gallery/page.tsx
├── components/
│   ├── layout/     # Navbar, Footer, MobileMenu, ThemeToggle, ScrollProgressBar
│   ├── home/       # Hero, ClassPhoto, QuickInfoCard/Grid, ScrollIndicator
│   ├── about/       # /class page sections (SectionHeading is shared across them)
│   ├── organization/
│   ├── members/
│   ├── schedule/
│   ├── cleaning-duty/
│   ├── achievements/
│   ├── gallery/
│   └── ui/          # Shared primitives: Button, Card, Badge, Modal, Container, Logo, NavLink, PageIntro
├── providers/
│   └── ThemeProvider.tsx
├── lib/
│   ├── constants.ts # All site/nav/footer/page content — edit here
│   └── utils.ts      # cn() class merge helper
└── types/
    └── index.ts       # Shared TypeScript interfaces for every data shape
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint     # ESLint (next/core-web-vitals)
```

## Deploying to Vercel

1. Push this project to a Git repository.
2. Import it in [Vercel](https://vercel.com/new) — the Next.js framework
   preset is detected automatically, no configuration needed.
3. Set the `NEXT_PUBLIC_SITE_URL` environment variable to your production
   domain (e.g. `https://your-domain.vercel.app`). It's used for
   `metadataBase`, the sitemap, and `robots.txt`; it falls back to a
   placeholder if unset.
4. Deploy. No database, auth, or other secrets are required.

## Notes

- Dependencies in `package.json` are pinned to exact versions (no `^`/`~`)
  since this repo doesn't ship a `package-lock.json`. Run `npm install`
  once and commit the generated lockfile so every install — local and on
  Vercel — resolves identical versions.
- Dark/light mode uses the `class` strategy and respects the system
  preference by default; toggle lives in the navbar.
- All animations respect `prefers-reduced-motion`.
- No environment variables are required to run the site — only
  `NEXT_PUBLIC_SITE_URL` is recommended for correct production SEO metadata.
- No real photos exist yet — the gallery, member cards, and class photo all
  use intentional, labeled placeholders instead of broken `<img>` tags.
