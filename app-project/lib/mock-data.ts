import "server-only";
import type {
  Achievement,
  Announcement,
  Birthday,
  FaqItem,
  NewsArticle,
} from "./types";

/**
 * All content below is mock data standing in for a future database.
 * Every getter is async and returns a fresh array, so swapping the body of
 * each function for a real query (Prisma, Supabase, etc.) later requires no
 * changes on the calling side. The small delay simulates real network/DB
 * latency so loading states in the UI are exercised during development.
 */
function simulateLatency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an-1",
    title: "Fall Open House — Save the Date",
    summary: "Join us on the evening of September 10th to see the classroom and meet the team.",
    body: "Our Fall Open House will run from 6:00–7:30 PM in the main classroom. Families are welcome to drop by any time in that window to see student work on display, chat with teachers, and learn what's ahead for the semester. Light refreshments will be provided. No RSVP required, but let us know if you have more than four guests coming.",
    date: "2026-07-20",
    category: "Event",
    pinned: true,
  },
  {
    id: "an-2",
    title: "Picture Day Moved to August 5th",
    summary: "Picture day has shifted one week later due to a scheduling conflict with the photographer.",
    body: "Picture Day has been rescheduled from July 29th to August 5th. Order forms sent home last week are still valid — just update the date. Students should wear their photo-day best. Retakes will be offered in late August for anyone absent.",
    date: "2026-07-18",
    category: "General",
  },
  {
    id: "an-3",
    title: "Early Dismissal — Staff Development Day",
    summary: "School lets out at 12:15 PM on Friday, July 31st for a staff training day.",
    body: "All students will be dismissed at 12:15 PM on Friday, July 31st while staff attend a professional development session. Bus schedules will run their normal afternoon route, just three hours earlier. Please make arrangements for early pickup if your child usually stays later.",
    date: "2026-07-16",
    category: "Urgent",
  },
  {
    id: "an-4",
    title: "Book Fair Kicks Off Monday",
    summary: "The Scholastic Book Fair opens Monday in the library and runs all week.",
    body: "The library will host our Scholastic Book Fair from Monday through Friday, 8:00 AM–4:00 PM. Students can browse during their scheduled library block, and the fair is open to families before and after school. All proceeds go toward new titles for our classroom shelves.",
    date: "2026-07-12",
    category: "Event",
  },
  {
    id: "an-5",
    title: "Congratulations to Our Science Fair Finalists",
    summary: "Four students advanced to the district science fair — details on the showcase inside.",
    body: "We're thrilled to share that four of our students advanced to the district-level science fair this year. A showcase of all class projects, including the finalists, will be on display in the hallway through the end of the month. Come take a look during pickup or drop-off.",
    date: "2026-07-08",
    category: "Celebration",
  },
];

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "nw-1",
    title: "Students Launch a Classroom Garden Project",
    excerpt: "A hands-on lesson in biology and patience, our new garden bed is already sprouting.",
    content: "Over the past two weeks, students have been designing, planting, and maintaining a small garden bed just outside the classroom window. The project ties directly into our life-science unit, giving students a chance to track germination, measure growth, and take turns on a watering schedule. Early sprouts of basil and sunflowers are already visible, and the class has started a shared journal to log observations. We expect the first harvest of herbs by late August, which the class plans to use in a cooking activity tied to our nutrition unit.",
    date: "2026-07-21",
    author: "Ms. Alvarez",
    tag: "Classroom Life",
  },
  {
    id: "nw-2",
    title: "Reading Challenge Passes the 1,000-Book Mark",
    excerpt: "Our class-wide reading challenge just crossed a major milestone ahead of schedule.",
    content: "What started as a modest goal of 750 books read by the end of the term has already blown past the 1,000-book mark, with several weeks still to go. Students log their reading nightly, and the class tracker in the front of the room has become a favorite thing to check each morning. As a reward, the class voted to hold an outdoor reading day, complete with blankets and lemonade, once the total reaches 1,200.",
    date: "2026-07-15",
    author: "Mr. Douglas",
    tag: "Academics",
  },
  {
    id: "nw-3",
    title: "A Look Back at Field Day",
    excerpt: "Sunshine, relay races, and a lot of team spirit — highlights from this year's Field Day.",
    content: "Field Day brought the whole grade together for a morning of relay races, tug-of-war, and a very competitive water balloon toss. Despite the heat, spirits stayed high, and every student walked away with a ribbon for participation. Thank you to the parent volunteers who helped run stations and kept the water coolers full — the event simply doesn't happen without you.",
    date: "2026-07-09",
    author: "Ms. Alvarez",
    tag: "Events",
  },
  {
    id: "nw-4",
    title: "New Classroom Library Corner Now Open",
    excerpt: "Thanks to family donations, our reading nook has doubled in size.",
    content: "Generous book donations from several families have let us more than double the size of our classroom reading corner. New bean bags and a low bookshelf were added over the weekend, and students have already claimed it as a favorite spot for independent reading time. If you have gently used chapter books at home, we're always happy to add to the shelf.",
    date: "2026-07-02",
    author: "Mr. Douglas",
    tag: "Classroom Life",
  },
];

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ac-1",
    title: "District Science Fair Finalist",
    description: "Advanced to the district-level competition with a project on water filtration.",
    date: "2026-07-08",
    icon: "trophy",
    recipient: "Priya N.",
  },
  {
    id: "ac-2",
    title: "1,000-Book Reading Milestone",
    description: "The whole class hit a major shared reading goal three weeks ahead of schedule.",
    date: "2026-07-15",
    icon: "book",
    recipient: "Whole Class",
  },
  {
    id: "ac-3",
    title: "Perfect Attendance — Spring Term",
    description: "Didn't miss a single day of school all term.",
    date: "2026-06-20",
    icon: "star",
    recipient: "Marcus T.",
  },
  {
    id: "ac-4",
    title: "Kindness Award",
    description: "Nominated by classmates for consistently helping others without being asked.",
    date: "2026-06-12",
    icon: "medal",
    recipient: "Sofia R.",
  },
  {
    id: "ac-5",
    title: "Math Olympiad Top Score",
    description: "Highest score in the grade on this term's Math Olympiad qualifier.",
    date: "2026-05-30",
    icon: "target",
    recipient: "Ethan W.",
  },
  {
    id: "ac-6",
    title: "Field Day Team Spirit Award",
    description: "Voted by teachers as the team that showed the most encouragement to others.",
    date: "2026-07-09",
    icon: "users",
    recipient: "Whole Class",
  },
];

