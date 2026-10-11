"use client";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { toast } from "sonner";
import { useState } from "react";

export default function Page() {
  const { state, store } = usePrototype();
  const [form, setForm] = useState(state.content);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy">Website content</h1>
      <p className="text-sm text-muted">Changes appear on the public prototype immediately after save.</p>
      <div className="mt-4 grid gap-3">
        <div>
          <Label htmlFor="an">Announcement</Label>
          <Textarea id="an" value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} />
        </div>
        <label className="text-sm">
          <input type="checkbox" checked={form.announcementEnabled} onChange={(e) => setForm({ ...form, announcementEnabled: e.target.checked })} /> Enabled
        </label>
        <div>
          <Label htmlFor="hh">Hero headline</Label>
          <Input id="hh" value={form.heroHeadline} onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="hs">Hero support</Label>
          <Textarea id="hs" value={form.heroSupport} onChange={(e) => setForm({ ...form, heroSupport: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="em">Footer email</Label>
          <Input id="em" value={form.footerEmail} onChange={(e) => setForm({ ...form, footerEmail: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="ph">Footer phone</Label>
          <Input id="ph" value={form.footerPhone} onChange={(e) => setForm({ ...form, footerPhone: e.target.value })} />
        </div>
        <Button
          onClick={() => {
            store.updateContent(form);
            toast.success("Public content updated in this browser.");
          }}
        >
          Save content
        </Button>
      </div>
    </div>
  );
}
