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
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 bg-[#0A1628]",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={BRAND.school.mark}
            alt={BRAND.school.name}
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{courseTitle}</p>
            <p className="truncate text-xs text-[#7DD3FC]">{BRAND.school.name}</p>
          </div>
        </div>
        <Link
          href="/courses"
          className="shrink-0 text-xs text-white/60 transition-colors hover:text-white"
        >
          Powered by {BRAND.system.shortName}
        </Link>
      </div>
    </header>
  );
}
