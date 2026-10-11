# Jewel Rinku Enterprise — frontend prototype

Premium recruitment website prototype for **Jewel Rinku Enterprise** (Dhaka, recruiting licence **1776**).

This is a **frontend-only** demonstration. There is no production API, real authentication, email, document storage, or payment integration. Demo vacancies are **not live job offers**.

## Run locally

```bash
cd jewel-rinku-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo access

| Workspace | How to enter | Notes |
| --- | --- | --- |
| Job seeker | Open a vacancy and submit the application form | No applicant login. Staff contact the person manually. |
| Admin | `/admin/login` → **Enter admin demo** | `admin@demo.jewelrinku.local` / `demo1234` |

Passwords are checked only in the browser. They are not stored or transmitted.

Reset mock data: **Admin → Settings → Reset demo data**.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright journeys (starts or reuses the dev server) |

## Documentation

- `PROJECT_PLAN.md` — routes, inspection notes, verified facts
- `PROTOTYPE_GUIDE.md` — how to demonstrate the product
- `BACKEND_INTEGRATION_PLAN.md` — replacing mock repositories with Laravel

## Content policy

Verified public facts (licence, address, published leadership, MD message, BAIRA listing) are labelled as such. Vacancies, salaries, inquiries, applications, and testimonials in the UI are **prototype data**.
