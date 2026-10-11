"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { applicationStatusLabel } from "@/lib/status-rules";
import { downloadText, formatDate, toCsv } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function Page() {
  const { state } = usePrototype();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [dest, setDest] = useState("");

  const rows = useMemo(() => {
    return state.applications.filter((a) => {
      const job = state.jobs.find((j) => j.id === a.jobId);
      const can = state.candidates.find((c) => c.id === a.candidateId);
      if (status && a.status !== status) return false;
      if (jobId && a.jobId !== jobId) return false;
      if (dest && job?.destination !== dest) return false;
      if (q && !`${job?.title} ${can?.name} ${a.reference}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state, q, status, jobId, dest]);

  function exportCsv() {
    downloadText(
      "applications-demo.csv",
      toCsv(
        rows.map((a) => {
          const job = state.jobs.find((j) => j.id === a.jobId);
          const can = state.candidates.find((c) => c.id === a.candidateId);
          return {
            reference: a.reference,
            candidate: can?.name ?? "",
            vacancy: job?.title ?? "",
            destination: job?.destination ?? "",
            status: a.status,
            submitted: a.submittedAt,
          };
        }),
      ),
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-navy">Applications</h1>
        <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {["submitted","under-review","shortlisted","interview-scheduled","assessment-required","documents-pending","approved-next-stage","rejected","withdrawn"].map(s => <option key={s}>{s}</option>)}
        </Select>
        <Select value={jobId} onChange={(e) => setJobId(e.target.value)}>
          <option value="">All vacancies</option>
          {state.jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </Select>
        <Select value={dest} onChange={(e) => setDest(e.target.value)}>
          <option value="">All destinations</option>
          {[...new Set(state.jobs.map((j) => j.destination))].map((d) => <option key={d}>{d}</option>)}
        </Select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-canvas text-muted">
            <tr>{["Ref","Candidate","Vacancy","Destination","Status","Date",""].map(h => <th key={h} className="p-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const job = state.jobs.find((j) => j.id === a.jobId);
              const can = state.candidates.find((c) => c.id === a.candidateId);
              return (
                <tr key={a.id} className="border-t border-border">
                  <td className="p-3">{a.reference}</td>
                  <td className="p-3">{can?.name}</td>
                  <td className="p-3">{job?.title}</td>
                  <td className="p-3">{job?.destination}</td>
                  <td className="p-3"><Badge>{applicationStatusLabel(a.status)}</Badge></td>
                  <td className="p-3">{formatDate(a.submittedAt)}</td>
                  <td className="p-3"><Button href={`/admin/applications/${a.id}`} size="sm" variant="outline">Open</Button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
