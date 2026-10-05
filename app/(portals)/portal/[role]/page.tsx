import Link from "next/link";
import { notFound } from "next/navigation";
import { portalBySlug } from "@/lib/portals/roles";

type Props = { params: Promise<{ role: string }> };

export default async function PortalDashboardPage({ params }: Props) {
  const { role } = await params;
  const portal = portalBySlug(role);
  if (!portal) notFound();

  return (
    <div className="space-y-6">
      <section className="border border-[var(--rule)] bg-[var(--paper-elevated)] p-6">
        <p className="kicker">Dashboard</p>
        <h2 className="mt-2 font-serif text-3xl font-black text-[var(--ink)]">
          {portal.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-secondary)]">
          {portal.blurb} Modules open empty until your community files people,
          courses, attendance, and messages — no mock catalogs.
        </p>
        <p className="byline mt-4">
          Tip: create or select a profile on the{" "}
          <Link href="/portal" className="underline">
            portal home
          </Link>{" "}
          before posting chats or check-ins.
        </p>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {portal.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block border border-[var(--rule)] px-4 py-4 transition-colors hover:bg-black/[0.03]"
            >
              <p className="kicker">Open</p>
              <p className="mt-1 font-serif text-xl font-bold text-[var(--ink)]">
                {link.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
