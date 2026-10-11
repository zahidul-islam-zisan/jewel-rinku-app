"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { applicationStatusLabel } from "@/lib/status-rules";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { state, store } = usePrototype();
  const c = state.candidates.find((x) => x.id === id);
  const [editedNotes, setEditedNotes] = useState<string | null>(null);
  if (!c) return <EmptyState title="Candidate not found" description="Unknown id." action={<Button href="/admin/candidates">Back</Button>} />;
  const notes = editedNotes ?? c.notes;
  const setNotes = (value: string) => setEditedNotes(value);
  const apps = state.applications.filter((a) => a.candidateId === c.id);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-navy">{c.name}</h1>
      <p className="text-sm text-muted">{c.email} · {c.phone} · prototype record</p>
      <p className="mt-4 text-sm">Skills: {c.profile.skills.join(", ") || "—"}</p>
      <p className="text-sm">Experience: {c.profile.experience || "—"}</p>
      <p className="text-sm">Education: {c.profile.education || "—"}</p>
      <h2 className="mt-6 font-semibold">Applications</h2>
      <ul className="mt-2 space-y-1 text-sm">
        {apps.map((a) => {
          const job = state.jobs.find((j) => j.id === a.jobId);
          return (
            <li key={a.id}>
              <Link className="text-teal" href={`/admin/applications/${a.id}`}>
                {a.reference} · {job?.title} · {applicationStatusLabel(a.status)}
              </Link>
            </li>
          );
        })}
      </ul>
      <Textarea className="mt-4" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button
        className="mt-2"
        onClick={() => {
          store.updateCandidateNotes(c.id, notes);
          toast.success("Notes saved in the prototype store.");
        }}
      >
        Save notes
      </Button>
    </div>
  );
}
