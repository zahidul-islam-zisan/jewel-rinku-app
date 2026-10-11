import { prototypeStore } from "@/lib/state/store";
import type { ApplicationStatus, Job } from "@/types";

/** Repository facades — swap implementations for Laravel REST later. */

export const jobRepository = {
  list: () => prototypeStore.getState().jobs,
  getBySlug: (slug: string) => prototypeStore.getState().jobs.find((j) => j.slug === slug),
  getById: (id: string) => prototypeStore.getState().jobs.find((j) => j.id === id),
  create: (job: Parameters<typeof prototypeStore.saveJob>[0]) => prototypeStore.saveJob(job),
  update: (job: Parameters<typeof prototypeStore.saveJob>[0]) => prototypeStore.saveJob(job),
  setStatus: (id: string, status: Job["status"]) => prototypeStore.setJobStatus(id, status),
};

export const applicationRepository = {
  list: () => prototypeStore.getState().applications,
  create: (input: Parameters<typeof prototypeStore.applyToJob>[0]) =>
    prototypeStore.applyToJob(input),
  updateStatus: (id: string, status: ApplicationStatus, note: string) =>
    prototypeStore.updateApplicationStatus(id, status, note),
};

export const employerInquiryRepository = {
  list: () => prototypeStore.getState().inquiries,
  create: (input: Parameters<typeof prototypeStore.createInquiry>[0]) =>
    prototypeStore.createInquiry(input),
  updateStatus: (
    id: string,
    patch: Parameters<typeof prototypeStore.updateInquiry>[1],
  ) => prototypeStore.updateInquiry(id, patch),
};

export const candidateRepository = {
  getProfile: (id: string) => prototypeStore.getState().candidates.find((c) => c.id === id),
  updateProfile: (id: string, profile: Parameters<typeof prototypeStore.updateCandidateProfile>[1]) =>
    prototypeStore.updateCandidateProfile(id, profile),
};

export const notificationRepository = {
  markAsRead: (id: string) => prototypeStore.markNotificationRead(id),
  markAllRead: (scope: { candidateId?: string; admin?: boolean }) =>
    prototypeStore.markAllNotificationsRead(scope),
};
