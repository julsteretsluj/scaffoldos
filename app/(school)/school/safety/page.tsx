"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function SafetyPlansPage() {
  const params = useSearchParams();
  const [people, setPeople] = useState<{ id: string; name: string }[]>([]);
  const [plans, setPlans] = useState<
    {
      id: string;
      title: string;
      status: string;
      triggers: string | null;
      person: { name: string };
    }[]
  >([]);
  const [form, setForm] = useState({
    personId: params.get("personId") || "",
    title: "",
    triggers: "",
    warningSigns: "",
    copingStrategies: "",
    supportContacts: "",
    crisisSteps: "",
    status: "DRAFT",
  });
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [p, s] = await Promise.all([
        fetch("/api/people").then((r) => r.json()),
        fetch("/api/safety-plans").then((r) => r.json()),
      ]);
      if (!Array.isArray(s)) {
        setOffline(true);
        return;
      }
      setPlans(s);
      if (Array.isArray(p)) setPeople(p);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/safety-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm((f) => ({
      ...f,
      title: "",
      triggers: "",
      warningSigns: "",
      copingStrategies: "",
      supportContacts: "",
      crisisSteps: "",
    }));
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={Shield}
        title="Safety plans offline"
        description="Connect the database to create and manage person-linked safety plans."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Care · Safety plans</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Individual safety plans
        </h1>
      </header>

      <form onSubmit={save} className="grid gap-3 border border-[var(--rule)] p-4">
        <Label>Create safety plan</Label>
        <select
          required
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.personId}
          onChange={(e) => setForm({ ...form, personId: e.target.value })}
        >
          <option value="">Person</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <Input
          required
          placeholder="Plan title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          placeholder="Triggers"
          value={form.triggers}
          onChange={(e) => setForm({ ...form, triggers: e.target.value })}
        />
        <Textarea
          placeholder="Warning signs"
          value={form.warningSigns}
          onChange={(e) => setForm({ ...form, warningSigns: e.target.value })}
        />
        <Textarea
          placeholder="Coping strategies"
          value={form.copingStrategies}
          onChange={(e) => setForm({ ...form, copingStrategies: e.target.value })}
        />
        <Textarea
          placeholder="Support contacts"
          value={form.supportContacts}
          onChange={(e) => setForm({ ...form, supportContacts: e.target.value })}
        />
        <Textarea
          placeholder="Crisis steps"
          value={form.crisisSteps}
          onChange={(e) => setForm({ ...form, crisisSteps: e.target.value })}
        />
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="DRAFT">DRAFT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
        <Button type="submit">Save plan</Button>
      </form>

      {plans.length === 0 ? (
        <EmptyState
          icon={Shield}
          title="No safety plans filed"
          description="Create a plan linked to a student or staff profile when ready."
          actionLabel="Add a profile first"
          actionHref="/school/students"
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {plans.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <p className="byline">
                {p.status} · {p.person.name}
              </p>
              <p className="font-serif text-xl font-bold">{p.title}</p>
              {p.triggers ? (
                <p className="mt-1 text-sm text-[var(--ink-secondary)]">{p.triggers}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
