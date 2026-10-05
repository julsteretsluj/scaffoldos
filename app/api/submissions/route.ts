import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateSubmissionSchema,
  ToggleMilestoneSchema,
  ProjectTrackChoiceSchema,
} from "@/lib/validators/course";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.milestoneId && typeof body.done === "boolean") {
      const parsed = ToggleMilestoneSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.milestoneProgress.upsert({
        where: {
          milestoneId_studentId: {
            milestoneId: parsed.data.milestoneId,
            studentId: parsed.data.studentId,
          },
        },
        create: {
          milestoneId: parsed.data.milestoneId,
          studentId: parsed.data.studentId,
          done: parsed.data.done,
        },
        update: { done: parsed.data.done },
      });
      return NextResponse.json(row);
    }

    if (body.track) {
      const parsed = ProjectTrackChoiceSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const choice = await db.projectTrackChoice.upsert({
        where: {
          assignmentId_studentId: {
            assignmentId: parsed.data.assignmentId,
            studentId: parsed.data.studentId,
          },
        },
        create: parsed.data,
        update: {
          track: parsed.data.track,
          roleCard: parsed.data.roleCard ?? null,
        },
      });
      return NextResponse.json(choice);
    }

    const parsed = CreateSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const submission = await db.submission.create({
      data: {
        assignmentId: parsed.data.assignmentId,
        studentId: parsed.data.studentId,
        submissionFormat: parsed.data.submissionFormat,
        content: parsed.data.content || null,
        fileUrl: parsed.data.fileUrl || null,
        reflection: parsed.data.reflection || null,
        status: "SUBMITTED",
        boardStatus: "COMPLETED",
      },
    });
    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("[POST /api/submissions]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
