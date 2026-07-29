import { School, CalendarDays, UserRound, Users, MapPin } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GenderGlyph } from "@/components/ui/GenderGlyph";
import { ClassInfoItem } from "@/types";

// Mars/Venus are handled separately via GenderGlyph (see that file for why),
// so this map only needs to cover the plain lucide-backed icons.
const LUCIDE_ICONS = {
  school: School,
  "calendar-days": CalendarDays,
  "user-round": UserRound,
  users: Users,
  "map-pin": MapPin,
} as const;

type LucideIconKey = keyof typeof LUCIDE_ICONS;

interface ClassInfoCardProps {
  item: ClassInfoItem;
  delay?: number;
}

export function ClassInfoCard({ item, delay = 0 }: ClassInfoCardProps) {
  const isGenderIcon = item.icon === "mars" || item.icon === "venus";
  const LucideIcon = isGenderIcon ? null : LUCIDE_ICONS[item.icon as LucideIconKey];

  return (
    <Card interactive delay={delay} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="index-label">{item.index}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 ease-ledger group-hover:scale-105 group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:text-muted-dark">
          {isGenderIcon ? (
            <GenderGlyph gender={item.icon as "mars" | "venus"} size={16} />
          ) : (
            LucideIcon && <LucideIcon size={16} />
          )}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted dark:text-muted-dark">{item.label}</p>
        <p className="mt-1 font-display text-xl font-semibold leading-snug text-ink dark:text-ink-dark sm:text-2xl">
          {item.value}
        </p>
        {item.helper && (
          <p className="mt-0.5 text-xs text-muted dark:text-muted-dark">{item.helper}</p>
        )}
      </div>
    </Card>
  );
}
