"use client";

import { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function CareHubPage() {
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [studentId, setStudentId] = useState("");
  const [sensoryNeeds, setSensoryNeeds] = useState("");
  const [approvedAccommodations, setApprovedAccommodations] = useState("");
  const [communicationStyle, setCommunicationStyle] = useState("");
  const [note, setNote] = useState("");
  const [level, setLevel] = useState("GREEN");
  const [checkIns, setCheckIns] = useState<
    { id: string; level: string; note: string | null; createdAt: string; student: { name: string } }[]
  >([]);
  const [careNotes, setCareNotes] = useState<
    { id: string; note: string; createdAt: string; student: { name: string } }[]
  >([]);
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [p, c, care] = await Promise.all([
        fetch("/api/people?role=STUDENT").then((r) => r.json()),
        fetch("/api/support?kind=checkins").then((r) => r.json()),
        fetch("/api/support?kind=care").then((r) => r.json()),
      ]);
      if (!Array.isArray(p)) setOffline(true);
      else {
        setPeople(p);
        if (!studentId && p[0]) setStudentId(p[0].id);
      }
      if (Array.isArray(c)) setCheckIns(c);
      if (Array.isArray(care)) setCareNotes(care);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function saveIap(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "accommodation",
        studentId,
        sensoryNeeds,
        approvedAccommodations,
        communicationStyle,
      }),
    });
  }

  async function saveCare(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "care", studentId, note }),
    });
    setNote("");
    await load();
  }

  async function checkIn(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "checkin", studentId, level }),
    });
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={HeartPulse}
        title="Clinical hub offline"
        description="Connect the database and create student profiles first."
        actionLabel="Open portals"
        actionHref="/portal"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Module D · Clinical & support</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Clinical & support hub
        </h1>
      </header>

      <select
        className="h-9 border border-[var(--rule)] px-2 text-sm"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      >
        <option value="">Student</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {people.length === 0 ? (
        <EmptyState
          icon={HeartPulse}
          title="No student profiles"
          description="Create a student on the portal or SIS roster before filing IAPs."
          actionLabel="Create profile"
          actionHref="/portal"
        />
      ) : (
        <>
          <form onSubmit={saveIap} className="space-y-3 border border-[var(--rule)] p-4">
            <p className="kicker">Individual accommodation profile</p>
            <Label>Sensory needs</Label>
            <Textarea
              value={sensoryNeeds}
              onChange={(e) => setSensoryNeeds(e.target.value)}
            />
            <Label>Approved accommodations</Label>
            <Textarea
              value={approvedAccommodations}
              onChange={(e) => setApprovedAccommodations(e.target.value)}
            />
            <Label>Communication style</Label>
            <Input
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
            />
            <Button type="submit">Save IAP</Button>
          </form>

          <form onSubmit={checkIn} className="flex flex-wrap gap-2 border border-[var(--rule)] p-4">
            <p className="w-full kicker">Energy check-in</p>
            <select
              className="h-9 border border-[var(--rule)] px-2 text-sm"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="GREEN">Green</option>
              <option value="YELLOW">Yellow</option>
              <option value="RED">Red</option>
            </select>
            <Button type="submit">Log check-in</Button>
          </form>

          <form onSubmit={saveCare} className="space-y-3 border border-[var(--rule)] p-4">
            <p className="kicker">Confidential care note</p>
            <Textarea required value={note} onChange={(e) => setNote(e.target.value)} />
            <Button type="submit">File care note</Button>
          </form>

          <section>
            <h2 className="font-serif text-xl font-bold">Recent check-ins</h2>
            {checkIns.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--ink-muted)]">None yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
                {checkIns.slice(0, 10).map((c) => (
                  <li key={c.id} className="px-3 py-2 text-sm">
                    {c.student.name} · {c.level} ·{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold">Care notes</h2>
            {careNotes.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--ink-muted)]">None yet.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
                {careNotes.slice(0, 10).map((c) => (
                  <li key={c.id} className="px-3 py-2 text-sm">
                    <p className="byline">
                      {c.student.name} · {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <p>{c.note}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
