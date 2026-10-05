import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
  brandSrc?: string;
  brandAlt?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
  brandSrc,
  brandAlt,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-[var(--rule)] bg-[var(--paper-elevated)] px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      <div className="mx-auto mb-5 flex max-w-md flex-col items-center border-b border-[var(--rule-soft)] pb-5">
        {brandSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brandSrc}
            alt={brandAlt ?? "Brand"}
            className="mb-4 h-14 w-auto object-contain"
          />
        ) : (
          <Icon className="mb-3 h-6 w-6 text-[var(--ink)]" strokeWidth={1.5} />
        )}
        <p className="kicker">Notice · Edition incomplete</p>
      </div>
      <h2 className="font-serif text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--ink-secondary)] sm:text-[0.95rem]">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-7 inline-flex">
          <Button type="button">{actionLabel}</Button>
        </Link>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <div className="mt-7">
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
