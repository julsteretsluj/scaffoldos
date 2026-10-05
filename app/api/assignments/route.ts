import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateAssignmentSchema,
  UpdateBoardStatusSchema,
} from "@/lib/validators/course";
import { PROJECT_CHOICE_PROMPT, DEFAULT_ROLE_CARDS } from "@/lib/school/curriculum";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const assignments = await db.assignment.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: [{ hardDeadline: "asc" }, { createdAt: "desc" }],
      include: {
        course: { select: { id: true, title: true, slug: true } },
        milestones: { orderBy: { stepNumber: "asc" } },
        submissions: true,
        trackChoices: true,
      },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("[GET /api/assignments]", error);
    return NextResponse.json(
      { error: "Failed to list assignments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.boardStatus && body.assignmentId && body.studentId) {
      const parsed = UpdateBoardStatusSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const existing = await db.submission.findFirst({
        where: {
          assignmentId: parsed.data.assignmentId,
          studentId: parsed.data.studentId,
        },
      });
      const submission = existing
        ? await db.submission.update({
            where: { id: existing.id },
            data: { boardStatus: parsed.data.boardStatus },
          })
        : await db.submission.create({
            data: {
              assignmentId: parsed.data.assignmentId,
              studentId: parsed.data.studentId,
              boardStatus: parsed.data.boardStatus,
              status: "NEEDS_ATTENTION",
            },
          });
      return NextResponse.json(submission);
    }

    const parsed = CreateAssignmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    const assignment = await db.assignment.create({
      data: {
        courseId: d.courseId,
        title: d.title,
        brief: d.brief || null,
        energyRating: d.energyRating,
        estimatedMinutes: d.estimatedMinutes ?? null,
        deadlineKind: d.deadlineKind,
        hardDeadline: d.hardDeadline ? new Date(d.hardDeadline) : null,
        softDeadline: d.softDeadline ? new Date(d.softDeadline) : null,
        rubricJson: d.rubricJson || null,
        resourceCardsJson: d.resourceCardsJson || null,
        choicePrompt: d.choicePrompt || PROJECT_CHOICE_PROMPT,
        roleCardsJson:
          d.roleCardsJson || JSON.stringify(DEFAULT_ROLE_CARDS),
        milestones: d.milestones?.length
          ? {
              create: d.milestones.map((m) => ({
                title: m.title,
                stepNumber: m.stepNumber,
                timeEstimate: m.timeEstimate ?? null,
              })),
            }
          : undefined,
      },
      include: { milestones: true },
    });
    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("[POST /api/assignments]", error);
    return NextResponse.json(
      { error: "Failed to create/update assignment" },
      { status: 500 },
    );
  }
}
