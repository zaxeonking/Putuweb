import { Users, UserRound, Calendar, MapPin, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { QuickInfoItem } from "@/types";

const ICONS: Record<QuickInfoItem["icon"], typeof Users> = {
  users: Users,
  "user-round": UserRound,
  calendar: Calendar,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
};

export function QuickInfoCard({ index, icon, label, value }: QuickInfoItem & { delay?: number }) {
  const Icon = ICONS[icon];

  return (
    <Card interactive animate={false} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="index-label">{index}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-marigold group-hover:text-marigold dark:border-line-dark dark:text-muted-dark">
          <Icon size={16} />
        </div>
      </div>
      <div>
        <p className="text-sm text-muted dark:text-muted-dark">{label}</p>
        <p className="mt-1 font-display text-xl font-semibold text-ink dark:text-ink-dark">
          {value}
        </p>
      </div>
    </Card>
  );
}
