"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { state, store } = usePrototype();
  const [reject, setReject] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Document review</h1>
      <p className="text-sm text-muted">All files are simulated. No production repository exists.</p>
      <ul className="mt-4 space-y-2">
        {state.documents.map((d) => {
          const can = state.candidates.find((c) => c.id === d.candidateId);
          return (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-white p-3 text-sm">
              <div>
                <p className="font-medium">{d.fileName}</p>
                <p className="text-muted">{can?.name} · {d.type} · {formatDate(d.uploadedAt)} {d.expiresAt ? `· expires ${formatDate(d.expiresAt)}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={d.reviewStatus === "approved" ? "success" : d.reviewStatus === "rejected" ? "error" : "warning"}>{d.reviewStatus}</Badge>
                <Button size="sm" variant="outline" onClick={() => { store.reviewDocument(d.id, "approved"); toast.success("Approved"); }}>Approve</Button>
                <Button size="sm" variant="ghost" onClick={() => setReject(d.id)}>Reject</Button>
              </div>
            </li>
          );
        })}
      </ul>
      <ConfirmDialog
        open={Boolean(reject)}
        title="Reject document?"
        message="Provide a reason. This is a simulated review."
        danger
        onClose={() => setReject(null)}
        onConfirm={() => {
          if (reject) store.reviewDocument(reject, "rejected", reason || "Rejected in demo");
          setReason("");
        }}
      />
      {reject ? (
        <Input className="mt-3 max-w-md" placeholder="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      ) : null}
    </div>
  );
}
