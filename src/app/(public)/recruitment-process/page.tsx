import { Container, PageHero } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Recruitment process" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Recruitment workflow"
        description="General stages. Country-specific approvals are different and must be confirmed for each demand."
      />
      <Container className="grid gap-8 py-12 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold text-navy">Employer responsibilities</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Issue a clear workforce requirement.</li>
            <li>Provide documents required by Bangladesh and the destination.</li>
            <li>Confirm selection after screening and tests.</li>
            <li>Honour employment terms offered to selected workers.</li>
          </ol>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-navy">Candidate responsibilities</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Provide accurate skills and experience information.</li>
            <li>Attend interviews and assessments when invited.</li>
            <li>Complete medicals and papers when requested through a legitimate process.</li>
            <li>Review the contract before departure.</li>
          </ol>
        </section>
      </Container>
    </>
  );
}
