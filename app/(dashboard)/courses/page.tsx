import Link from "next/link";
import { BookOpen, FolderPlus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND } from "@/lib/brand";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  let courses: Awaited<ReturnType<typeof db.course.findMany>> = [];
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
        title="Database not connected"
        description="Set DATABASE_URL in .env, run prisma migrate, then create your first course. The UI is ready — zero mock data."
        actionLabel="Create Course"
        actionHref="/courses/new"
      />
    );
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
            Courses
          </h1>
          <p className="mt-1 text-sm text-[#6E6E73]">
            Build and publish courses from an empty catalog.
          </p>
        </div>
        <EmptyState
          icon={FolderPlus}
          brandSrc={BRAND.system.lockup}
          brandAlt={BRAND.system.name}
          title="No courses created yet"
          description="Get started by creating your first course structure."
          actionLabel="Create Course"
          actionHref="/courses/new"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1D1D1F]">
            Courses
          </h1>
          <p className="mt-1 text-sm text-[#6E6E73]">
            {courses.length} course{courses.length === 1 ? "" : "s"} in your catalog.
          </p>
        </div>
        <Link
          href="/courses/new"
          className="inline-flex h-10 items-center rounded-[980px] bg-[#007AFF] px-5 text-sm font-medium text-white hover:bg-[#0077ED]"
        >
          Create Course
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}/edit`}>
            <Card className="h-full transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
              <CardHeader>
                <div className="mb-2 inline-flex w-fit rounded-[980px] bg-[#F2F2F7] px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-[#6E6E73]">
                  {course.status}
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-[#6E6E73]">
                  {course.description || "No description yet."}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
