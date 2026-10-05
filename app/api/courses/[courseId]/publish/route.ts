import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PublishCourseSchema } from "@/lib/validators/course";

type Params = { params: Promise<{ courseId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const parsed = PublishCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (parsed.data.status === "PUBLISHED") {
      const course = await db.course.findUnique({
        where: { id: courseId },
        include: {
          modules: { include: { lessons: true } },
        },
      });

      if (!course) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      const hasLessons = course.modules.some((m) => m.lessons.length > 0);
      if (!hasLessons) {
        return NextResponse.json(
          {
            error:
              "Add at least one lesson before publishing. Empty courses stay in draft.",
          },
          { status: 400 },
        );
      }
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[POST /api/courses/:id/publish]", error);
    return NextResponse.json(
      { error: "Failed to update publish status" },
      { status: 500 },
    );
  }
}
