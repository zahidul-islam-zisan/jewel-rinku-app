"use client";

import { Container, PageHero } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty";
import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { useMemo, useState } from "react";

export default function Page() {
  const { state } = usePrototype();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const items = useMemo(() => {
    return state.content.faqs.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (q && !`${f.question} ${f.answer}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state.content.faqs, q, cat]);

  return (
    <>
      <PageHero title="Frequently asked questions" description="Search by topic. Answers distinguish verified facts from prototype behaviour." />
      <Container className="py-10">
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label="Search FAQ" />
          <Select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="all">All categories</option>
            <option value="employer">Employer</option>
            <option value="job-seeker">Job seeker</option>
            <option value="training">Training</option>
            <option value="documents">Documents</option>
          </Select>
        </div>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-white">
          {items.length === 0 ? (
            <div className="p-6">
              <EmptyState title="No matching questions" description="Try another keyword or category." />
            </div>
          ) : (
            items.map((f) => (
              <details key={f.id} className="px-5 py-4">
                <summary className="cursor-pointer font-medium text-navy">{f.question}</summary>
                <p className="mt-2 text-sm text-muted">{f.answer}</p>
              </details>
            ))
          )}
        </div>
      </Container>
    </>
  );
}
