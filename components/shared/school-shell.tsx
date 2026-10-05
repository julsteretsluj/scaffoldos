"use client";

import { usePathname } from "next/navigation";
import { SchoolNav } from "@/components/shared/school-nav";

export function SchoolShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <SchoolNav current={pathname} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</main>
    </>
  );
}
