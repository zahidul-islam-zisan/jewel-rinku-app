"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDateTime } from "@/lib/utils";
import type { InterviewOutcome } from "@/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { state, store } = usePrototype();
  const [tab, setTab] = useState<"upcoming" | "past" | "agenda">("upcoming");
  const [edit, setEdit] = useState<string | null>(null);
  const rows = useMemo(() => {
    return state.interviews.filter((i) => {
      if (tab === "upcoming") return i.outcome === "scheduled";
      if (tab === "past") return i.outcome !== "scheduled";
      return true;
    });
  }, [state.interviews, tab]);
  const current = state.interviews.find((i) => i.id === edit);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Interviews</h1>
      <p className="text-sm text-muted">Scheduling is simulated. No invitations are sent.</p>
      <div className="mt-4 flex gap-2">
        {(["upcoming", "past", "agenda"] as const).map((t) => (
          <Button key={t} size="sm" variant={tab === t ? "navy" : "outline"} onClick={() => setTab(t)}>
            {t}
          </Button>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((i) => {
          const can = state.candidates.find((c) => c.id === i.candidateId);
          const job = state.jobs.find((j) => j.id === i.jobId);
          return (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-white p-3 text-sm">
              <div>
                <p className="font-medium text-navy">{can?.name} · {job?.title}</p>
                <p className="text-muted">{formatDateTime(i.scheduledAt)} · {i.type} · {i.interviewer}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{i.outcome}</Badge>
                <Button size="sm" variant="outline" onClick={() => setEdit(i.id)}>Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => { store.cancelInterview(i.id); toast.success("Cancelled"); }}>Cancel</Button>
              </div>
            </li>
          );
        })}
      </ul>
      <Dialog open={Boolean(current)} title="Edit interview" onClose={() => setEdit(null)}>
        {current ? (
          <div className="grid gap-3">
            <Input
              type="datetime-local"
              defaultValue={current.scheduledAt.slice(0, 16)}
              onBlur={(e) => store.updateInterview(current.id, { scheduledAt: new Date(e.target.value).toISOString() })}
            />
            <Select
              defaultValue={current.outcome}
              onChange={(e) => store.updateInterview(current.id, { outcome: e.target.value as InterviewOutcome })}
            >
              <option value="scheduled">scheduled</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
              <option value="no-show">no-show</option>
            </Select>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
