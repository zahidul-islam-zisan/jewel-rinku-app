import { Container, PageHero } from "@/components/layout/container";
import { Card, CardBody } from "@/components/ui/card";
import { company } from "@/lib/company";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Licences and credentials" };

export default function Page() {
  return (
    <>
      <PageHero
        title="Licences and credentials"
        description="Only publicly listed information is shown. Certificate scans are not fabricated."
      />
      <Container className="grid gap-4 py-12 md:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">Recruiting licence</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">Number</dt><dd>{company.licenseNumber}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Title</dt><dd>Recruiting Licence</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Listed as</dt><dd>Jewel Rinku Enterprise / Limited</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">Validity</dt><dd>Confirm with the issuing authority — not displayed here</dd></div>
            </dl>
            <p className="mt-4 text-xs text-muted">Sources: current company website and BAIRA member listing.</p>
            <div className="mt-4 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted">
              Licence document preview unavailable — authentic file not supplied for this prototype.
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">BAIRA membership listing</h2>
            <p className="mt-2 text-sm text-muted">{company.membership}</p>
            <p className="mt-2 text-sm text-muted">Contact person listed: Md. Rezaul Karim, Managing Director.</p>
            <p className="mt-4 text-xs text-muted">
              Verify at the BAIRA directory. Membership status can change; this prototype does not poll live registries.
            </p>
            <div className="mt-4 rounded-md border border-dashed border-border p-6 text-center text-sm text-muted">
              Certificate / membership card placeholder — no official logo reproduced.
            </div>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}
