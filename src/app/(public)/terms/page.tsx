import { Container, PageHero } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms (draft)" };

export default function Page() {
  return (
    <>
      <PageHero title="Website terms" description="Draft terms for this prototype. Not a production contract." />
      <Container className="max-w-3xl space-y-4 py-12 text-sm text-muted">
        <p>Content on this site includes demonstration vacancies and simulated applications. They are not offers of employment.</p>
        <p>Nothing here guarantees a visa, job, or recruitment timeline.</p>
        <p>Use of demo logins is for evaluation only. Simulated authentication is not security.</p>
        <p>Replace this page with counsel-reviewed terms before public launch.</p>
      </Container>
    </>
  );
}
