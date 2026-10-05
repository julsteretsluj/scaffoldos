import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateLessonSchema,
  CreateModuleSchema,
  ReorderSchema,
} from "@/lib/validators/course";

type Params = { params: Promise<{ courseId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    const modules = await db.module.findMany({
      where: { courseId },
      orderBy: { order: "asc" },
      include: {
        lessons: { orderBy: { order: "asc" } },
      },
    });
    return NextResponse.json(modules);
  } catch (error) {
    console.error("[GET /api/courses/:id/modules]", error);
    return NextResponse.json(
      { error: "Failed to list modules" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { courseId } = await params;
    const body = await request.json();

    // Create lesson inside a module
    if (body.moduleId && body.lesson) {
      const lessonParsed = CreateLessonSchema.safeParse(body.lesson);
      if (!lessonParsed.success) {
        return NextResponse.json(
          { error: lessonParsed.error.flatten() },
          { status: 400 },
        );
      }

      const count = await db.lesson.count({
        where: { moduleId: body.moduleId },
      });

      const lesson = await db.lesson.create({
        data: {
          moduleId: body.moduleId,
          title: lessonParsed.data.title,
          type: lessonParsed.data.type,
          content: lessonParsed.data.content ?? null,
          videoUrl: lessonParsed.data.videoUrl || null,
          order: lessonParsed.data.order ?? count,
          isFreePreview: lessonParsed.data.isFreePreview ?? false,
        },
      });

      return NextResponse.json(lesson, { status: 201 });
    }

    // Reorder modules or lessons
    if (body.reorder) {
      const reorderParsed = ReorderSchema.safeParse(body.reorder);
      if (!reorderParsed.success) {
        return NextResponse.json(
          { error: reorderParsed.error.flatten() },
          { status: 400 },
        );
      }

      const kind = body.kind === "lessons" ? "lessons" : "modules";
      await db.$transaction(
        reorderParsed.data.items.map((item) =>
          kind === "lessons"
            ? db.lesson.update({
                where: { id: item.id },
                data: { order: item.order },
              })
            : db.module.update({
                where: { id: item.id },
                data: { order: item.order },
              }),
        ),
      );

      return NextResponse.json({ ok: true });
    }

    // Create module
    const parsed = CreateModuleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const count = await db.module.count({ where: { courseId } });
    const moduleRecord = await db.module.create({
      data: {
        courseId,
        title: parsed.data.title,
        order: parsed.data.order ?? count,
      },
      include: { lessons: true },
    });

    return NextResponse.json(moduleRecord, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses/:id/modules]", error);
    return NextResponse.json(
      { error: "Failed to mutate modules" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get("moduleId");
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      await db.lesson.delete({ where: { id: lessonId } });
      return NextResponse.json({ ok: true });
    }

    if (moduleId) {
      await db.module.delete({ where: { id: moduleId } });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "moduleId or lessonId required" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[DELETE /api/courses/:id/modules]", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 },
    );
  }
}
