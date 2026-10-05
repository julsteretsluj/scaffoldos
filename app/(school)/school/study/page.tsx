"use client";

import { useEffect, useState } from "react";
import { Library } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Note = {
  id: string;
  title: string;
  description: string | null;
  subjectTag: string | null;
  fileName: string;
  filePath: string;
  createdAt: string;
};

export default function StudyPortalPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectTag, setSubjectTag] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState("");
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const q = filter ? `?subjectTag=${encodeURIComponent(filter)}` : "";
      const data = await fetch(`/api/study-notes${q}`).then((r) => r.json());
      if (!Array.isArray(data)) setOffline(true);
      else setNotes(data);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, [filter]);

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    const form = new FormData();
    form.set("title", title);
    form.set("description", description);
    form.set("subjectTag", subjectTag);
    form.set("file", file);
    const res = await fetch("/api/study-notes", { method: "POST", body: form });
    if (!res.ok) {
      setError("Upload failed.");
      return;
    }
    setTitle("");
    setDescription("");
    setSubjectTag("");
    setFile(null);
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={Library}
        title="Study portal offline"
        description="Connect the database to upload and catalogue study notes."
        actionLabel="School desk"
        actionHref="/school"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Study portal</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Study notes catalogue
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Upload files to `public/uploads/notes` with catalogue metadata. Empty until
          someone contributes.
        </p>
      </header>

      <form onSubmit={upload} className="space-y-3 border border-[var(--rule)] p-4">
        <Label>Title</Label>
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label>Subject tag</Label>
        <Input
          value={subjectTag}
          onChange={(e) => setSubjectTag(e.target.value)}
          placeholder="e.g. MATH, ND, LIFE"
        />
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Label>File</Label>
        <input
          type="file"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm"
        />
        <Button type="submit">Upload note</Button>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      </form>

      <div className="flex gap-2">
        <Input
          placeholder="Filter by subject tag"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button type="button" variant="secondary" onClick={() => setFilter("")}>
          Clear
        </Button>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          icon={Library}
          title="Catalogue is empty"
          description="Upload the first study note to begin the shared library."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {notes.map((n) => (
            <li key={n.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="byline">
                  {n.subjectTag || "untagged"} · {n.fileName}
                </p>
                <p className="font-serif text-lg font-bold text-[var(--ink)]">{n.title}</p>
                {n.description ? (
                  <p className="text-sm text-[var(--ink-secondary)]">{n.description}</p>
                ) : null}
              </div>
              <a
                className="text-xs font-semibold uppercase tracking-[0.08em] underline"
                href={n.filePath}
                target="_blank"
                rel="noreferrer"
              >
                Open file
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
