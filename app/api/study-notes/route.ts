import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { CreateStudyNoteMetaSchema } from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectTag = searchParams.get("subjectTag") ?? undefined;
    const courseId = searchParams.get("courseId") ?? undefined;
    const notes = await db.studyNote.findMany({
      where: {
        ...(subjectTag ? { subjectTag } : {}),
        ...(courseId ? { courseId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        uploader: true,
        course: { select: { id: true, title: true } },
      },
    });
    return NextResponse.json(notes);
  } catch (error) {
    console.error("[GET /api/study-notes]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const meta = {
      title: String(form.get("title") || ""),
      description: String(form.get("description") || "") || undefined,
      subjectTag: String(form.get("subjectTag") || "") || undefined,
      courseId: String(form.get("courseId") || "") || undefined,
      uploaderId: String(form.get("uploaderId") || "") || undefined,
    };
    const parsed = CreateStudyNoteMetaSchema.safeParse(meta);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const stamp = Date.now().toString(36);
    const relDir = "/uploads/notes";
    const absDir = path.join(process.cwd(), "public", "uploads", "notes");
    await mkdir(absDir, { recursive: true });
    const stored = `${stamp}-${safeName}`;
    await writeFile(path.join(absDir, stored), bytes);

    const note = await db.studyNote.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        subjectTag: parsed.data.subjectTag || null,
        courseId: parsed.data.courseId || null,
        uploaderId: parsed.data.uploaderId || null,
        fileName: file.name,
        filePath: `${relDir}/${stored}`,
        mimeType: file.type || null,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("[POST /api/study-notes]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
