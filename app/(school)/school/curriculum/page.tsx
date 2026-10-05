import Link from "next/link";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GRADE_BANDS, SUBJECT_AREAS } from "@/lib/school/curriculum";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CurriculumHubPage() {
  let courses: Awaited<ReturnType<typeof db.course.findMany>> = [];
  let offline = false;
  try {
    courses = await db.course.findMany({ orderBy: { updatedAt: "desc" } });
  } catch {
    offline = true;
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Module B · Academic & curriculum hub</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Curriculum ledger
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Grade bands and subject taxonomy for authoring. Courses appear only when
          you create them — no seed catalog.
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        {GRADE_BANDS.map((b) => (
          <div key={b.id} className="border border-[var(--rule)] p-4">
            <p className="kicker">{b.id}</p>
            <p className="mt-1 font-serif text-lg font-bold">{b.label}</p>
            <p className="byline mt-1">{b.ages}</p>
          </div>
        ))}
      </section>

      <section>
        <p className="kicker mb-2">Subject areas</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SUBJECT_AREAS.map((s) => (
            <li key={s.code} className="border border-[var(--rule-soft)] px-3 py-2 text-sm">
              <span className="font-semibold">{s.code}</span> — {s.label}
            </li>
          ))}
        </ul>
      </section>

      {offline ? (
        <EmptyState
          icon={BookOpen}
          title="Curriculum offline"
          description="Connect Postgres to list authored courses tagged by grade band and subject."
          actionLabel="Create course"
          actionHref="/courses/new"
        />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses on the ledger"
          description="Author a DRAFT course and optionally tag grade band / subject code in settings."
          actionLabel="Compose a course"
          actionHref="/courses/new"
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {courses.map((c) => (
            <li key={c.id} className="px-4 py-3">
              <Link href={`/courses/${c.id}/edit`} className="block hover:underline">
                <p className="byline">
                  {c.status}
                  {c.gradeBand ? ` · ${c.gradeBand}` : ""}
                  {c.subjectCode ? ` · ${c.subjectCode}` : ""}
                </p>
                <p className="font-serif text-xl font-bold text-[var(--ink)]">{c.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
