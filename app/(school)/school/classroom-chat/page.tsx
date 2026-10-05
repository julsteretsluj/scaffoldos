"use client";

import { useEffect, useState } from "react";
import { MessagesSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ClassroomChatPage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [courseId, setCourseId] = useState("");
  const [senderId, setSenderId] = useState("");
  const [body, setBody] = useState("");
  const [messages, setMessages] = useState<
    { id: string; body: string; sender: { name: string } }[]
  >([]);
  const [offline, setOffline] = useState(false);

  async function loadMeta() {
    try {
      const [c, p] = await Promise.all([
        fetch("/api/courses").then((r) => r.json()),
        fetch("/api/people").then((r) => r.json()),
      ]);
      if (!Array.isArray(c)) setOffline(true);
      else setCourses(c);
      if (Array.isArray(p)) {
        setPeople(p);
        if (!senderId && p[0]) setSenderId(p[0].id);
      }
    } catch {
      setOffline(true);
    }
  }

  async function loadRoom(id: string) {
    const data = await fetch(
      `/api/messages?kind=classroom&courseId=${encodeURIComponent(id)}`,
    ).then((r) => r.json());
    setMessages(Array.isArray(data?.messages) ? data.messages : []);
  }

  useEffect(() => {
    void loadMeta();
  }, []);

  useEffect(() => {
    if (courseId) void loadRoom(courseId);
  }, [courseId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId || !senderId || !body.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, senderId, body }),
    });
    setBody("");
    await loadRoom(courseId);
  }

  if (offline) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Classroom chat offline"
        description="Connect the database and create a course to open a room."
        actionLabel="Create course"
        actionHref="/courses/new"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Per-class messaging</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Classroom chats
        </h1>
      </header>
      <div className="flex flex-wrap gap-2">
        <select
          className="h-9 border border-[var(--rule)] px-2 text-sm"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="">Select course room</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-[var(--rule)] px-2 text-sm"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        >
          <option value="">Posting as</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {!courseId ? (
        <EmptyState
          icon={MessagesSquare}
          title="No classroom selected"
          description="Pick a course to open or create its chat room."
          actionLabel={courses.length ? undefined : "Create a course"}
          actionHref={courses.length ? undefined : "/courses/new"}
        />
      ) : (
        <div className="border border-[var(--rule)] p-4">
          <ul className="mb-4 max-h-96 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <li className="text-sm text-[var(--ink-muted)]">
                Room is quiet — post the first message.
              </li>
            ) : (
              messages.map((m) => (
                <li key={m.id} className="border border-[var(--rule-soft)] p-2 text-sm">
                  <p className="byline">{m.sender.name}</p>
                  <p>{m.body}</p>
                </li>
              ))
            )}
          </ul>
          <form onSubmit={send} className="space-y-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Async classroom message"
            />
            <Button type="submit">Post to classroom</Button>
          </form>
        </div>
      )}
    </div>
  );
}
