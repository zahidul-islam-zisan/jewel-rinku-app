import { Container, PageHero } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Operation flow" };

const stages = [
  { t: "Demand received", d: "Employer requirement and papers are logged. Status: new inquiry." },
  { t: "Sourcing", d: "Candidates are identified against the demand. Status: sourcing." },
  { t: "Verification", d: "Skills, interviews, and trade tests as specified. Status: assessment." },
  { t: "Approvals", d: "Medicals, visas, and other destination steps — these depend on the country. Status: pending approvals." },
  { t: "Deployment", d: "Travel and site placement after required approvals exist. Status: deployed / coordinated." },
];

export default function Page() {
  return (
    <>
      <PageHero
        title="Operational recruitment flow"
        description="A general operations view. It is not a promise of duration or of any specific country’s visa process."
      />
      <Container className="py-12">
        <ol className="space-y-4">
          {stages.map((s, i) => (
            <li key={s.t} className="rounded-lg border border-border bg-white p-5">
              <p className="text-sm text-gold">Stage {i + 1}</p>
              <h2 className="font-semibold text-navy">{s.t}</h2>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
