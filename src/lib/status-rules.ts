import type { ApplicationStatus, Job, JobStatus } from "@/types";

export const applicationTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  submitted: ["under-review", "withdrawn"],
  "under-review": ["shortlisted", "documents-pending", "rejected", "withdrawn"],
  shortlisted: ["interview-scheduled", "assessment-required", "rejected", "withdrawn"],
  "interview-scheduled": [
    "assessment-required",
    "approved-next-stage",
    "rejected",
    "withdrawn",
  ],
  "assessment-required": ["documents-pending", "approved-next-stage", "rejected", "withdrawn"],
  "documents-pending": ["approved-next-stage", "rejected", "withdrawn"],
  "approved-next-stage": ["withdrawn"],
  rejected: [],
  withdrawn: [],
};

export function canTransition(from: ApplicationStatus, to: ApplicationStatus) {
  return applicationTransitions[from].includes(to);
}

export function importantTransition(to: ApplicationStatus) {
  return to === "rejected" || to === "approved-next-stage" || to === "withdrawn";
}

export function effectiveJobStatus(job: Job, now = Date.now()): JobStatus {
  if (job.status === "published" && new Date(job.deadline).getTime() < now) {
    return "expired";
  }
  return job.status;
}

export function isJobOpen(job: Job, now = Date.now()) {
  return effectiveJobStatus(job, now) === "published";
}

export function jobStatusLabel(status: JobStatus) {
  const map: Record<JobStatus, string> = {
    draft: "Draft",
    published: "Open",
    closed: "Closed",
    expired: "Deadline passed",
  };
  return map[status];
}

export function applicationStatusLabel(status: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    submitted: "Submitted",
    "under-review": "Under review",
    shortlisted: "Shortlisted",
    "interview-scheduled": "Interview scheduled",
    "assessment-required": "Assessment required",
    "documents-pending": "Documents pending",
    "approved-next-stage": "Approved for next stage",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };
  return map[status];
}
