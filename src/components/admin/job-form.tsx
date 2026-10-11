"use client";

import { Button } from "@/components/ui/button";
import { Checkbox, FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { company } from "@/lib/company";
import { jobFormSchema } from "@/lib/validation/schemas";
import type { Job } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function lines(v: string) {
  return v.split("\n").map((s) => s.trim()).filter(Boolean);
}

export function JobForm({ job }: { job?: Job }) {
  const { state, store } = usePrototype();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    title: job?.title ?? "",
    categorySlug: job?.categorySlug ?? "construction",
    destination: job?.destination ?? "UAE",
    employmentType: job?.employmentType ?? "full-time",
    experienceLevel: job?.experienceLevel ?? "skilled",
    summary: job?.summary ?? "",
    responsibilities: (job?.responsibilities ?? []).join("\n"),
    qualifications: (job?.qualifications ?? []).join("\n"),
    skills: (job?.skills ?? []).join("\n"),
    requiredDocuments: (job?.requiredDocuments ?? []).join("\n"),
    eligibility: job?.eligibility ?? "",
    salaryLabel: job?.salaryLabel ?? "",
    deadline: job?.deadline?.slice(0, 10) ?? "",
    featured: job?.featured ?? false,
  });

  function submit(status: Job["status"]) {
    const parsed = jobFormSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    const deadline = new Date(form.deadline).toISOString();
    if (status === "published" && new Date(deadline).getTime() < Date.now()) {
      setErrors({ deadline: "Cannot publish with a past deadline." });
      return;
    }
    const id = store.saveJob({
      id: job?.id,
      slug: job?.slug,
      title: form.title,
      categorySlug: form.categorySlug,
      destination: form.destination,
      employmentType: form.employmentType as Job["employmentType"],
      experienceLevel: form.experienceLevel as Job["experienceLevel"],
      status,
      featured: form.featured,
      summary: form.summary,
      responsibilities: lines(form.responsibilities),
      qualifications: lines(form.qualifications),
      skills: lines(form.skills),
      requiredDocuments: lines(form.requiredDocuments),
      eligibility: form.eligibility,
      salaryLabel: form.salaryLabel || undefined,
      salaryIsIllustrative: Boolean(form.salaryLabel),
      deadline,
      publishedAt: status === "published" ? job?.publishedAt ?? new Date().toISOString() : job?.publishedAt,
    });
    toast.success(status === "published" ? "Vacancy saved and published." : "Vacancy saved.");
    router.push("/admin/jobs");
    return id;
  }

  return (
    <form className="grid max-w-3xl gap-3" onSubmit={(e) => e.preventDefault()}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FieldError>{errors.title}</FieldError>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor="cat">Category</Label>
          <Select id="cat" value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}>
            {state.categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dest">Destination</Label>
          <Select id="dest" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}>
            {company.destinationsNamed.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <Label htmlFor="et">Employment type</Label>
          <Select id="et" value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value as never })}>
            <option value="full-time">Full-time</option>
            <option value="contract">Contract</option>
            <option value="seasonal">Seasonal</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="ex">Experience</Label>
          <Select id="ex" value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value as never })}>
            <option value="entry">Entry</option>
            <option value="skilled">Skilled</option>
            <option value="supervisor">Supervisor</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="sum">Summary</Label>
        <Textarea id="sum" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <FieldError>{errors.summary}</FieldError>
      </div>
      {(["responsibilities", "qualifications", "skills", "requiredDocuments"] as const).map((key) => (
        <div key={key}>
          <Label htmlFor={key}>{key} (one per line)</Label>
          <Textarea id={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          <FieldError>{errors[key]}</FieldError>
        </div>
      ))}
      <div>
        <Label htmlFor="elig">Eligibility</Label>
        <Textarea id="elig" value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="sal">Salary label (illustrative)</Label>
        <Input id="sal" value={form.salaryLabel} onChange={(e) => setForm({ ...form, salaryLabel: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="dl">Deadline</Label>
        <Input id="dl" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        <FieldError>{errors.deadline}</FieldError>
      </div>
      <Checkbox
        id="feat"
        label="Featured on homepage"
        checked={form.featured}
        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
      />
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => submit("draft")}>
          Save draft
        </Button>
        <Button type="button" onClick={() => submit("published")} data-testid="job-publish">
          Save and publish
        </Button>
      </div>
    </form>
  );
}
