"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { useMemo, useState } from "react";

export default function Page() {
  const { state } = usePrototype();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("");
  const rows = useMemo(() => {
    return state.candidates.filter((c) => {
      if (q && !`${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (skill && !c.profile.skills.join(" ").toLowerCase().includes(skill.toLowerCase())) return false;
      return true;
    });
  }, [state.candidates, q, skill]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Applicants</h1>
      <p className="mt-1 text-sm text-muted">Contact records from public applications. There is no applicant login.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" />
        <Input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill filter" />
      </div>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-canvas"><tr>{["Name","Email","City","Skills","Apps",""].map(h=> <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.profile.city || "—"}</td>
                <td className="p-3">{c.profile.skills.join(", ") || "—"}</td>
                <td className="p-3">{state.applications.filter((a) => a.candidateId === c.id).length}</td>
                <td className="p-3"><Button href={`/admin/candidates/${c.id}`} size="sm" variant="outline">Open</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
