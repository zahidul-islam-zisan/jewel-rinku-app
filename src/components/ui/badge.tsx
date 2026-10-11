import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  navy: "bg-navy/10 text-navy",
  teal: "bg-teal/10 text-teal",
  gold: "bg-gold/20 text-navy",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/10 text-error",
  muted: "bg-canvas text-muted border border-border",
};

export function Badge({
  children,
  tone = "navy",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
