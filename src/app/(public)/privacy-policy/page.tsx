import { Container, PageHero } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy policy (draft)" };

export default function Page() {
  return (
    <>
      <PageHero title="Privacy policy" description="Draft for legal review. This prototype does not claim regulatory compliance." />
      <Container className="prose prose-slate max-w-3xl py-12 text-sm text-muted">
        <p>This website currently operates as a frontend prototype. Form entries, demo accounts, and document file names are stored in your browser (localStorage). They are not transmitted to a company server.</p>
        <p className="mt-4">Do not enter real passport numbers, national ID images, or other sensitive identity documents. A future production system would need a privacy notice, lawful basis, retention limits, and secure storage before collecting such data.</p>
        <p className="mt-4">Published contact details may be used to reach the office by phone or email outside this prototype.</p>
      </Container>
    </>
  );
}
