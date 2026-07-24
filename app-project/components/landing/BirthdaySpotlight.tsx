import { getUpcomingBirthdays } from "@/lib/mock-data";
import EmptyState from "../EmptyState";
import { IconCake } from "../icons";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CONFETTI_COLORS = ["bg-brass-400", "bg-brass-300", "bg-ink-300", "bg-emerald-300"];

export default async function BirthdaySpotlight() {
  const now = new Date();
  const birthdays = await getUpcomingBirthdays(now);
  const monthName = MONTH_NAMES[now.getMonth()];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brass-200 bg-gradient-to-br from-brass-50 via-white to-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-brass-500 text-white shadow-card">
          <IconCake className="h-6 w-6 animate-float" />
          {birthdays.length > 0 && (
            <span className="pointer-events-none absolute inset-0" aria-hidden="true">
              {CONFETTI_COLORS.map((color, i) => (
                <span
                  key={i}
                  className={`absolute top-0 h-1.5 w-1.5 rounded-full ${color} animate-confetti`}
                  style={{
                    left: `${18 + i * 20}%`,
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              ))}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brass-600">
            Birthday Showcase
          </p>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Celebrating in {monthName}
          </h2>
        </div>
      </div>

      {birthdays.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<IconCake className="h-8 w-8" />}
            title="No birthdays this month"
            message="Check back next month for the next round of celebrations."
          />
        </div>
      ) : (
        <ul className="mt-6 flex flex-wrap gap-3">
          {birthdays.map((birthday, i) => (
            <li
              key={birthday.id}
              className="flex animate-pop-in items-center gap-2 rounded-full border border-brass-200 bg-white px-4 py-2 shadow-card"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <IconCake className="h-4 w-4 text-brass-500" />
              <span className="text-sm font-medium text-ink-800">{birthday.name}</span>
              <span className="text-xs text-ink-400">
                {monthName.slice(0, 3)} {birthday.day}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
