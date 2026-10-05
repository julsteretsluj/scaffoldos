import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateHelpRequestSchema,
  CreateEnergyCheckInSchema,
  UpsertAccommodationSchema,
  CreateCareNoteSchema,
  CreateAnnouncementSchema,
} from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind") ?? "help";

    if (kind === "help") {
      return NextResponse.json(
        await db.helpRequest.findMany({
          orderBy: { createdAt: "desc" },
          include: { student: true },
        }),
      );
    }
    if (kind === "checkins") {
      const studentId = searchParams.get("studentId") ?? undefined;
      return NextResponse.json(
        await db.energyCheckIn.findMany({
          where: studentId ? { studentId } : undefined,
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { student: true },
        }),
      );
    }
    if (kind === "announcements") {
      return NextResponse.json(
        await db.announcement.findMany({ orderBy: { createdAt: "desc" } }),
      );
    }
    if (kind === "care") {
      const studentId = searchParams.get("studentId");
      return NextResponse.json(
        await db.careNote.findMany({
          where: studentId ? { studentId } : undefined,
          orderBy: { createdAt: "desc" },
          include: { student: true, author: true },
        }),
      );
    }
    return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
  } catch (error) {
    console.error("[GET /api/support]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === "help") {
      const parsed = CreateHelpRequestSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.helpRequest.create({ data: parsed.data });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "checkin") {
      const parsed = CreateEnergyCheckInSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.energyCheckIn.create({ data: parsed.data });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "accommodation") {
      const parsed = UpsertAccommodationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const { studentId, ...rest } = parsed.data;
      const row = await db.accommodationProfile.upsert({
        where: { studentId },
        create: { studentId, ...rest },
        update: rest,
      });
      return NextResponse.json(row);
    }

    if (action === "care") {
      const parsed = CreateCareNoteSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.careNote.create({
        data: {
          studentId: parsed.data.studentId,
          authorId: parsed.data.authorId || null,
          note: parsed.data.note,
          isConfidential: parsed.data.isConfidential,
        },
      });
      return NextResponse.json(row, { status: 201 });
    }

    if (action === "announce") {
      const parsed = CreateAnnouncementSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.announcement.create({ data: parsed.data });
      return NextResponse.json(row, { status: 201 });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("[POST /api/support]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
