import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UpsertAttendanceSchema } from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId") ?? undefined;
    const date = searchParams.get("date");
    const rows = await db.attendanceRecord.findMany({
      where: {
        ...(courseId ? { courseId } : {}),
        ...(date ? { date: new Date(date) } : {}),
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      include: {
        student: true,
        course: { select: { id: true, title: true } },
      },
      take: 200,
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/attendance]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = UpsertAttendanceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    const date = new Date(d.date);
    const present =
      d.status === "PRESENT" || d.status === "REMOTE" || d.status === "LATE";
    const existing = await db.attendanceRecord.findFirst({
      where: {
        studentId: d.studentId,
        courseId: d.courseId ?? null,
        date,
      },
    });
    const row = existing
      ? await db.attendanceRecord.update({
          where: { id: existing.id },
          data: { status: d.status, present, note: d.note || null },
        })
      : await db.attendanceRecord.create({
          data: {
            studentId: d.studentId,
            courseId: d.courseId || null,
            date,
            status: d.status,
            present,
            note: d.note || null,
          },
        });
    return NextResponse.json(row);
  } catch (error) {
    console.error("[POST /api/attendance]", error);
    return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
  }
}
