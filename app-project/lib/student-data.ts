import "server-only";
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceStatusOrUnrecorded,
  BulkStudentAction,
  ClassOfficer,
  ClassOfficerWithStudent,
  ProgressEntry,
  Student,
  StudentFullProfile,
  StudentListItem,
  StudentListResult,
  StudentStats,
  Teacher,
  TeacherDepartment,
  TeacherStats,
} from "./types";
import { getAchievements } from "./mock-data";
import { notifyAttendanceChange } from "./notifications";
import { indexStudent, indexTeacher } from "./search-index";

/**
 * All content below is mock data standing in for a future database, mirroring
 * the pattern in lib/mock-data.ts. Getters are async and simulate latency so
 * loading states get exercised. Mutations (attendance, enrollment) operate on
 * in-memory arrays — fine for a single-instance dev/demo deploy, same caveat
 * as lib/rate-limit.ts. Swap the bodies for real queries when a database
 * arrives; call sites won't need to change.
 */

function simulateLatency(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ATTENDANCE_WINDOW_DAYS = 14;
const DEFAULT_PAGE_SIZE = 8;

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return isoDate(new Date());
}

/** Small deterministic hash so mock attendance/progress looks varied but is stable across requests. */
function seededScore(seed: string, index: number): number {
  let hash = 0;
  const s = `${seed}-${index}`;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) % 1000;
  }
  return hash;
}

/* ---------------------------- Students ---------------------------- */

const STUDENTS: Student[] = [
  {
    id: "st-1",
    studentId: "STU-1001",
    name: "Priya N.",
    photoUrl: null,
    dateOfBirth: "2016-07-03",
    classSection: "Section A",
    guardianName: "Anita Nair",
    contactEmail: "anita.nair@example.com",
    contactPhone: "(555) 010-1001",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-18",
    gradeAverage: 94,
  },
  {
    id: "st-2",
    studentId: "STU-1002",
    name: "Marcus T.",
    photoUrl: null,
    dateOfBirth: "2016-07-11",
    classSection: "Section A",
    guardianName: "Deborah Thompson",
    contactEmail: "deborah.thompson@example.com",
    contactPhone: "(555) 010-1002",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-18",
    gradeAverage: 88,
  },
  {
    id: "st-3",
    studentId: "STU-1003",
    name: "Sofia R.",
    photoUrl: null,
    dateOfBirth: "2016-07-22",
    classSection: "Section B",
    guardianName: "Carlos Reyes",
    contactEmail: "carlos.reyes@example.com",
    contactPhone: "(555) 010-1003",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-19",
    gradeAverage: 91,
  },
  {
    id: "st-4",
    studentId: "STU-1004",
    name: "Ethan W.",
    photoUrl: null,
    dateOfBirth: "2016-07-29",
    classSection: "Section B",
    guardianName: "Karen Walsh",
    contactEmail: "karen.walsh@example.com",
    contactPhone: "(555) 010-1004",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-19",
    gradeAverage: 97,
  },
  {
    id: "st-5",
    studentId: "STU-1005",
    name: "Ava L.",
    photoUrl: null,
    dateOfBirth: "2016-08-04",
    classSection: "Section A",
    guardianName: "Michael Lindqvist",
    contactEmail: "michael.lindqvist@example.com",
    contactPhone: "(555) 010-1005",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-18",
    gradeAverage: 85,
  },
  {
    id: "st-6",
    studentId: "STU-1006",
    name: "Noah K.",
    photoUrl: null,
    dateOfBirth: "2016-08-17",
    classSection: "Section C",
    guardianName: "Grace Kim",
    contactEmail: "grace.kim@example.com",
    contactPhone: "(555) 010-1006",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-20",
    gradeAverage: 79,
  },
  {
    id: "st-7",
    studentId: "STU-1007",
    name: "Grace P.",
    photoUrl: null,
    dateOfBirth: "2016-06-09",
    classSection: "Section C",
    guardianName: "Daniel Petrov",
    contactEmail: "daniel.petrov@example.com",
    contactPhone: "(555) 010-1007",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-20",
    gradeAverage: 90,
  },
  {
    id: "st-8",
    studentId: "STU-1008",
    name: "Liam H.",
    photoUrl: null,
    dateOfBirth: "2016-09-02",
    classSection: "Section B",
    guardianName: "Rachel Hughes",
    contactEmail: "rachel.hughes@example.com",
    contactPhone: "(555) 010-1008",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-19",
    gradeAverage: 82,
  },
  {
    id: "st-9",
    studentId: "STU-1009",
    name: "Isabella M.",
    photoUrl: null,
    dateOfBirth: "2016-09-14",
    classSection: "Section A",
    guardianName: "Julia Moreno",
    contactEmail: "julia.moreno@example.com",
    contactPhone: "(555) 010-1009",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-18",
    gradeAverage: 93,
  },
  {
    id: "st-10",
    studentId: "STU-1010",
    name: "Owen D.",
    photoUrl: null,
    dateOfBirth: "2016-10-01",
    classSection: "Section C",
    guardianName: "Patricia Diaz",
    contactEmail: "patricia.diaz@example.com",
    contactPhone: "(555) 010-1010",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-20",
    gradeAverage: 76,
  },
  {
    id: "st-11",
    studentId: "STU-1011",
    name: "Zara F.",
    photoUrl: null,
    dateOfBirth: "2016-10-19",
    classSection: "Section B",
    guardianName: "Omar Farouk",
    contactEmail: "omar.farouk@example.com",
    contactPhone: "(555) 010-1011",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-19",
    gradeAverage: 89,
  },
  {
    id: "st-12",
    studentId: "STU-1012",
    name: "Jacob S.",
    photoUrl: null,
    dateOfBirth: "2016-11-05",
    classSection: "Section A",
    guardianName: "Nicole Shaw",
    contactEmail: "nicole.shaw@example.com",
    contactPhone: "(555) 010-1012",
    enrollmentStatus: "inactive",
    enrollmentDate: "2025-08-18",
    gradeAverage: 71,
    notes: "Family relocated mid-term; enrollment paused as of June 2026.",
  },
  {
    id: "st-13",
    studentId: "STU-1013",
    name: "Chloe B.",
    photoUrl: null,
    dateOfBirth: "2016-11-21",
    classSection: "Section C",
    guardianName: "Ryan Bennett",
    contactEmail: "ryan.bennett@example.com",
    contactPhone: "(555) 010-1013",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-20",
    gradeAverage: 96,
  },
  {
    id: "st-14",
    studentId: "STU-1014",
    name: "Mateo G.",
    photoUrl: null,
    dateOfBirth: "2016-12-08",
    classSection: "Section B",
    guardianName: "Elena Gomez",
    contactEmail: "elena.gomez@example.com",
    contactPhone: "(555) 010-1014",
    enrollmentStatus: "active",
    enrollmentDate: "2025-08-19",
    gradeAverage: 87,
  },
];

