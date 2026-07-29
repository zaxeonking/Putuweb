import {
  Achievement,
  AchievementTimelineEntry,
  Certificate,
  ClassInfoItem,
  ClassMember,
  CleaningDutyGroup,
  CompetitionAward,
  ContactChannel,
  FooterLinkGroup,
  GalleryCategoryOption,
  GalleryPhoto,
  MissionItem,
  MottoPart,
  NavLink,
  OrgGroup,
  PhilosophyPillar,
  QuickInfoItem,
  ScheduleRow,
  SocialLink,
  TimelineMilestone,
  Weekday,
} from "@/types";

// Canonical production URL — used for metadataBase, sitemap, robots, and
// OpenGraph. Override at deploy time with NEXT_PUBLIC_SITE_URL if the class
// ends up hosting this somewhere other than the default Vercel domain.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://putu-x7.vercel.app";

export const SITE = {
  // PUTU is the primary brand — the class's own name for itself.
  // "Class X-7" is the official designation, shown as context/subtitle.
  name: "PUTU",
  classCode: "X-7",
  fullName: "Class X-7",
  shortName: "PUTU",
  motto: "Unity in Every Name Called.",
  tagline: "One roll call. One story, told by everyone in it.",
  welcome:
    "Welcome to the official home of PUTU — Class X-7. This is where our roll call becomes a record: the people, the milestones, and the small moments that make this class ours.",
};

export const QUICK_INFO: QuickInfoItem[] = [
  { index: "01", icon: "users", label: "Students", value: "36" },
  { index: "02", icon: "user-round", label: "Homeroom Teacher", value: "Mrs. Ayu Lestari" },
  { index: "03", icon: "calendar", label: "Academic Year", value: "2025 / 2026" },
  { index: "04", icon: "map-pin", label: "Homeroom", value: "Room X-7" },
];

// ---------------------------------------------------------------------------
// About page content — all dummy copy, written to be swapped out easily.
// ---------------------------------------------------------------------------

export const ABOUT = {
  intro: {
    eyebrow: "02 — The Class",
    title: "About PUTU",
    lead:
      "PUTU is the name Class X-7 gave itself — short, easy to call across a room, and stuck ever since. This page is the long version of who we are: where we started, what we're working toward, and why our roll call means more to us than attendance.",
  },
  history: {
    paragraphs: [
      "Class X-7 — known to its own members as PUTU — was formed in July 2023, when 36 students were called together for the first roll call of the year in Room X-7. What began as a list of names read aloud grew, over the following weeks, into something closer to a shared rhythm: the same room, the same homeroom hour, the same quiet joke about who'd answer \"present\" last.",
      "By the second semester, the nickname PUTU had taken over completely, and the class had already collected its first traditions — a weekly Friday gathering, an annual class photo, a running joke that has now outlived three substitute teachers. None of it was planned. It just kept happening, the way roll call keeps happening, one name at a time.",
      "This page exists to keep that record straight — not a highlight reel, but a log. The same way a roll call doesn't skip a name, this history tries not to skip a moment.",
    ],
  },
  vision:
    "A class where every name called is a name that belongs — remembered, counted, and never left to the margins.",
  mission: [
    { index: "01", text: "Show up for every roll call, in the room and outside of it." },
    { index: "02", text: "Keep a record worth looking back on in ten years." },
    { index: "03", text: "Turn a shared homeroom into a shared history." },
    { index: "04", text: "Celebrate every name equally — in effort, and in memory." },
  ] as MissionItem[],
  philosophy: [
    {
      index: "01",
      icon: "heart-handshake",
      title: "Unity",
      description: "One list, not thirty-six separate lines. What happens to one name happens to the class.",
    },
    {
      index: "02",
      icon: "trending-up",
      title: "Growth",
      description: "Every entry in the record is a step further than the last — the point isn't to stay the same.",
    },
    {
      index: "03",
      icon: "shield-check",
      title: "Integrity",
      description: "The roll call doesn't lie about who showed up. We hold ourselves to the same honesty.",
    },
    {
      index: "04",
      icon: "sparkles",
      title: "Belonging",
      description: "No name is called louder than another. Every entry gets the same weight on the page.",
    },
  ] as PhilosophyPillar[],
  motto: {
    phrase: "Unity in Every Name Called.",
    parts: [
      { word: "Unity", meaning: "We function as one class, not a room of individual entries." },
      { word: "in Every", meaning: "No exceptions — the motto applies to all 36 names, not just the loudest ones." },
      { word: "Name Called", meaning: "A nod to roll call itself: the daily ritual that first brought this class together." },
    ] as MottoPart[],
    summary:
      "Put simply: nobody in X-7 is background noise. Every name on the roll call carries the same weight — and that's the whole philosophy in five words.",
  },
  timeline: [
    {
      index: "01",
      date: "Jul 2023",
      title: "Roll Call Zero",
      description: "The first day of X-7. 36 names, read aloud in Room X-7, for the very first time.",
    },
    {
      index: "02",
      date: "Sep 2023",
      title: "The First Photo",
      description: "The class's inaugural group photo — still framed at the back of the homeroom.",
    },
    {
      index: "03",
      date: "Feb 2024",
      title: "PUTU Is Born",
      description: "A months-old nickname is put to an informal class vote — and wins, unanimously.",
    },
    {
      index: "04",
      date: "Jun 2024",
      title: "First Field Day Trophy",
      description: "X-7 wins its first inter-class field day, and the trophy gets its own shelf.",
    },
    {
      index: "05",
      date: "Jan 2025",
      title: "Midpoint Assembly",
      description: "Halfway through the journey, the class holds a reflection session on how far it's come.",
    },
    {
      index: "06",
      date: "2026 — Present",
      title: "Writing the Next Entry",
      description: "The record continues. This website is the newest page in it.",
    },
  ] as TimelineMilestone[],
};

