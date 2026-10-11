import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { effectiveJobStatus, jobStatusLabel } from "@/lib/status-rules";
import type { Job, JobCategory } from "@/types";
import Link from "next/link";

export function JobCard({ job, category }: { job: Job; category?: JobCategory }) {
  const status = effectiveJobStatus(job);
  const tone =
    status === "published" ? "success" : status === "closed" ? "muted" : "warning";
  return (
    <Card className="h-full">
      <CardBody className="flex h-full flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={tone}>{jobStatusLabel(status)}</Badge>
          <Badge tone="navy">{job.destination}</Badge>
          <Badge tone="teal">{category?.name ?? job.categorySlug}</Badge>
          {job.isDemo ? <Badge tone="gold">Demo vacancy</Badge> : null}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-navy">
          <Link href={`/jobs/${job.slug}`} className="hover:underline">
            {job.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{job.summary}</p>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
          <div>
            <dt className="font-medium text-ink">Type</dt>
            <dd className="capitalize">{job.employmentType}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Published</dt>
            <dd>{job.publishedAt ? formatDate(job.publishedAt) : "—"}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Deadline</dt>
            <dd>{formatDate(job.deadline)}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">Compensation</dt>
            <dd>
              {job.salaryLabel
                ? `${job.salaryLabel}${job.salaryIsIllustrative ? " (illustrative)" : ""}`
                : "Not published"}
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <Button href={`/jobs/${job.slug}`} variant="outline" size="sm">
            View details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
