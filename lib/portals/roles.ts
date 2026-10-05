import { BRAND } from "@/lib/brand";

export type PortalSlug =
  | "student"
  | "teacher"
  | "admin"
  | "leadership"
  | "parent"
  | "tutor";

export const PORTAL_ROLES: {
  slug: PortalSlug;
  dbRole: "STUDENT" | "TEACHER" | "ADMIN" | "LEADERSHIP" | "GUARDIAN" | "TUTOR";
  title: string;
  blurb: string;
  links: { href: string; label: string }[];
}[] = [
  {
    slug: "student",
    dbRole: "STUDENT",
    title: "Student portal",
    blurb: "Classwork stream, study notes, help desk, energy check-ins, and chats.",
    links: [
      { href: "/school/stream", label: "My classwork stream" },
      { href: "/school/classroom", label: "Class streams" },
      { href: "/school/study", label: "Study portal & notes" },
      { href: "/school/help", label: "Request help" },
      { href: "/school/chats", label: "Direct chats" },
      { href: "/school/classroom-chat", label: "Classroom chats" },
      { href: "/school/schedule", label: "Day architecture" },
      { href: "/school/accessibility", label: "Access settings" },
      { href: "/courses", label: "Browse published courses" },
    ],
  },
  {
    slug: "teacher",
    dbRole: "TEACHER",
    title: "Teacher portal",
    blurb: "Assignments, attendance, class streams, classroom chat, and curriculum.",
    links: [
      { href: "/courses", label: "Author courses" },
      { href: "/school/stream", label: "Classwork stream" },
      { href: "/school/classroom", label: "Class streams" },
      { href: "/school/attendance", label: "Take attendance" },
      { href: "/school/classroom-chat", label: "Classroom chats" },
      { href: "/school/announcements", label: "Class announcements" },
      { href: "/school/curriculum", label: "Curriculum hub" },
      { href: "/school/students", label: "Student profiles" },
      { href: "/school/help", label: "Help desk queue" },
    ],
  },
  {
    slug: "admin",
    dbRole: "ADMIN",
    title: "Admin portal",
    blurb: "SIS roster, contacts, communications, safety plans, and operations.",
    links: [
      { href: "/school/students", label: "Profiles & SIS" },
      { href: "/school/attendance", label: "Attendance" },
      { href: "/school/safety", label: "Safety plans" },
      { href: "/school/news", label: "School news" },
      { href: "/school/announcements", label: "Announcements" },
      { href: "/school/comms", label: "Communications hub" },
      { href: "/school/curriculum", label: "Curriculum hub" },
      { href: "/courses", label: "Scaffold OS catalog" },
    ],
  },
  {
    slug: "leadership",
    dbRole: "LEADERSHIP",
    title: "Senior leadership",
    blurb: "School-wide visibility across news, safety, SIS, and curriculum readiness.",
    links: [
      { href: "/school", label: "School desk overview" },
      { href: "/school/news", label: "News" },
      { href: "/school/announcements", label: "Announcements" },
      { href: "/school/safety", label: "Safety plans" },
      { href: "/school/students", label: "SIS roster" },
      { href: "/school/attendance", label: "Attendance overview" },
      { href: "/school/curriculum", label: "Curriculum hub" },
      { href: "/school/care", label: "Clinical & support" },
    ],
  },
  {
    slug: "parent",
    dbRole: "GUARDIAN",
    title: "Parent / guardian portal",
    blurb: "Family-facing deadlines, news, announcements, and calm status updates.",
    links: [
      { href: "/school/family", label: "Family desk" },
      { href: "/school/news", label: "School news" },
      { href: "/school/announcements", label: "Announcements" },
      { href: "/school/attendance", label: "Attendance view" },
      { href: "/school/chats", label: "Message school" },
      { href: "/school/students", label: "Linked profiles" },
    ],
  },
  {
    slug: "tutor",
    dbRole: "TUTOR",
    title: "Tutor / 1:1 portal",
    blurb: "Focused coaching: help desk, chats, study notes, and individual progress.",
    links: [
      { href: "/school/help", label: "Help desk" },
      { href: "/school/chats", label: "1:1 chats" },
      { href: "/school/study", label: "Study notes catalogue" },
      { href: "/school/stream", label: "Learner classwork" },
      { href: "/school/students", label: "Tutee profiles" },
      { href: "/school/care", label: "Support notes (as permitted)" },
      { href: "/school/schedule", label: "Day architecture" },
    ],
  },
];

export function portalBySlug(slug: string) {
  return PORTAL_ROLES.find((p) => p.slug === slug);
}

export const PRODUCT = BRAND.system.shortName;
