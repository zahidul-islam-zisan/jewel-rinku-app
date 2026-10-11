"use client";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { DemoBanner } from "@/components/ui/empty";
import { usePrototype } from "@/hooks/use-prototype";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { store } = usePrototype();
  const [open, setOpen] = useState(false);
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-navy">Settings</h1>
      <DemoBanner>
        These controls affect the local prototype only. They are not production security settings.
      </DemoBanner>
      <section className="mt-6 rounded-lg border border-border bg-white p-4">
        <h2 className="font-semibold">Demo staff access</h2>
        <p className="mt-2 text-sm text-muted">
          Applicants do not log in. They submit a job form; staff contact them manually.
          <br />
          Admin: admin@demo.jewelrinku.local / demo1234
        </p>
      </section>
      <section className="mt-4 rounded-lg border border-border bg-white p-4">
        <h2 className="font-semibold">Recruitment categories</h2>
        <p className="mt-2 text-sm text-muted">Prototype categories are defined in seed data and can be replaced when connecting a backend.</p>
      </section>
      <section className="mt-4 rounded-lg border border-error/30 bg-white p-4">
        <h2 className="font-semibold text-error">Reset demo data</h2>
        <p className="mt-2 text-sm text-muted">Restores the original seed dataset in this browser.</p>
        <Button className="mt-3" variant="danger" onClick={() => setOpen(true)}>
          Reset demo data
        </Button>
      </section>
      <ConfirmDialog
        open={open}
        title="Reset demo data?"
        message="All locally stored prototype changes will be discarded."
        danger
        confirmLabel="Reset"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          store.resetDemo();
          toast.success("Demo data restored.");
        }}
      />
    </div>
  );
}
