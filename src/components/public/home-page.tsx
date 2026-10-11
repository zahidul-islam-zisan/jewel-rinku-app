"use client";

import { Container } from "@/components/layout/container";
import { JobCard } from "@/components/public/job-card";
import { OfficeDirectionsLinks, OfficeMap } from "@/components/public/office-map";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/field";
import { company } from "@/lib/company";
import { images } from "@/lib/images";
import { filterJobs } from "@/lib/filter-jobs";
import { usePrototype } from "@/hooks/use-prototype";
import { Briefcase, ClipboardCheck, FileSearch, Globe, ShieldCheck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const steps = [
  { title: "Workforce requirements", body: "Employers describe roles, skills, and destination conditions." },
  { title: "Candidate sourcing", body: "The agency searches the local labour market against those requirements." },
  { title: "Screening and assessment", body: "CVs, interviews, and trade tests are organised as the employer specifies." },
  { title: "Documentation and approvals", body: "Papers follow Bangladesh rules and the country of employment. Timelines vary." },
  { title: "Deployment and coordination", body: "Travel and site placement are coordinated after required approvals exist." },
];

export function HomePage() {
  const { state } = usePrototype();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [dest, setDest] = useState("");

  const featured = useMemo(() => {
    const ids = new Set(state.content.featuredJobIds);
    const pool = filterJobs(state.jobs, {
      query: q,
      category: cat,
      destination: dest,
    });
    const preferred = pool.filter((j) => ids.has(j.id));
    return (preferred.length ? preferred : pool).slice(0, 4);
  }, [state.jobs, state.content.featuredJobIds, q, cat, dest]);

  const faqs = state.content.faqs.slice(0, 5);

  return (
    <div>
      <section className="bg-navy text-white">
        <Container className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-sm font-medium text-gold">Recruiting Licence No. {company.licenseNumber}</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {state.content.heroHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              {state.content.heroSupport}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/employers" size="lg">
                Hire Skilled Workers
              </Button>
              <Button href="/jobs" variant="gold" size="lg">
                Explore Job Opportunities
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="border-b border-border bg-white">
        <Container className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: "Government licence", body: `RL ${company.licenseNumber} published on the company website and listed with BAIRA.` },
            { icon: Globe, title: "Markets named publicly", body: "Saudi Arabia, Malaysia, UAE, and Qatar are named in the managing director’s published message." },
            { icon: ClipboardCheck, title: "Training centre", body: "A training centre is presented on the current website. Programme details should be confirmed directly." },
            { icon: Users, title: "Dhaka office", body: company.address },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              <div>
                <h2 className="text-sm font-semibold text-navy">{item.title}</h2>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </Container>
        <Container className="pb-8">
          <Link href="/licenses-and-credentials" className="text-sm font-medium text-teal hover:underline">
            View credentials
          </Link>
        </Container>
      </section>

      <section>
        <Container className="grid gap-6 py-14 md:grid-cols-2">
          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gold">For international employers</p>
              <h2 className="mt-2 text-2xl font-semibold text-navy">Workforce recruitment support</h2>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
                <li>Workforce sourcing</li>
                <li>Candidate screening</li>
                <li>Skills assessment</li>
                <li>Recruitment coordination</li>
              </ul>
              <Button href="/employers" className="mt-6">
                Explore Employer Services
              </Button>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gold">For job seekers</p>
              <h2 className="mt-2 text-2xl font-semibold text-navy">Overseas employment guidance</h2>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
                <li>Job discovery</li>
                <li>Eligibility guidance</li>
                <li>Application instructions</li>
                <li>Recruitment support</li>
              </ul>
              <Button href="/jobs" className="mt-6" variant="navy">
                Find Job Opportunities
              </Button>
            </CardBody>
          </Card>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-navy">Featured job opportunities</h2>
              <p className="mt-2 text-sm text-muted">Demo vacancies for this prototype — not live offers.</p>
            </div>
            <Button href="/jobs" variant="outline">
              View all jobs
            </Button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Input
              placeholder="Search demo vacancies"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search jobs"
            />
            <Select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
              <option value="">All categories</option>
              {state.categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select value={dest} onChange={(e) => setDest(e.target.value)} aria-label="Destination">
              <option value="">All destinations</option>
              {company.destinationsNamed.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featured.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                category={state.categories.find((c) => c.slug === job.categorySlug)}
              />
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-semibold text-navy">Employer recruitment process</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-5">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="text-sm font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={images.training.src} alt={images.training.alt} fill className="object-cover" sizes="50vw" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-navy">Training centre</h2>
            <p className="mt-3 text-muted">{company.trainingIntro}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {state.courses.map((c) => (
                <span key={c.id} className="rounded-md border border-border px-3 py-1">
                  {c.title}
                </span>
              ))}
            </div>
            <Button href="/training-center" className="mt-6" variant="outline">
              View training programmes
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-semibold text-navy">Why work with a licensed agency</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: FileSearch, t: "Transparent process", b: "Requirements, documents, and destination rules should be explained without guaranteed outcomes." },
              { icon: ClipboardCheck, t: "Structured screening", b: "CV review, interviews, and trade tests follow the employer’s specification." },
              { icon: Briefcase, t: "Clear communication", b: "Employers and candidates should know which stage they are in and which approvals remain." },
            ].map((x) => (
              <Card key={x.t}>
                <CardBody>
                  <x.icon className="h-5 w-5 text-teal" />
                  <h3 className="mt-3 font-semibold text-navy">{x.t}</h3>
                  <p className="mt-2 text-sm text-muted">{x.b}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-navy">Company overview</h2>
            <p className="mt-3 text-muted">{company.managingDirectorQuote}</p>
            <p className="mt-3 text-sm text-muted">— Md. Rezaul Karim, Managing Director</p>
            <Button href="/about-us" className="mt-6">
              Learn About Our Company
            </Button>
          </div>
          <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-lg bg-canvas">
            <Image src={images.mdPortrait.src} alt={images.mdPortrait.alt} fill className="object-contain object-top" sizes="50vw" />
          </div>
        </Container>
      </section>

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-semibold text-navy">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-white">
            {faqs.map((f) => (
              <details key={f.id} className="px-5 py-4">
                <summary className="cursor-pointer font-medium text-navy">{f.question}</summary>
                <p className="mt-2 text-sm text-muted">{f.answer}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="mt-4 inline-block text-sm font-medium text-teal hover:underline">
            Open the full FAQ
          </Link>
        </Container>
      </section>

      <section className="bg-white py-14">
        <Container>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-navy">Find the office</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted">{company.address}</p>
            </div>
            <OfficeDirectionsLinks />
          </div>
          <OfficeMap />
        </Container>
      </section>

      <section className="bg-navy py-14 text-white">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Ready to talk?</h2>
            <p className="mt-2 max-w-xl text-white/75">
              Employers can discuss workforce requirements. Job seekers can review application guidance. Prototype forms are not delivered to the company.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/employers/request">Discuss Workforce Requirements</Button>
            <Button href="/job-seeker-guide" variant="gold">
              Get Job Application Guidance
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
