import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { portalBySlug, PORTAL_ROLES } from "@/lib/portals/roles";

type Props = { params: Promise<{ role: string }> };

export function generateStaticParams() {
  return PORTAL_ROLES.map((p) => ({ role: p.slug }));
}

export default async function PortalRoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const portal = portalBySlug(role);
  if (!portal) notFound();

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <header className="border-b border-[var(--rule)] bg-[var(--paper-elevated)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-end justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <p className="kicker">
              {BRAND.system.shortName} · {BRAND.school.name}
            </p>
            <h1 className="font-serif text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">
              {portal.title}
            </h1>
          </div>
          <nav className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.1em]">
            <Link href="/portal" className="text-[var(--ink-muted)] hover:underline">
              Switch portal
            </Link>
            <Link href="/school" className="text-[var(--ink-muted)] hover:underline">
              School desk
            </Link>
            <Link href="/courses" className="text-[var(--ink-muted)] hover:underline">
              Authoring
            </Link>
          </nav>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {portal.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap border border-[var(--rule-soft)] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-secondary)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { role } = await params;
  const portal = portalBySlug(role);
  return {
    title: portal ? portal.title : "Portal",
  };
}
