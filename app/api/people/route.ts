import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CreatePersonSchema } from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const people = await db.person.findMany({
      where: role ? { role: role as never } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        accommodation: true,
        _count: {
          select: { helpRequests: true, submissions: true, checkIns: true },
        },
      },
    });
    return NextResponse.json(people);
  } catch (error) {
    console.error("[GET /api/people]", error);
    return NextResponse.json({ error: "Failed to list people" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreatePersonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const person = await db.person.create({
      data: {
        name: data.name,
        preferredName: data.preferredName || null,
        email: data.email || null,
        role: data.role,
        schedulePreference: data.schedulePreference || null,
        contactDetails: data.contactDetails || null,
      },
    });
    return NextResponse.json(person, { status: 201 });
  } catch (error) {
    console.error("[POST /api/people]", error);
    return NextResponse.json({ error: "Failed to create person" }, { status: 500 });
  }
}
