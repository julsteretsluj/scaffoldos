import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LearnerHeaderProps {
  courseTitle: string;
  className?: string;
}

/** Tenant/school chrome for published learner experience */
export function LearnerHeader({ courseTitle, className }: LearnerHeaderProps) {
  return (
    <header className={cn("bg-[var(--paper)]", className)}>
      <div className="mx-auto max-w-5xl px-4 pt-3 sm:px-6">
        <div className="flex items-center justify-between border-b border-[var(--rule)] pb-2 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ink-secondary)]">
          <span>{BRAND.school.name}</span>
          <Link href="/courses" className="hover:text-[var(--ink)] hover:underline">
            Powered by {BRAND.system.shortName}
          </Link>
        </div>
        <div className="rule-double flex items-center gap-4 py-3">
          <Image
            src={BRAND.school.lockupLight}
            alt={BRAND.school.name}
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
          <div className="min-w-0 border-l border-[var(--rule)] pl-4">
            <p className="kicker">Learner edition</p>
            <p className="truncate font-serif text-lg font-bold text-[var(--ink)] sm:text-xl">
              {courseTitle}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