// ---------------------------------------------------------------------------
// Class Information — the concrete vitals behind the story above: school,
// year, teacher, headcount, and how to reach the class.
// ---------------------------------------------------------------------------

export const CLASS_INFO_SECTION = {
  index: "03",
  title: "Class Information",
  lead: "The vitals behind the story — school, year, teacher, and everyone counted in the roll call.",
};

export const CLASS_INFO = {
  schoolName: "SMA Negeri 1",
  academicYear: "2025 / 2026",
  homeroomTeacher: "Mrs. Ayu Lestari",
  totalStudents: 36,
  maleStudents: 19,
  femaleStudents: 17,
  classroom: "Room X-7",
  classroomDetail: "Second Floor, East Wing",
};

export const CLASS_INFO_CARDS: ClassInfoItem[] = [
  { index: "01", icon: "school", label: "School Name", value: CLASS_INFO.schoolName, helper: SITE.fullName },
  { index: "02", icon: "calendar-days", label: "Academic Year", value: CLASS_INFO.academicYear },
  { index: "03", icon: "user-round", label: "Homeroom Teacher", value: CLASS_INFO.homeroomTeacher },
  { index: "04", icon: "users", label: "Number of Students", value: String(CLASS_INFO.totalStudents), helper: "Total enrolled" },
  { index: "05", icon: "mars", label: "Male Students", value: String(CLASS_INFO.maleStudents) },
  { index: "06", icon: "venus", label: "Female Students", value: String(CLASS_INFO.femaleStudents) },
  { index: "07", icon: "map-pin", label: "Classroom Location", value: CLASS_INFO.classroom, helper: CLASS_INFO.classroomDetail },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  { index: "01", icon: "mail", label: "Email", value: "x7.putu@smanegeri1.sch.id", href: "mailto:x7.putu@smanegeri1.sch.id" },
  { index: "02", icon: "phone", label: "Phone / WhatsApp", value: "+62 812-3456-7890", href: "tel:+6281234567890" },
  { index: "03", icon: "instagram", label: "Instagram", value: "@putu.x7", href: "#" },
];

// ---------------------------------------------------------------------------
// Organization Structure page content — dummy names, real shape.
// ---------------------------------------------------------------------------

export const ORGANIZATION = {
  intro: {
    eyebrow: "03 — Organization",
    title: "Organization Structure",
    lead: "Every roll call needs someone keeping the ledger straight. Here's who holds which line in X-7 — from the front of the room to every corner of it.",
  },
  teacher: {
    id: "teacher",
    index: "00",
    name: "Mrs. Ayu Lestari",
    role: "Homeroom Teacher",
    initials: "AL",
  },
  groups: [
    {
      id: "leadership",
      index: "01",
      title: "Class Leadership",
      description: "The two names called first — steering the room day to day.",
      members: [
        { id: "class-leader", index: "01", name: "Raka Pratama", role: "Class Leader", initials: "RP" },
        { id: "vice-leader", index: "02", name: "Salsabila Putri", role: "Vice Leader", initials: "SP" },
      ],
    },
    {
      id: "administration",
      index: "02",
      title: "Secretaries & Treasurers",
      description: "Keeping the record and the till in equally good order.",
      members: [
        { id: "secretary-1", index: "01", name: "Nadia Wulandari", role: "Secretary 1", initials: "NW" },
        { id: "secretary-2", index: "02", name: "Fajar Ramadhan", role: "Secretary 2", initials: "FR" },
        { id: "treasurer-1", index: "03", name: "Bagas Setiawan", role: "Treasurer 1", initials: "BS" },
        { id: "treasurer-2", index: "04", name: "Dinda Anggraini", role: "Treasurer 2", initials: "DA" },
      ],
    },
    {
      id: "coordinators",
      index: "03",
      title: "Section Coordinators",
      description: "The people making sure the room, the gear, and everyone in it stay looked after.",
      members: [
        { id: "cleanliness", index: "01", name: "Intan Permata", role: "Cleanliness Coordinator", initials: "IP" },
        { id: "equipment", index: "02", name: "Yusuf Maulana", role: "Equipment Coordinator", initials: "YM" },
        { id: "security", index: "03", name: "Reza Firmansyah", role: "Security Coordinator", initials: "RF" },
        { id: "documentation", index: "04", name: "Cinta Amelia", role: "Documentation Coordinator", initials: "CA" },
        { id: "health", index: "05", name: "Galih Nugraha", role: "Health & Safety Coordinator", initials: "GN" },
      ],
    },
  ] as OrgGroup[],
};

// ---------------------------------------------------------------------------
// Members page content — the full 36-name roll call.
// ---------------------------------------------------------------------------

export const MEMBERS_PAGE = {
  eyebrow: "04 — Members",
  title: "Class Members",
  lead: "All 36 names on the X-7 roll call — searchable, filterable, and each one worth a closer look.",
};

