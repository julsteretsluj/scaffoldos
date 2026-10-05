import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "system" | "school";
  className?: string;
}

export function Header({ variant = "system", className }: HeaderProps) {
  const isSystem = variant === "system";
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className={cn("bg-[var(--paper)]", className)}>
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-2 text-[0.65rem] uppercase tracking-[0.12em] text-[var(--ink-secondary)]">
          <span>{today}</span>
          <span>{isSystem ? "Vol. I · Course Edition" : BRAND.school.name}</span>
        </div>

        <div className="rule-double flex flex-col items-center gap-3 py-4 sm:flex-row sm:items-end sm:justify-between">
          <Link href={isSystem ? "/" : "/courses"} className="flex flex-col items-center sm:items-start">
            <Image
              src={isSystem ? BRAND.system.lockup : BRAND.school.lockupLight}
              alt={isSystem ? BRAND.system.name : BRAND.school.name}
              width={isSystem ? 168 : 148}
              height={48}
              className="h-12 w-auto object-contain"
              priority
            />
            <p className="mt-2 font-serif text-2xl font-black tracking-tight text-[var(--ink)] sm:text-3xl">
              {isSystem ? "Scaffold OS" : "The Learner"}
            </p>
          </Link>

          <nav className="flex items-center gap-4 border-t border-[var(--rule-soft)] pt-3 text-xs font-semibold uppercase tracking-[0.12em] sm:border-t-0 sm:pt-0">
            <Link
              href="/courses"
              className="text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:underline"
            >
              Catalog
            </Link>
            <Link
              href="/courses/new"
              className="border border-[var(--ink)] bg-[var(--ink)] px-3 py-1.5 text-[var(--paper)] hover:bg-[var(--accent-hover)]"
            >
              New Course
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
