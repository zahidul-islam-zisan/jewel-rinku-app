import { Container, PageHero } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { company } from "@/lib/company";
import { images } from "@/lib/images";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About us",
  description: "About Jewel Rinku Enterprise, Govt. Approved Recruiting Agency License # RL-1776.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Jewel Rinku Enterprise"
        description="Govt. Approved Recruiting Agency License # RL-1776"
      />
      <Container className="grid gap-10 py-12 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <Image src={images.about.src} alt={images.about.alt} fill className="object-cover" priority sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-navy">Govt. Approved Recruiting Agency License # RL-1776</h2>
          <p className="mt-4 text-muted">{company.vision}</p>
          <p className="mt-4 text-muted">{company.aboutIntro}</p>
        </div>
      </Container>
      <Container className="grid gap-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {company.milestones.map((m) => (
          <Card key={m.year}>
            <CardBody>
              <p className="text-sm font-semibold text-gold">{m.year}</p>
              <h3 className="mt-1 font-semibold text-navy">{m.title}</h3>
              <p className="mt-1 text-sm text-muted">{m.note}</p>
            </CardBody>
          </Card>
        ))}
      </Container>
      <Container className="grid gap-8 pb-12 md:grid-cols-2 md:items-start">
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>{company.aboutOffice}</p>
          <p>{company.aboutMarkets}</p>
          <p>{company.aboutMembership}</p>
          <p>{company.aboutStaff}</p>
          <p>{company.aboutBriefing}</p>
        </div>
        <div className="relative min-h-[320px] overflow-hidden rounded-lg md:min-h-[480px]">
          <Image src={images.officeBuilding.src} alt={images.officeBuilding.alt} fill className="object-cover" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
      </Container>
      <Container className="grid gap-6 pb-12 md:grid-cols-2">
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">Mission</h2>
            <p className="mt-2 text-sm text-muted">{company.mission}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h2 className="font-semibold text-navy">Vision</h2>
            <p className="mt-2 text-sm text-muted">{company.vision}</p>
          </CardBody>
        </Card>
      </Container>
      <Container className="pb-12">
        <h2 className="text-2xl font-semibold text-navy">Leading experts</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {company.leadership.map((p) => (
            <Card key={p.name} className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-canvas">
                <Image src={p.photo} alt={`${p.name} — ${p.title}`} fill className="object-cover object-top" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
              </div>
              <CardBody>
                <h3 className="font-semibold text-navy">{p.name}</h3>
                <p className="mt-1 text-sm text-teal">{p.title}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </Container>
      <Container className="pb-12">
        <h2 className="text-2xl font-semibold text-navy">Office and training centre</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {images.gallery.slice(0, 8).map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </Container>
      <Container className="pb-16">
        <h2 className="text-2xl font-semibold text-navy">Why choose our company services?</h2>
        <p className="mt-3 max-w-3xl text-muted">{company.whyChoose}</p>
        <div className="mt-8 flex gap-3">
          <Button href="/licenses-and-credentials">Licences and credentials</Button>
          <Button href="/contact" variant="outline">
            Contact
          </Button>
        </div>
      </Container>
    </>
  );
}
