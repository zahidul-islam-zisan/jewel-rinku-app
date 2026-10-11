import { Container } from "@/components/layout/container";
import { company } from "@/lib/company";
import { images } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-navy text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Image
            src={images.logoWhite.src}
            alt={images.logoWhite.alt}
            width={420}
            height={133}
            className="h-14 w-auto object-contain object-left"
            quality={100}
          />
          <p className="mt-3 text-sm text-white/70">
            Efficient and experienced Manpower Recruiting Agency in Bangladesh. License # {company.licenseNumber}.
          </p>
          <p className="mt-3 text-sm text-white/70">{company.address}</p>
          <p className="mt-3 flex flex-wrap gap-4 text-sm text-white/80">
            <a href={company.mapOpenUrl} target="_blank" rel="noreferrer">
              Office map
            </a>
            <a href={company.mapDirectionsUrl} target="_blank" rel="noreferrer">
              Directions
            </a>
          </p>
          <p className="mt-3 flex gap-4 text-sm text-white/80">
            <a href="https://www.facebook.com/jewelrinku1776" rel="noreferrer">Facebook</a>
            <a href="https://www.youtube.com/@amintechnicaltrainingcente2560" rel="noreferrer">Youtube</a>
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/about-us">About us</Link></li>
            <li><Link href="/licenses-and-credentials">Licences & credentials</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Employers</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/employers">Employer services</Link></li>
            <li><Link href="/employers/request">Manpower request</Link></li>
            <li><Link href="/operation-flow">Operation flow</Link></li>
            <li><Link href="/recruitment-process">Recruitment process</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">Job seekers</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/jobs">Job opportunities</Link></li>
            <li><Link href="/job-categories">Job categories</Link></li>
            <li><Link href="/job-seeker-guide">Job seeker guide</Link></li>
            <li><Link href="/training-center">Training centre</Link></li>
            <li><Link href="/contact">Contact the office</Link></li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/10 py-4 text-xs text-white/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        <p className="flex gap-4">
          <Link href="/privacy-policy">Privacy policy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/admin/login">Staff demo</Link>
        </p>
      </Container>
    </footer>
  );
}
