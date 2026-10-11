"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { DemoBanner } from "@/components/ui/empty";
import { FieldError, Input, Label } from "@/components/ui/field";
import { usePrototype } from "@/hooks/use-prototype";
import { loginSchema } from "@/lib/validation/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { store } = usePrototype();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    if (email === "admin@demo.jewelrinku.local" && password === "demo1234") {
      store.demoLoginAdmin();
      toast.success("Admin demo workspace opened. Authentication is simulated.");
      router.push("/admin/dashboard");
      return;
    }
    setErrors({ password: "Use admin@demo.jewelrinku.local / demo1234 or the demo button." });
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-canvas p-6">
      <Card className="w-full max-w-md">
        <CardBody>
          <h1 className="text-xl font-semibold text-navy">Staff sign in</h1>
          <DemoBanner>Simulated access. admin@demo.jewelrinku.local / demo1234</DemoBanner>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FieldError>{errors.email}</FieldError>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <FieldError>{errors.password}</FieldError>
            </div>
            <Button type="submit">Sign in</Button>
            <Button
              type="button"
              variant="navy"
              data-testid="demo-admin"
              onClick={() => {
                store.demoLoginAdmin();
                router.push("/admin/dashboard");
              }}
            >
              Enter admin demo
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