const CLASS_SECTIONS = ["Section A", "Section B", "Section C"];

/* --------------------------- Attendance ---------------------------- */

const ATTENDANCE_CYCLE: AttendanceStatus[] = ["present", "present", "present", "present", "late", "absent", "excused"];

function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const today = new Date();

  for (const student of STUDENTS) {
    for (let dayOffset = ATTENDANCE_WINDOW_DAYS - 1; dayOffset >= 0; dayOffset--) {
      const date = new Date(today);
      date.setDate(today.getDate() - dayOffset);
      // Skip weekends to keep the mock data realistic.
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const cycleIndex = (seededScore(student.id, dayOffset) + dayOffset) % ATTENDANCE_CYCLE.length;
      const status = ATTENDANCE_CYCLE[cycleIndex];
      const dateStr = isoDate(date);

      records.push({
        id: `att-${student.id}-${dateStr}`,
        studentId: student.id,
        date: dateStr,
        status,
        recordedAt: `${dateStr}T08:05:00.000Z`,
        recordedBy: "system-seed",
      });
    }
  }

  return records;
}

// Mutable in-memory store — see file header note on persistence.
let ATTENDANCE_RECORDS: AttendanceRecord[] = generateAttendance();

/* ---------------------------- Progress ------------------------------ */

const PERIODS = ["Q1", "Q2", "Q3", "Q4"];
const SUBJECTS = ["Reading", "Math", "Science"];

function generateProgress(): ProgressEntry[] {
  const entries: ProgressEntry[] = [];
  let counter = 0;

  for (const student of STUDENTS) {
    for (const subject of SUBJECTS) {
      const base = 68 + (seededScore(student.id + subject, 0) % 20); // 68-87 starting point
      const drift = (seededScore(student.id + subject, 1) % 5) - 1; // -1..3 per period trend
      PERIODS.forEach((period, i) => {
        const noise = (seededScore(student.id + subject, i + 2) % 7) - 3; // +/-3 wobble
        const score = Math.max(55, Math.min(100, base + drift * i + noise));
        entries.push({
          id: `prog-${counter++}`,
          studentId: student.id,
          period,
          subject,
          score,
          date: `2026-0${i + 1}-15`,
        });
      });
    }
  }

  return entries;
}

