# Class Site — Core Infrastructure & Authentication

Foundational Next.js (App Router) application: TypeScript, Tailwind CSS, admin
authentication backed by environment variables, and the shared layout every
other module will build on top of.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000. The admin login lives at `/login`; protected
pages live under `/admin/*`.

## Required environment variables

| Variable | Purpose |
|---|---|
| `ADMIN_USERNAME` | The only valid admin username. No public registration exists. |
| `ADMIN_PASSWORD` | The only valid admin password. |
| `SESSION_SECRET` | Long random string used to sign session + nothing else. Generate with `openssl rand -base64 48`. |
| `SESSION_MAX_AGE_MINUTES` | Inactivity timeout for the session cookie (default 30). |

Credentials are never hardcoded — if either `ADMIN_USERNAME` or
`ADMIN_PASSWORD` is missing, every login attempt is rejected.

## How authentication works

- **Session**: a signed JWT (HS256, via `jose`) stored in an `httpOnly`,
  `sameSite=lax`, `secure`-in-production cookie (`lib/session.ts`). It's
  short-lived and reissued on login, giving an inactivity-style timeout.
- **CSRF**: double-submit cookie pattern (`lib/csrf.ts`). The login page
  generates a token server-side, sets it as an `httpOnly` cookie, and renders
  the same value into a hidden form field. The login API compares the two.
- **Rate limiting**: in-memory, 5 failed attempts per 15-minute window per IP
  (`lib/rate-limit.ts`). This is process-local — fine for a single-instance
  deploy; swap in a shared store (e.g. Upstash Redis) if this ever runs on
  multiple instances.
- **Route protection**: `middleware.ts` verifies the session cookie at the
  edge for any `/admin/*` route and redirects to `/login` if it's missing or
  invalid. It also bounces already-authenticated users away from `/login`.
- **Security headers**: set globally in `next.config.js` (CSP, HSTS,
  X-Frame-Options, etc.) so they apply to every response, not just admin
  routes.

## Integration points for other modules

- **Layout**: `app/layout.tsx` renders `Navigation`, `Footer`, and a toast
  provider around every page. New public routes just need a `page.tsx` under
  `app/`; they inherit the shared chrome automatically.
- **Navigation**: add new public routes to `NAV_LINKS` in
  `components/Navigation.tsx`.
- **Footer**: `components/Footer.tsx` exposes a `QUICK_LINKS` array — extend
  it rather than duplicating the footer markup.
- **Auth context for admin UI**: any client component under `/admin/*` can
  call `useAdminSession()` from `components/AdminSessionProvider.tsx` to read
  the signed-in username or trigger `logout()`. Server components/route
  handlers should call `getSession()` from `lib/session.ts` directly.
- **New admin routes**: anything under `app/admin/` is automatically covered
  by the middleware matcher and the layout's server-side session check — no
  extra wiring needed.
- **New protected API routes**: call `getSession()` from `lib/session.ts` at
  the top of the handler and return `401` if it's `null`.

## Notes / things to revisit as the app grows

- The rate limiter resets on redeploy and doesn't share state across
  instances — acceptable for a single-admin site, worth upgrading before any
  multi-instance deploy.
- There's no password reset flow by design — credentials are rotated by
  editing environment variables and redeploying.

## Student & Teacher Management module

Everything for managing the roster lives under `/admin/*`, so it's covered by
the existing middleware and layout auth check with no extra wiring.

- **Data**: `lib/student-data.ts` holds mock students, teachers, class
  officers, attendance records, and progress entries, following the same
  async-getter pattern as `lib/mock-data.ts`. Attendance and enrollment
  mutations happen on in-memory arrays — same single-instance caveat as the
  rate limiter above; swap the function bodies for real queries when a
  database exists and every call site keeps working unmodified.
- **Pages**: `/admin/students` (searchable, filterable, paginated roster with
  bulk actions and CSV export), `/admin/students/[id]` (full profile:
  personal info, attendance history, achievement badges, progress charts),
  `/admin/teachers` (directory grouped by department, expandable bios),
  `/admin/officers` (roles, responsibilities, contact info).
- **API routes**: `app/api/admin/{students,teachers,officers,stats}` — every
  handler calls `getSession()` and returns `401` if there's no session,
  matching the pattern described above for new protected API routes.
- **Achievements**: student profiles pull from the existing
  `getAchievements()` in `lib/mock-data.ts`, matching on `recipient` — no
  duplicate achievement data was introduced.
- **Integration stubs for modules that don't exist yet**:
  - `lib/notifications.ts` — `notifyAttendanceChange()` is called on every
    attendance change; replace the body with a real dispatch once the
    Notification module exists.
  - `lib/search-index.ts` — `indexStudent()` / `indexTeacher()` are called on
    create/update; replace the body with a real index upsert once the Search
    module exists.
  - The student profile page has a placeholder "Schedule" section ready for
    the Schedule module to fill in, matching the style of the `/about`
    placeholder page.

