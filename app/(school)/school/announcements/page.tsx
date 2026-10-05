"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Row = {
  id: string;
  title: string;
  body: string;
  audience: string;
  course: { title: string } | null;
  createdAt: string;
};

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("school");
  const [courseId, setCourseId] = useState("");
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [a, c] = await Promise.all([
        fetch("/api/comms?kind=announcements").then((r) => r.json()),
        fetch("/api/courses").then((r) => r.json()),
      ]);
      if (!Array.isArray(a)) setOffline(true);
      else setItems(a);
      if (Array.isArray(c)) setCourses(c);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "announce",
        title,
        body,
        audience,
        courseId: courseId || undefined,
      }),
    });
    setTitle("");
    setBody("");
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={Megaphone}
        title="Announcements offline"
        description="Connect the database to file announcements."
        actionLabel="School desk"
        actionHref="/school"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Communications · Announcements</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Announcements
        </h1>
      </header>
      <form onSubmit={submit} className="grid gap-3 border border-[var(--rule)] p-4">
        <Label>Title</Label>
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label>Message</Label>
        <Textarea required value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="school">School-wide</option>
            <option value="family">Family</option>
            <option value="class">Class</option>
          </select>
          <select
            className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">No class scope</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit">Post announcement</Button>
      </form>
      {items.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Post the first school or class announcement when needed."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {items.map((n) => (
            <li key={n.id} className="px-4 py-4">
              <p className="byline">
                {n.audience}
                {n.course ? ` · ${n.course.title}` : ""} ·{" "}
                {new Date(n.createdAt).toLocaleString()}
              </p>
              <h2 className="font-serif text-xl font-bold">{n.title}</h2>
              <p className="mt-2 text-sm text-[var(--ink-secondary)]">{n.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
