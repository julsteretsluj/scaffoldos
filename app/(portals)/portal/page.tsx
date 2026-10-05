"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import { PORTAL_ROLES, type PortalSlug } from "@/lib/portals/roles";

const STORAGE_KEY = "scaffold-os-active-person";

type Person = {
  id: string;
  name: string;
  preferredName: string | null;
  role: string;
};

export default function PortalHomePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [activeId, setActiveId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<string>("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/people");
      const data = await res.json();
      if (!Array.isArray(data)) {
        setOffline(true);
        return;
      }
      setPeople(data);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && data.some((p: Person) => p.id === saved)) {
        setActiveId(saved);
      }
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function selectPerson(id: string) {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }

  async function createPerson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role }),
    });
    if (!res.ok) {
      setError("Could not create profile.");
      return;
    }
    const person = await res.json();
    setName("");
    selectPerson(person.id);
    await load();
  }

  const active = people.find((p) => p.id === activeId);

  if (offline) {
    return (
      <EmptyState
        icon={Users}
        brandSrc={BRAND.system.lockup}
        brandAlt={BRAND.system.name}
        title="Portals need a database"
        description="Set DATABASE_URL and run prisma db push. Profiles stay empty until you create them — no seed users."
        actionLabel="Open Scaffold OS courses"
        actionHref="/courses"
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6">
      <header className="border-b border-[var(--rule)] pb-4 text-center">
        <p className="kicker">{BRAND.system.name}</p>
        <h1 className="mt-2 font-serif text-4xl font-black tracking-tight text-[var(--ink)]">
          Role portals
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-secondary)]">
          Choose a desk for student, teacher, admin, senior leadership, parents, or
          tutors. Create profiles first — the roster starts empty.
        </p>
      </header>

      <section className="border border-[var(--rule)] bg-[var(--paper-elevated)] p-5">
        <p className="kicker">Active profile</p>
        {people.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--ink-secondary)]">
            No profiles yet. File one below.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {people.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPerson(p.id)}
                className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                  activeId === p.id
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--rule)] text-[var(--ink)]"
                }`}
              >
                {p.preferredName || p.name} · {p.role}
              </button>
            ))}
          </div>
        )}
        {active ? (
          <p className="byline mt-3">
            Signed in as {active.preferredName || active.name} ({active.role})
          </p>
        ) : null}
      </section>

      <form
        onSubmit={createPerson}
        className="grid gap-3 border border-[var(--rule)] p-5 sm:grid-cols-[1fr_auto_auto]"
      >
        <div className="space-y-1">
          <Label htmlFor="name">New profile name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Preferred or legal name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            className="h-9 w-full border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {PORTAL_ROLES.map((r) => (
              <option key={r.dbRole} value={r.dbRole}>
                {r.title}
              </option>
            ))}
            <option value="CLINICIAN">Clinician</option>
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit">Create profile</Button>
        </div>
        {error ? (
          <p className="text-sm text-[var(--danger)] sm:col-span-3">{error}</p>
        ) : null}
      </form>

      <div className="grid gap-3 sm:grid-cols-2">
        {PORTAL_ROLES.map((portal) => (
          <Link
            key={portal.slug}
            href={`/portal/${portal.slug}`}
            className="border border-[var(--rule)] bg-[var(--paper-elevated)] p-5 transition-colors hover:bg-black/[0.03]"
          >
            <p className="kicker">{portal.dbRole}</p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[var(--ink)]">
              {portal.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--ink-secondary)]">
              {portal.blurb}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export type { PortalSlug };
