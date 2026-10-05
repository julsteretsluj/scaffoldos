import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const SCHOOL_NAV = [
  { href: "/school", label: "School desk" },
  { href: "/school/stream", label: "Classwork stream" },
  { href: "/school/classroom", label: "Class streams" },
  { href: "/school/curriculum", label: "Curriculum hub" },
  { href: "/school/students", label: "Profiles & SIS" },
  { href: "/school/attendance", label: "Attendance" },
  { href: "/school/safety", label: "Safety plans" },
  { href: "/school/news", label: "News" },
  { href: "/school/announcements", label: "Announcements" },
  { href: "/school/chats", label: "Direct chats" },
  { href: "/school/classroom-chat", label: "Classroom chats" },
  { href: "/school/study", label: "Study portal" },
  { href: "/school/schedule", label: "Day architecture" },
  { href: "/school/care", label: "Clinical & support" },
  { href: "/school/family", label: "Family portal" },
  { href: "/school/help", label: "Help desk" },
  { href: "/school/accessibility", label: "Access settings" },
] as const;

export function SchoolNav({ current }: { current?: string }) {
  return (
    <aside className="border-b border-[var(--rule)] lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="p-4">
        <Link href="/school" className="block">
          <Image
            src={BRAND.school.lockupLight}
            alt={BRAND.school.name}
            width={140}
            height={44}
            className="h-11 w-auto object-contain"
          />
        </Link>
        <p className="mt-2 byline">Tenant edition · {BRAND.system.shortName}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:max-h-[70vh] lg:flex-col lg:overflow-y-auto lg:px-0 lg:pb-6">
        {SCHOOL_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em]",
              current === item.href
                ? "bg-[var(--ink)] text-[var(--paper)]"
                : "text-[var(--ink-secondary)] hover:bg-black/[0.04] hover:text-[var(--ink)]",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="hidden space-y-2 border-t border-[var(--rule-soft)] p-4 lg:block">
        <Link
          href="/portal"
          className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:underline"
        >
          Role portals
        </Link>
        <Link
          href="/courses"
          className="block text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)] hover:text-[var(--ink)] hover:underline"
        >
          ← Scaffold OS authoring
        </Link>
      </div>
    </aside>
  );
}
