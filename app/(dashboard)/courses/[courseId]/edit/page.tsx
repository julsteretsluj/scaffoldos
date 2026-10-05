import { CourseBuilder } from "@/components/builder/course-builder";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ courseId: string }> };

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params;

  let course = null;
  try {
    course = await db.course.findUnique({
      where: { id: courseId },
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

  return <CourseBuilder courseId={courseId} initialCourse={course} />;
}
