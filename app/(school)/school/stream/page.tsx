"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Assignment = {
  id: string;
  title: string;
  energyRating: string;
  estimatedMinutes: number | null;
  hardDeadline: string | null;
  softDeadline: string | null;
  course: { title: string };
  milestones: { id: string; title: string; stepNumber: number; timeEstimate: number | null }[];
  submissions: { boardStatus: string; studentId: string }[];
};

const COLUMNS = ["TO_DO", "IN_PROGRESS", "NEED_SUPPORT", "COMPLETED"] as const;

export default function ClassworkStreamPage() {
  const [view, setView] = useState<"timeline" | "matrix">("timeline");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [people, setPeople] = useState<{ id: string; name: string; role: string }[]>([]);
  const [studentId, setStudentId] = useState("");
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    energyRating: "LOW",
    estimatedMinutes: "15",
  });
  const [error, setError] = useState<string | null>(null);
  const [dbError, setDbError] = useState(false);

  async function load() {
    try {
      const [a, p, c] = await Promise.all([
        fetch("/api/assignments").then((r) => r.json()),
        fetch("/api/people?role=STUDENT").then((r) => r.json()),
        fetch("/api/courses").then((r) => r.json()),
      ]);
      if (Array.isArray(a)) setAssignments(a);
      else setDbError(true);
      if (Array.isArray(p)) {
        setPeople(p);
        if (!studentId && p[0]) setStudentId(p[0].id);
      }
      if (Array.isArray(c)) setCourses(c.filter((x: { status: string }) => x.status));
    } catch {
      setDbError(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const matrix = useMemo(() => {
    const map: Record<string, Assignment[]> = {
      TO_DO: [],
      IN_PROGRESS: [],
      NEED_SUPPORT: [],
      COMPLETED: [],
    };
    for (const a of assignments) {
      const mine = a.submissions.find((s) => s.studentId === studentId);
      const status = (mine?.boardStatus as (typeof COLUMNS)[number]) || "TO_DO";
      (map[status] ?? map.TO_DO).push(a);
    }
    return map;
  }, [assignments, studentId]);

  async function createAssignment(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: form.courseId,
        title: form.title,
        energyRating: form.energyRating,
        estimatedMinutes: Number(form.estimatedMinutes) || undefined,
        milestones: [
          { stepNumber: 1, title: "Read the brief", timeEstimate: 10 },
          { stepNumber: 2, title: "Outline response", timeEstimate: 20 },
          { stepNumber: 3, title: "First draft / upload", timeEstimate: 30 },
        ],
      }),
    });
    if (!res.ok) {
      setError("Could not file assignment.");
      return;
    }
    setForm((f) => ({ ...f, title: "" }));
    await load();
  }

  async function setBoard(assignmentId: string, boardStatus: string) {
    if (!studentId) return;
    await fetch("/api/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, studentId, boardStatus }),
    });
    await load();
  }

  if (dbError) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Classwork stream offline"
        description="Connect the database, then create published courses and assignments. Nothing is pre-seeded."
        actionLabel="Open course authoring"
        actionHref="/courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Module A · Classwork stream</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Neurodivergent-friendly task board
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Timeline or matrix views with energy badges and micro-milestones. Support
          labels only — never “overdue”.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={view === "timeline" ? "default" : "secondary"}
          onClick={() => setView("timeline")}
        >
          Show timeline view
        </Button>
        <Button
          type="button"
          variant={view === "matrix" ? "default" : "secondary"}
          onClick={() => setView("matrix")}
        >
          Show matrix board
        </Button>
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Select student profile</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={createAssignment}
        className="grid gap-3 border border-[var(--rule)] bg-[var(--paper-elevated)] p-4 sm:grid-cols-2"
      >
        <div className="space-y-1 sm:col-span-2">
          <Label>File a new assignment</Label>
        </div>
        <select
          required
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
        >
          <option value="">Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <Input
          required
          placeholder="Assignment title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.energyRating}
          onChange={(e) => setForm({ ...form, energyRating: e.target.value })}
        >
          <option value="LOW">Low energy</option>
          <option value="MEDIUM">Medium energy</option>
          <option value="HIGH">High energy</option>
        </select>
        <Input
          type="number"
          min={1}
          placeholder="Estimated minutes"
          value={form.estimatedMinutes}
          onChange={(e) => setForm({ ...form, estimatedMinutes: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Button type="submit">Add to stream</Button>
          {error ? <p className="mt-2 text-sm text-[var(--danger)]">{error}</p> : null}
        </div>
      </form>

      {assignments.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No assignments filed yet"
          description="Create a course first, then add an assignment with energy rating and scaffolding milestones."
          actionLabel="Create a course"
          actionHref="/courses/new"
        />
      ) : view === "timeline" ? (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {assignments.map((a) => (
            <li key={a.id} className="bg-[var(--paper-elevated)] px-4 py-4">
              <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--ink-secondary)]">
                <span>{a.course.title}</span>
                <span>· {a.energyRating} energy</span>
                {a.estimatedMinutes ? <span>· {a.estimatedMinutes} mins</span> : null}
              </div>
              <h2 className="mt-1 font-serif text-xl font-bold text-[var(--ink)]">
                {a.title}
              </h2>
              <ol className="mt-3 space-y-1 border-l border-[var(--rule-soft)] pl-3 text-sm text-[var(--ink-secondary)]">
                {a.milestones.map((m) => (
                  <li key={m.id}>
                    Step {m.stepNumber}: {m.title}
                    {m.timeEstimate ? ` (${m.timeEstimate} mins)` : ""}
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap gap-2">
                {COLUMNS.map((col) => (
                  <Button
                    key={col}
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => void setBoard(a.id, col)}
                  >
                    Mark {col.replaceAll("_", " ").toLowerCase()}
                  </Button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid gap-3 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col} className="border border-[var(--rule)] bg-[var(--paper-elevated)]">
              <p className="border-b border-[var(--rule-soft)] px-3 py-2 kicker">
                {col.replaceAll("_", " ")}
              </p>
              <ul className="space-y-2 p-2">
                {matrix[col].length === 0 ? (
                  <li className="px-2 py-4 text-xs text-[var(--ink-muted)]">Empty column</li>
                ) : (
                  matrix[col].map((a) => (
                    <li key={a.id} className="border border-[var(--rule-soft)] p-2 text-sm">
                      <p className="font-semibold text-[var(--ink)]">{a.title}</p>
                      <p className="byline">{a.energyRating}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
