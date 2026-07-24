import "server-only";
import type {
  Assignment,
  GradeLevel,
  HomeworkStatus,
  HomeworkTrackerEntry,
  LearningMaterial,
  MaterialCategory,
  ResourceSearchResult,
  ResourceSubject,
  VideoResource,
} from "./types";
import { notifyNewAssignment } from "./notifications";
import { indexMaterial } from "./search-index";
import { getAssignmentDaysUntilDue as daysUntil } from "./resources-data-client";

/**
 * All content below is mock data standing in for a future database, mirroring
 * the pattern in lib/mock-data.ts and lib/student-data.ts. Getters are async
 * and simulate latency so loading states get exercised. Swap function bodies
 * for real queries once a database/API exists — call sites won't change.
 */

function simulateLatency(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const RESOURCE_SUBJECTS: ResourceSubject[] = [
  "Math",
  "Science",
  "English Language Arts",
  "Social Studies",
  "Art",
  "Physical Education",
];

export const GRADE_LEVELS: GradeLevel[] = ["Grade 3", "Grade 4", "Grade 5", "All Grades"];

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  "Worksheet",
  "Reading",
  "Reference Guide",
  "Presentation Slides",
  "Study Guide",
  "Practice Problems",
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: "as-1",
    title: "Fractions Word Problems, Set 3",
    subject: "Math",
    gradeLevel: "Grade 4",
    assignedDate: "2026-07-20",
    dueDate: "2026-07-27",
    description: "Ten mixed word problems covering adding and subtracting fractions with unlike denominators.",
    instructions: "Show your work for every problem. Simplify all final answers. Use the fraction bar method we practiced in class if you get stuck.",
    points: 20,
    attachments: [
      { id: "att-1", name: "fractions-word-problems-set3.pdf", fileType: "pdf", sizeLabel: "412 KB" },
      { id: "att-2", name: "answer-sheet-template.docx", fileType: "docx", sizeLabel: "88 KB" },
    ],
  },
  {
    id: "as-2",
    title: "Water Cycle Diagram & Summary",
    subject: "Science",
    gradeLevel: "Grade 4",
    assignedDate: "2026-07-18",
    dueDate: "2026-07-25",
    description: "Label a diagram of the water cycle and write a short paragraph explaining each stage.",
    instructions: "Print the diagram or redraw it neatly. Label all five stages and write 4-6 sentences describing the cycle in your own words.",
    points: 15,
    attachments: [
      { id: "att-3", name: "water-cycle-diagram-blank.pdf", fileType: "pdf", sizeLabel: "620 KB" },
    ],
  },
  {
    id: "as-3",
    title: "Chapter 6 Reading Response",
    subject: "English Language Arts",
    gradeLevel: "Grade 4",
    assignedDate: "2026-07-21",
    dueDate: "2026-07-24",
    description: "Read Chapter 6 of our class novel and respond to the discussion questions.",
    instructions: "Answer all four questions in complete sentences. Cite a specific page or quote in at least one answer.",
    points: 10,
    attachments: [
      { id: "att-4", name: "chapter6-discussion-questions.pdf", fileType: "pdf", sizeLabel: "150 KB" },
    ],
  },
  {
    id: "as-4",
    title: "Community Helpers Interview",
    subject: "Social Studies",
    gradeLevel: "Grade 3",
    assignedDate: "2026-07-15",
    dueDate: "2026-07-22",
    description: "Interview a family member or neighbor about their job and how it helps the community.",
    instructions: "Use the interview sheet questions. Add one drawing of the person at work.",
    points: 15,
    attachments: [
      { id: "att-5", name: "community-helpers-interview-sheet.docx", fileType: "docx", sizeLabel: "95 KB" },
    ],
  },
  {
    id: "as-5",
    title: "Self-Portrait in Mixed Media",
    subject: "Art",
    gradeLevel: "All Grades",
    assignedDate: "2026-07-14",
    dueDate: "2026-07-31",
    description: "Create a self-portrait using at least two different art materials (paint, collage, pastels, etc.).",
    instructions: "Bring your finished piece to class on poster board no larger than 11x17. No instructions sheet needed — refer to the demo from class.",
    points: 20,
    attachments: [],
  },
  {
    id: "as-6",
    title: "Multiplication Fluency Drill 4",
    subject: "Math",
    gradeLevel: "Grade 3",
    assignedDate: "2026-07-10",
    dueDate: "2026-07-17",
    description: "Timed practice sheet covering the 6, 7, and 8 times tables.",
    instructions: "Complete within the 5-minute practice window at home and record your time at the top of the sheet.",
    points: 10,
    attachments: [
      { id: "att-6", name: "multiplication-drill-4.pdf", fileType: "pdf", sizeLabel: "210 KB" },
    ],
  },
];

