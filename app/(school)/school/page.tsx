import Link from "next/link";
import { BookOpen, Users, ClipboardList, HeartPulse } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { SCHOOL_NAV } from "@/components/shared/school-nav";

export default function SchoolDeskPage() {
  return (
    <div className="space-y-8">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">{BRAND.school.name}</p>
        <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-[var(--ink)]">
          School desk
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
          Unified neuroaffirming hub for classwork, care, communications, and
          operations — empty until your community files records in{" "}
          {BRAND.system.shortName}.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {SCHOOL_NAV.filter((n) => n.href !== "/school").map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-[var(--rule)] bg-[var(--paper-elevated)] px-4 py-4 transition-colors hover:bg-black/[0.03]"
          >
            <p className="kicker">Module</p>
            <p className="mt-1 font-serif text-lg font-bold text-[var(--ink)]">
              {item.label}
            </p>
          </Link>
        ))}
      </div>

      <section className="grid gap-4 border border-[var(--rule)] p-5 md:grid-cols-4">
        {[
          { icon: BookOpen, label: "Curriculum & streams" },
          { icon: Users, label: "SIS & profiles" },
          { icon: ClipboardList, label: "Attendance & plans" },
          { icon: HeartPulse, label: "Clinical support" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <item.icon className="mx-auto h-5 w-5 text-[var(--ink)]" strokeWidth={1.5} />
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-secondary)]">
              {item.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
