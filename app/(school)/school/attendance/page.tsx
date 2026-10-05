"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AttendancePage() {
  const [rows, setRows] = useState<
    {
      id: string;
      date: string;
      status: string;
      note: string | null;
      student: { name: string };
      course: { title: string } | null;
    }[]
  >([]);
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState({
    studentId: "",
    courseId: "",
    date: new Date().toISOString().slice(0, 10),
    status: "PRESENT",
    note: "",
  });
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [a, p, c] = await Promise.all([
        fetch("/api/attendance").then((r) => r.json()),
        fetch("/api/people?role=STUDENT").then((r) => r.json()),
        fetch("/api/courses").then((r) => r.json()),
      ]);
      if (!Array.isArray(a)) {
        setOffline(true);
        return;
      }
      setRows(a);
      if (Array.isArray(p)) setPeople(p);
      if (Array.isArray(c)) setCourses(c);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        courseId: form.courseId || undefined,
      }),
    });
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Attendance offline"
        description="Connect the database to take and review class attendance."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Attendance · iSAMS-style</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Daily attendance ledger
        </h1>
      </header>

      <form
        onSubmit={save}
        className="grid gap-3 border border-[var(--rule)] p-4 sm:grid-cols-2"
      >
        <Label className="sm:col-span-2">Take attendance</Label>
        <select
          required
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
        >
          <option value="">Student</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">Course (optional)</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          {["PRESENT", "ABSENT", "LATE", "EXCUSED", "REMOTE"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          className="sm:col-span-2"
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Button type="submit">Save attendance</Button>
        </div>
      </form>

      {people.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Add students before taking attendance"
          description="Create SIS profiles first, then mark daily status."
          actionLabel="Open profiles"
          actionHref="/school/students"
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No attendance rows yet"
          description="Record the first present / remote / excused mark for today."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {rows.map((r) => (
            <li key={r.id} className="px-4 py-3 text-sm">
              <p className="byline">
                {new Date(r.date).toLocaleDateString()} · {r.status}
                {r.course ? ` · ${r.course.title}` : ""}
              </p>
              <p className="font-serif text-lg font-bold text-[var(--ink)]">
                {r.student.name}
              </p>
              {r.note ? <p className="text-[var(--ink-secondary)]">{r.note}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
