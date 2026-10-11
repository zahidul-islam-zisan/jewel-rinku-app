"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { paginate } from "@/lib/filter-jobs";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { state, store } = usePrototype();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [edit, setEdit] = useState<string | "new" | null>(null);
  const [del, setDel] = useState<string | null>(null);
  const current = state.employers.find((e) => e.id === edit);
  const [form, setForm] = useState({ companyName: "", country: "", contactName: "", email: "", phone: "", notes: "" });

  const filtered = useMemo(
    () => state.employers.filter((e) => `${e.companyName} ${e.country}`.toLowerCase().includes(q.toLowerCase())),
    [state.employers, q],
  );
  const result = paginate(filtered, page, 6);

  function open(id: string | "new") {
    if (id === "new") setForm({ companyName: "", country: "", contactName: "", email: "", phone: "", notes: "" });
    else {
      const e = state.employers.find((x) => x.id === id)!;
      setForm({ companyName: e.companyName, country: e.country, contactName: e.contactName, email: e.email, phone: e.phone, notes: e.notes });
    }
    setEdit(id);
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-navy">Employers</h1>
        <Button onClick={() => open("new")}>Add employer</Button>
      </div>
      <Input className="mt-4 max-w-sm" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
      <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-canvas"><tr>{["Company","Country","Contact","Email",""].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {result.items.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="p-3">{e.companyName}</td>
                <td className="p-3">{e.country}</td>
                <td className="p-3">{e.contactName}</td>
                <td className="p-3">{e.email}</td>
                <td className="p-3">
                  <Button size="sm" variant="outline" onClick={() => open(e.id)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => setDel(e.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" disabled={result.page<=1} onClick={() => setPage(p=>p-1)}>Previous</Button>
        <Button size="sm" variant="outline" disabled={result.page>=result.pages} onClick={() => setPage(p=>p+1)}>Next</Button>
      </div>
      <Dialog open={Boolean(edit)} title={edit === "new" ? "Create employer" : "Edit employer"} onClose={() => setEdit(null)}>
        <div className="grid gap-3">
          {(["companyName","country","contactName","email","phone"] as const).map((k) => (
            <div key={k}>
              <Label htmlFor={k}>{k}</Label>
              <Input id={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button
            onClick={() => {
              store.upsertEmployer({ id: edit === "new" ? undefined : current?.id, ...form });
              toast.success("Saved");
              setEdit(null);
            }}
          >
            Save
          </Button>
        </div>
      </Dialog>
      <ConfirmDialog
        open={Boolean(del)}
        title="Delete employer?"
        message="Remove this demo employer record."
        danger
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (del) store.deleteEmployer(del);
        }}
      />
    </div>
  );
}
