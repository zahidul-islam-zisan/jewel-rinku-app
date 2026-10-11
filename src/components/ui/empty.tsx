export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white px-6 py-12 text-center">
      <h3 className="text-base font-semibold text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Skeleton({ className = "h-4" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-border ${className}`} />;
}

export function DemoBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-navy">
      {children}
    </p>
  );
}
