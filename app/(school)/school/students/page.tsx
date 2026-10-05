"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Person = {
  id: string;
  name: string;
  preferredName: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  emergencyContact: string | null;
};

export default function StudentsPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [contacts, setContacts] = useState<
    { id: string; label: string; value: string; subjectId: string }[]
  >([]);
  const [form, setForm] = useState({
    name: "",
    preferredName: "",
    email: "",
    phone: "",
    role: "STUDENT",
    emergencyContact: "",
  });
  const [contactForm, setContactForm] = useState({
    subjectId: "",
    label: "Email",
    value: "",
  });
  const [offline, setOffline] = useState(false);

  async function load() {
    try {
      const [p, c] = await Promise.all([
        fetch("/api/people").then((r) => r.json()),
        fetch("/api/comms?kind=contacts").then((r) => r.json()),
      ]);
      if (!Array.isArray(p)) {
        setOffline(true);
        return;
      }
      setPeople(p);
      if (Array.isArray(c)) setContacts(c);
    } catch {
      setOffline(true);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function createPerson(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/people", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({
      name: "",
      preferredName: "",
      email: "",
      phone: "",
      role: "STUDENT",
      emergencyContact: "",
    });
    await load();
  }

  async function addContact(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/comms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "contact", ...contactForm }),
    });
    setContactForm((f) => ({ ...f, value: "" }));
    await load();
  }

  if (offline) {
    return (
      <EmptyState
        icon={Users}
        title="SIS offline"
        description="Connect the database to manage student, staff, and guardian profiles."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Module C · Profiles & contacts</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Roster & contact book
        </h1>
      </header>

      <form
        onSubmit={createPerson}
        className="grid gap-3 border border-[var(--rule)] p-4 sm:grid-cols-2"
      >
        <Label className="sm:col-span-2">File a new profile</Label>
        <Input
          required
          placeholder="Legal name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Preferred name"
          value={form.preferredName}
          onChange={(e) => setForm({ ...form, preferredName: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <select
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {[
            "STUDENT",
            "TEACHER",
            "ADMIN",
            "LEADERSHIP",
            "GUARDIAN",
            "TUTOR",
            "CLINICIAN",
          ].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <Input
          placeholder="Emergency contact"
          value={form.emergencyContact}
          onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Button type="submit">Save profile</Button>
        </div>
      </form>

      <form
        onSubmit={addContact}
        className="grid gap-3 border border-[var(--rule)] p-4 sm:grid-cols-3"
      >
        <Label className="sm:col-span-3">Add contact record</Label>
        <select
          required
          className="h-9 border border-[var(--rule)] bg-[var(--paper-elevated)] px-2 text-sm"
          value={contactForm.subjectId}
          onChange={(e) => setContactForm({ ...contactForm, subjectId: e.target.value })}
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
          placeholder="Label (Email, Parent mobile…)"
          value={contactForm.label}
          onChange={(e) => setContactForm({ ...contactForm, label: e.target.value })}
        />
        <Input
          required
          placeholder="Value"
          value={contactForm.value}
          onChange={(e) => setContactForm({ ...contactForm, value: e.target.value })}
        />
        <div className="sm:col-span-3">
          <Button type="submit" variant="secondary">
            Add contact
          </Button>
        </div>
      </form>

      {people.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No profiles yet"
          description="Add students, teachers, guardians, or clinicians to begin SIS records."
        />
      ) : (
        <ul className="divide-y divide-[var(--rule-soft)] border border-[var(--rule)]">
          {people.map((p) => (
            <li key={p.id} className="px-4 py-3">
              <p className="byline">{p.role}</p>
              <p className="font-serif text-xl font-bold text-[var(--ink)]">
                {p.preferredName || p.name}
                {p.preferredName ? (
                  <span className="ml-2 text-sm font-normal text-[var(--ink-muted)]">
                    ({p.name})
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-[var(--ink-secondary)]">
                {[p.email, p.phone, p.emergencyContact].filter(Boolean).join(" · ") ||
                  "No primary contact filed."}
              </p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--ink-muted)]">
                {contacts
                  .filter((c) => c.subjectId === p.id)
                  .map((c) => (
                    <li key={c.id}>
                      {c.label}: {c.value}
                    </li>
                  ))}
              </ul>
              <Link
                href={`/school/safety?personId=${p.id}`}
                className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.08em] underline"
              >
                Safety plans
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
