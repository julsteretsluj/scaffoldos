"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CourseSummary } from "@/types";

export default function CourseSettingsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params.courseId;
  const [course, setCourse] = useState<CourseSummary | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) return;
      const data = await res.json();
      setCourse(data);
      setTitle(data.title);
      setDescription(data.description ?? "");
    })();
  }, [courseId]);

  async function saveMetadata() {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Could not save settings.");
      return;
    }
    setMessage("Saved.");
    router.refresh();
  }

  async function setStatus(status: "DRAFT" | "PUBLISHED" | "ARCHIVED") {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/courses/${courseId}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(
        typeof data.error === "string" ? data.error : "Status update failed.",
      );
      return;
    }
    setCourse(data);
    setMessage(`Status set to ${status}.`);
  }

  if (!course) {
    return <p className="byline">Loading settings…</p>;
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-4">
        <div>
          <p className="kicker">Colophon</p>
          <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-[var(--ink)]">
            Course settings
          </h1>
        </div>
        <Link href={`/courses/${courseId}/edit`}>
          <Button variant="secondary" type="button">
            Back to builder
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Title, description, and lifecycle.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Headline</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deck</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <p className="byline">
            Current status:{" "}
            <span className="font-semibold text-[var(--ink)]">{course.status}</span>
          </p>
          <div className="flex flex-wrap gap-2 border-t border-[var(--rule-soft)] pt-4">
            <Button type="button" onClick={() => void saveMetadata()} disabled={busy}>
              Save metadata
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void setStatus("PUBLISHED")}
            >
              Publish
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy}
              onClick={() => void setStatus("DRAFT")}
            >
              Revert to draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={busy}
              onClick={() => void setStatus("ARCHIVED")}
            >
              Archive
            </Button>
          </div>
          {message ? (
            <p className="text-sm font-medium text-[var(--ink)]">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {course.status === "PUBLISHED" ? (
            <p className="byline">
              Learner edition:{" "}
              <Link
                className="font-semibold text-[var(--ink)] underline underline-offset-2"
                href={`/learn/${course.slug}`}
              >
                /learn/{course.slug}
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
