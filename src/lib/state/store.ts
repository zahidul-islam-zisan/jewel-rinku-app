"use client";

import { createSeedState, STORAGE_KEY, STORE_VERSION } from "@/lib/mock-data/seed";
import { canTransition, isJobOpen } from "@/lib/status-rules";
import { createId, createReference, profileCompletion, slugify } from "@/lib/utils";
import type {
  Application,
  ApplicationStatus,
  Candidate,
  CandidateProfile,
  ContactMessage,
  DocumentRecord,
  DocumentReviewStatus,
  Employer,
  EmployerInquiry,
  Interview,
  InterviewOutcome,
  Job,
  PrototypeState,
  SessionState,
  SiteContent,
  TrainingInquiry,
} from "@/types";

type Listener = () => void;

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function nowIso() {
  return new Date().toISOString();
}

function loadState(): PrototypeState {
  const seed = createSeedState();
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as Partial<PrototypeState>;
    if (parsed.version !== STORE_VERSION || !parsed.jobs || !parsed.candidates) {
      return seed;
    }
    return {
      ...seed,
      ...parsed,
      version: STORE_VERSION,
      categories: seed.categories,
      session: parsed.session ?? { role: "guest" },
    };
  } catch {
    return seed;
  }
}

class PrototypeStore {
  private state: PrototypeState;
  private listeners = new Set<Listener>();
  private hydrated = false;

  constructor() {
    this.state = createSeedState();
  }

