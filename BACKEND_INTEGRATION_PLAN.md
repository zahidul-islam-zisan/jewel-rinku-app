# Backend integration plan (Laravel)

Do not treat `localStorage` as authentication or document storage.

## Current facades

Typed repositories in `src/lib/repositories/index.ts`:

- `jobRepository.list | getBySlug | create | update | setStatus`
- `applicationRepository.list | create | updateStatus`
- `employerInquiryRepository.list | create | updateStatus`
- `candidateRepository.getProfile | updateProfile` (contact records from public applications; no applicant auth)
- `notificationRepository.markAsRead | markAllRead`

Today they wrap `prototypeStore`. Later, implement the same methods with `fetch` against a Laravel REST API.

## Laravel work still required

- Server-side validation and authorization
- Database transactions
- Private document object storage (never localStorage)
- Queues for email/SMS
- Real audit logs
- Session/CSRF and hashed passwords
- Licence and vacancy content managed as verified records

## Suggested mapping

| Frontend | Laravel |
| --- | --- |
| Job | `jobs` + `job_translations` as needed |
| Application | `applications` + `application_events` |
| EmployerInquiry | `employer_inquiries` |
| Applicant contact | `applicants` (name, phone, email — no login) |
| Interview | `interviews` |
| DocumentRecord | `documents` on private disk |

Keep page components free of storage details; call repositories or React Query hooks only.