// Per-student tracker state, seeded as mock data. Mutations happen client-side
// (see ResourceHomeworkTracker) and are not persisted here since this module
// runs on the server; the client keeps its own copy in localStorage until a
// real backend/API exists.
const HOMEWORK_TRACKER: HomeworkTrackerEntry[] = [
  { assignmentId: "as-1", status: "in-progress", submittedDate: null },
  { assignmentId: "as-2", status: "not-started", submittedDate: null },
  { assignmentId: "as-3", status: "not-started", submittedDate: null },
  { assignmentId: "as-4", status: "completed", submittedDate: "2026-07-21" },
  { assignmentId: "as-5", status: "not-started", submittedDate: null },
  { assignmentId: "as-6", status: "completed", submittedDate: "2026-07-16" },
];

const MATERIALS: LearningMaterial[] = [
  {
    id: "mt-1",
    title: "Fraction Bar Method — Reference Sheet",
    description: "A one-page visual reference for adding and subtracting fractions with unlike denominators.",
    subject: "Math",
    category: "Reference Guide",
    gradeLevel: "Grade 4",
    fileType: "pdf",
    sizeLabel: "340 KB",
    dateAdded: "2026-07-19",
    previewSnippet: "Step 1: Find a common denominator. Step 2: Rewrite each fraction. Step 3: Add or subtract the numerators and keep the denominator...",
    tags: ["fractions", "math", "reference"],
  },
  {
    id: "mt-2",
    title: "Multiplication Tables 1-12",
    description: "Printable multiplication chart for quick reference during homework and practice drills.",
    subject: "Math",
    category: "Reference Guide",
    gradeLevel: "All Grades",
    fileType: "pdf",
    sizeLabel: "120 KB",
    dateAdded: "2026-07-05",
    previewSnippet: "1x1=1  1x2=2  1x3=3 ... 12x11=132  12x12=144. Full grid available for printing and desk reference.",
    tags: ["multiplication", "math", "chart"],
  },
  {
    id: "mt-3",
    title: "The Water Cycle Explained",
    description: "Illustrated reading covering evaporation, condensation, precipitation, and collection.",
    subject: "Science",
    category: "Reading",
    gradeLevel: "Grade 4",
    fileType: "pdf",
    sizeLabel: "780 KB",
    dateAdded: "2026-07-17",
    previewSnippet: "Water is always on the move. As the sun heats oceans, lakes, and rivers, water turns into vapor and rises into the sky...",
    tags: ["water cycle", "science", "weather"],
  },
  {
    id: "mt-4",
    title: "Ecosystems Study Guide",
    description: "Review packet covering food chains, habitats, and producer/consumer relationships ahead of the unit quiz.",
    subject: "Science",
    category: "Study Guide",
    gradeLevel: "Grade 4",
    fileType: "docx",
    sizeLabel: "215 KB",
    dateAdded: "2026-07-11",
    previewSnippet: "Key vocabulary: producer, consumer, decomposer, habitat, food chain, food web. Review questions 1-12 with answer key on the last page.",
    tags: ["ecosystems", "science", "review"],
  },
  {
    id: "mt-5",
    title: "Chapter 6 Vocabulary List",
    description: "Vocabulary words from Chapter 6 of our class novel with definitions and example sentences.",
    subject: "English Language Arts",
    category: "Reference Guide",
    gradeLevel: "Grade 4",
    fileType: "pdf",
    sizeLabel: "98 KB",
    dateAdded: "2026-07-20",
    previewSnippet: "1. Reluctant (adj.) - unwilling and hesitant. 'She was reluctant to raise her hand.' 2. Persevere (v.) - to continue despite difficulty...",
    tags: ["vocabulary", "reading", "novel"],
  },
  {
    id: "mt-6",
    title: "Paragraph Writing Checklist",
    description: "A checklist students can use to self-edit any response paragraph before turning it in.",
    subject: "English Language Arts",
    category: "Worksheet",
    gradeLevel: "All Grades",
    fileType: "pdf",
    sizeLabel: "60 KB",
    dateAdded: "2026-06-28",
    previewSnippet: "Does my paragraph have a topic sentence? Did I use at least two supporting details? Did I check spelling and punctuation?",
    tags: ["writing", "checklist", "editing"],
  },
  {
    id: "mt-7",
    title: "Community Helpers Slide Deck",
    description: "Slides from our in-class discussion on different community jobs and how they help others.",
    subject: "Social Studies",
    category: "Presentation Slides",
    gradeLevel: "Grade 3",
    fileType: "pptx",
    sizeLabel: "3.1 MB",
    dateAdded: "2026-07-14",
    previewSnippet: "Slide 1: What is a community? Slide 2: Firefighters and Police Officers. Slide 3: Doctors and Nurses. Slide 4: Teachers and Librarians...",
    tags: ["community", "social studies", "jobs"],
  },
  {
    id: "mt-8",
    title: "Map Skills Practice Problems",
    description: "Practice reading map legends, compass roses, and grid coordinates.",
    subject: "Social Studies",
    category: "Practice Problems",
    gradeLevel: "Grade 4",
    fileType: "pdf",
    sizeLabel: "290 KB",
    dateAdded: "2026-06-30",
    previewSnippet: "Using the map on page 2, find the grid coordinate for the library. What direction is the park from the school?",
    tags: ["maps", "geography", "practice"],
  },
  {
    id: "mt-9",
    title: "Color Theory Basics",
    description: "Quick-reference guide to primary, secondary, and complementary colors for the mixed-media unit.",
    subject: "Art",
    category: "Reference Guide",
    gradeLevel: "All Grades",
    fileType: "image",
    sizeLabel: "540 KB",
    dateAdded: "2026-07-08",
    previewSnippet: "Primary colors: red, yellow, blue. Secondary colors are made by mixing two primaries. Complementary colors sit across from each other on the wheel.",
    tags: ["color theory", "art"],
  },
  {
    id: "mt-10",
    title: "Warm-Up Stretch Routine",
    description: "Printable illustrated guide to the five-minute warm-up routine used before PE activities.",
    subject: "Physical Education",
    category: "Reference Guide",
    gradeLevel: "All Grades",
    fileType: "pdf",
    sizeLabel: "410 KB",
    dateAdded: "2026-06-22",
    previewSnippet: "1. Arm circles - 20 seconds. 2. High knees - 20 seconds. 3. Toe touches - 20 seconds. 4. Jumping jacks - 20 seconds. 5. Deep breathing - 20 seconds.",
    tags: ["fitness", "warm-up", "pe"],
  },
  {
    id: "mt-11",
    title: "Long Division Practice Problems",
    description: "A set of 15 long division problems with an answer key for at-home practice.",
    subject: "Math",
    category: "Practice Problems",
    gradeLevel: "Grade 5",
    fileType: "pdf",
    sizeLabel: "265 KB",
    dateAdded: "2026-07-22",
    previewSnippet: "1) 486 / 6  2) 912 / 4  3) 735 / 5 ... Answer key included on the final page for self-checking.",
    tags: ["division", "math", "practice"],
  },
  {
    id: "mt-12",
    title: "Persuasive Essay Planning Sheet",
    description: "Graphic organizer for outlining a persuasive essay before drafting.",
    subject: "English Language Arts",
    category: "Worksheet",
    gradeLevel: "Grade 5",
    fileType: "docx",
    sizeLabel: "72 KB",
    dateAdded: "2026-07-13",
    previewSnippet: "Claim: ___. Reason 1: ___. Supporting detail: ___. Reason 2: ___. Supporting detail: ___. Counterargument: ___.",
    tags: ["writing", "essay", "planning"],
  },
];

