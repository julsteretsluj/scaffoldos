import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  CreateConversationSchema,
  CreateMessageSchema,
} from "@/lib/validators/course";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const conversationId = searchParams.get("conversationId");
    const courseId = searchParams.get("courseId");

    if (conversationId) {
      const messages = await db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: { sender: true },
      });
      return NextResponse.json(messages);
    }

    if (courseId && kind === "classroom") {
      let convo = await db.conversation.findUnique({
        where: { courseId },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
            include: { sender: true },
            take: 100,
          },
          participants: { include: { person: true } },
        },
      });
      return NextResponse.json(convo);
    }

    const conversations = await db.conversation.findMany({
      where: kind ? { kind: kind as never } : undefined,
      orderBy: { updatedAt: "desc" },
      include: {
        participants: { include: { person: true } },
        course: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("[GET /api/messages]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === "conversation") {
      const parsed = CreateConversationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
      }
      if (parsed.data.kind === "CLASSROOM" && parsed.data.courseId) {
        const existing = await db.conversation.findUnique({
          where: { courseId: parsed.data.courseId },
        });
        if (existing) return NextResponse.json(existing);
      }
      const convo = await db.conversation.create({
        data: {
          kind: parsed.data.kind,
          title: parsed.data.title || null,
          courseId: parsed.data.courseId || null,
          participants: {
            create: parsed.data.participantIds.map((personId) => ({ personId })),
          },
        },
        include: { participants: true },
      });
      return NextResponse.json(convo, { status: 201 });
    }

    const parsed = CreateMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    let conversationId = parsed.data.conversationId;
    if (!conversationId && parsed.data.courseId) {
      let convo = await db.conversation.findUnique({
        where: { courseId: parsed.data.courseId },
      });
      if (!convo) {
        convo = await db.conversation.create({
          data: {
            kind: "CLASSROOM",
            title: "Classroom chat",
            courseId: parsed.data.courseId,
            participants: {
              create: [{ personId: parsed.data.senderId }],
            },
          },
        });
      }
      conversationId = convo.id;
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId or courseId required" },
        { status: 400 },
      );
    }

    const message = await db.message.create({
      data: {
        conversationId,
        courseId: parsed.data.courseId || null,
        senderId: parsed.data.senderId,
        body: parsed.data.body,
      },
      include: { sender: true },
    });
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("[POST /api/messages]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
