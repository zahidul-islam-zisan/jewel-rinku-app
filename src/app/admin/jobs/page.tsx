"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { effectiveJobStatus, jobStatusLabel } from "@/lib/status-rules";
import { formatDate } from "@/lib/utils";
import { paginate } from "@/lib/filter-jobs";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function JobsInner() {
  const { state, store } = usePrototype();
  const q0 = useSearchParams().get("q") ?? "";
  const [q, setQ] = useState(q0);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return state.jobs.filter((j) => {
      const st = effectiveJobStatus(j);
      if (status && st !== status) return false;
      if (q && !`${j.title} ${j.destination}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state.jobs, q, status]);
  const result = paginate(filtered, page, 8);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-navy">Jobs</h1>
        <Button href="/admin/jobs/new">New vacancy</Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search" />
        <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Open</option>
          <option value="closed">Closed</option>
          <option value="expired">Expired</option>
        </Select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-canvas text-muted">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Destination</th>
              <th className="p-3">Status</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((j) => {
              const st = effectiveJobStatus(j);
              return (
                <tr key={j.id} className="border-t border-border">
                  <td className="p-3">{j.title}</td>
                  <td className="p-3">{j.destination}</td>
                  <td className="p-3">
                    <Badge>{jobStatusLabel(st)}</Badge>
                  </td>
                  <td className="p-3">{formatDate(j.deadline)}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <Button href={`/admin/jobs/${j.id}/edit`} size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button href={`/jobs/${j.slug}`} size="sm" variant="ghost">
                        Preview
                      </Button>
                      {j.status !== "published" ? (
                        <Button size="sm" variant="ghost" onClick={() => { store.setJobStatus(j.id, "published"); toast.success("Published"); }}>
                          Publish
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => { store.setJobStatus(j.id, "closed"); toast.success("Closed"); }}>
                          Close
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => store.duplicateJob(j.id)}>
                        Duplicate
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirm(j.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" disabled={result.page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <Button size="sm" variant="outline" disabled={result.page >= result.pages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
      <ConfirmDialog
        open={Boolean(confirm)}
        title="Delete vacancy?"
        message="This removes the demo vacancy from the shared store."
        danger
        confirmLabel="Delete"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) store.deleteJob(confirm);
          toast.success("Deleted");
        }}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <JobsInner />
    </Suspense>
  );
}
