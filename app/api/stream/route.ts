import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateStreamPostSchema,
  CreateStreamCommentSchema,
} from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const courseId = new URL(request.url).searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "courseId required" }, { status: 400 });
    }
    const posts = await db.classStreamPost.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
        comments: {
          orderBy: { createdAt: "asc" },
          include: { author: true },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[GET /api/stream]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === "comment") {
      const parsed = CreateStreamCommentSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      const row = await db.streamComment.create({
        data: {
          postId: parsed.data.postId,
          authorId: parsed.data.authorId || null,
          body: parsed.data.body,
        },
      });
      return NextResponse.json(row, { status: 201 });
    }

    const parsed = CreateStreamPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const row = await db.classStreamPost.create({
      data: {
        courseId: parsed.data.courseId,
        authorId: parsed.data.authorId || null,
        kind: parsed.data.kind,
        title: parsed.data.title || null,
        body: parsed.data.body,
        materialUrl: parsed.data.materialUrl || null,
      },
    });
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    console.error("[POST /api/stream]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
