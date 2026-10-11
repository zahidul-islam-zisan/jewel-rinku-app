"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDate } from "@/lib/utils";
import type { InquiryPriority, InquiryStatus } from "@/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const statuses: InquiryStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal-in-progress",
  "converted",
  "closed",
];

export default function Page() {
  const { state, store } = usePrototype();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const inquiry = state.inquiries.find((i) => i.id === open);

  const rows = useMemo(() => {
    return state.inquiries.filter((i) => {
      if (status && i.status !== status) return false;
      if (q && !`${i.companyName} ${i.reference} ${i.country}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [state.inquiries, q, status]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Employer inquiries</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-canvas text-muted">
            <tr>
              {["Ref", "Company", "Country", "Contact", "Qty", "Category", "Date", "Owner", "Priority", "Status", ""].map((h) => (
                <th key={h} className="p-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((i) => (
              <tr key={i.id} className="border-t border-border">
                <td className="p-3">{i.reference}</td>
                <td className="p-3">{i.companyName}</td>
                <td className="p-3">{i.country}</td>
                <td className="p-3">{i.contactName}</td>
                <td className="p-3">{i.workersNeeded}</td>
                <td className="p-3">{i.jobCategorySlug}</td>
                <td className="p-3">{formatDate(i.createdAt)}</td>
                <td className="p-3">{i.assignedTo}</td>
                <td className="p-3"><Badge>{i.priority}</Badge></td>
                <td className="p-3"><Badge tone="teal">{i.status}</Badge></td>
                <td className="p-3"><Button size="sm" variant="outline" onClick={() => setOpen(i.id)}>Manage</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={Boolean(inquiry)} title={inquiry?.reference ?? ""} onClose={() => setOpen(null)}>
        {inquiry ? (
          <div className="grid gap-3 text-sm">
            <p>{inquiry.description}</p>
            <div>
              <Label htmlFor="st">Status</Label>
              <Select
                id="st"
                value={inquiry.status}
                onChange={(e) => {
                  store.updateInquiry(inquiry.id, { status: e.target.value as InquiryStatus });
                  toast.success("Status updated");
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="pr">Priority</Label>
              <Select
                id="pr"
                value={inquiry.priority}
                onChange={(e) => store.updateInquiry(inquiry.id, { priority: e.target.value as InquiryPriority })}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="as">Assigned to</Label>
              <Input
                id="as"
                defaultValue={inquiry.assignedTo}
                onBlur={(e) => store.updateInquiry(inquiry.id, { assignedTo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="no">Notes</Label>
              <Textarea
                id="no"
                defaultValue={inquiry.notes}
                onBlur={(e) => store.updateInquiry(inquiry.id, { notes: e.target.value })}
              />
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
