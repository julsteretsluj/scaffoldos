import Link from "next/link";
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
      <div className="min-h-screen bg-[#F2F2F7]">
        <header className="border-b border-[#D1D1D6] bg-[#0A1628] px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND.school.wordmarkDark}
            alt={BRAND.school.name}
            className="h-8 w-auto object-contain"
          />
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
    <div className="min-h-screen bg-[#F2F2F7]">
      <LearnerHeader courseTitle={course.title} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] sm:px-6">
        <aside className="rounded-[16px] border border-[#D1D1D6] bg-white p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#AEAEB2]">
            Outline
          </p>
          {course.modules.length === 0 ? (
            <p className="text-sm text-[#6E6E73]">No modules yet.</p>
          ) : (
            <ul className="space-y-4">
              {course.modules.map((mod) => (
                <li key={mod.id}>
                  <p className="mb-1.5 text-sm font-semibold text-[#1D1D1F]">
                    {mod.title}
                  </p>
                  {mod.lessons.length === 0 ? (
                    <p className="text-xs text-[#AEAEB2]">No lessons</p>
                  ) : (
                    <ul className="space-y-1">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <Link
                            href={`/learn/${course.slug}/${lesson.id}`}
                            className={cn(
                              "block rounded-[10px] px-2.5 py-1.5 text-sm transition-colors",
                              active?.id === lesson.id
                                ? "bg-[#007AFF]/10 text-[#007AFF]"
                                : "text-[#6E6E73] hover:bg-[#F2F2F7]",
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

        <section className="rounded-[16px] border border-[#D1D1D6] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {!active ? (
            <EmptyState
              icon={BookOpen}
              title="No lessons yet"
              description="This published course has no lessons. Check back after the author adds content."
            />
          ) : (
            <article>
              <p className="text-xs font-medium uppercase tracking-wide text-[#AEAEB2]">
                {active.moduleTitle} · {active.type}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1D1D1F]">
                {active.title}
              </h1>
              {active.videoUrl ? (
                <div className="mt-6 aspect-video overflow-hidden rounded-[12px] bg-[#1D1D1F]">
                  <iframe
                    title={active.title}
                    src={active.videoUrl}
                    className="h-full w-full"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <div className="prose prose-neutral mt-6 max-w-none text-[#1D1D1F]">
                {active.content ? (
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#1D1D1F]">
                    {active.content}
                  </pre>
                ) : (
                  <p className="text-sm text-[#6E6E73]">
                    Lesson content has not been written yet.
                  </p>
                )}
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
