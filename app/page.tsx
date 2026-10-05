import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#F2F2F7]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,122,255,0.08),_transparent_55%),linear-gradient(180deg,#F2F2F7_0%,#E8E8ED_100%)]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Image
          src={BRAND.system.lockup}
          alt={BRAND.system.name}
          width={160}
          height={48}
          className="h-11 w-auto object-contain"
          priority
        />
        <Link
          href="/courses"
          className="rounded-[980px] bg-[#007AFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0077ED]"
        >
          Open course catalog
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-20 pt-10">
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#6E6E73]">
          Zero-data learning platform
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#1D1D1F] sm:text-5xl">
          Course OS
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6E6E73] sm:text-lg">
          Scaffold Operating System starts empty. Authors create courses,
          modules, and lessons from scratch — no mock catalogs, no seed content.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/courses/new"
            className="inline-flex h-11 items-center rounded-[980px] bg-[#007AFF] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0077ED]"
          >
            Create your first course
          </Link>
          <Link
            href="/courses"
            className="inline-flex h-11 items-center rounded-[980px] border border-[#D1D1D6] bg-white px-6 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-[#F2F2F7]"
          >
            Browse catalog
          </Link>
        </div>

        <div className="mt-16 flex items-center gap-3 border-t border-[#D1D1D6] pt-8">
          <Image
            src={BRAND.school.markCyan}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          <p className="text-sm text-[#6E6E73]">
            Tenant brand for learners:{" "}
            <span className="font-medium text-[#1D1D1F]">
              {BRAND.school.name}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