const VIDEOS: VideoResource[] = [
  {
    id: "vd-1",
    title: "Understanding the Water Cycle (Animated)",
    description: "A short animated explainer walking through evaporation, condensation, and precipitation.",
    subject: "Science",
    gradeLevel: "Grade 4",
    provider: "youtube",
    embedId: "al-do-HGuIk",
    thumbnailUrl: "https://img.youtube.com/vi/al-do-HGuIk/hqdefault.jpg",
    durationLabel: "4:32",
    dateAdded: "2026-07-16",
  },
  {
    id: "vd-2",
    title: "Adding Fractions with Unlike Denominators",
    description: "A step-by-step walkthrough of the fraction bar method used in class.",
    subject: "Math",
    gradeLevel: "Grade 4",
    provider: "youtube",
    embedId: "ZerqRUgYQ3U",
    thumbnailUrl: "https://img.youtube.com/vi/ZerqRUgYQ3U/hqdefault.jpg",
    durationLabel: "6:15",
    dateAdded: "2026-07-19",
  },
  {
    id: "vd-3",
    title: "What Does a Community Helper Do?",
    description: "A friendly overview of different community jobs, made for our Social Studies unit.",
    subject: "Social Studies",
    gradeLevel: "Grade 3",
    provider: "vimeo",
    embedId: "76979871",
    thumbnailUrl: "https://vumbnail.com/76979871.jpg",
    durationLabel: "3:48",
    dateAdded: "2026-07-12",
  },
  {
    id: "vd-4",
    title: "Color Mixing Basics for Young Artists",
    description: "A hands-on demonstration of mixing primary colors into secondary colors.",
    subject: "Art",
    gradeLevel: "All Grades",
    provider: "youtube",
    embedId: "X0NKuraLW4o",
    thumbnailUrl: "https://img.youtube.com/vi/X0NKuraLW4o/hqdefault.jpg",
    durationLabel: "5:02",
    dateAdded: "2026-07-07",
  },
  {
    id: "vd-5",
    title: "Five-Minute Classroom Warm-Up",
    description: "Follow-along stretch and movement routine used before PE activities.",
    subject: "Physical Education",
    gradeLevel: "All Grades",
    provider: "youtube",
    embedId: "UBMk30rjy0o",
    thumbnailUrl: "https://img.youtube.com/vi/UBMk30rjy0o/hqdefault.jpg",
    durationLabel: "5:47",
    dateAdded: "2026-06-25",
  },
  {
    id: "vd-6",
    title: "How to Read a Map: Legends and Coordinates",
    description: "A quick primer on map legends, compass roses, and grid references.",
    subject: "Social Studies",
    gradeLevel: "Grade 4",
    provider: "youtube",
    embedId: "sJ1lIvSs1F4",
    thumbnailUrl: "https://img.youtube.com/vi/sJ1lIvSs1F4/hqdefault.jpg",
    durationLabel: "4:58",
    dateAdded: "2026-06-29",
  },
];

