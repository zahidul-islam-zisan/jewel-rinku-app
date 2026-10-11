import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { company } from "@/lib/company";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employer services",
  description: "Workforce recruitment support for international employers engaging Jewel Rinku Enterprise.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Employers"
        title="Recruit qualified workers from Bangladesh"
        description="Describe the roles you need. Screening, assessment, and documentation follow your specification and applicable rules. Country-specific capacity should be confirmed with the office — it is not invented here."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-2">
        {[
          ["Workforce sourcing", "Search the local labour market against a written requirement."],
          ["Candidate screening", "CV review and interviews as agreed with the employer."],
          ["Skills assessment", "Trade tests or practical assessments when the employer requires them."],
          ["Recruitment coordination", "Documentation support from papers through deployment, as described by the managing director."],
        ].map(([t, b]) => (
          <Card key={t}>
            <CardBody>
              <h2 className="font-semibold text-navy">{t}</h2>
              <p className="mt-2 text-sm text-muted">{b}</p>
            </CardBody>
          </Card>
        ))}
      </Container>
      <Container className="pb-12">
        <h2 className="text-2xl font-semibold text-navy">Industries and categories in this prototype</h2>
        <p className="mt-2 text-sm text-muted">
          The current website lists several service sectors. Prototype job categories are examples until the business validates them.
        </p>
        <p className="mt-4 text-sm text-muted">
          Markets named in the published MD message: {company.destinationsNamed.join(", ")}.
        </p>
      </Container>
      <Container className="pb-12">
        <h2 className="text-2xl font-semibold text-navy">Typical employer documentation</h2>
        <p className="mt-2 text-sm text-muted">
          Exact papers depend on destination and current regulation. Common items include a demand letter, power of attorney, and employment terms. Confirm the live checklist with the agency — this page does not replace legal advice.
        </p>
        <Button href="/employers/request" className="mt-6">
          Submit Manpower Request
        </Button>
      </Container>
    </>
  );
}
