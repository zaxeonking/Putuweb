export interface NavLink {
  index: string; // roll-call number, e.g. "01"
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  index: string;
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "github" | "instagram" | "mail" | "linkedin";
}

// Shape for classmate cards on the Members page.
export interface ClassMember {
  id: string;
  attendanceNumber: number;
  name: string;
  role?: string; // optional class position, e.g. "Class Leader"
  initials: string;
  bio?: string; // shown in the member modal
}

export interface QuickInfoItem {
  index: string; // roll-call number, e.g. "01"
  icon: "users" | "user-round" | "calendar" | "map-pin" | "graduation-cap";
  label: string;
  value: string;
}

export interface PhilosophyPillar {
  index: string;
  icon: "heart-handshake" | "trending-up" | "shield-check" | "sparkles";
  title: string;
  description: string;
}

export interface MissionItem {
  index: string;
  text: string;
}

export interface MottoPart {
  word: string;
  meaning: string;
}

export interface TimelineMilestone {
  index: string;
  date: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Organization Structure page
// ---------------------------------------------------------------------------

export interface OrgMember {
  id: string;
  index: string; // roll-call style number within its group
  name: string;
  role: string;
  initials: string; // fallback shown on the photo placeholder
}

export interface OrgGroup {
  id: string;
  index: string; // section number, e.g. "01"
  title: string;
  description?: string;
  members: OrgMember[];
}

// ---------------------------------------------------------------------------
// Lesson Schedule page
// ---------------------------------------------------------------------------

export type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export interface ScheduleEntry {
  subject: string;
  teacher?: string;
  colorKey: string; // key into SUBJECT_COLORS
}

export interface SchedulePeriodRow {
  type: "period";
  period: number;
  time: string;
  entries: Partial<Record<Weekday, ScheduleEntry>>;
}

export interface ScheduleBreakRow {
  type: "break";
  time: string;
  label: string;
}

export type ScheduleRow = SchedulePeriodRow | ScheduleBreakRow;

// ---------------------------------------------------------------------------
// Cleaning Duty Schedule page
// ---------------------------------------------------------------------------

export interface CleaningDutyGroup {
  day: Weekday;
  focus: string; // short label for the day's cleaning emphasis, e.g. "Floors & Furniture"
  icon: "sparkles" | "trash" | "spray" | "wind" | "droplets";
  tasks: string[];
  leadNumber: number; // attendance number of the day's team lead
  memberNumbers: number[]; // attendance numbers on duty, lead included
}

// ---------------------------------------------------------------------------
// Achievements page
// ---------------------------------------------------------------------------

export type AchievementLevel = "School" | "Regency" | "Provincial" | "National";
export type AchievementScope = "class" | "student";
export type AchievementCategory = "Academic" | "Sports" | "Arts" | "Technology" | "Class Spirit";
export type MedalTier = "Gold" | "Silver" | "Bronze" | "Finalist";

export interface Achievement {
  id: string;
  scope: AchievementScope;
  title: string;
  category: AchievementCategory;
  level: AchievementLevel;
  year: string;
  placement: string; // e.g. "1st Place", "Gold Medalist", "Champion"
  recipient?: string; // student name — present when scope is "student"
  description: string;
}

export interface CompetitionAward {
  id: string;
  competition: string;
  organizer: string;
  level: AchievementLevel;
  tier: MedalTier;
  year: string;
  representative: string; // a student's name, or "Class X-7 Team"
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  recipient: string;
  year: string;
  category: AchievementCategory;
}

// ---------------------------------------------------------------------------
// Class Information section (on The Class page)
// ---------------------------------------------------------------------------

export interface ClassInfoItem {
  index: string;
  icon: "school" | "calendar-days" | "user-round" | "users" | "mars" | "venus" | "map-pin";
  label: string;
  value: string;
  helper?: string;
}

export interface ContactChannel {
  index: string;
  icon: "mail" | "phone" | "instagram";
  label: string;
  value: string;
  href: string;
}

export interface AchievementTimelineEntry {
  index: string;
  year: string;
  title: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Gallery page
// ---------------------------------------------------------------------------

export type GalleryCategoryId =
  | "all"
  | "field-day"
  | "gatherings"
  | "trips"
  | "academics"
  | "celebrations"
  | "candid";

export interface GalleryCategoryOption {
  id: GalleryCategoryId;
  label: string;
  icon: "layout-grid" | "trophy" | "users" | "bus" | "book-open" | "party-popper" | "camera";
}

export type PhotoOrientation = "portrait" | "landscape" | "square" | "tall" | "wide";

export interface GalleryPhoto {
  id: string;
  title: string;
  category: Exclude<GalleryCategoryId, "all">;
  date: string; // e.g. "Sep 2023"
  orientation: PhotoOrientation;
  description: string;
  featured?: boolean;
}
