"use client";

import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { company } from "@/lib/company";
import { images } from "@/lib/images";
import { trainingInquirySchema } from "@/lib/validation/schemas";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { state, store } = usePrototype();
  const [form, setForm] = useState({ name: "", email: "", phone: "", courseId: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = trainingInquirySchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    store.addTrainingInquiry(parsed.data);
    toast.success("Training inquiry stored in this prototype only.");
    setForm({ name: "", email: "", phone: "", courseId: "", message: "" });
    setErrors({});
  }

  return (
    <>
      <PageHero
        title="Training Center"
        description={company.trainingIntro}
      />
      <Container className="grid gap-8 py-12 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[3/4] max-h-[520px] overflow-hidden rounded-lg">
          <Image src={images.training.src} alt={images.training.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-navy">Technical Training Centre</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{company.trainingCentre}</p>
          <h3 className="mt-6 font-semibold text-navy">Facility</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{company.trainingFacilities}</p>
        </div>
      </Container>
      <Container className="pb-12">
        <h2 className="text-xl font-semibold text-navy">Photo Gallery</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {images.gallery.map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="20vw" />
            </div>
          ))}
        </div>
      </Container>
      <Container className="grid gap-4 pb-12 md:grid-cols-2">
        {state.courses.map((c) => (
          <Card key={c.id}>
            <CardBody>
              <p className="text-xs text-gold">{c.category}</p>
              <h3 className="mt-1 font-semibold text-navy">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.summary}</p>
              <p className="mt-3 text-xs text-muted">Duration: {c.duration}</p>
              <p className="text-xs text-muted">Eligibility: {c.eligibility}</p>
              <p className="text-xs text-muted">Schedule: {c.scheduleNote}</p>
            </CardBody>
          </Card>
        ))}
      </Container>
      <Container className="pb-16">
        <h2 className="text-xl font-semibold text-navy">Training inquiry (simulated)</h2>
        <form onSubmit={submit} className="mt-4 grid max-w-xl gap-3">
          <div>
            <Label htmlFor="n">Name</Label>
            <Input id="n" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FieldError>{errors.name}</FieldError>
          </div>
          <div>
            <Label htmlFor="e">Email</Label>
            <Input id="e" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <FieldError>{errors.email}</FieldError>
          </div>
          <div>
            <Label htmlFor="p">Phone</Label>
            <Input id="p" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <FieldError>{errors.phone}</FieldError>
          </div>
          <div>
            <Label htmlFor="c">Programme</Label>
            <Select id="c" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
              <option value="">Select</option>
              {state.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
            <FieldError>{errors.courseId}</FieldError>
          </div>
          <div>
            <Label htmlFor="m">Message</Label>
            <Textarea id="m" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <FieldError>{errors.message}</FieldError>
          </div>
          <Button type="submit">Send demo inquiry</Button>
        </form>
      </Container>
    </>
  );
}
