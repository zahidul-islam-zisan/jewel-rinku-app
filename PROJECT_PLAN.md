# Jewel Rinku Enterprise — Frontend Prototype Plan

Prototype-only Next.js application. No production backend, authentication, email, document storage, or payments.

## Inspection notes

- Workspace was empty; a Next.js 16 App Router + TypeScript + Tailwind CSS v4 app was created in `jewel-rinku-app/`.
- Public website reviewed: https://jewelrinku.com.bd/ (contact/about subpages returned errors).
- BAIRA listing for recruiting licence **1776** was used as a verification source.

### Verified public information (to present as facts)

| Item | Source |
| --- | --- |
| Legal / trading names | Website + BAIRA: Jewel Rinku Enterprise / Jewel Rinku Enterprise Limited / M/S. Jewel Rinku Enterprise |
| Recruiting licence | RL **1776** (website, BAIRA, BMET listing) |
| Managing Director | Md. Rezaul Karim |
| Address | Holding No. 591 (Dag no. 1318), Moynertek, Uttarkhan, Dhaka-1230; BAIRA also lists 1318, Ziabag, Moynertek, Uttar Khan, Uttara, Dhaka-1230 |
| Phone | +880 16 1111 3090; BAIRA also lists 01713-507169 |
| Email | jewelrinku2@gmail.com, info@jewelrinku.com.bd |
| Leadership on current website | Chairman MD Easin Arafat; Director Masum Billah; Abdullah Al Mamun (title not clearly published — not invented) |
| Destination markets named by MD message | Saudi Arabia, Malaysia, UAE, Qatar |
| Training centre | Mentioned on current website (programme details not independently verified) |

### Content requiring later verification

- Course fees, accreditation, guaranteed outcomes — **not claimed**.
- Job vacancies, salaries, testimonials, partner logos — **demo only**.
- Abdullah Al Mamun’s official title.
- Social media URLs — none confirmed; footer omits invented social links.
- Map embed uses the published Dhaka address (verify pin accuracy before launch).

## Stack

- Next.js App Router, TypeScript (strict), Tailwind CSS
- Custom accessible UI primitives (shadcn-style)
- Lucide icons, React Hook Form + Zod, Recharts, date-fns, Sonner
- Typed mock repositories + `localStorage` persistence
- Vitest + Testing Library; Playwright for journeys

## Route groups

- `(public)` — marketing site shell (header/footer); job apply is a public form
- `admin` — staff dashboard shell (no public nav); applications and applicant contacts

See README and PROTOTYPE_GUIDE after implementation.

## Mock store

Single client store (`lib/state`) shared by public jobs, public applications, and admin tools. Repositories in `lib/repositories` isolate storage so a Laravel API can replace them later. There is no applicant login.

## Implementation phases

1. Design system + layouts
2. Seed data + repositories + persistence
3. Public website
4. Public job application form (staff contact applicants manually)
5. Admin dashboard
6. Tests, QA, documentation
