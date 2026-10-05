import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateNewsSchema,
  CreateAnnouncementSchema,
  CreateContactSchema,
  EnrollSchema,
} from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const kind = new URL(request.url).searchParams.get("kind") ?? "news";
    if (kind === "news") {
      return NextResponse.json(
        await db.newsPost.findMany({
          orderBy: { createdAt: "desc" },
          include: { author: true },
        }),
      );
    }
    if (kind === "announcements") {
      return NextResponse.json(
        await db.announcement.findMany({
          orderBy: { createdAt: "desc" },
          include: { course: true, author: true },
        }),
      );
    }
    if (kind === "contacts") {
      const subjectId = new URL(request.url).searchParams.get("subjectId") ?? undefined;
      return NextResponse.json(
        await db.contactRecord.findMany({
          where: subjectId ? { subjectId } : undefined,
          orderBy: { updatedAt: "desc" },
          include: { subject: true },
        }),
      );
    }
    if (kind === "enrollments") {
      const courseId = new URL(request.url).searchParams.get("courseId") ?? undefined;
      return NextResponse.json(
        await db.enrollment.findMany({
          where: courseId ? { courseId } : undefined,
          include: { person: true, course: true },
        }),
      );
    }
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (error) {
    console.error("[GET /api/comms]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "news") {
      const parsed = CreateNewsSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.newsPost.create({
        data: {
          title: parsed.data.title,
          body: parsed.data.body,
          authorId: parsed.data.authorId || null,
          publishedAt: parsed.data.publish === false ? null : new Date(),
        },
      });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "announce") {
      const parsed = CreateAnnouncementSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.announcement.create({
        data: {
          title: parsed.data.title,
          body: parsed.data.body,
          audience: parsed.data.audience,
          courseId: parsed.data.courseId || null,
          authorId: parsed.data.authorId || null,
        },
      });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "contact") {
      const parsed = CreateContactSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.contactRecord.create({
        data: {
          subjectId: parsed.data.subjectId,
          ownerId: parsed.data.ownerId || null,
          label: parsed.data.label,
          value: parsed.data.value,
          isPrimary: parsed.data.isPrimary ?? false,
        },
      });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "enroll") {
      const parsed = EnrollSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.enrollment.upsert({
        where: {
          courseId_personId: {
            courseId: parsed.data.courseId,
            personId: parsed.data.personId,
          },
        },
        create: parsed.data,
        update: { role: parsed.data.role },
      });
      return NextResponse.json(row);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/comms]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