  hydrate() {
    if (this.hydrated || typeof window === "undefined") return;
    this.state = loadState();
    this.hydrated = true;
    this.emit();
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  isReady = () => this.hydrated;

  private emit() {
    this.listeners.forEach((l) => l());
    if (typeof window !== "undefined") {
      try {
        const { session, ...rest } = this.state;
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...rest, session }),
        );
      } catch {
        /* quota / private mode */
      }
    }
  }

  private set(updater: (s: PrototypeState) => PrototypeState) {
    this.state = updater(clone(this.state));
    this.emit();
  }

  private audit(action: string, actor: string, entityType: string, entityId: string) {
    this.state.audit.unshift({
      id: createId("aud"),
      action,
      actor,
      entityType,
      entityId,
      createdAt: nowIso(),
    });
  }

  resetDemo() {
    const session = this.state.session;
    this.state = { ...createSeedState(), session };
    this.emit();
  }

  setSession(session: SessionState) {
    this.set((s) => ({ ...s, session }));
  }

  logout() {
    this.set((s) => ({ ...s, session: { role: "guest" } }));
  }

  demoLoginAdmin() {
    this.setSession({
      role: "admin",
      userId: "user_admin",
      name: "Demo Administrator",
      email: "admin@demo.jewelrinku.local",
    });
  }

  ensureApplicant(input: { name: string; email: string; phone: string }) {
    const existing = this.state.candidates.find(
      (c) => c.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (existing) return existing.id;
    const profile: CandidateProfile = {
      fullName: input.name,
      phone: input.phone,
      city: "",
      skills: [],
      experience: "",
      education: "",
      languages: [],
      preferredCategories: [],
      preferredDestinations: [],
      completionPercent: profileCompletion({
        fullName: input.name,
        phone: input.phone,
        city: "",
        skills: [],
        experience: "",
        education: "",
        languages: [],
        preferredCategories: [],
        preferredDestinations: [],
      }),
    };
    const candidate: Candidate = {
      id: createId("can"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      profile,
      notes: "Public application contact — no applicant login.",
      createdAt: nowIso(),
      isDemo: true,
    };
    this.set((s) => ({ ...s, candidates: [candidate, ...s.candidates] }));
    return candidate.id;
  }

  updateCandidateNotes(candidateId: string, notes: string) {
    this.set((s) => ({
      ...s,
      candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, notes } : c)),
    }));
  }

  updateCandidateProfile(candidateId: string, profile: CandidateProfile) {
    const completionPercent = profileCompletion(profile);
    this.set((s) => ({
      ...s,
      candidates: s.candidates.map((c) =>
        c.id === candidateId
          ? {
              ...c,
              name: profile.fullName || c.name,
              phone: profile.phone || c.phone,
              profile: { ...profile, completionPercent },
            }
          : c,
      ),
    }));
  }

  createInquiry(input: Omit<EmployerInquiry, "id" | "reference" | "createdAt" | "updatedAt" | "isDemo" | "status" | "priority" | "assignedTo" | "notes" | "employerId">) {
    const inquiry: EmployerInquiry = {
      ...input,
      id: createId("inq"),
      reference: createReference("REQ"),
      status: "new",
      priority: "medium",
      assignedTo: "Unassigned",
      notes: "",
      createdAt: nowIso(),
      updatedAt: nowIso(),
      isDemo: true,
    };
    this.set((s) => ({
      ...s,
      inquiries: [inquiry, ...s.inquiries],
      notifications: [
        {
          id: createId("nt"),
          adminVisible: true,
          title: "New employer inquiry",
          body: `${inquiry.reference} from ${inquiry.companyName}`,
          category: "system" as const,
          href: "/admin/employer-inquiries",
          read: false,
          createdAt: nowIso(),
        },
        ...s.notifications,
      ],
      audit: [
        {
          id: createId("aud"),
          action: "Inquiry submitted (demo)",
          actor: input.contactName,
          entityType: "inquiry",
          entityId: inquiry.id,
          createdAt: nowIso(),
        },
        ...s.audit,
      ],
    }));
    return inquiry;
  }

  updateInquiry(
    id: string,
    patch: Partial<Pick<EmployerInquiry, "status" | "priority" | "assignedTo" | "notes">>,
  ) {
    this.set((s) => ({
      ...s,
      inquiries: s.inquiries.map((i) =>
        i.id === id ? { ...i, ...patch, updatedAt: nowIso() } : i,
      ),
    }));
    this.audit("Inquiry updated", this.state.session.name ?? "Staff", "inquiry", id);
  }

  upsertEmployer(employer: Omit<Employer, "id" | "createdAt"> & { id?: string }) {
    if (employer.id) {
      this.set((s) => ({
        ...s,
        employers: s.employers.map((e) =>
          e.id === employer.id ? { ...e, ...employer, id: e.id } : e,
        ),
      }));
      return employer.id;
    }
    const created: Employer = { ...employer, id: createId("emp"), createdAt: nowIso() };
    this.set((s) => ({ ...s, employers: [created, ...s.employers] }));
    return created.id;
  }

  deleteEmployer(id: string) {
    this.set((s) => ({ ...s, employers: s.employers.filter((e) => e.id !== id) }));
  }

  saveJob(input: Omit<Job, "id" | "slug" | "createdAt" | "updatedAt" | "isDemo"> & { id?: string; slug?: string }) {
    if (input.id) {
      this.set((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === input.id
            ? {
                ...j,
                ...input,
                id: j.id,
                slug: input.slug || j.slug,
                isDemo: true,
                updatedAt: nowIso(),
              }
            : j,
        ),
      }));
      this.audit("Job updated", this.state.session.name ?? "Staff", "job", input.id);
      return input.id;
    }
    const created: Job = {
      ...input,
      id: createId("job"),
      slug: input.slug || slugify(input.title),
      isDemo: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.set((s) => ({ ...s, jobs: [created, ...s.jobs] }));
    this.audit("Job created", this.state.session.name ?? "Staff", "job", created.id);
    return created.id;
  }

  setJobStatus(id: string, status: Job["status"]) {
    this.set((s) => ({
      ...s,
      jobs: s.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              status,
              publishedAt: status === "published" ? j.publishedAt ?? nowIso() : j.publishedAt,
              updatedAt: nowIso(),
            }
          : j,
      ),
    }));
    this.audit(`Job ${status}`, this.state.session.name ?? "Staff", "job", id);
  }

  duplicateJob(id: string) {
    const job = this.state.jobs.find((j) => j.id === id);
    if (!job) return;
    this.saveJob({
      ...job,
      id: undefined,
      title: `${job.title} (copy)`,
      slug: `${job.slug}-copy-${Date.now().toString(36)}`,
      status: "draft",
      featured: false,
      publishedAt: undefined,
    });
  }

  deleteJob(id: string) {
    this.set((s) => ({ ...s, jobs: s.jobs.filter((j) => j.id !== id) }));
  }

  applyToJob(input: {
    jobId: string;
    name: string;
    email: string;
    phone: string;
    coverNote: string;
  }) {
    const job = this.state.jobs.find((j) => j.id === input.jobId);
    if (!job || !isJobOpen(job)) {
      throw new Error("This vacancy is not open for applications.");
    }
    const candidateId = this.ensureApplicant({
      name: input.name,
      email: input.email,
      phone: input.phone,
    });
    const existing = this.state.applications.find(
      (a) => a.jobId === input.jobId && a.candidateId === candidateId && a.status !== "withdrawn",
    );
    if (existing) return existing;
    const id = createId("app");
    const application: Application = {
      id,
      reference: createReference("APP"),
      candidateId,
      jobId: input.jobId,
      status: "submitted",
      coverNote: input.coverNote,
      submittedAt: nowIso(),
      updatedAt: nowIso(),
      isDemo: true,
      events: [
        {
          id: createId("ev"),
          applicationId: id,
          status: "submitted",
          note: "Application received from the public job form. Staff should contact the applicant manually.",
          actor: "Applicant",
          createdAt: nowIso(),
        },
      ],
    };
    this.set((s) => ({
      ...s,
      applications: [application, ...s.applications],
      notifications: [
        {
          id: createId("nt"),
          candidateId,
          adminVisible: true,
          title: "New job application",
          body: `${application.reference} from ${input.name} — contact the applicant manually.`,
          category: "application" as const,
          href: `/admin/applications/${application.id}`,
          read: false,
          createdAt: nowIso(),
        },
        ...s.notifications,
      ],
      audit: [
        {
          id: createId("aud"),
          action: "Application submitted",
          actor: "Applicant",
          entityType: "application",
          entityId: application.id,
          createdAt: nowIso(),
        },
        ...s.audit,
      ],
    }));
    return application;
  }

  updateApplicationStatus(id: string, status: ApplicationStatus, note: string) {
    const current = this.state.applications.find((a) => a.id === id);
    if (!current) throw new Error("Application not found");
    if (!canTransition(current.status, status)) {
      throw new Error("This status change is not permitted.");
    }
    const actor = this.state.session.name ?? "Staff";
    this.set((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              updatedAt: nowIso(),
              events: [
                ...a.events,
                {
                  id: createId("ev"),
                  applicationId: id,
                  status,
                  note,
                  actor,
                  createdAt: nowIso(),
                },
              ],
            }
          : a,
      ),
      notifications: [
        {
          id: createId("nt"),
          candidateId: current.candidateId,
          adminVisible: true,
          title: "Application update",
          body: `Status is now ${status.replace(/-/g, " ")}.`,
          category: "application" as const,
          href: `/admin/applications/${id}`,
          read: false,
          createdAt: nowIso(),
        },
        ...s.notifications,
      ],
      audit: [
        {
          id: createId("aud"),
          action: "Application status changed",
          actor,
          entityType: "application",
          entityId: id,
          createdAt: nowIso(),
        },
        ...s.audit,
      ],
    }));
  }

  addApplicationNote(id: string, note: string) {
    const current = this.state.applications.find((a) => a.id === id);
    if (!current) return;
    const actor = this.state.session.name ?? "Staff";
    this.set((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              updatedAt: nowIso(),
              events: [
                ...a.events,
                {
                  id: createId("ev"),
                  applicationId: id,
                  status: a.status,
                  note,
                  actor,
                  createdAt: nowIso(),
                },
              ],
            }
          : a,
      ),
    }));
  }

  scheduleInterview(input: Omit<Interview, "id">) {
    const interview: Interview = { ...input, id: createId("int") };
    const actor = this.state.session.name ?? "Staff";
    this.set((s) => ({
      ...s,
      interviews: [interview, ...s.interviews],
      notifications: [
        {
          id: createId("nt"),
          candidateId: input.candidateId,
          adminVisible: true,
          title: "Interview scheduled (simulated)",
          body: "No real invitation was sent.",
          category: "interview" as const,
          href: "/admin/interviews",
          read: false,
          createdAt: nowIso(),
        },
        ...s.notifications,
      ],
      audit: [
        {
          id: createId("aud"),
          action: "Interview scheduled",
          actor,
          entityType: "interview",
          entityId: interview.id,
          createdAt: nowIso(),
        },
        ...s.audit,
      ],
    }));
    return interview;
  }

  updateInterview(id: string, patch: Partial<Interview>) {
    this.set((s) => ({
      ...s,
      interviews: s.interviews.map((i) => (i.id === id ? { ...i, ...patch, id } : i)),
    }));
  }

  cancelInterview(id: string) {
    this.updateInterview(id, { outcome: "cancelled" as InterviewOutcome });
  }

  reviewDocument(id: string, reviewStatus: DocumentReviewStatus, rejectionReason?: string) {
    this.set((s) => ({
      ...s,
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, reviewStatus, rejectionReason } : d,
      ),
    }));
    this.audit("Document reviewed", this.state.session.name ?? "Staff", "document", id);
  }

  addSimulatedDocument(input: Omit<DocumentRecord, "id" | "uploadedAt" | "simulated">) {
    const doc: DocumentRecord = {
      ...input,
      id: createId("doc"),
      uploadedAt: nowIso(),
      simulated: true,
    };
    this.set((s) => ({ ...s, documents: [doc, ...s.documents] }));
    return doc;
  }

  markNotificationRead(id: string) {
    this.set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }

  markAllNotificationsRead(scope: { candidateId?: string; admin?: boolean }) {
    this.set((s) => ({
      ...s,
      notifications: s.notifications.map((n) => {
        if (scope.admin && n.adminVisible) return { ...n, read: true };
        if (scope.candidateId && n.candidateId === scope.candidateId) return { ...n, read: true };
        return n;
      }),
    }));
  }

  updateContent(patch: Partial<SiteContent>) {
    this.set((s) => ({ ...s, content: { ...s.content, ...patch } }));
  }

  addContactMessage(msg: Omit<ContactMessage, "id" | "createdAt" | "isDemo">) {
    const row: ContactMessage = {
      ...msg,
      id: createId("msg"),
      createdAt: nowIso(),
      isDemo: true,
    };
    this.set((s) => ({ ...s, contactMessages: [row, ...s.contactMessages] }));
    return row;
  }

  addTrainingInquiry(input: Omit<TrainingInquiry, "id" | "createdAt" | "status" | "isDemo">) {
    const row: TrainingInquiry = {
      ...input,
      id: createId("trq"),
      createdAt: nowIso(),
      status: "new",
      isDemo: true,
    };
    this.set((s) => ({ ...s, trainingInquiries: [row, ...s.trainingInquiries] }));
    return row;
  }

  updateTrainingInquiry(id: string, status: TrainingInquiry["status"]) {
    this.set((s) => ({
      ...s,
      trainingInquiries: s.trainingInquiries.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }
}

export const prototypeStore = new PrototypeStore();
