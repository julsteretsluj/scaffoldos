import { DAY_SCHEDULE_BLOCKS, WEEKLY_PACING } from "@/lib/school/curriculum";

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Daily schedule architecture</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Day & weekly pacing
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Suggested templates students can shift to match energy — not seeded personal calendars.
        </p>
      </header>
      <div className="overflow-x-auto border border-[var(--rule)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--rule)] bg-[var(--paper-elevated)]">
            <tr>
              <th className="px-3 py-2 kicker font-semibold">Window</th>
              <th className="px-3 py-2 kicker font-semibold">Focus</th>
              <th className="px-3 py-2 kicker font-semibold">Activities</th>
            </tr>
          </thead>
          <tbody>
            {DAY_SCHEDULE_BLOCKS.map((b) => (
              <tr key={b.window} className="border-b border-[var(--rule-soft)]">
                <td className="px-3 py-3 font-semibold text-[var(--ink)]">{b.window}</td>
                <td className="px-3 py-3 font-serif font-bold text-[var(--ink)]">{b.focus}</td>
                <td className="px-3 py-3 text-[var(--ink-secondary)]">{b.activities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {WEEKLY_PACING.map((w) => (
          <li key={w.days} className="border border-[var(--rule)] p-4">
            <p className="kicker">{w.days}</p>
            <p className="mt-1 font-serif text-lg font-bold text-[var(--ink)]">{w.label}</p>
            <p className="mt-2 text-sm text-[var(--ink-secondary)]">{w.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
