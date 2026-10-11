"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { applicationStatusLabel, applicationTransitions, importantTransition } from "@/lib/status-rules";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus, InterviewType } from "@/types";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const { state, store } = usePrototype();
  const app = state.applications.find((a) => a.id === id);
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState<ApplicationStatus | "">("");
  const [confirm, setConfirm] = useState(false);
  const [iv, setIv] = useState(false);
  const [ivForm, setIvForm] = useState({ interviewer: "Rashida Khan", type: "video" as InterviewType, scheduledAt: "" });

  if (!app) {
    return <EmptyState title="Application not found" description="Unknown id." action={<Button href="/admin/applications">Back</Button>} />;
  }
  const job = state.jobs.find((j) => j.id === app.jobId);
  const can = state.candidates.find((c) => c.id === app.candidateId);
  const allowed = applicationTransitions[app.status];

  function applyStatus() {
    if (!nextStatus || !app) return;
    try {
      store.updateApplicationStatus(app.id, nextStatus, note || `Status set to ${nextStatus}`);
      toast.success("Status updated");
      setNextStatus("");
      setNote("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid transition");
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-navy">{can?.name}</h1>
      <p className="text-sm text-muted">{app.reference} · {job?.title} · {job?.destination}</p>
      <Badge className="mt-3">{applicationStatusLabel(app.status)}</Badge>
      <p className="mt-4 text-sm">{app.coverNote}</p>
      <h2 className="mt-8 font-semibold">Timeline</h2>
      <ol className="mt-3 space-y-2 text-sm">
        {app.events.map((ev) => (
          <li key={ev.id} className="border-l-2 border-teal pl-3">
            {applicationStatusLabel(ev.status)} — {ev.note} ({ev.actor}, {formatDate(ev.createdAt)})
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-3 rounded-lg border border-border bg-white p-4">
        <Label htmlFor="st">Next status</Label>
        <Select id="st" value={nextStatus} onChange={(e) => setNextStatus(e.target.value as ApplicationStatus)}>
          <option value="">Select permitted transition</option>
          {allowed.map((s) => (
            <option key={s} value={s}>{applicationStatusLabel(s)}</option>
          ))}
        </Select>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
        <Button
          type="button"
          onClick={() => {
            if (nextStatus && importantTransition(nextStatus)) setConfirm(true);
            else applyStatus();
          }}
        >
          Update status
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!note) return;
            store.addApplicationNote(app.id, note);
            toast.success("Note added");
            setNote("");
          }}
        >
          Add internal note
        </Button>
        <Button type="button" variant="ghost" onClick={() => setIv(true)}>Schedule interview</Button>
      </div>
      <ConfirmDialog
        open={confirm}
        title="Confirm status change"
        message="This is an important status change. In production, staff would contact the applicant manually."
        onClose={() => setConfirm(false)}
        onConfirm={applyStatus}
      />
      <Dialog open={iv} title="Schedule interview (simulated)" onClose={() => setIv(false)}>
        <div className="grid gap-3">
          <Input value={ivForm.interviewer} onChange={(e) => setIvForm({ ...ivForm, interviewer: e.target.value })} />
          <Select value={ivForm.type} onChange={(e) => setIvForm({ ...ivForm, type: e.target.value as InterviewType })}>
            <option value="phone">phone</option>
            <option value="video">video</option>
            <option value="in-person">in-person</option>
            <option value="skills-assessment">skills-assessment</option>
          </Select>
          <Input type="datetime-local" value={ivForm.scheduledAt} onChange={(e) => setIvForm({ ...ivForm, scheduledAt: e.target.value })} />
          <Button
            onClick={() => {
              if (!ivForm.scheduledAt) return;
              store.scheduleInterview({
                applicationId: app.id,
                candidateId: app.candidateId,
                jobId: app.jobId,
                interviewer: ivForm.interviewer,
                type: ivForm.type,
                scheduledAt: new Date(ivForm.scheduledAt).toISOString(),
                outcome: "scheduled",
                notes: "Simulated — no invitation sent",
              });
              toast.success("Interview stored locally. No email was sent.");
              setIv(false);
            }}
          >
            Save
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
