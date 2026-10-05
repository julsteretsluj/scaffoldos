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
        "flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#D1D1D6] bg-white px-8 py-16 text-center",
        className,
      )}
    >
      {brandSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brandSrc}
          alt={brandAlt ?? "Brand"}
          className="mb-6 h-16 w-auto object-contain opacity-90"
        />
      ) : (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#F2F2F7]">
          <Icon className="h-7 w-7 text-[#007AFF]" strokeWidth={1.75} />
        </div>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-[#1D1D1F]">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6E6E73]">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-6 inline-flex">
          <Button type="button">{actionLabel}</Button>
        </Link>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <div className="mt-6">
          <Button type="button" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
