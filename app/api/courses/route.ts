import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CreateCourseSchema } from "@/lib/validators/course";
import { slugifyTitle } from "@/lib/utils";

export async function GET() {
  try {
    const courses = await db.course.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        _count: { select: { modules: true } },
      },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("[GET /api/courses]", error);
    return NextResponse.json(
      { error: "Failed to list courses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { title, description } = parsed.data;
    let slug = slugifyTitle(title);
    const existing = await db.course.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const course = await db.course.create({
      data: {
        title,
        slug,
        description: description ?? null,
        status: "DRAFT",
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("[POST /api/courses]", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
