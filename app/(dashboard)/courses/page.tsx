import Link from "next/link";
import { BookOpen, FolderPlus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BRAND } from "@/lib/brand";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: string;
  updatedAt: Date;
  _count?: { modules: number };
};

export default async function CoursesPage() {
  let courses: CourseRow[] = [];
  let dbError = false;

  try {
    courses = await db.course.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { modules: true } } },
    });
  } catch {
    dbError = true;
    courses = [];
  }

  if (dbError) {
    return (
      <EmptyState
        icon={BookOpen}
        brandSrc={BRAND.system.lockup}
        brandAlt={BRAND.system.name}
        title="Press room offline"
        description="Set DATABASE_URL in .env, run prisma db push, then file your first course. The desk is ready — zero mock data."
        actionLabel="Compose Course"
        actionHref="/courses/new"
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="kicker">Catalog</p>
          <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-[var(--ink)]">
            Courses
          </h1>
          <p className="byline mt-1">
            {courses.length === 0
              ? "No editions on file."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} on the ledger.`}
          </p>
        </div>
        <Link
          href="/courses/new"
          className="inline-flex h-9 items-center border border-[var(--ink)] bg-[var(--ink)] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--paper)] hover:bg-[var(--accent-hover)]"
        >
          New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          brandSrc={BRAND.system.lockup}
          brandAlt={BRAND.system.name}
          title="No courses created yet"
          description="Get started by creating your first course structure."
          actionLabel="Create Course"
          actionHref="/courses/new"
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)] bg-[var(--paper-elevated)]">
          {courses.map((course, index) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}/edit`}
                className="block px-4 py-5 transition-colors hover:bg-black/[0.03] sm:px-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="byline">
                    {String(index + 1).padStart(2, "0")} · {course.status}
                    {course._count
                      ? ` · ${course._count.modules} module${course._count.modules === 1 ? "" : "s"}`
                      : null}
                  </p>
                  <p className="byline">
                    Updated{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(course.updatedAt))}
                  </p>
                </div>
                <h2 className="mt-1 font-serif text-2xl font-bold leading-snug text-[var(--ink)]">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-relaxed text-[var(--ink-secondary)]">
                  {course.description || "No description filed."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