function sortByDueDate(items: Assignment[]): Assignment[] {
  return [...items].sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
}

export async function getAssignments(): Promise<Assignment[]> {
  await simulateLatency();
  return sortByDueDate(ASSIGNMENTS);
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  await simulateLatency(150);
  return ASSIGNMENTS.find((a) => a.id === id) ?? null;
}

export function getAssignmentDaysUntilDue(dateIso: string, referenceDate?: Date): number {
  return daysUntil(dateIso, referenceDate);
}

/** Simulates the notification module firing when a new assignment is posted. */
export async function publishAssignment(assignment: Assignment): Promise<void> {
  await simulateLatency(100);
  ASSIGNMENTS.push(assignment);
  notifyNewAssignment({
    assignmentId: assignment.id,
    title: assignment.title,
    subject: assignment.subject,
    dueDate: assignment.dueDate,
  });
}

export async function getHomeworkTracker(): Promise<
  Array<{ assignment: Assignment; status: HomeworkStatus; submittedDate: string | null }>
> {
  await simulateLatency();
  return sortByDueDate(ASSIGNMENTS).map((assignment) => {
    const entry = HOMEWORK_TRACKER.find((e) => e.assignmentId === assignment.id);
    return {
      assignment,
      status: entry?.status ?? "not-started",
      submittedDate: entry?.submittedDate ?? null,
    };
  });
}

