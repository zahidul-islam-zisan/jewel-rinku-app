import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

const styles = {
  primary:
    "bg-teal text-white hover:bg-teal/90 focus-visible:ring-teal",
  navy: "bg-navy text-white hover:bg-navy/90 focus-visible:ring-navy",
  gold: "bg-gold text-navy hover:bg-gold/90 focus-visible:ring-gold",
  outline:
    "border border-border bg-white text-navy hover:bg-canvas focus-visible:ring-navy",
  ghost: "text-navy hover:bg-canvas focus-visible:ring-navy",
  danger: "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
  size?: keyof typeof sizes;
  href?: string;
  children: ReactNode;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: Props) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    styles[variant],
    sizes[size],
    className,
  );
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
