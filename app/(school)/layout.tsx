import { SchoolShell } from "@/components/shared/school-shell";

/** School modules are client/API-driven or DB-backed — never prerender against missing DATABASE_URL. */
export const dynamic = "force-dynamic";

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl flex-col lg:min-h-screen lg:flex-row">
        <SchoolShell>{children}</SchoolShell>
      </div>
    </div>
  );
}
