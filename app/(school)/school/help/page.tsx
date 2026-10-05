"use client";

import { useEffect, useState } from "react";
import { LifeBuoy } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function HelpDeskPage() {
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [studentId, setStudentId] = useState("");
  const [kind, setKind] = useState("task_breakdown");
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<
    {
      id: string;
      kind: string;
      message: string;
      status: string;
      createdAt: string;
      student: { name: string };
    }[]
  >([]);
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [p, h] = await Promise.all([
        fetch("/api/people").then((r) => r.json()),
        fetch("/api/support?kind=help").then((r) => r.json()),
      ]);
      if (!Array.isArray(p)) setOffline(true);
      else {
        setPeople(p);
        if (!studentId && p[0]) setStudentId(p[0].id);
      }
      if (Array.isArray(h)) setRows(h);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "help", studentId, kind, message }),
    });
    setMessage("");
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={LifeBuoy}
        title="Help desk offline"
        description="Connect the database to queue support requests."
        actionLabel="Open portals"
        actionHref="/portal"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Direct help desk</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Help desk
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Request 1:1 assistance for task breakdown or emotional/sensory regulation.
          Status uses support-oriented labels like Help Requested.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-3 border border-[var(--rule)] p-4">
        <Label>Who needs support</Label>
        <select
          className="h-9 w-full border border-[var(--rule)] px-2 text-sm"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        >
          <option value="">Select profile</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Label>Request type</Label>
        <select
          className="h-9 w-full border border-[var(--rule)] px-2 text-sm"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="task_breakdown">Task breakdown</option>
          <option value="sensory_regulation">Sensory regulation</option>
          <option value="emotional_support">Emotional support</option>
        </select>
        <Label>Message</Label>
        <Textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What would help right now?"
        />
        <Button type="submit">Request help now</Button>
      </form>

      {rows.length === 0 ? (
        <EmptyState
          icon={LifeBuoy}
          title="Queue is clear"
          description="No help requests filed yet."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {rows.map((r) => (
            <li key={r.id} className="px-4 py-3 text-sm">
              <p className="byline">
                {r.student.name} · {r.kind} · {r.status.replaceAll("_", " ")}
              </p>
              <p className="mt-1">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
