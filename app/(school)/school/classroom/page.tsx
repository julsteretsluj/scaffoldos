"use client";

import { useEffect, useState } from "react";
import { LayoutList } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Post = {
  id: string;
  title: string | null;
  body: string;
  kind: string;
  materialUrl: string | null;
  comments: { id: string; body: string; author: { name: string } | null }[];
};

export default function ClassroomStreamPage() {
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [courseId, setCourseId] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [kind, setKind] = useState("DISCUSSION");
  const [materialUrl, setMaterialUrl] = useState("");
  const [commentByPost, setCommentByPost] = useState<Record<string, string>>({});
  const [offline, setOffline] = useState(false);

  async function loadCourses() {
    try {
      const c = await fetch("/api/courses").then((r) => r.json());
      if (!Array.isArray(c)) setOffline(true);
      else setCourses(c);
    } catch {
      setOffline(true);
    }
  }

  async function loadPosts(id: string) {
    const data = await fetch(`/api/stream?courseId=${encodeURIComponent(id)}`).then(
      (r) => r.json(),
    );
    if (Array.isArray(data)) setPosts(data);
  }

  useEffect(() => {
    void loadCourses();
  }, []);

  useEffect(() => {
    if (courseId) void loadPosts(courseId);
  }, [courseId]);

  async function createPost(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        kind,
        title: title || undefined,
        body,
        materialUrl: materialUrl || undefined,
      }),
    });
    setTitle("");
    setBody("");
    setMaterialUrl("");
    await loadPosts(courseId);
  }

  async function addComment(postId: string) {
    const text = commentByPost[postId];
    if (!text?.trim()) return;
    await fetch("/api/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "comment", postId, body: text }),
    });
    setCommentByPost((s) => ({ ...s, [postId]: "" }));
    await loadPosts(courseId);
  }

  if (offline) {
    return (
      <EmptyState
        icon={LayoutList}
        title="Class streams offline"
        description="Connect the database to post class materials and discussions."
        actionLabel="Create course"
        actionHref="/courses/new"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Classroom-style activity</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Class streams
        </h1>
      </header>
      <select
        className="h-9 border border-[var(--rule)] px-2 text-sm"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      >
        <option value="">Select course</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      {!courseId ? (
        <EmptyState
          icon={LayoutList}
          title="Choose a course stream"
          description="Activity posts are scoped per course and start empty."
          actionLabel={courses.length ? undefined : "Create a course"}
          actionHref={courses.length ? undefined : "/courses/new"}
        />
      ) : (
        <>
          <form onSubmit={createPost} className="space-y-3 border border-[var(--rule)] p-4">
            <Label>New stream post</Label>
            <select
              className="h-9 w-full border border-[var(--rule)] px-2 text-sm"
              value={kind}
              onChange={(e) => setKind(e.target.value)}
            >
              <option value="DISCUSSION">Discussion</option>
              <option value="MATERIAL">Material</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="ASSIGNMENT_LINK">Assignment link</option>
            </select>
            <Input
              placeholder="Optional title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              required
              placeholder="Post body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <Input
              placeholder="Material URL (optional)"
              value={materialUrl}
              onChange={(e) => setMaterialUrl(e.target.value)}
            />
            <Button type="submit">Post to stream</Button>
          </form>

          {posts.length === 0 ? (
            <EmptyState
              icon={LayoutList}
              title="Stream is empty"
              description="Share the first material or discussion for this class."
            />
          ) : (
            <ul className="space-y-4">
              {posts.map((p) => (
                <li key={p.id} className="border border-[var(--rule)] p-4">
                  <p className="byline">{p.kind}</p>
                  {p.title ? (
                    <h2 className="font-serif text-xl font-bold">{p.title}</h2>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink-secondary)]">
                    {p.body}
                  </p>
                  {p.materialUrl ? (
                    <a
                      className="mt-2 inline-block text-sm underline"
                      href={p.materialUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open material
                    </a>
                  ) : null}
                  <ul className="mt-3 space-y-1 border-t border-[var(--rule-soft)] pt-3">
                    {p.comments.map((c) => (
                      <li key={c.id} className="text-sm">
                        <span className="font-semibold">
                          {c.author?.name ?? "Anon"}:
                        </span>{" "}
                        {c.body}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <Input
                      placeholder="Add a comment"
                      value={commentByPost[p.id] ?? ""}
                      onChange={(e) =>
                        setCommentByPost((s) => ({ ...s, [p.id]: e.target.value }))
                      }
                    />
                    <Button type="button" onClick={() => void addComment(p.id)}>
                      Comment
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
