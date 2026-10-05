import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-2 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ink-secondary)]">
          <span>{today}</span>
          <span>Scaffold Operating System</span>
          <span>Zero Data · No. 1</span>
        </div>

        <header className="rule-double py-6 text-center">
          <Image
            src={BRAND.system.lockup}
            alt={BRAND.system.name}
            width={180}
            height={56}
            className="mx-auto h-14 w-auto object-contain"
            priority
          />
          <h1 className="mt-4 font-serif text-5xl font-black tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl">
            Course OS
          </h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-secondary)]">
            The modular learning gazette
          </p>
        </header>

        <div className="grid gap-0 border border-[var(--rule)] md:grid-cols-[1.4fr_1fr]">
          <section className="border-b border-[var(--rule)] p-6 md:border-b-0 md:border-r md:p-8">
            <p className="kicker">Lead · Product</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[var(--ink)] sm:text-4xl">
              An empty catalog awaits its first edition
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-[var(--ink-secondary)]">
              Scaffold Operating System starts with no mock courses and no seed
              lessons. Authors compose modules, set draft-to-publish status, and
              release courses when ready — nothing is pre-written.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/courses/new"
                className="inline-flex h-9 items-center border border-[var(--ink)] bg-[var(--ink)] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--paper)] hover:bg-[var(--accent-hover)]"
              >
                Compose a course
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-9 items-center border border-[var(--ink)] px-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ink)] hover:bg-black/[0.04]"
              >
                Open the catalog
              </Link>
            </div>
          </section>

          <aside className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <p className="kicker">Briefing</p>
              <ul className="mt-4 space-y-3 border-t border-[var(--rule-soft)] pt-4 text-sm leading-relaxed text-[var(--ink-secondary)]">
                <li className="border-b border-[var(--rule-soft)] pb-3">
                  <span className="font-semibold text-[var(--ink)]">Empty states first.</span>{" "}
                  Every desk handles a blank ledger.
                </li>
                <li className="border-b border-[var(--rule-soft)] pb-3">
                  <span className="font-semibold text-[var(--ink)]">Draft → Published → Archived.</span>{" "}
                  Lifecycle printed into the schema.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">Two mastheads.</span>{" "}
                  Product OS for authors; school mark for learners.
                </li>
              </ul>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[var(--rule)] pt-4">
              <Image
                src={BRAND.school.markCyan}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <p className="byline">
                Tenant edition:{" "}
                <span className="font-medium text-[var(--ink)]">
                  {BRAND.school.name}
                </span>
              </p>
            </div>
          </aside>
        </div>

        <footer className="mt-6 border-t border-[var(--rule)] pt-3 text-center text-[0.65rem] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
          All the courses that are fit to teach · Zero mock data
        </footer>
      </div>
    </div>
  );
}
