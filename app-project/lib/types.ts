export type AnnouncementCategory =
  | "General"
  | "Academic"
  | "Event"
  | "Urgent"
  | "Celebration";

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body: string;
  date: string; // ISO date
  category: AnnouncementCategory;
  pinned?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string; // ISO date
  author: string;
  tag: string;
}

export type AchievementIcon = "trophy" | "medal" | "star" | "book" | "users" | "target";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  icon: AchievementIcon;
  recipient: string; // student name or "Whole Class"
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Birthday {
  id: string;
  name: string;
  month: number; // 1-12
  day: number;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface FeedbackPayload {
  rating: number;
  comment: string;
  name?: string;
  honeypot?: string;
}

/* -------------------------------------------------------------------- */
/*  Student & Teacher Management                                        */
/* -------------------------------------------------------------------- */

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

/** Used wherever "no record for today yet" needs to be represented alongside real statuses. */
export type AttendanceStatusOrUnrecorded = AttendanceStatus | "unrecorded";

export type EnrollmentStatus = "active" | "inactive";

export interface Student {
  id: string;
  studentId: string; // school-issued ID, e.g. "STU-1042"
  name: string;
  photoUrl?: string | null; // absent in mock data; component falls back to initials
  dateOfBirth: string; // ISO date
  classSection: string;
  guardianName: string;
  contactEmail: string;
  contactPhone: string;
  enrollmentStatus: EnrollmentStatus;
  enrollmentDate: string; // ISO date
  gradeAverage: number; // 0-100, current overall average
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // ISO date — one record per student per calendar day
  status: AttendanceStatus;
  recordedAt: string; // ISO datetime — when the status was last set
  recordedBy: string; // admin username
}

export interface ProgressEntry {
  id: string;
  studentId: string;
  period: string; // e.g. "Q1", "Q2", "Q3", "Q4"
  subject: string;
  score: number; // 0-100
  date: string; // ISO date
}

export type TeacherDepartment =
  | "Core Academics"
  | "STEM"
  | "Arts & Humanities"
  | "Physical Education"
  | "Support Services";

export interface Teacher {
  id: string;
  name: string;
  photoUrl?: string | null;
  title: string;
  department: TeacherDepartment;
  subjects: string[];
  email: string;
  phone: string;
  officeHours: string;
  bio: string;
  yearsExperience: number;
}

export interface ClassOfficer {
  id: string;
  studentId: string;
  role: string;
  responsibilities: string[];
  termLabel: string;
  contactEmail: string;
}

/** Class officer joined with the student record it references, for display. */
export interface ClassOfficerWithStudent extends ClassOfficer {
  student: Pick<Student, "id" | "name" | "photoUrl" | "classSection">;
}

export type BulkAttendanceAction = "mark-present" | "mark-absent" | "mark-late" | "mark-excused";
export type BulkEnrollmentAction = "activate" | "deactivate";
export type BulkStudentAction = BulkAttendanceAction | BulkEnrollmentAction;

export interface StudentListItem extends Student {
  todayStatus: AttendanceStatusOrUnrecorded;
  attendanceRate: number; // % present+late+excused over tracked window, 0-100
  achievementCount: number;
}

export interface StudentListResult {
  items: StudentListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface StudentFullProfile {
  student: Student;
  todayStatus: AttendanceStatusOrUnrecorded;
  attendance: AttendanceRecord[]; // most recent first
  attendanceRate: number;
  achievements: Achievement[];
  progress: ProgressEntry[];
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  averageGrade: number;
  today: Record<AttendanceStatusOrUnrecorded, number>;
}

export interface TeacherStats {
  total: number;
  byDepartment: Record<TeacherDepartment, number>;
}

/* -------------------------------------------------------------------- */
/*  Learning Materials & Resources                                      */
/* -------------------------------------------------------------------- */

export type ResourceSubject =
  | "Math"
  | "Science"
  | "English Language Arts"
  | "Social Studies"
  | "Art"
  | "Physical Education";

export type GradeLevel = "Grade 3" | "Grade 4" | "Grade 5" | "All Grades";

export type AttachmentFileType = "pdf" | "docx" | "xlsx" | "pptx" | "image" | "zip";

export interface Attachment {
  id: string;
  name: string;
  fileType: AttachmentFileType;
  sizeLabel: string; // e.g. "1.2 MB"
}

export interface Assignment {
  id: string;
  title: string;
  subject: ResourceSubject;
  gradeLevel: GradeLevel;
  assignedDate: string; // ISO date
  dueDate: string; // ISO date
  description: string;
  instructions: string;
  points: number;
  attachments: Attachment[];
}

export type HomeworkStatus = "not-started" | "in-progress" | "completed";

/** Per-student tracker state for an assignment. Seeded as mock data; user
 *  interaction (checkbox toggles) is persisted client-side until a real
 *  backend exists. */
export interface HomeworkTrackerEntry {
  assignmentId: string;
  status: HomeworkStatus;
  submittedDate: string | null; // ISO date, set when marked completed
}

export type MaterialCategory =
  | "Worksheet"
  | "Reading"
  | "Reference Guide"
  | "Presentation Slides"
  | "Study Guide"
  | "Practice Problems";

export type MaterialFileType = "pdf" | "docx" | "pptx" | "xlsx" | "image";

export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  subject: ResourceSubject;
  category: MaterialCategory;
  gradeLevel: GradeLevel;
  fileType: MaterialFileType;
  sizeLabel: string;
  dateAdded: string; // ISO date
  previewSnippet: string; // short text shown in the preview modal, standing in for a real preview render
  tags: string[];
}

export type VideoProvider = "youtube" | "vimeo";

export interface VideoResource {
  id: string;
  title: string;
  description: string;
  subject: ResourceSubject;
  gradeLevel: GradeLevel;
  provider: VideoProvider;
  embedId: string;
  thumbnailUrl: string;
  durationLabel: string; // e.g. "6:42"
  dateAdded: string; // ISO date
}

export type ResourceCategory = MaterialCategory | "Video";

export interface ResourceSearchResult {
  id: string;
  kind: "material" | "video" | "assignment";
  title: string;
  subject: ResourceSubject;
  snippet: string;
}

