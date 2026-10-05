import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CreateSafetyPlanSchema } from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const personId = new URL(request.url).searchParams.get("personId") ?? undefined;
    const rows = await db.safetyPlan.findMany({
      where: personId ? { personId } : undefined,
      orderBy: { updatedAt: "desc" },
      include: { person: true },
    });
    return NextResponse.json(rows);
  } catch (error) {
    console.error("[GET /api/safety-plans]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateSafetyPlanSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const row = await db.safetyPlan.create({ data: parsed.data });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("[POST /api/safety-plans]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const row = await db.safetyPlan.update({ where: { id }, data: rest });
    return NextResponse.json(row);
  } catch (error) {
    console.error("[PATCH /api/safety-plans]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
