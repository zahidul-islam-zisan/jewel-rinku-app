"use client";

import { Container } from "@/components/layout/container";
import { JobCard } from "@/components/public/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DemoBanner, EmptyState } from "@/components/ui/empty";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { company } from "@/lib/company";
import { formatDate } from "@/lib/utils";
import { jobApplySchema } from "@/lib/validation/schemas";
import { effectiveJobStatus, isJobOpen, jobStatusLabel } from "@/lib/status-rules";
import { toast } from "sonner";
import { useState } from "react";

export function JobDetail({ slug }: { slug: string }) {
  const { state, store } = usePrototype();
  const job = state.jobs.find((j) => j.slug === slug);
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverNote: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  if (!job) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Vacancy not found"
          description="This slug does not match a demo vacancy."
          action={<Button href="/jobs">Back to jobs</Button>}
        />
      </Container>
    );
  }

  const status = effectiveJobStatus(job);
  const open = isJobOpen(job);
  const category = state.categories.find((c) => c.slug === job.categorySlug);
  const similar = state.jobs
    .filter((j) => j.id !== job.id && j.categorySlug === job.categorySlug && isJobOpen(j))
    .slice(0, 3);

  function apply() {
    if (!open || !job) return;
    const parsed = jobApplySchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const app = store.applyToJob({
        jobId: job.id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        coverNote: parsed.data.coverNote || "Public job application",
      });
      setDone(app.reference);
      toast.success(`Application ${app.reference} recorded for office follow-up.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not apply");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container className="py-10">
      <DemoBanner>This vacancy is demonstration content and is not a live offer of employment.</DemoBanner>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <article>
          <div className="flex flex-wrap gap-2">
            <Badge tone={open ? "success" : "muted"}>{jobStatusLabel(status)}</Badge>
            <Badge>{job.destination}</Badge>
            <Badge tone="teal">{category?.name}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-navy">{job.title}</h1>
          <p className="mt-3 text-muted">{job.summary}</p>
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-navy">Responsibilities</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">
              {job.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-navy">Qualifications and skills</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">
              {[...job.qualifications, ...job.skills].map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-navy">Eligibility</h2>
            <p className="mt-2 text-sm text-muted">{job.eligibility}</p>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-navy">Required documents</h2>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">
              {job.requiredDocuments.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </article>
        <aside className="h-fit rounded-lg border border-border bg-white p-5">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">Employment type</dt>
              <dd className="capitalize text-navy">{job.employmentType}</dd>
            </div>
            <div>
              <dt className="text-muted">Experience</dt>
              <dd className="capitalize text-navy">{job.experienceLevel}</dd>
            </div>
            <div>
              <dt className="text-muted">Deadline</dt>
              <dd className="text-navy">{formatDate(job.deadline)}</dd>
            </div>
            <div>
              <dt className="text-muted">Compensation</dt>
              <dd className="text-navy">
                {job.salaryLabel ?? "Not published"}
                {job.salaryIsIllustrative ? " (illustrative)" : ""}
              </dd>
            </div>
          </dl>
          {open ? (
            done ? (
              <div className="mt-5 space-y-2">
                <p className="font-semibold text-navy">Application received</p>
                <p className="text-sm text-muted">
                  Reference <span className="font-medium text-navy">{done}</span>. This is a demonstration record. An office employee would contact you by phone or email. Nothing was sent to the company automatically.
                </p>
                <p className="text-sm text-muted">
                  Office: {company.phone} · {company.email}
                </p>
              </div>
            ) : (
              <form
                className="mt-5 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  apply();
                }}
              >
                <p className="text-sm font-medium text-navy">Apply for this vacancy</p>
                <div>
                  <Label htmlFor="app-name">Full name</Label>
                  <Input
                    id="app-name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <FieldError>{errors.name}</FieldError>
                </div>
                <div>
                  <Label htmlFor="app-phone">Phone</Label>
                  <Input
                    id="app-phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <FieldError>{errors.phone}</FieldError>
                </div>
                <div>
                  <Label htmlFor="app-email">Email</Label>
                  <Input
                    id="app-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <FieldError>{errors.email}</FieldError>
                </div>
                <div>
                  <Label htmlFor="cover">Message (optional)</Label>
                  <Textarea
                    id="cover"
                    value={form.coverNote}
                    onChange={(e) => setForm({ ...form, coverNote: e.target.value })}
                    placeholder="Skills, experience, or questions"
                  />
                </div>
                <Button className="w-full" type="submit" disabled={busy} data-testid="apply-job">
                  {busy ? "Submitting…" : "Submit application"}
                </Button>
                <p className="text-xs text-muted">
                  There is no applicant login. Staff will contact you manually if they proceed with this demonstration request.
                </p>
              </form>
            )
          ) : (
            <p className="mt-4 text-sm text-warning">This vacancy is closed or past its deadline. New applications are disabled.</p>
          )}
        </aside>
      </div>
      {similar.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-navy">Similar demo vacancies</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {similar.map((j) => (
              <JobCard key={j.id} job={j} category={category} />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
