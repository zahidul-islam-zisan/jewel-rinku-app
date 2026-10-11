"use client";

import { Input, Select } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { formatDateTime } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function Page() {
  const { state } = usePrototype();
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const rows = useMemo(() => {
    return [...state.audit]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((a) => {
        if (type && a.entityType !== type) return false;
        if (q && !`${a.action} ${a.actor}`.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      });
  }, [state.audit, q, type]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Activity logs</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All entities</option>
          <option value="job">job</option>
          <option value="inquiry">inquiry</option>
          <option value="application">application</option>
          <option value="interview">interview</option>
          <option value="document">document</option>
        </Select>
      </div>
      <ol className="mt-4 space-y-2">
        {rows.map((a) => (
          <li key={a.id} className="rounded-md border border-border bg-white p-3 text-sm">
            <p className="font-medium text-navy">{a.action}</p>
            <p className="text-muted">{a.actor} · {a.entityType} · {a.entityId} · {formatDateTime(a.createdAt)}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
