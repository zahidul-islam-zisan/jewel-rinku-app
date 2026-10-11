"use client";

import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { DemoBanner } from "@/components/ui/empty";
import { Checkbox, FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { company } from "@/lib/company";
import { inquiryStep1, inquiryStep2, inquiryStep3 } from "@/lib/validation/schemas";
import type { EmploymentType } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

const empty = {
  companyName: "",
  country: "",
  contactName: "",
  email: "",
  phone: "",
  position: "",
  jobCategorySlug: "",
  workersNeeded: 1,
  requiredSkills: "",
  experience: "",
  destination: "",
  employmentType: "full-time" as EmploymentType,
  timeline: "",
  description: "",
  supportingFileName: "",
  consent: false,
};

export function ManpowerRequest() {
  const { state, store } = usePrototype();
  const [step, setStep] = useState(1);
  const [data, setData] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function set<K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function validate(n: number) {
    const schema = n === 1 ? inquiryStep1 : n === 2 ? inquiryStep2 : inquiryStep3;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return false;
    }
    setErrors({});
    return true;
  }

  function next() {
    if (validate(step)) setStep((s) => Math.min(4, s + 1));
  }

  function submit() {
    if (!validate(3) || busy) return;
    setBusy(true);
    const inquiry = store.createInquiry({
      companyName: data.companyName,
      country: data.country,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      jobCategorySlug: data.jobCategorySlug,
      workersNeeded: Number(data.workersNeeded),
      requiredSkills: data.requiredSkills,
      experience: data.experience,
      destination: data.destination,
      employmentType: data.employmentType,
      timeline: data.timeline,
      description: data.description,
      supportingFileName: data.supportingFileName || undefined,
    });
    setDone(inquiry.reference);
    toast.success(`Demo inquiry ${inquiry.reference} stored locally.`);
    setBusy(false);
  }

  if (done) {
    return (
      <>
        <PageHero eyebrow="Employers" title="Request received in the prototype" />
        <Container className="py-12">
          <Card>
            <CardBody>
              <h2 className="text-xl font-semibold text-navy">Reference {done}</h2>
              <p className="mt-3 text-muted">
                This manpower request was stored in your browser only. It has not been emailed or delivered to Jewel Rinku Enterprise.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/admin/employer-inquiries">View in admin demo</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDone(null);
                    setStep(1);
                    setData(empty);
                  }}
                >
                  Submit another demo request
                </Button>
              </div>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Employers"
        title="Submit a manpower request"
        description="Four-step demonstration form. Files stay on this device. Nothing is sent to the company."
      />
      <Container className="py-10">
        <DemoBanner>
          Demonstration only — use the admin inquiries screen to see the stored record.
        </DemoBanner>
        <ol className="mt-6 flex flex-wrap gap-2 text-sm">
          {["Company", "Workforce", "Details", "Review"].map((l, i) => (
            <li
              key={l}
              className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-navy text-white" : "bg-white border border-border"}`}
            >
              {i + 1}. {l}
            </li>
          ))}
        </ol>
        <Card className="mt-6">
          <CardBody className="grid gap-4">
            {step === 1 ? (
              <>
                <div>
                  <Label htmlFor="companyName">Company name</Label>
                  <Input id="companyName" value={data.companyName} onChange={(e) => set("companyName", e.target.value)} />
                  <FieldError>{errors.companyName}</FieldError>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" value={data.country} onChange={(e) => set("country", e.target.value)} />
                  <FieldError>{errors.country}</FieldError>
                </div>
                <div>
                  <Label htmlFor="contactName">Contact person</Label>
                  <Input id="contactName" value={data.contactName} onChange={(e) => set("contactName", e.target.value)} />
                  <FieldError>{errors.contactName}</FieldError>
                </div>
                <div>
                  <Label htmlFor="email">Business email</Label>
                  <Input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
                  <FieldError>{errors.email}</FieldError>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
                  <FieldError>{errors.phone}</FieldError>
                </div>
                <div>
                  <Label htmlFor="position">Position or role</Label>
                  <Input id="position" value={data.position} onChange={(e) => set("position", e.target.value)} />
                  <FieldError>{errors.position}</FieldError>
                </div>
              </>
            ) : null}
            {step === 2 ? (
              <>
                <div>
                  <Label htmlFor="cat">Job category</Label>
                  <Select id="cat" value={data.jobCategorySlug} onChange={(e) => set("jobCategorySlug", e.target.value)}>
                    <option value="">Select</option>
                    {state.categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                  <FieldError>{errors.jobCategorySlug}</FieldError>
                </div>
                <div>
                  <Label htmlFor="workers">Number of workers</Label>
                  <Input
                    id="workers"
                    type="number"
                    min={1}
                    value={data.workersNeeded}
                    onChange={(e) => set("workersNeeded", Number(e.target.value))}
                  />
                  <FieldError>{errors.workersNeeded}</FieldError>
                </div>
                <div>
                  <Label htmlFor="skills">Required skills</Label>
                  <Textarea id="skills" value={data.requiredSkills} onChange={(e) => set("requiredSkills", e.target.value)} />
                  <FieldError>{errors.requiredSkills}</FieldError>
                </div>
                <div>
                  <Label htmlFor="exp">Experience requirements</Label>
                  <Input id="exp" value={data.experience} onChange={(e) => set("experience", e.target.value)} />
                  <FieldError>{errors.experience}</FieldError>
                </div>
                <div>
                  <Label htmlFor="dest">Destination country</Label>
                  <Select id="dest" value={data.destination} onChange={(e) => set("destination", e.target.value)}>
                    <option value="">Select</option>
                    {company.destinationsNamed.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                    <option value="Other">Other (confirm with the agency)</option>
                  </Select>
                  <FieldError>{errors.destination}</FieldError>
                </div>
                <div>
                  <Label htmlFor="etype">Employment type</Label>
                  <Select
                    id="etype"
                    value={data.employmentType}
                    onChange={(e) => set("employmentType", e.target.value as EmploymentType)}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="seasonal">Seasonal</option>
                  </Select>
                </div>
              </>
            ) : null}
            {step === 3 ? (
              <>
                <div>
                  <Label htmlFor="timeline">Preferred recruitment timeline</Label>
                  <Input id="timeline" value={data.timeline} onChange={(e) => set("timeline", e.target.value)} />
                  <FieldError>{errors.timeline}</FieldError>
                </div>
                <div>
                  <Label htmlFor="desc">Requirements description</Label>
                  <Textarea id="desc" value={data.description} onChange={(e) => set("description", e.target.value)} />
                  <FieldError>{errors.description}</FieldError>
                </div>
                <div>
                  <Label htmlFor="file">Supporting file (simulated locally)</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => set("supportingFileName", e.target.files?.[0]?.name ?? "")}
                  />
                  <p className="mt-1 text-xs text-muted">The file is not uploaded. Only the file name is stored.</p>
                </div>
                <Checkbox
                  id="consent"
                  label="I understand this is a demonstration and the request will not be delivered to Jewel Rinku Enterprise."
                  checked={data.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                />
                <FieldError>{errors.consent}</FieldError>
              </>
            ) : null}
            {step === 4 ? (
              <dl className="grid gap-2 text-sm">
                {Object.entries({
                  Company: data.companyName,
                  Country: data.country,
                  Contact: data.contactName,
                  Email: data.email,
                  Phone: data.phone,
                  Role: data.position,
                  Category: data.jobCategorySlug,
                  Workers: String(data.workersNeeded),
                  Destination: data.destination,
                  Timeline: data.timeline,
                  File: data.supportingFileName || "None",
                }).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border py-2">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="mt-2 flex justify-between">
              <Button variant="outline" type="button" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                Back
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={next} data-testid="inquiry-next">
                  Continue
                </Button>
              ) : (
                <Button type="button" onClick={submit} disabled={busy}>
                  {busy ? "Submitting…" : "Submit demonstration request"}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
