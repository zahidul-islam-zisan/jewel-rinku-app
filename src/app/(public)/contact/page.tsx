"use client";

import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { OfficeDirectionsLinks, OfficeMap } from "@/components/public/office-map";
import { company } from "@/lib/company";
import { contactSchema } from "@/lib/validation/schemas";
import { useState } from "react";
import { toast } from "sonner";

function InquiryForm({ audience }: { audience: "employer" | "job-seeker" }) {
  const { store } = usePrototype();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ok, setOk] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    store.addContactMessage({ audience, ...parsed.data });
    toast.success("Message stored locally. It was not emailed to the office.");
    setOk(true);
  }

  if (ok) {
    return <p className="text-sm text-success">Thank you. This demonstration message stays in your browser.</p>;
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <div>
        <Label htmlFor={`${audience}-name`}>Name</Label>
        <Input id={`${audience}-name`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FieldError>{errors.name}</FieldError>
      </div>
      <div>
        <Label htmlFor={`${audience}-email`}>Email</Label>
        <Input id={`${audience}-email`} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FieldError>{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor={`${audience}-phone`}>Phone</Label>
        <Input id={`${audience}-phone`} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <FieldError>{errors.phone}</FieldError>
      </div>
      <div>
        <Label htmlFor={`${audience}-msg`}>Message</Label>
        <Textarea id={`${audience}-msg`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <FieldError>{errors.message}</FieldError>
      </div>
      <Button type="submit">Send demo {audience === "employer" ? "employer" : "job seeker"} inquiry</Button>
    </form>
  );
}

export default function Page() {
  return (
    <>
      <PageHero title="Contact" description="Published contact details from the current website. Forms in this prototype do not send email." />
      <Container className="grid gap-8 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-navy">Office</h2>
          <p className="mt-3 text-sm text-muted">{company.address}</p>
          <p className="mt-1 text-sm text-muted">BAIRA listing address: {company.addressBaira}</p>
          <p className="mt-3 text-sm">
            <a className="text-teal" href={`tel:${company.phone}`}>{company.phone}</a>
          </p>
          <p className="text-sm">
            <a className="text-teal" href={`mailto:${company.email}`}>{company.email}</a>
            {" · "}
            <a className="text-teal" href={`mailto:${company.emailInfo}`}>{company.emailInfo}</a>
          </p>
          <p className="mt-3 text-sm text-muted">{company.hours}</p>
          <OfficeDirectionsLinks className="mt-4" />
        </div>
        <div className="grid gap-4">
          <Card>
            <CardBody>
              <h2 className="font-semibold text-navy">Employer inquiry</h2>
              <InquiryForm audience="employer" />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <h2 className="font-semibold text-navy">Job seeker inquiry</h2>
              <InquiryForm audience="job-seeker" />
            </CardBody>
          </Card>
        </div>
      </Container>
      <Container className="pb-16">
        <h2 className="text-xl font-semibold text-navy">Office location</h2>
        <p className="mt-2 text-sm text-muted">
          The same Google Maps pin published on jewelrinku.com.bd for {company.mapPlaceName}.
        </p>
        <OfficeMap className="mt-4" />
      </Container>
    </>
  );
}
