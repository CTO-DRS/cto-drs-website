"use client";

import { Inbox, Loader2 } from "lucide-react";

/** Grid of shimmering skeleton cards used while lists load. */
export function ListSkeleton({ count = 6, className = "" }: { count?: number; className?: string }) {
  return (
    <div
      className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
      aria-busy="true"
      aria-label="جارٍ التحميل"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card-glow overflow-hidden rounded-2xl p-5"
        >
          <div className="mb-4 h-40 animate-pulse rounded-xl bg-elev-2" />
          <div className="mb-3 h-4 w-2/3 animate-pulse rounded bg-elev-2" />
          <div className="mb-2 h-3 w-full animate-pulse rounded bg-elev-2" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-elev-2" />
        </div>
      ))}
    </div>
  );
}

/** Centered full-area loading spinner. */
export function ScreenLoader({ label = "جارٍ التحميل..." }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-mute">
      <Loader2 className="h-8 w-8 animate-spin text-cyber" />
      <p className="font-mono-cyber text-xs tracking-widest">{label}</p>
    </div>
  );
}

/** Friendly empty state with icon + action. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card-glow mx-auto flex max-w-md flex-col items-center rounded-2xl px-6 py-14 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(0,240,255,0.25)] bg-[rgba(0,240,255,0.06)]">
        <Icon className="h-7 w-7 text-cyber" />
      </span>
      <h3 className="font-heading-cyber text-lg font-bold text-main">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-sec">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Error state with retry. */
export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-[rgba(255,42,109,0.3)] bg-[rgba(255,42,109,0.05)] px-6 py-12 text-center">
      <h3 className="font-heading-cyber text-lg font-bold text-main">حدث خطأ</h3>
      <p className="mt-2 text-sm text-sec">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-outline-cyber mt-5 rounded-full px-5 py-2 text-xs font-bold"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
