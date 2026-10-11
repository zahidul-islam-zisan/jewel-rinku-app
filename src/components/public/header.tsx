"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { images } from "@/lib/images";
import { usePrototype } from "@/hooks/use-prototype";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/employers", label: "Employers" },
  { href: "/jobs", label: "Jobs" },
  { href: "/training-center", label: "Training" },
  { href: "/contact", label: "Contact" },
];

const moreLinks = [
  { href: "/recruitment-process", label: "Recruitment process" },
  { href: "/operation-flow", label: "Operation flow" },
  { href: "/job-categories", label: "Job categories" },
  { href: "/job-seeker-guide", label: "Job seeker guide" },
  { href: "/licenses-and-credentials", label: "Licences & credentials" },
  { href: "/faq", label: "FAQ" },
  { href: "/news", label: "News" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state } = usePrototype();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      {state.content.announcementEnabled ? <Announcement /> : null}
      <div className="mx-auto flex h-[5.5rem] w-full max-w-[1400px] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex h-[4.25rem] w-[13.5rem] shrink-0 items-center sm:w-[15.5rem]"
          aria-label="Jewel Rinku Enterprise home"
        >
          <Image
            src={images.logoWhite.src}
            alt={images.logoWhite.alt}
            width={600}
            height={190}
            className="h-[4.25rem] w-full object-contain object-left"
            priority
            quality={100}
          />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"
          aria-label="Primary"
        >
          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] tracking-wide text-white/75 transition-colors hover:bg-white/5 hover:text-white",
                pathname === l.href && "bg-white/10 font-medium text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
          <MoreMenu pathname={pathname} />
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
          <Button
            href="/jobs"
            variant="outline"
            size="sm"
            className="h-10 whitespace-nowrap border-white/25 bg-transparent px-3.5 text-[13px] text-white hover:bg-white/10 hover:text-white"
          >
            Find a Job
          </Button>
          <Button
            href="/employers/request"
            size="sm"
            className="h-10 whitespace-nowrap px-3.5 text-[13px]"
          >
            Submit Request
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-white xl:hidden md:ml-0"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Menu</span>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-white/10 bg-navy px-4 py-4 xl:hidden">
          <nav className="mx-auto flex max-w-[1400px] flex-col gap-1" aria-label="Mobile">
            {[...primaryLinks, ...moreLinks].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2.5 text-sm text-white/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button href="/jobs" variant="outline" className="h-11 flex-1 whitespace-nowrap border-white/25 bg-transparent text-white">
                Find a Job
              </Button>
              <Button href="/employers/request" className="h-11 flex-1 whitespace-nowrap">
                Submit Manpower Request
              </Button>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MoreMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = moreLinks.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-0.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13px] tracking-wide text-white/75 hover:bg-white/5 hover:text-white",
          (open || active) && "bg-white/10 text-white",
        )}
      >
        More
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 w-56 -translate-x-1/2 rounded-md border border-border bg-white py-1.5 shadow-lg"
        >
          {moreLinks.map((l) => (
            <li key={l.href} role="none">
              <Link
                role="menuitem"
                href={l.href}
                className={cn(
                  "block px-3 py-2 text-sm text-navy hover:bg-canvas",
                  pathname === l.href && "bg-canvas font-medium",
                )}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Announcement() {
  const { state } = usePrototype();
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="border-b border-white/10 bg-[#0c1c2e]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
        <p className="truncate text-xs leading-5 text-white/70">{state.content.announcement}</p>
        <button
          type="button"
          className="shrink-0 rounded px-2 py-0.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
          onClick={() => setHidden(true)}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
