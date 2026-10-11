"use client";

import { Container, PageHero } from "@/components/layout/container";
import { JobCard } from "@/components/public/job-card";
import { Button } from "@/components/ui/button";
import { DemoBanner, EmptyState } from "@/components/ui/empty";
import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { company } from "@/lib/company";
import { filterJobs, paginate } from "@/lib/filter-jobs";
import type { EmploymentType, ExperienceLevel } from "@/types";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ExplorerInner() {
  const { state } = usePrototype();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const destination = params.get("destination") ?? "";
  const employmentType = (params.get("type") ?? "") as EmploymentType | "";
  const experience = (params.get("experience") ?? "") as ExperienceLevel | "";
  const sort = (params.get("sort") ?? "newest") as "newest" | "deadline" | "title";
  const page = Number(params.get("page") ?? "1");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    router.replace(`${pathname}?${next.toString()}`);
  }

  const filtered = useMemo(
    () =>
      filterJobs(state.jobs, {
        query,
        category,
        destination,
        employmentType,
        experience,
        sort,
      }),
    [state.jobs, query, category, destination, employmentType, experience, sort],
  );
  const result = paginate(filtered, page, 6);

  const chips = [
    query && { k: "q", l: `Search: ${query}` },
    category && { k: "category", l: state.categories.find((c) => c.slug === category)?.name },
    destination && { k: "destination", l: destination },
    employmentType && { k: "type", l: employmentType },
    experience && { k: "experience", l: experience },
  ].filter(Boolean) as { k: string; l: string }[];

  return (
    <>
      <PageHero
        eyebrow="Job seekers"
        title="Overseas job opportunities"
        description="Listings in this prototype are demonstration records. They are not live vacancies and should not be treated as offers of employment."
      />
      <Container className="py-10">
        <DemoBanner>
          Demo data only. Salary figures, where shown, are illustrative.
        </DemoBanner>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          <Input
            value={query}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder="Search title or destination"
            aria-label="Search jobs"
          />
          <Select value={category} onChange={(e) => setParam("category", e.target.value)} aria-label="Category">
            <option value="">All categories</option>
            {state.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select value={destination} onChange={(e) => setParam("destination", e.target.value)} aria-label="Destination">
            <option value="">All destinations</option>
            {company.destinationsNamed.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
          <Select value={employmentType} onChange={(e) => setParam("type", e.target.value)} aria-label="Employment type">
            <option value="">All types</option>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="seasonal">Seasonal</option>
          </Select>
          <Select value={sort} onChange={(e) => setParam("sort", e.target.value)} aria-label="Sort">
            <option value="newest">Newest</option>
            <option value="deadline">Deadline</option>
            <option value="title">Title</option>
          </Select>
        </div>
        <div className="mt-3">
          <Select
            className="max-w-xs"
            value={experience}
            onChange={(e) => setParam("experience", e.target.value)}
            aria-label="Experience"
          >
            <option value="">All experience levels</option>
            <option value="entry">Entry</option>
            <option value="skilled">Skilled</option>
            <option value="supervisor">Supervisor</option>
          </Select>
        </div>
        {chips.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <button
                key={c.k}
                type="button"
                className="rounded-full border border-border bg-white px-3 py-1 text-xs"
                onClick={() => setParam(c.k, "")}
              >
                {c.l} ×
              </button>
            ))}
            <Button href="/jobs" variant="ghost" size="sm">
              Clear filters
            </Button>
          </div>
        ) : null}
        {result.total === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No matching vacancies"
              description="Try another search or clear filters. Demo inventory is limited."
              action={
                <Button href="/jobs" variant="outline">
                  Reset
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-muted">{result.total} demo vacancies</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {result.items.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  category={state.categories.find((c) => c.slug === job.categorySlug)}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={result.page <= 1}
                onClick={() => setParam("page", String(result.page - 1))}
              >
                Previous
              </Button>
              <span className="flex h-9 items-center text-sm text-muted">
                Page {result.page} of {result.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={result.page >= result.pages}
                onClick={() => setParam("page", String(result.page + 1))}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
}

export function JobsExplorer() {
  return (
    <Suspense fallback={<Container className="py-16 text-muted">Loading jobs…</Container>}>
      <ExplorerInner />
    </Suspense>
  );
}
