"use client";

import { Container, PageHero } from "@/components/layout/container";
import { Card, CardBody } from "@/components/ui/card";
import { usePrototype } from "@/hooks/use-prototype";
import { isJobOpen } from "@/lib/status-rules";
import Link from "next/link";

export default function Page() {
  const { state } = usePrototype();
  return (
    <>
      <PageHero
        eyebrow="Job seekers"
        title="Job categories"
        description="Prototype trade categories for demonstration. Validate against actual demand before launching a production site."
      />
      <Container className="grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {state.categories.map((c) => {
          const count = state.jobs.filter((j) => j.categorySlug === c.slug && isJobOpen(j)).length;
          return (
            <Link key={c.slug} href={`/job-categories/${c.slug}`}>
              <Card className="h-full hover:border-teal">
                <CardBody>
                  <h2 className="font-semibold text-navy">{c.name}</h2>
                  <p className="mt-2 text-sm text-muted">{c.summary}</p>
                  <p className="mt-3 text-xs text-teal">{count} open demo vacancies</p>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </Container>
    </>
  );
}
