"use client";

import { JobForm } from "@/components/admin/job-form";
import { EmptyState } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { usePrototype } from "@/hooks/use-prototype";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { state } = usePrototype();
  const job = state.jobs.find((j) => j.id === id);
  if (!job) {
    return <EmptyState title="Job not found" description="Unknown vacancy id." action={<Button href="/admin/jobs">Jobs</Button>} />;
  }
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-navy">Edit vacancy</h1>
      <JobForm job={job} />
    </div>
  );
}
