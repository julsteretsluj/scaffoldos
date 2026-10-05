"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Person = { id: string; name: string };
type Convo = {
  id: string;
  title: string | null;
  kind: string;
  participants: { person: Person }[];
  messages: { body: string; createdAt: string }[];
};
type Msg = {
  id: string;
  body: string;
  createdAt: string;
  sender: Person;
};

export default function ChatsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [convos, setConvos] = useState<Convo[]>([]);
  const [active, setActive] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [me, setMe] = useState("");
  const [other, setOther] = useState("");
  const [body, setBody] = useState("");
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [p, c] = await Promise.all([
        fetch("/api/people").then((r) => r.json()),
        fetch("/api/messages?kind=DIRECT").then((r) => r.json()),
      ]);
      if (!Array.isArray(p) || !Array.isArray(c)) {
        setOffline(true);
        return;
      }
      setPeople(p);
      setConvos(c);
      if (!me && p[0]) setMe(p[0].id);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!active) return;
    void fetch(`/api/messages?conversationId=${active}`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setMessages(d);
      });
  }, [active]);

  async function startChat(e: React.FormEvent) {
    e.preventDefault();
    if (!me || !other || me === other) return;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "conversation",
        kind: "DIRECT",
        title: "Direct chat",
        participantIds: [me, other],
      }),
    });
    const convo = await res.json();
    setActive(convo.id);
    await load();
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!active || !me || !body.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: active, senderId: me, body }),
    });
    setBody("");
    const d = await fetch(`/api/messages?conversationId=${active}`).then((r) =>
      r.json(),
    );
    if (Array.isArray(d)) setMessages(d);
  }

  if (offline) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="Chats offline"
        description="Connect the database and create profiles to start messaging."
        actionLabel="Open portals"
        actionHref="/portal"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Direct messaging</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Direct chats
        </h1>
      </header>

      <form
        onSubmit={startChat}
        className="flex flex-wrap gap-2 border border-[var(--rule)] p-4"
      >
        <select
          className="h-9 border border-[var(--rule)] px-2 text-sm"
          value={me}
          onChange={(e) => setMe(e.target.value)}
        >
          <option value="">Me</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select
          className="h-9 border border-[var(--rule)] px-2 text-sm"
          value={other}
          onChange={(e) => setOther(e.target.value)}
        >
          <option value="">With</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit">Start direct chat</Button>
      </form>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <ul className="border border-[var(--rule)]">
          {convos.length === 0 ? (
            <li className="p-4 text-sm text-[var(--ink-muted)]">No threads yet</li>
          ) : (
            convos.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`block w-full border-b border-[var(--rule-soft)] px-3 py-2 text-left text-sm ${
                    active === c.id ? "bg-[var(--ink)] text-[var(--paper)]" : ""
                  }`}
                  onClick={() => setActive(c.id)}
                >
                  {c.title ||
                    c.participants.map((p) => p.person.name).join(", ")}
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="border border-[var(--rule)] p-4">
          {!active ? (
            <EmptyState
              icon={MessageSquare}
              title="Select or start a chat"
              description="Choose a thread or create a new direct conversation."
            />
          ) : (
            <>
              <ul className="mb-4 max-h-80 space-y-2 overflow-y-auto">
                {messages.map((m) => (
                  <li key={m.id} className="border border-[var(--rule-soft)] p-2 text-sm">
                    <p className="byline">{m.sender.name}</p>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ul>
              <form onSubmit={send} className="space-y-2">
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write a calm, clear message"
                />
                <Button type="submit">Send message</Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
