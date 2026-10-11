"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrototype } from "@/hooks/use-prototype";
import { toast } from "sonner";

export default function Page() {
  const { state, store } = usePrototype();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Training</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {state.courses.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex justify-between">
              <h2 className="font-semibold text-navy">{c.title}</h2>
              <Badge>{c.status}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">{c.summary}</p>
            <p className="mt-2 text-xs">{c.duration} · {c.category}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-8 font-semibold text-navy">Enrolment inquiries</h2>
      <ul className="mt-3 space-y-2">
        {state.trainingInquiries.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-md border border-border bg-white p-3 text-sm">
            <span>{t.name} · {state.courses.find((c) => c.id === t.courseId)?.title} · {t.status}</span>
            {t.status === "new" ? (
              <Button size="sm" variant="outline" onClick={() => { store.updateTrainingInquiry(t.id, "reviewed"); toast.success("Marked reviewed"); }}>
                Mark reviewed
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
