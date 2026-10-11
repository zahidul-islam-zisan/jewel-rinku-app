"use client";

import { Container } from "@/components/layout/container";
import { JobCard } from "@/components/public/job-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { usePrototype } from "@/hooks/use-prototype";
import { isJobOpen } from "@/lib/status-rules";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = usePrototype();
  const category = state.categories.find((c) => c.slug === slug);
  if (!category) {
    return (
      <Container className="py-16">
        <EmptyState title="Category not found" description="This category slug is not in the prototype set." action={<Button href="/job-categories">All categories</Button>} />
      </Container>
    );
  }
  const jobs = state.jobs.filter((j) => j.categorySlug === category.slug && isJobOpen(j));
  return (
    <Container className="py-12">
      <p className="text-sm text-gold">Prototype category</p>
      <h1 className="mt-2 text-3xl font-semibold text-navy">{category.name}</h1>
      <p className="mt-3 max-w-2xl text-muted">{category.description}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {jobs.length ? (
          jobs.map((job) => <JobCard key={job.id} job={job} category={category} />)
        ) : (
          <EmptyState title="No open demo vacancies" description="Check back in the jobs list or another category." />
        )}
      </div>
    </Container>
  );
}
