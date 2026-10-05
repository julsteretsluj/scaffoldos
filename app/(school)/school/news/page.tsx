"use client";

import { useEffect, useState } from "react";
import { Newspaper } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type News = {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  createdAt: string;
};

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/comms?kind=news");
      const data = await res.json();
      if (!Array.isArray(data)) setOffline(true);
      else setItems(data);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "news", title, body, publish: true }),
    });
    if (res.ok) {
      setTitle("");
      setBody("");
      await load();
    }
  }

  if (offline) {
    return (
      <EmptyState
        icon={Newspaper}
        title="News desk offline"
        description="Connect the database to publish school news."
        actionLabel="School desk"
        actionHref="/school"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Communications · News</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          School news
        </h1>
      </header>
      <form onSubmit={submit} className="space-y-3 border border-[var(--rule)] p-4">
        <Label>Headline</Label>
        <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Label>Body</Label>
        <Textarea required value={body} onChange={(e) => setBody(e.target.value)} />
        <Button type="submit">Publish news post</Button>
      </form>
      {items.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="No news posts yet"
          description="Publish the first school news item when you are ready."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {items.map((n) => (
            <li key={n.id} className="px-4 py-4">
              <p className="byline">
                {n.publishedAt
                  ? new Date(n.publishedAt).toLocaleDateString()
                  : "Draft"}
              </p>
              <h2 className="font-serif text-xl font-bold text-[var(--ink)]">{n.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--ink-secondary)]">
                {n.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