const PROGRESS_ENTRIES: ProgressEntry[] = generateProgress();

/* ----------------------------- Teachers ------------------------------ */

const TEACHERS: Teacher[] = [
  {
    id: "tc-1",
    name: "Elena Alvarez",
    photoUrl: null,
    title: "Lead Teacher",
    department: "Core Academics",
    subjects: ["Reading", "Writing"],
    email: "e.alvarez@classsite.edu",
    phone: "(555) 020-2001",
    officeHours: "Mon & Wed, 3:15–4:00 PM",
    bio: "Elena has led the classroom for six years and specializes in building independent reading habits through leveled small-group instruction. She co-designed the current reading-challenge program and mentors two student teachers each semester.",
    yearsExperience: 11,
  },
  {
    id: "tc-2",
    name: "Marcus Douglas",
    photoUrl: null,
    title: "Math & Science Teacher",
    department: "STEM",
    subjects: ["Math", "Science"],
    email: "m.douglas@classsite.edu",
    phone: "(555) 020-2002",
    officeHours: "Tue & Thu, 3:15–4:00 PM",
    bio: "Marcus brings a hands-on, project-first approach to math and science, including this term's classroom garden unit. He previously worked as a field research assistant before moving into teaching and still runs the after-school science club.",
    yearsExperience: 8,
  },
  {
    id: "tc-3",
    name: "Priya Subramaniam",
    photoUrl: null,
    title: "Art & Music Teacher",
    department: "Arts & Humanities",
    subjects: ["Art", "Music"],
    email: "p.subramaniam@classsite.edu",
    phone: "(555) 020-2003",
    officeHours: "Wed, 2:30–3:30 PM",
    bio: "Priya studied fine arts and music education and rotates students through visual art, choir, and basic music theory across the term. She organizes the spring showcase where every student's work is displayed.",
    yearsExperience: 5,
  },
  {
    id: "tc-4",
    name: "Jordan Whitfield",
    photoUrl: null,
    title: "Physical Education Teacher",
    department: "Physical Education",
    subjects: ["Physical Education", "Health"],
    email: "j.whitfield@classsite.edu",
    phone: "(555) 020-2004",
    officeHours: "Mon & Fri, 3:15–4:00 PM",
    bio: "Jordan coordinates Field Day and the class's daily movement breaks, with a focus on cooperative games over competition. He also tracks basic fitness milestones and coordinates with families on any activity accommodations.",
    yearsExperience: 6,
  },
  {
    id: "tc-5",
    name: "Renee Castillo",
    photoUrl: null,
    title: "Learning Support Specialist",
    department: "Support Services",
    subjects: ["Reading Intervention", "Study Skills"],
    email: "r.castillo@classsite.edu",
    phone: "(555) 020-2005",
    officeHours: "Daily, 12:00–12:45 PM",
    bio: "Renee provides small-group and one-on-one support for students who need extra practice, coordinating closely with families and the lead teacher on individualized plans. She holds a master's degree in special education.",
    yearsExperience: 9,
  },
  {
    id: "tc-6",
    name: "Sam Okafor",
    photoUrl: null,
    title: "School Counselor",
    department: "Support Services",
    subjects: ["Social-Emotional Learning"],
    email: "s.okafor@classsite.edu",
    phone: "(555) 020-2006",
    officeHours: "Tue & Thu, 8:00–8:45 AM",
    bio: "Sam runs weekly SEL circle time and is available for drop-in conversations with any student who needs to talk something through. He also leads the Kindness Award nomination process each term.",
    yearsExperience: 7,
  },
];

/* -------------------------- Class officers --------------------------- */

