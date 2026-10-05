import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { LearnerHeader } from "@/components/shared/learner-header";
import { EmptyState } from "@/components/shared/empty-state";
import { BRAND } from "@/lib/brand";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ courseSlug: string; lessonId?: string[] }>;
};

export default async function LearnerPage({ params }: Props) {
  const { courseSlug, lessonId: lessonPath } = await params;
  const activeLessonId = lessonPath?.[0];

  let course = null;
  try {
    course = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
      },
    });
  } catch {
    course = null;
  }

  if (!course || course.status !== "PUBLISHED") {
    return (
      <div className="min-h-screen bg-[var(--paper)]">
        <header className="border-b border-[var(--rule)] bg-[var(--paper)] px-4 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-center">
            <Image
              src={BRAND.school.lockupLight}
              alt={BRAND.school.name}
              width={160}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <EmptyState
            icon={BookOpen}
            brandSrc={BRAND.school.lockupLight}
            brandAlt={BRAND.school.name}
            title="Course unavailable"
            description="This course is not published yet, or the catalog is empty. Authors publish from Course OS settings."
            actionLabel="Open Course OS"
            actionHref="/courses"
          />
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title })),
  );
  const active =
    allLessons.find((l) => l.id === activeLessonId) ?? allLessons[0] ?? null;

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <LearnerHeader courseTitle={course.title} />
      <div className="mx-auto grid max-w-5xl gap-0 border-x border-[var(--rule)] lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-[var(--rule)] p-4 lg:border-b-0 lg:border-r">
          <p className="kicker mb-3">Contents</p>
          {course.modules.length === 0 ? (
            <p className="text-sm text-[var(--ink-secondary)]">No modules yet.</p>
          ) : (
            <ul className="space-y-4">
              {course.modules.map((mod) => (
                <li key={mod.id}>
                  <p className="mb-1.5 font-serif text-sm font-bold text-[var(--ink)]">
                    {mod.title}
                  </p>
                  {mod.lessons.length === 0 ? (
                    <p className="byline">No lessons</p>
                  ) : (
                    <ul className="space-y-0.5 border-l border-[var(--rule-soft)] pl-2">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/learn/${course.slug}/${lesson.id}`}
                            className={cn(
                              "block px-2 py-1 text-sm transition-colors",
                              active?.id === lesson.id
                                ? "bg-[var(--ink)] font-semibold text-[var(--paper)]"
                                : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:underline",
                            )}
                          >
                            {lesson.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="bg-[var(--paper-elevated)] p-6 sm:p-8">
          {!active ? (
            <EmptyState
              icon={BookOpen}
              title="No lessons yet"
              description="This published course has no lessons. Check back after the author adds content."
            />
          ) : (
            <article>
              <p className="kicker">
                {active.moduleTitle} · {active.type}
              </p>
              <h1 className="mt-2 font-serif text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl">
                {active.title}
              </h1>
              <div className="my-5 border-t border-[var(--rule)]" />
              {active.videoUrl ? (
                <div className="mb-6 aspect-video overflow-hidden border border-[var(--rule)] bg-[var(--ink)]">
                  <iframe
                    title={active.title}
                    src={active.videoUrl}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              ) : null}
              {active.content ? (
                <pre className="whitespace-pre-wrap font-serif text-[1.05rem] leading-[1.7] text-[var(--ink)]">
                  {active.content}
                </pre>
              ) : (
                <p className="text-sm italic text-[var(--ink-secondary)]">
                  Lesson content has not been written yet.
                </p>
              )}
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