export const STUDENTS: ClassMember[] = [
  { id: "s01", attendanceNumber: 1, name: "Aditya Nugroho", initials: "AN", bio: "Keeps a running tally of every class trivia night — and usually wins it." },
  { id: "s02", attendanceNumber: 2, name: "Bagas Setiawan", role: "Treasurer 1", initials: "BS", bio: "Guards the class fund like it's a national reserve. Receipts always filed same-day." },
  { id: "s03", attendanceNumber: 3, name: "Bella Anjani", initials: "BA", bio: "The class's unofficial photographer — half the gallery page is her doing." },
  { id: "s04", attendanceNumber: 4, name: "Candra Wijaya", initials: "CW", bio: "Can recite the school anthem backwards. Nobody has verified this claim." },
  { id: "s05", attendanceNumber: 5, name: "Cinta Amelia", role: "Documentation Coordinator", initials: "CA", bio: "If it happened in X-7, there's a photo of it — and Cinta took it." },
  { id: "s06", attendanceNumber: 6, name: "Devi Kartika", initials: "DK", bio: "Front-row regular. Has never once forgotten her homework diary." },
  { id: "s07", attendanceNumber: 7, name: "Dinda Anggraini", role: "Treasurer 2", initials: "DA", bio: "Splits every group expense down to the last rupiah, fairly and fast." },
  { id: "s08", attendanceNumber: 8, name: "Eka Saputra", initials: "ES", bio: "Runs the class group chat's meme desk. Peer-reviewed for maximum quality." },
  { id: "s09", attendanceNumber: 9, name: "Fajar Ramadhan", role: "Secretary 2", initials: "FR", bio: "Backup note-taker who somehow writes faster than the teacher talks." },
  { id: "s10", attendanceNumber: 10, name: "Farah Az-Zahra", initials: "FZ", bio: "Class librarian in spirit — always has a book to lend between periods." },
  { id: "s11", attendanceNumber: 11, name: "Galih Nugraha", role: "Health & Safety Coordinator", initials: "GN", bio: "Keeps the first-aid kit stocked and the emergency numbers on the wall." },
  { id: "s12", attendanceNumber: 12, name: "Gilang Pratomo", initials: "GP", bio: "The one who remembers everyone's birthday before the calendar does." },
  { id: "s13", attendanceNumber: 13, name: "Hana Puspita", initials: "HP", bio: "Plant-corner caretaker. The homeroom succulents answer to her." },
  { id: "s14", attendanceNumber: 14, name: "Ilham Firdaus", initials: "IF", bio: "Field day MVP two years running. Retirement not yet announced." },
  { id: "s15", attendanceNumber: 15, name: "Intan Permata", role: "Cleanliness Coordinator", initials: "IP", bio: "Runs the cleaning roster like clockwork — no corner of Room X-7 left behind." },
  { id: "s16", attendanceNumber: 16, name: "Jihan Maharani", initials: "JM", bio: "Class debate champion. Will happily argue either side, just for the sport of it." },
  { id: "s17", attendanceNumber: 17, name: "Kirana Amara", initials: "KA", bio: "Keeps the class playlist alive — one new song added every Friday." },
  { id: "s18", attendanceNumber: 18, name: "Krisna Adiwijaya", initials: "KA", bio: "The whiteboard's best friend — diagrams appear whenever he explains anything." },
  { id: "s19", attendanceNumber: 19, name: "Laras Kusuma", initials: "LK", bio: "Keeps a shared notes doc so detailed it should come with a table of contents." },
  { id: "s20", attendanceNumber: 20, name: "Made Wirawan", initials: "MW", bio: "Never late to homeroom — sets his alarm twenty minutes ahead of everyone else's." },
  { id: "s21", attendanceNumber: 21, name: "Nadia Wulandari", role: "Secretary 1", initials: "NW", bio: "Keeps the class minutes cleaner than most published reports." },
  { id: "s22", attendanceNumber: 22, name: "Naila Zahra", initials: "NZ", bio: "Resident peacemaker — settles more group-project disputes than the teacher does." },
  { id: "s23", attendanceNumber: 23, name: "Oktavia Rahmawati", initials: "OR", bio: "Keeps a sketchbook full of the class's inside jokes, illustrated." },
  { id: "s24", attendanceNumber: 24, name: "Prima Wibowo", initials: "PW", bio: "The quiet strategist behind most of the class's field day wins." },
  { id: "s25", attendanceNumber: 25, name: "Raka Pratama", role: "Class Leader", initials: "RP", bio: "First name called, first one to answer for the whole room." },
  { id: "s26", attendanceNumber: 26, name: "Rangga Saputra", initials: "RS", bio: "Can fix a jammed projector faster than IT can be called." },
  { id: "s27", attendanceNumber: 27, name: "Reza Firmansyah", role: "Security Coordinator", initials: "RF", bio: "Last one to leave the room — makes sure the door's locked, every time." },
  { id: "s28", attendanceNumber: 28, name: "Salsabila Putri", role: "Vice Leader", initials: "SP", bio: "Covers for the class leader without missing a beat, roll call or not." },
  { id: "s29", attendanceNumber: 29, name: "Siti Nur Aini", initials: "SA", bio: "Keeps everyone's group-project deadlines straight — including her own." },
  { id: "s30", attendanceNumber: 30, name: "Taufik Hidayat", initials: "TH", bio: "The class's unofficial statistician — knows every exam average by heart." },
  { id: "s31", attendanceNumber: 31, name: "Umar Al Fatih", initials: "UF", bio: "Runs the Friday gathering setup — chairs arranged before anyone else arrives." },
  { id: "s32", attendanceNumber: 32, name: "Vina Marlina", initials: "VM", bio: "Keeps the class group chat's shared calendar impressively up to date." },
  { id: "s33", attendanceNumber: 33, name: "Wahyu Setiadi", initials: "WS", bio: "The one who always has a spare pen. And a spare for the spare." },
  { id: "s34", attendanceNumber: 34, name: "Yola Anggita", initials: "YA", bio: "Class trip logistics, unofficially handled by her since day one." },
  { id: "s35", attendanceNumber: 35, name: "Yusuf Maulana", role: "Equipment Coordinator", initials: "YM", bio: "Knows exactly which cupboard has the extra chalk. Every time." },
  { id: "s36", attendanceNumber: 36, name: "Zahra Kamila", initials: "ZK", bio: "Closes every roll call with the same line: \"present, and accounted for.\"" },
];