const CLASS_OFFICERS: ClassOfficer[] = [
  {
    id: "off-1",
    studentId: "st-4",
    role: "Class President",
    responsibilities: [
      "Runs the weekly class meeting agenda",
      "Represents the class at the student council",
      "Signs off on the class newsletter before it goes home",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "ethan.w.officer@classsite.edu",
  },
  {
    id: "off-2",
    studentId: "st-1",
    role: "Vice President",
    responsibilities: [
      "Steps in to run meetings when the President is absent",
      "Coordinates the class supply and materials checklist",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "priya.n.officer@classsite.edu",
  },
  {
    id: "off-3",
    studentId: "st-13",
    role: "Secretary",
    responsibilities: [
      "Takes notes during class meetings",
      "Keeps the class calendar of events up to date",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "chloe.b.officer@classsite.edu",
  },
  {
    id: "off-4",
    studentId: "st-3",
    role: "Treasurer",
    responsibilities: [
      "Tracks the class fundraising jar for field-trip snacks",
      "Reports the running total at each class meeting",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "sofia.r.officer@classsite.edu",
  },
  {
    id: "off-5",
    studentId: "st-9",
    role: "Line Leader",
    responsibilities: [
      "Leads the class safely between rooms and to recess",
      "Models hallway expectations for younger grades",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "isabella.m.officer@classsite.edu",
  },
  {
    id: "off-6",
    studentId: "st-7",
    role: "Materials Manager",
    responsibilities: [
      "Hands out and collects worksheets each period",
      "Keeps the supply shelf organized",
    ],
    termLabel: "Fall 2026 Term",
    contactEmail: "grace.p.officer@classsite.edu",
  },
];

/* ------------------------------ Helpers ------------------------------- */

function attendanceStatusOn(studentId: string, date: string): AttendanceStatusOrUnrecorded {
  const record = ATTENDANCE_RECORDS.find((r) => r.studentId === studentId && r.date === date);
  return record?.status ?? "unrecorded";
}

function attendanceRateFor(studentId: string): number {
  const records = ATTENDANCE_RECORDS.filter((r) => r.studentId === studentId);
  if (records.length === 0) return 0;
  const positive = records.filter((r) => r.status === "present" || r.status === "late" || r.status === "excused").length;
  return Math.round((positive / records.length) * 100);
}

async function achievementCountFor(studentName: string): Promise<number> {
  const achievements = await getAchievements();
  return achievements.filter((a) => a.recipient === studentName).length;
}

/* ------------------------------ Students API --------------------------- */

export function getClassSections(): string[] {
  return [...CLASS_SECTIONS];
}

export interface StudentListParams {
  q?: string;
  section?: string; // "All" or exact section name
  attendanceStatus?: AttendanceStatusOrUnrecorded | "All";
  page?: number;
  pageSize?: number;
}

export async function getStudentList(params: StudentListParams = {}): Promise<StudentListResult> {
  await simulateLatency();

  const { q = "", section = "All", attendanceStatus = "All", page = 1, pageSize = DEFAULT_PAGE_SIZE } = params;
  const today = todayIso();
  const query = q.trim().toLowerCase();

  const achievements = await getAchievements();
  const achievementCounts = new Map<string, number>();
  for (const a of achievements) {
    achievementCounts.set(a.recipient, (achievementCounts.get(a.recipient) ?? 0) + 1);
  }

  let items: StudentListItem[] = STUDENTS.map((student) => ({
    ...student,
    todayStatus: attendanceStatusOn(student.id, today),
    attendanceRate: attendanceRateFor(student.id),
    achievementCount: achievementCounts.get(student.name) ?? 0,
  }));

  if (query) {
    items = items.filter(
      (s) => s.name.toLowerCase().includes(query) || s.studentId.toLowerCase().includes(query)
    );
  }

  if (section !== "All") {
    items = items.filter((s) => s.classSection === section);
  }

  if (attendanceStatus !== "All") {
    items = items.filter((s) => s.todayStatus === attendanceStatus);
  }

  items.sort((a, b) => a.name.localeCompare(b.name));

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return { items: pageItems, total, page: safePage, pageSize, totalPages };
}

export async function getStudentFullProfile(id: string): Promise<StudentFullProfile | null> {
  await simulateLatency();

  const student = STUDENTS.find((s) => s.id === id);
  if (!student) return null;

  const achievements = await getAchievements();
  const studentAchievements = achievements.filter((a) => a.recipient === student.name);

  const attendance = ATTENDANCE_RECORDS.filter((r) => r.studentId === id).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );

  const progress = PROGRESS_ENTRIES.filter((p) => p.studentId === id);

  return {
    student,
    todayStatus: attendanceStatusOn(id, todayIso()),
    attendance,
    attendanceRate: attendanceRateFor(id),
    achievements: studentAchievements,
    progress,
  };
}

export async function setAttendanceStatus(
  studentId: string,
  status: AttendanceStatus,
  recordedBy: string
): Promise<AttendanceRecord | null> {
  await simulateLatency(150);

  const student = STUDENTS.find((s) => s.id === studentId);
  if (!student) return null;

  const date = todayIso();
  const nowIso = new Date().toISOString();
  const existing = ATTENDANCE_RECORDS.find((r) => r.studentId === studentId && r.date === date);

  let record: AttendanceRecord;
  if (existing) {
    existing.status = status;
    existing.recordedAt = nowIso;
    existing.recordedBy = recordedBy;
    record = existing;
  } else {
    record = {
      id: `att-${studentId}-${date}`,
      studentId,
      date,
      status,
      recordedAt: nowIso,
      recordedBy,
    };
    ATTENDANCE_RECORDS = [...ATTENDANCE_RECORDS, record];
  }

  notifyAttendanceChange({ studentId, studentName: student.name, status, recordedBy });
  indexStudent(student);

  return record;
}

export async function bulkUpdateStudents(
  studentIds: string[],
  action: BulkStudentAction,
  performedBy: string
): Promise<{ updated: number }> {
  await simulateLatency(250);

  let updated = 0;

  for (const id of studentIds) {
    const student = STUDENTS.find((s) => s.id === id);
    if (!student) continue;

    if (action === "activate" || action === "deactivate") {
      student.enrollmentStatus = action === "activate" ? "active" : "inactive";
      indexStudent(student);
      updated++;
      continue;
    }

    const statusMap: Record<string, AttendanceStatus> = {
      "mark-present": "present",
      "mark-absent": "absent",
      "mark-late": "late",
      "mark-excused": "excused",
    };
    const status = statusMap[action];
    if (status) {
      await setAttendanceStatus(id, status, performedBy);
      updated++;
    }
  }

  return { updated };
}

export async function getStudentStats(): Promise<StudentStats> {
  await simulateLatency(200);

  const today = todayIso();
  const counts: StudentStats["today"] = { present: 0, absent: 0, late: 0, excused: 0, unrecorded: 0 };

  for (const student of STUDENTS) {
    const status = attendanceStatusOn(student.id, today);
    counts[status]++;
  }

  const active = STUDENTS.filter((s) => s.enrollmentStatus === "active").length;
  const averageGrade = Math.round(
    STUDENTS.reduce((sum, s) => sum + s.gradeAverage, 0) / STUDENTS.length
  );

  return {
    total: STUDENTS.length,
    active,
    inactive: STUDENTS.length - active,
    averageGrade,
    today: counts,
  };
}

export function studentsToCsv(students: StudentListItem[]): string {
  const header = [
    "Student ID",
    "Name",
    "Class Section",
    "Guardian",
    "Contact Email",
    "Contact Phone",
    "Enrollment Status",
    "Grade Average",
    "Today's Attendance",
    "Attendance Rate (%)",
  ];

  const rows = students.map((s) => [
    s.studentId,
    s.name,
    s.classSection,
    s.guardianName,
    s.contactEmail,
    s.contactPhone,
    s.enrollmentStatus,
    String(s.gradeAverage),
    s.todayStatus,
    String(s.attendanceRate),
  ]);

  const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

  return [header, ...rows].map((row) => row.map(escape).join(",")).join("\n");
}

/* ------------------------------ Teachers API --------------------------- */

export async function getTeachers(department?: TeacherDepartment | "All"): Promise<Teacher[]> {
  await simulateLatency();
  const sorted = [...TEACHERS].sort((a, b) => a.name.localeCompare(b.name));
  if (!department || department === "All") return sorted;
  return sorted.filter((t) => t.department === department);
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
  await simulateLatency();
  return TEACHERS.find((t) => t.id === id) ?? null;
}

export function getTeacherDepartments(): TeacherDepartment[] {
  return ["Core Academics", "STEM", "Arts & Humanities", "Physical Education", "Support Services"];
}

export async function getTeacherStats(): Promise<TeacherStats> {
  await simulateLatency(150);
  const byDepartment = getTeacherDepartments().reduce((acc, dept) => {
    acc[dept] = TEACHERS.filter((t) => t.department === dept).length;
    return acc;
  }, {} as Record<TeacherDepartment, number>);

  return { total: TEACHERS.length, byDepartment };
}

/* --------------------------- Class officers API ------------------------ */

export async function getClassOfficers(): Promise<ClassOfficerWithStudent[]> {
  await simulateLatency();

  return CLASS_OFFICERS.map((officer) => {
    const student = STUDENTS.find((s) => s.id === officer.studentId);
    return {
      ...officer,
      student: student
        ? { id: student.id, name: student.name, photoUrl: student.photoUrl, classSection: student.classSection }
        : { id: officer.studentId, name: "Unknown Student", photoUrl: null, classSection: "" },
    };
  });
}

// Fire an initial index pass so the Search module integration point has
// something to point to as soon as the app boots.
for (const teacher of TEACHERS) indexTeacher(teacher);
for (const student of STUDENTS) indexStudent(student);
