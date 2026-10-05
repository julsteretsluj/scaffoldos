import Link from "next/link";

const LINKS = [
  { href: "/school/news", label: "School news" },
  { href: "/school/announcements", label: "Announcements" },
  { href: "/school/chats", label: "Direct chats" },
  { href: "/school/classroom-chat", label: "Classroom chats" },
];

export default function CommsHubPage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Communications hub</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          School communications
        </h1>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block border border-[var(--rule)] p-4 hover:bg-black/[0.03]">
              <p className="font-serif text-xl font-bold text-[var(--ink)]">{l.label}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