const FAQS: FaqItem[] = [
  {
    id: "fq-1",
    category: "General",
    question: "What are the school's drop-off and pickup times?",
    answer: "Drop-off begins at 7:45 AM and the first bell rings at 8:00 AM. Pickup is at 3:00 PM, with early dismissal days ending at 12:15 PM — those are always announced in advance on the announcements page.",
  },
  {
    id: "fq-2",
    category: "General",
    question: "How do I update my contact information?",
    answer: "Send updated contact details through the contact form on this site, or a note in your student's folder. We'll confirm the change within one business day.",
  },
  {
    id: "fq-3",
    category: "Academics",
    question: "How is homework communicated each week?",
    answer: "Homework is sent home in the Friday folder and also posted as an announcement. Most assignments are due the following Friday unless otherwise noted.",
  },
  {
    id: "fq-4",
    category: "Academics",
    question: "Will there be report cards this term?",
    answer: "Yes, report cards go home at the end of each term. Interim progress notes are shared roughly halfway through if a teacher has specific feedback to share sooner.",
  },
  {
    id: "fq-5",
    category: "Events",
    question: "Do I need to RSVP for the Open House?",
    answer: "No RSVP is required for the Open House — families can drop in any time during the posted window. If you're bringing more than four guests, a quick note ahead of time helps us plan refreshments.",
  },
  {
    id: "fq-6",
    category: "Events",
    question: "Can younger siblings attend class events?",
    answer: "Absolutely — most events, like the Open House and Field Day, are family-friendly and younger siblings are always welcome.",
  },
  {
    id: "fq-7",
    category: "Support",
    question: "Who do I contact if my child needs extra help?",
    answer: "Reach out through the contact form and mention which subject your child is working on. We'll follow up to set up extra practice time or point you toward the right resource.",
  },
  {
    id: "fq-8",
    category: "Support",
    question: "How can I volunteer in the classroom?",
    answer: "We're always glad to have volunteer help for events like Field Day and the Book Fair. Let us know through the contact form and we'll add you to the volunteer list for the next opportunity.",
  },
];

const BIRTHDAYS: Birthday[] = [
  { id: "bd-1", name: "Priya N.", month: 7, day: 3 },
  { id: "bd-2", name: "Marcus T.", month: 7, day: 11 },
  { id: "bd-3", name: "Sofia R.", month: 7, day: 22 },
  { id: "bd-4", name: "Ethan W.", month: 7, day: 29 },
  { id: "bd-5", name: "Ava L.", month: 8, day: 4 },
  { id: "bd-6", name: "Noah K.", month: 8, day: 17 },
  { id: "bd-7", name: "Grace P.", month: 6, day: 9 },
  { id: "bd-8", name: "Liam H.", month: 9, day: 2 },
];

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getAnnouncements(): Promise<Announcement[]> {
  await simulateLatency();
  const pinned = ANNOUNCEMENTS.filter((a) => a.pinned);
  const rest = sortByDateDesc(ANNOUNCEMENTS.filter((a) => !a.pinned));
  return [...pinned, ...rest];
}

export async function getNews(): Promise<NewsArticle[]> {
  await simulateLatency();
  return sortByDateDesc(NEWS_ARTICLES);
}

export async function getAchievements(): Promise<Achievement[]> {
  await simulateLatency();
  return sortByDateDesc(ACHIEVEMENTS);
}

export async function getFaqs(): Promise<FaqItem[]> {
  await simulateLatency(200);
  return FAQS;
}

export async function getBirthdays(): Promise<Birthday[]> {
  await simulateLatency(200);
  return [...BIRTHDAYS].sort((a, b) => (a.month === b.month ? a.day - b.day : a.month - b.month));
}

/** Birthdays falling in the current calendar month, soonest first. */
export async function getUpcomingBirthdays(referenceDate = new Date()): Promise<Birthday[]> {
  const all = await getBirthdays();
  const month = referenceDate.getMonth() + 1;
  const day = referenceDate.getDate();
  return all
    .filter((b) => b.month === month)
    .sort((a, b) => {
      const aPast = a.day < day;
      const bPast = b.day < day;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return a.day - b.day;
    });
}
