"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { BookOpen } from "lucide-react";
import type { CourseSummary, ModuleSummary } from "@/types";

interface CourseBuilderProps {
  courseId: string;
  initialCourse: CourseSummary | null;
}

export function CourseBuilder({ courseId, initialCourse }: CourseBuilderProps) {
  const [course, setCourse] = useState(initialCourse);
  const [modules, setModules] = useState<ModuleSummary[]>(
    initialCourse?.modules ?? [],
  );
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/courses/${courseId}`);
    if (!res.ok) return;
    const data = await res.json();
    setCourse(data);
    setModules(data.modules ?? []);
  }, [courseId]);

  useEffect(() => {
    if (!initialCourse) {
      void refresh();
    }
  }, [initialCourse, refresh]);

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newModuleTitle.trim() }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not add module.");
      return;
    }
    setNewModuleTitle("");
    await refresh();
  }

  async function addLesson(moduleId: string) {
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        moduleId,
        lesson: { title: "Untitled lesson", type: "TEXT_MARKDOWN" },
      }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not add lesson.");
      return;
    }
    await refresh();
  }

  async function deleteModule(moduleId: string) {
    setBusy(true);
    await fetch(
      `/api/courses/${courseId}/modules?moduleId=${encodeURIComponent(moduleId)}`,
      { method: "DELETE" },
    );
    setBusy(false);
    await refresh();
  }

  async function deleteLesson(lessonId: string) {
    setBusy(true);
    await fetch(
      `/api/courses/${courseId}/modules?lessonId=${encodeURIComponent(lessonId)}`,
      { method: "DELETE" },
    );
    setBusy(false);
    await refresh();
  }

  async function moveModule(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= modules.length) return;
    const reordered = [...modules];
    const [item] = reordered.splice(index, 1);
    reordered.splice(next, 0, item);
    setModules(reordered);
    await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "modules",
        reorder: {
          items: reordered.map((m, i) => ({ id: m.id, order: i })),
        },
      }),
    });
  }

  async function moveLesson(
    moduleId: string,
    lessonIndex: number,
    direction: -1 | 1,
  ) {
    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;
    const next = lessonIndex + direction;
    if (next < 0 || next >= mod.lessons.length) return;
    const lessons = [...mod.lessons];
    const [item] = lessons.splice(lessonIndex, 1);
    lessons.splice(next, 0, item);
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, lessons } : m)),
    );
    await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "lessons",
        reorder: {
          items: lessons.map((l, i) => ({ id: l.id, order: i })),
        },
      }),
    });
  }

  if (!course) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Course not found"
        description="This course may have been deleted, or the database is offline."
        actionLabel="Back to courses"
        actionHref="/courses"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#AEAEB2]">
            {course.status} · Outline builder
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1D1D1F]">
            {course.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/courses/${courseId}/settings`}>
            <Button variant="secondary" type="button">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {error ? <p className="text-sm text-[#FF3B30]">{error}</p> : null}

      <div className="flex flex-wrap gap-2 rounded-[16px] border border-[#D1D1D6] bg-white p-4">
        <Input
          placeholder="New module title"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          className="max-w-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void addModule();
            }
          }}
        />
        <Button type="button" onClick={() => void addModule()} disabled={busy}>
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No modules yet"
          description="Add your first module to start structuring this course."
        />
      ) : (
        <ul className="space-y-4">
          {modules.map((mod, modIndex) => (
            <li
              key={mod.id}
              className="rounded-[16px] border border-[#D1D1D6] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-[#1D1D1F]">
                  {modIndex + 1}. {mod.title}
                </h2>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void moveModule(modIndex, -1)}
                    aria-label="Move module up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void moveModule(modIndex, 1)}
                    aria-label="Move module down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => void deleteModule(mod.id)}
                    aria-label="Delete module"
                  >
                    <Trash2 className="h-4 w-4 text-[#FF3B30]" />
                  </Button>
                </div>
              </div>

              {mod.lessons.length === 0 ? (
                <p className="mt-4 rounded-[12px] bg-[#F2F2F7] px-4 py-3 text-sm text-[#6E6E73]">
                  This module has no lessons yet. Click &apos;Add Lesson&apos; to
                  begin.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {mod.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lesson.id}
                      className="flex items-center justify-between rounded-[12px] border border-[#D1D1D6]/80 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F]">
                          {lesson.title}
                        </p>
                        <p className="text-xs text-[#AEAEB2]">{lesson.type}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            void moveLesson(mod.id, lessonIndex, -1)
                          }
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            void moveLesson(mod.id, lessonIndex, 1)
                          }
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => void deleteLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-[#FF3B30]" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void addLesson(mod.id)}
                  disabled={busy}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Lesson
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
