/**
 * Curriculum grade bands from the school design PDF — taxonomy only.
 * Does NOT seed courses; authors create courses and optionally tag them.
 */
export const GRADE_BANDS = [
  { id: "PRI", label: "PreK – Grade 4", ages: "Primary" },
  { id: "MS", label: "Grades 5 – 8", ages: "Middle" },
  { id: "HS", label: "Grades 9 – 12", ages: "Secondary" },
] as const;

export const SUBJECT_AREAS = [
  { code: "ND", label: "Neurodivergence & Advocacy" },
  { code: "LIFE", label: "Life Skills & Autonomy" },
  { code: "ENG", label: "Language Arts & Communication" },
  { code: "MATH", label: "Applied Mathematics" },
  { code: "SCI", label: "Natural & Behavioral Sciences" },
  { code: "TECH", label: "Technology & Design" },
  { code: "HUM", label: "History, Social Sciences & Humanities" },
  { code: "ART", label: "Creative Arts & Media" },
] as const;

/** Daily schedule architecture (policy template — not per-student fake data). */
export const DAY_SCHEDULE_BLOCKS = [
  {
    window: "8:30 – 9:30",
    focus: "Morning Reset & Prep",
    activities:
      "Visual schedule review, interoception check-in, async EF coach check-in.",
  },
  {
    window: "9:30 – 11:30",
    focus: "Focus Block I: Core Academics",
    activities:
      "STEM/Math, CS, or academic writing in 25–45 min sprints with sensory breaks.",
  },
  {
    window: "11:30 – 12:30",
    focus: "Sensory Movement & Lunch",
    activities: "Screen-free time, lunch, movement, or quiet regulation space.",
  },
  {
    window: "12:30 – 2:00",
    focus: "Focus Block II: Specialized Electives",
    activities:
      "Interest-driven work — ND studies, digital arts, game design, humanities.",
  },
  {
    window: "2:00 – 2:30",
    focus: "Executive Function & Admin Break",
    activities: "Inbox clear, task tracking, Help Desk requests.",
  },
  {
    window: "2:30 – 3:30",
    focus: "Life Skills & Practical Application",
    activities: "Financial literacy, home mechanics, self-advocacy practice.",
  },
  {
    window: "3:30 – 4:00",
    focus: "Wrap-Up & Clinical Support",
    activities:
      "End-of-day reflection; office hours, therapy, or diagnostic check-ins.",
  },
] as const;

export const WEEKLY_PACING = [
  {
    days: "Mon & Wed",
    label: "Core Academic Sprints",
    detail: "Quantitative, analytical, structured written modules.",
  },
  {
    days: "Tue & Thu",
    label: "Applied Projects & Advocacy",
    detail: "Creative, project-based, identity-focused modules.",
  },
  {
    days: "Flex Friday",
    label: "Catch-Up & Support",
    detail: "Async catch-up, 1:1 coaching, hyperfixation deep-dives.",
  },
] as const;

export const PROJECT_CHOICE_PROMPT =
  "You may complete this project as part of an asynchronous group exhibit or independently using the solo option below.";

export const DEFAULT_ROLE_CARDS = [
  { id: "researcher", title: "Researcher", description: "Gather sources and notes asynchronously." },
  { id: "visual", title: "Visual Designer", description: "Produce diagrams, maps, or layout assets." },
  { id: "analyst", title: "Data Analyst", description: "Organize findings into structured data." },
  { id: "editor", title: "Editor", description: "Polish language and accessibility of the exhibit." },
] as const;
