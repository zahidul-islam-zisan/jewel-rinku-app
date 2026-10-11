import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-navy text-white">
      <Container className="py-12 md:py-16">
        {eyebrow ? (
          <p className="text-sm font-medium tracking-wide text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 max-w-3xl font-sans text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">{description}</p>
        ) : null}
      </Container>
    </section>
  );
}
