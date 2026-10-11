import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Job seeker guide" };

const steps = [
  ["Discover a legitimate vacancy", "Use licensed agencies and written vacancy details. Listings on this prototype are demo records only."],
  ["Eligibility checks", "Compare your skills, documents, and health with the vacancy. Requirements vary by destination."],
  ["Application submission", "Open a vacancy and send your name, phone, and email. There is no applicant dashboard. Office staff will contact you if they proceed."],
  ["Interviews and skills assessments", "Employers may request interviews or trade tests. Attendance does not guarantee selection."],
  ["Required documents", "Typical items include a CV and trade certificates. Identity documents belong in a secure production process, not localStorage."],
  ["Medical and other approvals", "Medicals and destination approvals, where required, are separate from this website."],
  ["Contract review", "Read employment terms before signing. Ask questions about wages, hours, and accommodation."],
  ["Pre-departure steps", "Briefings, tickets, and remaining papers happen only after approvals exist. Timelines are not universal."],
  ["Contact and support", "Use published phone and email. This prototype does not send messages to the office."],
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Job seekers"
        title="Guidance for overseas employment"
        description="This is educational information. It does not guarantee a job, visa, or timeline. Actual requirements vary by vacancy and destination."
      />
      <Container className="space-y-6 py-12">
        {steps.map(([t, b], i) => (
          <section key={t} className="rounded-lg border border-border bg-white p-5">
            <h2 className="font-semibold text-navy">
              {i + 1}. {t}
            </h2>
            <p className="mt-2 text-sm text-muted">{b}</p>
          </section>
        ))}
        <Button href="/jobs">Browse demo vacancies</Button>
      </Container>
    </>
  );
}
