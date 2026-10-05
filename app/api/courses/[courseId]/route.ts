import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UpdateCourseSchema } from "@/lib/validators/course";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    const course = await db.course.findUnique({
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

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[GET /api/courses/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    const body = await request.json();
    const parsed = UpdateCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const course = await db.course.update({
      where: { id: courseId },
      data: parsed.data,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[PATCH /api/courses/:id]", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    await db.course.delete({ where: { id: courseId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[DELETE /api/courses/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 },
    );
  }
}
