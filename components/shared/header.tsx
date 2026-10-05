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

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[#D1D1D6]/70 bg-white/90 backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href={isSystem ? "/" : "/courses"} className="flex items-center gap-3">
          <Image
            src={
              isSystem
                ? BRAND.system.lockup
                : BRAND.school.lockupLight
            }
            alt={isSystem ? BRAND.system.name : BRAND.school.name}
            width={isSystem ? 140 : 120}
            height={40}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/courses"
            className="rounded-[980px] px-3 py-1.5 text-[#6E6E73] transition-colors hover:bg-[#F2F2F7] hover:text-[#1D1D1F]"
          >
            Courses
          </Link>
          <Link
            href="/courses/new"
            className="rounded-[980px] bg-[#007AFF] px-3.5 py-1.5 font-medium text-white transition-colors hover:bg-[#0077ED]"
          >
            Create Course
          </Link>
        </nav>
      </div>
    </header>
  );
}
