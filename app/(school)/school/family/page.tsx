import Link from "next/link";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { BRAND } from "@/lib/brand";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FamilyPortalPage() {
  let news: { id: string; title: string; body: string; publishedAt: Date | null }[] =
    [];
  let announcements: { id: string; title: string; body: string; audience: string }[] =
    [];
  let offline = false;

  try {
    news = await db.newsPost.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 5,
    });
    announcements = await db.announcement.findMany({
      where: { audience: { in: ["family", "school"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  } catch {
    offline = true;
  }

  if (offline) {
    return (
      <EmptyState
        icon={Users}
        brandSrc={BRAND.school.lockupLight}
        brandAlt={BRAND.school.name}
        title="Family portal offline"
        description="Connect the database to show calm family updates."
        actionLabel="School desk"
        actionHref="/school"
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">{BRAND.school.name} · Family</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Family desk
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Transparent insight into news and announcements without micro-update
          overload.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-[var(--rule)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">News</h2>
            <Link href="/school/news" className="text-xs underline">
              All news
            </Link>
          </div>
          {news.length === 0 ? (
            <p className="text-sm text-[var(--ink-muted)]">No published news yet.</p>
          ) : (
            <ul className="space-y-3">
              {news.map((n) => (
                <li key={n.id}>
                  <p className="font-semibold text-[var(--ink)]">{n.title}</p>
                  <p className="line-clamp-2 text-sm text-[var(--ink-secondary)]">
                    {n.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="border border-[var(--rule)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Announcements</h2>
            <Link href="/school/announcements" className="text-xs underline">
              All notices
            </Link>
          </div>
          {announcements.length === 0 ? (
            <p className="text-sm text-[var(--ink-muted)]">No announcements yet.</p>
          ) : (
            <ul className="space-y-3">
              {announcements.map((n) => (
                <li key={n.id}>
                  <p className="byline">{n.audience}</p>
                  <p className="font-semibold text-[var(--ink)]">{n.title}</p>
                  <p className="line-clamp-2 text-sm text-[var(--ink-secondary)]">
                    {n.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-[var(--rule)] pt-4 text-xs font-semibold uppercase tracking-[0.08em]">
        <Link href="/school/attendance" className="underline">
          Attendance
        </Link>
        <Link href="/portal/parent" className="underline">
          Parent portal home
        </Link>
        <Link href="/school/chats" className="underline">
          Message school
        </Link>
      </div>
    </div>
  );
}