// ---------------------------------------------------------------------------
// Lesson Schedule page content
// ---------------------------------------------------------------------------

export const SCHEDULE_PAGE = {
  eyebrow: "05 — Schedule",
  title: "Lesson Schedule",
  lead: "The weekly rhythm of Room X-7 — every period, every subject, Monday through Friday.",
};

export const WEEKDAYS: { day: Weekday; short: string }[] = [
  { day: "Monday", short: "Mon" },
  { day: "Tuesday", short: "Tue" },
  { day: "Wednesday", short: "Wed" },
  { day: "Thursday", short: "Thu" },
  { day: "Friday", short: "Fri" },
];

// Tailwind classes are written out in full (not composed from variables) so
// the JIT compiler can find and generate every one of them.
export const SUBJECT_COLORS: Record<string, { dot: string; chip: string }> = {
  homeroom: {
    dot: "bg-marigold",
    chip: "border-marigold/30 bg-marigold/10 text-marigold dark:text-marigold-light",
  },
  math: {
    dot: "bg-sky-500",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  },
  physics: {
    dot: "bg-emerald-500",
    chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  history: {
    dot: "bg-amber-500",
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  religion: {
    dot: "bg-indigo-500",
    chip: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  chemistry: {
    dot: "bg-teal-500",
    chip: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  },
  geography: {
    dot: "bg-orange-500",
    chip: "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300",
  },
  english: {
    dot: "bg-violet-500",
    chip: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  },
  pe: {
    dot: "bg-blue-500",
    chip: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  indonesian: {
    dot: "bg-rose-500",
    chip: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  biology: {
    dot: "bg-lime-500",
    chip: "border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-300",
  },
  economics: {
    dot: "bg-fuchsia-500",
    chip: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  },
  civics: {
    dot: "bg-cyan-500",
    chip: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
  informatics: {
    dot: "bg-purple-500",
    chip: "border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  arts: {
    dot: "bg-pink-500",
    chip: "border-pink-500/30 bg-pink-500/10 text-pink-700 dark:text-pink-300",
  },
};

export const SCHEDULE: ScheduleRow[] = [
  {
    type: "period",
    period: 1,
    time: "07:00 – 07:40",
    entries: {
      Monday: { subject: "Flag Ceremony & Homeroom", teacher: "Mrs. Ayu Lestari", colorKey: "homeroom" },
      Tuesday: { subject: "Physics", teacher: "Mrs. Sari Puspita", colorKey: "physics" },
      Wednesday: { subject: "History", teacher: "Mr. Joko Susilo", colorKey: "history" },
      Thursday: { subject: "Mathematics", teacher: "Mr. Bimo Santoso", colorKey: "math" },
      Friday: { subject: "Religion Education", teacher: "Ustad Hasan Fauzi", colorKey: "religion" },
    },
  },
  {
    type: "period",
    period: 2,
    time: "07:40 – 08:20",
    entries: {
      Monday: { subject: "Mathematics", teacher: "Mr. Bimo Santoso", colorKey: "math" },
      Tuesday: { subject: "Physics", teacher: "Mrs. Sari Puspita", colorKey: "physics" },
      Wednesday: { subject: "History", teacher: "Mr. Joko Susilo", colorKey: "history" },
      Thursday: { subject: "Mathematics", teacher: "Mr. Bimo Santoso", colorKey: "math" },
      Friday: { subject: "Religion Education", teacher: "Ustad Hasan Fauzi", colorKey: "religion" },
    },
  },
  { type: "break", time: "08:20 – 08:40", label: "Morning Break" },
  {
    type: "period",
    period: 3,
    time: "08:40 – 09:20",
    entries: {
      Monday: { subject: "Mathematics", teacher: "Mr. Bimo Santoso", colorKey: "math" },
      Tuesday: { subject: "Chemistry", teacher: "Mr. Hendra Gunawan", colorKey: "chemistry" },
      Wednesday: { subject: "Geography", teacher: "Mrs. Melati Anggraini", colorKey: "geography" },
      Thursday: { subject: "English", teacher: "Mr. Andre Wicaksono", colorKey: "english" },
      Friday: { subject: "Physical Education", teacher: "Mr. Firman Hakim", colorKey: "pe" },
    },
  },
  {
    type: "period",
    period: 4,
    time: "09:20 – 10:00",
    entries: {
      Monday: { subject: "Indonesian Language", teacher: "Mrs. Ratna Dewi", colorKey: "indonesian" },
      Tuesday: { subject: "Chemistry", teacher: "Mr. Hendra Gunawan", colorKey: "chemistry" },
      Wednesday: { subject: "Geography", teacher: "Mrs. Melati Anggraini", colorKey: "geography" },
      Thursday: { subject: "English", teacher: "Mr. Andre Wicaksono", colorKey: "english" },
      Friday: { subject: "Physical Education", teacher: "Mr. Firman Hakim", colorKey: "pe" },
    },
  },
  { type: "break", time: "10:00 – 10:20", label: "Recess" },
  {
    type: "period",
    period: 5,
    time: "10:20 – 11:00",
    entries: {
      Monday: { subject: "Indonesian Language", teacher: "Mrs. Ratna Dewi", colorKey: "indonesian" },
      Tuesday: { subject: "Biology", teacher: "Mrs. Wulan Sari", colorKey: "biology" },
      Wednesday: { subject: "Economics", teacher: "Mr. Dedi Kurniawan", colorKey: "economics" },
      Thursday: { subject: "Indonesian Language", teacher: "Mrs. Ratna Dewi", colorKey: "indonesian" },
      Friday: { subject: "Civics", teacher: "Mrs. Puput Handayani", colorKey: "civics" },
    },
  },
  {
    type: "period",
    period: 6,
    time: "11:00 – 11:40",
    entries: {
      Monday: { subject: "English", teacher: "Mr. Andre Wicaksono", colorKey: "english" },
      Tuesday: { subject: "Biology", teacher: "Mrs. Wulan Sari", colorKey: "biology" },
      Wednesday: { subject: "Economics", teacher: "Mr. Dedi Kurniawan", colorKey: "economics" },
      Thursday: { subject: "Indonesian Language", teacher: "Mrs. Ratna Dewi", colorKey: "indonesian" },
      Friday: { subject: "Civics", teacher: "Mrs. Puput Handayani", colorKey: "civics" },
    },
  },
  { type: "break", time: "11:40 – 12:20", label: "Lunch & Prayer Break" },
  {
    type: "period",
    period: 7,
    time: "12:20 – 13:00",
    entries: {
      Monday: { subject: "English", teacher: "Mr. Andre Wicaksono", colorKey: "english" },
      Tuesday: { subject: "Informatics", teacher: "Mr. Rian Saputra", colorKey: "informatics" },
      Wednesday: { subject: "Arts & Culture", teacher: "Mrs. Citra Ayu Ningrum", colorKey: "arts" },
      Thursday: { subject: "Physical Education", teacher: "Mr. Firman Hakim", colorKey: "pe" },
      // Friday dismisses early for congregational prayer — no entry.
    },
  },
  {
    type: "period",
    period: 8,
    time: "13:00 – 13:40",
    entries: {
      Monday: { subject: "Civics", teacher: "Mrs. Puput Handayani", colorKey: "civics" },
      Tuesday: { subject: "Informatics", teacher: "Mr. Rian Saputra", colorKey: "informatics" },
      Wednesday: { subject: "Arts & Culture", teacher: "Mrs. Citra Ayu Ningrum", colorKey: "arts" },
      Thursday: { subject: "Physical Education", teacher: "Mr. Firman Hakim", colorKey: "pe" },
    },
  },
];

// ---------------------------------------------------------------------------
// Cleaning Duty Schedule page content
// ---------------------------------------------------------------------------

export const CLEANING_DUTY_PAGE = {
  eyebrow: "06 — Cleaning Duty",
  title: "Cleaning Duty Schedule",
  lead: "Room X-7 doesn't clean itself. Here's who's on the roster each day, Monday through Friday — rotated fairly, one team per day.",
};

// Attendance numbers map back to the STUDENTS roll call above, so the same
// 36 names stay the single source of truth across every page.
export const CLEANING_DUTY: CleaningDutyGroup[] = [
  {
    day: "Monday",
    focus: "Floors & Furniture",
    icon: "sparkles",
    tasks: [
      "Sweep the classroom floor",
      "Arrange chairs and tables in neat rows",
      "Wipe down the whiteboard",
      "Empty the trash bins",
      "Water the classroom plants",
    ],
    leadNumber: 1,
    memberNumbers: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    day: "Tuesday",
    focus: "Windows & Surfaces",
    icon: "spray",
    tasks: [
      "Wipe the windows and window sills",
      "Clean the teacher's desk",
      "Sweep the classroom floor",
      "Empty the trash bins",
      "Straighten the class bookshelf",
    ],
    leadNumber: 8,
    memberNumbers: [8, 9, 10, 11, 12, 13, 14],
  },
  {
    day: "Wednesday",
    focus: "Deep Clean & Hallway",
    icon: "droplets",
    tasks: [
      "Mop the classroom and hallway entrance",
      "Wipe down the whiteboard",
      "Sweep the classroom floor",
      "Empty the trash bins",
      "Tidy the lost-and-found box",
    ],
    leadNumber: 15,
    memberNumbers: [15, 16, 17, 18, 19, 20, 21],
  },
  {
    day: "Thursday",
    focus: "Dust & Detail",
    icon: "wind",
    tasks: [
      "Dust the classroom shelves and cabinets",
      "Wipe down the whiteboard",
      "Sweep the classroom floor",
      "Empty the trash bins",
      "Check and restock the first-aid kit",
    ],
    leadNumber: 22,
    memberNumbers: [22, 23, 24, 25, 26, 27, 28],
  },
  {
    day: "Friday",
    focus: "Weekly Reset",
    icon: "trash",
    tasks: [
      "Deep-sweep and mop the classroom floor",
      "Rearrange chairs and tables for Monday",
      "Wipe the whiteboard and wall charts",
      "Empty and rinse the trash bins",
      "Water the classroom plants",
      "Final walkthrough check before dismissal",
    ],
    leadNumber: 29,
    memberNumbers: [29, 30, 31, 32, 33, 34, 35, 36],
  },
];

// ---------------------------------------------------------------------------
// Achievements page content
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS_PAGE = {
  eyebrow: "07 — Achievements",
  title: "Achievements",
  lead: "Every trophy, medal, and certificate X-7 has earned — as a class, and one name at a time.",
};

// Full class names spelled out for the Tailwind JIT compiler, same convention
// as SUBJECT_COLORS above.
export const LEVEL_BADGES: Record<string, string> = {
  School: "border-line bg-paper text-muted dark:border-line-dark dark:bg-paper-dark dark:text-muted-dark",
  Regency: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
  Provincial: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  National: "border-marigold/30 bg-marigold/10 text-marigold dark:text-marigold-light",
};

export const CATEGORY_BADGES: Record<string, string> = {
  Academic: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Sports: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Arts: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300",
  Technology: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  "Class Spirit": "border-marigold/30 bg-marigold/10 text-marigold dark:text-marigold-light",
};

export const TIER_STYLES: Record<string, { chip: string; ring: string }> = {
  Gold: {
    chip: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    ring: "from-amber-400/30 to-amber-200/10 ring-amber-400/50",
  },
  Silver: {
    chip: "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300",
    ring: "from-slate-300/30 to-slate-100/10 ring-slate-400/50",
  },
  Bronze: {
    chip: "border-orange-700/30 bg-orange-700/10 text-orange-800 dark:text-orange-300",
    ring: "from-orange-500/30 to-orange-200/10 ring-orange-600/50",
  },
  Finalist: {
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    ring: "from-sky-400/30 to-sky-200/10 ring-sky-400/50",
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  // Class-wide achievements
  {
    id: "a01",
    scope: "class",
    title: "Best Overall Class — Annual Field Day",
    category: "Class Spirit",
    level: "School",
    year: "2024",
    placement: "1st Place",
    description:
      "X-7 topped the inter-class field day scoreboard for the first time, sweeping the tug-of-war and relay events.",
  },
  {
    id: "a02",
    scope: "class",
    title: "Cleanest Classroom Award",
    category: "Class Spirit",
    level: "School",
    year: "2025",
    placement: "1st Place",
    description:
      "Recognized in the semester-end inspection for the tidiest, best-kept homeroom on the floor.",
  },
  {
    id: "a03",
    scope: "class",
    title: "Best Class Choir Performance",
    category: "Arts",
    level: "School",
    year: "2024",
    placement: "1st Place",
    description: "X-7's Independence Day choir arrangement earned the top score from the judging panel.",
  },
  {
    id: "a04",
    scope: "class",
    title: "Highest Attendance Record",
    category: "Academic",
    level: "School",
    year: "2025",
    placement: "Recognition Award",
    description:
      "Logged the highest average attendance rate across the entire grade for two consecutive semesters.",
  },
  // Student achievements
  {
    id: "a05",
    scope: "student",
    recipient: "Aditya Nugroho",
    title: "National Science Olympiad",
    category: "Academic",
    level: "National",
    year: "2025",
    placement: "Gold Medalist",
    description: "Placed first nationally in the physics category of the National Science Olympiad.",
  },
  {
    id: "a06",
    scope: "student",
    recipient: "Jihan Maharani",
    title: "Provincial Debate Championship",
    category: "Academic",
    level: "Provincial",
    year: "2024",
    placement: "Champion",
    description: "Led the school debate team to its first provincial title, and took Best Speaker too.",
  },
  {
    id: "a07",
    scope: "student",
    recipient: "Ilham Firdaus",
    title: "Regional Athletics Meet — 100m Sprint",
    category: "Sports",
    level: "Regency",
    year: "2025",
    placement: "1st Place",
    description: "Set a new regency-level record time in the boys' 100m sprint final.",
  },
  {
    id: "a08",
    scope: "student",
    recipient: "Oktavia Rahmawati",
    title: "Inter-School Art Exhibition",
    category: "Arts",
    level: "School",
    year: "2024",
    placement: "Best in Show",
    description: "Her illustrated series on everyday classroom life took top honors at the exhibition.",
  },
  {
    id: "a09",
    scope: "student",
    recipient: "Rangga Saputra",
    title: "National Robotics Challenge",
    category: "Technology",
    level: "National",
    year: "2025",
    placement: "Silver Medalist",
    description: "Co-built the runner-up autonomous robot in the national schools robotics challenge.",
  },
  {
    id: "a10",
    scope: "student",
    recipient: "Kirana Amara",
    title: "Provincial Choir Solo Competition",
    category: "Arts",
    level: "Provincial",
    year: "2024",
    placement: "2nd Place",
    description: "Represented the school as a solo vocalist at the provincial choir competition.",
  },
];

export const COMPETITION_AWARDS: CompetitionAward[] = [
  {
    id: "c01",
    competition: "National Science Olympiad",
    organizer: "Ministry of Education",
    level: "National",
    tier: "Gold",
    year: "2025",
    representative: "Aditya Nugroho",
  },
  {
    id: "c02",
    competition: "National Robotics Challenge",
    organizer: "Indonesia Robotics Association",
    level: "National",
    tier: "Silver",
    year: "2025",
    representative: "Rangga Saputra",
  },
  {
    id: "c03",
    competition: "Provincial Debate Championship",
    organizer: "Provincial Education Office",
    level: "Provincial",
    tier: "Gold",
    year: "2024",
    representative: "Jihan Maharani",
  },
  {
    id: "c04",
    competition: "Provincial Choir Competition",
    organizer: "Provincial Arts Council",
    level: "Provincial",
    tier: "Silver",
    year: "2024",
    representative: "Kirana Amara",
  },
  {
    id: "c05",
    competition: "Regional Athletics Meet",
    organizer: "Regency Sports Board",
    level: "Regency",
    tier: "Gold",
    year: "2025",
    representative: "Ilham Firdaus",
  },
  {
    id: "c06",
    competition: "Inter-Class Field Day",
    organizer: "School Student Council",
    level: "School",
    tier: "Gold",
    year: "2024",
    representative: "Class X-7 Team",
  },
  {
    id: "c07",
    competition: "Inter-School Quiz Bee",
    organizer: "School Academic Board",
    level: "School",
    tier: "Bronze",
    year: "2025",
    representative: "Class X-7 Team",
  },
  {
    id: "c08",
    competition: "City Futsal Tournament",
    organizer: "City Youth Sports Committee",
    level: "Regency",
    tier: "Finalist",
    year: "2025",
    representative: "Class X-7 Team",
  },
];

export const CERTIFICATES: Certificate[] = [
  {
    id: "cert01",
    title: "Certificate of Academic Excellence",
    issuer: "SMA Negeri 1",
    recipient: "Aditya Nugroho",
    year: "2025",
    category: "Academic",
  },
  {
    id: "cert02",
    title: "Certificate of Debate Championship",
    issuer: "Provincial Education Office",
    recipient: "Jihan Maharani",
    year: "2024",
    category: "Academic",
  },
  {
    id: "cert03",
    title: "Certificate of Athletic Achievement",
    issuer: "Regency Sports Board",
    recipient: "Ilham Firdaus",
    year: "2025",
    category: "Sports",
  },
  {
    id: "cert04",
    title: "Certificate of Artistic Merit",
    issuer: "School Arts Committee",
    recipient: "Oktavia Rahmawati",
    year: "2024",
    category: "Arts",
  },
  {
    id: "cert05",
    title: "Certificate of Robotics Innovation",
    issuer: "Indonesia Robotics Association",
    recipient: "Rangga Saputra",
    year: "2025",
    category: "Technology",
  },
  {
    id: "cert06",
    title: "Certificate of Class Excellence",
    issuer: "School Principal's Office",
    recipient: "Class X-7 (PUTU)",
    year: "2024",
    category: "Class Spirit",
  },
];

export const ACHIEVEMENT_TIMELINE: AchievementTimelineEntry[] = [
  {
    index: "01",
    year: "2023",
    title: "First Recognition",
    description: "X-7 receives its first certificate of merit — Best Attendance in the freshman term.",
  },
  {
    index: "02",
    year: "2024",
    title: "First Field Day Trophy",
    description: "The class wins its first inter-class field day title, launching the trophy shelf.",
  },
  {
    index: "03",
    year: "2024",
    title: "First Provincial Title",
    description: "Jihan Maharani brings home X-7's first provincial-level championship, in debate.",
  },
  {
    index: "04",
    year: "2025",
    title: "First National Medal",
    description: "Aditya Nugroho wins gold at the National Science Olympiad — the class's first national medal.",
  },
  {
    index: "05",
    year: "2025",
    title: "Best-Attendance Streak",
    description: "X-7 logs the highest attendance average in the grade for a second straight semester.",
  },
  {
    index: "06",
    year: "2026 — Present",
    title: "The Shelf Keeps Growing",
    description: "More medals, more certificates — this page updates as the record does.",
  },
];

// ---------------------------------------------------------------------------
// Gallery page content — dummy captions, real shape. Placeholder tiles stand
// in for photos until the class uploads the genuine roll of film.
// ---------------------------------------------------------------------------

export const GALLERY_PAGE = {
  eyebrow: "09 — Gallery",
  title: "Gallery",
  lead: "Every frame the class has collected so far — field days, Friday gatherings, quiet study hours, and everything in between. The real photos are still being scanned in; consider these placeholders a reserved seat for each one.",
};

// Tailwind classes written out in full (not composed) so the JIT compiler
// can find and generate every one of them — same convention as
// SUBJECT_COLORS and LEVEL_BADGES above.
export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { id: "all", label: "All Photos", icon: "layout-grid" },
  { id: "field-day", label: "Field Day", icon: "trophy" },
  { id: "gatherings", label: "Friday Gatherings", icon: "users" },
  { id: "trips", label: "Class Trips", icon: "bus" },
  { id: "academics", label: "Academic Life", icon: "book-open" },
  { id: "celebrations", label: "Celebrations", icon: "party-popper" },
  { id: "candid", label: "Candid Moments", icon: "camera" },
];

export const GALLERY_GRADIENTS: Record<
  Exclude<GalleryCategoryOption["id"], "all">,
  { gradient: string; ring: string; chip: string; iconColor: string }
> = {
  "field-day": {
    gradient: "from-marigold/25 via-marigold/10 to-transparent",
    ring: "ring-marigold/40",
    chip: "border-marigold/30 bg-marigold/10 text-marigold dark:text-marigold-light",
    iconColor: "text-marigold dark:text-marigold-light",
  },
  gatherings: {
    gradient: "from-ivy/25 via-ivy/10 to-transparent",
    ring: "ring-ivy/40",
    chip: "border-ivy/30 bg-ivy/10 text-ivy dark:text-ivy-light",
    iconColor: "text-ivy dark:text-ivy-light",
  },
  trips: {
    gradient: "from-sky-500/25 via-sky-500/10 to-transparent",
    ring: "ring-sky-400/40",
    chip: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    iconColor: "text-sky-600 dark:text-sky-300",
  },
  academics: {
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
    ring: "ring-violet-400/40",
    chip: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    iconColor: "text-violet-600 dark:text-violet-300",
  },
  celebrations: {
    gradient: "from-rose-500/25 via-rose-500/10 to-transparent",
    ring: "ring-rose-400/40",
    chip: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    iconColor: "text-rose-600 dark:text-rose-300",
  },
  candid: {
    gradient: "from-teal-500/25 via-teal-500/10 to-transparent",
    ring: "ring-teal-400/40",
    chip: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300",
    iconColor: "text-teal-600 dark:text-teal-300",
  },
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: "g01", title: "Roll Call Zero", category: "candid", date: "Jul 2023", orientation: "landscape", description: "The very first morning in Room X-7 — 36 names, read aloud for the first time.", featured: true },
  { id: "g02", title: "The First Class Photo", category: "celebrations", date: "Sep 2023", orientation: "portrait", description: "The inaugural group photo, still framed at the back of the homeroom.", featured: true },
  { id: "g03", title: "Tug-of-War Final", category: "field-day", date: "Jun 2024", orientation: "wide", description: "The last pull of the inter-class field day final — X-7 wins it in three seconds.", featured: true },
  { id: "g04", title: "Relay Handoff", category: "field-day", date: "Jun 2024", orientation: "square", description: "A clean baton handoff on the back straight, mid-relay." },
  { id: "g05", title: "Trophy Shelf, Day One", category: "field-day", date: "Jun 2024", orientation: "tall", description: "The first trophy finds its shelf in the corner of Room X-7." },
  { id: "g06", title: "Friday Chairs, Set Early", category: "gatherings", date: "Aug 2023", orientation: "landscape", description: "Chairs arranged before anyone else arrives — a Friday ritual." },
  { id: "g07", title: "Weekly Playlist Vote", category: "gatherings", date: "Nov 2023", orientation: "square", description: "The Friday gathering's running debate: whose song gets added next." },
  { id: "g08", title: "Snack Table, As Usual", category: "gatherings", date: "Feb 2024", orientation: "portrait", description: "The unofficial Friday spread, contributed potluck-style." },
  { id: "g09", title: "Museum Trip, Group Shot", category: "trips", date: "Oct 2023", orientation: "wide", description: "The whole class outside the history museum, mid-field trip." },
  { id: "g10", title: "Bus Ride Out", category: "trips", date: "Oct 2023", orientation: "landscape", description: "The class bus, loaded up and pulling out for the annual trip." },
  { id: "g11", title: "Coastal Cleanup Day", category: "trips", date: "Apr 2024", orientation: "tall", description: "X-7's volunteer outing to the coast — bags full by noon." },
  { id: "g12", title: "Science Fair Booth", category: "academics", date: "Mar 2024", orientation: "square", description: "The class's joint science fair booth, an hour before judging." },
  { id: "g13", title: "Midpoint Assembly", category: "academics", date: "Jan 2025", orientation: "landscape", description: "The reflection session marking the class's halfway point." },
  { id: "g14", title: "Study Group, Exam Week", category: "academics", date: "May 2024", orientation: "portrait", description: "A quiet corner of the library, three days before finals." },
  { id: "g15", title: "Whiteboard Diagram Marathon", category: "academics", date: "Sep 2024", orientation: "wide", description: "A physics explanation that outgrew the whiteboard twice over." },
  { id: "g16", title: "Independence Day Choir", category: "celebrations", date: "Aug 2024", orientation: "tall", description: "The class choir mid-performance, the arrangement that took first place." },
  { id: "g17", title: "Birthday Circle", category: "celebrations", date: "Dec 2024", orientation: "square", description: "A homeroom birthday, marked the way X-7 always marks them — together." },
  { id: "g18", title: "PUTU Vote Announcement", category: "celebrations", date: "Feb 2024", orientation: "landscape", description: "The moment the nickname PUTU won its unanimous class vote." },
  { id: "g19", title: "Cleanest Classroom Award", category: "celebrations", date: "2025", orientation: "portrait", description: "Accepting the semester's Cleanest Classroom recognition." },
  { id: "g20", title: "Plant Corner Watering", category: "candid", date: "Oct 2024", orientation: "square", description: "The homeroom succulents, tended to on the Monday rotation." },
  { id: "g21", title: "Trivia Night Scoreboard", category: "candid", date: "Nov 2024", orientation: "wide", description: "The running tally from another close trivia night finish." },
  { id: "g22", title: "Between-Period Hallway", category: "candid", date: "Mar 2025", orientation: "landscape", description: "The ordinary five minutes between periods, caught mid-motion." },
  { id: "g23", title: "Rain-Day Window Seat", category: "candid", date: "Jan 2025", orientation: "tall", description: "A quiet rainy afternoon, watched from the third-row window." },
  { id: "g24", title: "Sports Day Warm-Up", category: "field-day", date: "Jun 2025", orientation: "portrait", description: "Stretching circle before the second field day title defense." },
  { id: "g25", title: "Debate Team Send-Off", category: "academics", date: "Apr 2024", orientation: "square", description: "The homeroom's send-off before the provincial debate championship." },
  { id: "g26", title: "Year-End Group Photo", category: "celebrations", date: "Jun 2025", orientation: "wide", description: "The second annual class photo — same wall, one year taller." },
  { id: "g27", title: "Robotics Workshop Late Night", category: "academics", date: "Feb 2025", orientation: "landscape", description: "Final wiring checks before the national robotics submission." },
  { id: "g28", title: "Friday Gathering, Rainy Edition", category: "gatherings", date: "Sep 2025", orientation: "portrait", description: "The Friday tradition, moved indoors but otherwise unchanged." },
];

// Roll-call numbered nav — pages will be built one at a time on top of
// this foundation, so hrefs already point at their future routes.
export const NAV_LINKS: NavLink[] = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "The Class", href: "/class" },
  { index: "03", label: "Organization", href: "/organization" },
  { index: "04", label: "Members", href: "/members" },
  { index: "05", label: "Schedule", href: "/schedule" },
  { index: "06", label: "Cleaning Duty", href: "/cleaning-duty" },
  { index: "07", label: "Achievements", href: "/achievements" },
  { index: "08", label: "Timeline", href: "/class#timeline" },
  { index: "09", label: "Gallery", href: "/gallery" },
  { index: "10", label: "Contact", href: "/class#contact" },
];

export const FOOTER_GROUPS: FooterLinkGroup[] = [
  {
    index: "01",
    title: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "The Class", href: "/class" },
      { label: "Organization", href: "/organization" },
      { label: "Members", href: "/members" },
      { label: "Schedule", href: "/schedule" },
      { label: "Cleaning Duty", href: "/cleaning-duty" },
      { label: "Achievements", href: "/achievements" },
      { label: "Timeline", href: "/class#timeline" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    index: "02",
    title: "Class Info",
    links: [
      { label: "Homeroom X-7", href: "/class#class-information" },
      { label: "Academic Year 2025/2026", href: "/class#class-information" },
      { label: "Est. 2023", href: "/class#class-information" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "#", icon: "github" },
  { label: "Instagram", href: "#", icon: "instagram" },
  { label: "Email", href: "#", icon: "mail" },
];
