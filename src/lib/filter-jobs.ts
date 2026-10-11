import type { EmploymentType, ExperienceLevel, Job } from "@/types";
import { effectiveJobStatus } from "@/lib/status-rules";

export interface JobFilters {
  query?: string;
  category?: string;
  destination?: string;
  employmentType?: EmploymentType | "";
  experience?: ExperienceLevel | "";
  sort?: "newest" | "deadline" | "title";
  includeUnpublished?: boolean;
}

export function filterJobs(jobs: Job[], filters: JobFilters) {
  const q = filters.query?.trim().toLowerCase() ?? "";
  let list = jobs.filter((job) => {
    const status = effectiveJobStatus(job);
    if (!filters.includeUnpublished && status !== "published") return false;
    if (q) {
      const hay = `${job.title} ${job.destination} ${job.summary} ${job.categorySlug}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.category && job.categorySlug !== filters.category) return false;
    if (filters.destination && job.destination !== filters.destination) return false;
    if (filters.employmentType && job.employmentType !== filters.employmentType) return false;
    if (filters.experience && job.experienceLevel !== filters.experience) return false;
    return true;
  });

  const sort = filters.sort ?? "newest";
  list = [...list].sort((a, b) => {
    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "deadline") return a.deadline.localeCompare(b.deadline);
    return (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt);
  });
  return list;
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    pages,
    total,
  };
}