export async function getLearningMaterials(): Promise<LearningMaterial[]> {
  await simulateLatency();
  return [...MATERIALS].sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1));
}

export async function getLearningMaterialById(id: string): Promise<LearningMaterial | null> {
  await simulateLatency(150);
  return MATERIALS.find((m) => m.id === id) ?? null;
}

export async function getVideoResources(): Promise<VideoResource[]> {
  await simulateLatency();
  return [...VIDEOS].sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : -1));
}

/** Recommends materials by matching subject/tags against recently viewed material IDs. */
export async function getRecommendedMaterials(
  recentlyViewedIds: string[],
  limit = 4
): Promise<LearningMaterial[]> {
  const all = await getLearningMaterials();
  if (recentlyViewedIds.length === 0) {
    return all.slice(0, limit);
  }

  const viewed = all.filter((m) => recentlyViewedIds.includes(m.id));
  const viewedSubjects = new Set(viewed.map((m) => m.subject));
  const viewedTags = new Set(viewed.flatMap((m) => m.tags));

  const scored = all
    .filter((m) => !recentlyViewedIds.includes(m.id))
    .map((m) => {
      let score = 0;
      if (viewedSubjects.has(m.subject)) score += 2;
      score += m.tags.filter((t) => viewedTags.has(t)).length;
      return { material: m, score };
    })
    .sort((a, b) => b.score - a.score || (a.material.dateAdded < b.material.dateAdded ? 1 : -1));

  return scored.slice(0, limit).map((s) => s.material);
}

/** Simulates a search-index lookup across materials, videos, and assignments. */
export async function searchResources(query: string): Promise<ResourceSearchResult[]> {
  await simulateLatency(200);
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const [materials, videos, assignments] = await Promise.all([
    getLearningMaterials(),
    getVideoResources(),
    getAssignments(),
  ]);

  const materialResults: ResourceSearchResult[] = materials
    .filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((m) => ({ id: m.id, kind: "material", title: m.title, subject: m.subject, snippet: m.description }));

  const videoResults: ResourceSearchResult[] = videos
    .filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.subject.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q)
    )
    .map((v) => ({ id: v.id, kind: "video", title: v.title, subject: v.subject, snippet: v.description }));

  const assignmentResults: ResourceSearchResult[] = assignments
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    )
    .map((a) => ({ id: a.id, kind: "assignment", title: a.title, subject: a.subject, snippet: a.description }));

  // Every result funnels through the search-index integration point so a
  // real search module can log/track query hits the same way it indexes writes.
  [...materialResults, ...videoResults, ...assignmentResults].forEach((r) =>
    indexMaterial({ id: r.id, title: r.title, subject: r.subject })
  );

  return [...assignmentResults, ...materialResults, ...videoResults];
}
