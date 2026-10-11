export type UserRole = "candidate" | "admin" | "guest";

export type JobStatus = "draft" | "published" | "closed" | "expired";
export type EmploymentType = "full-time" | "contract" | "seasonal";
export type ExperienceLevel = "entry" | "skilled" | "supervisor";

export type ApplicationStatus =
  | "submitted"
  | "under-review"
  | "shortlisted"
  | "interview-scheduled"
  | "assessment-required"
  | "documents-pending"
  | "approved-next-stage"
  | "rejected"
  | "withdrawn";

export type InquiryStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal-in-progress"
  | "converted"
  | "closed";

export type InquiryPriority = "low" | "medium" | "high";

export type InterviewType = "phone" | "video" | "in-person" | "skills-assessment";
export type InterviewOutcome = "scheduled" | "completed" | "cancelled" | "no-show";

export type DocumentType =
  | "cv"
  | "certificate"
  | "skills"
  | "medical"
  | "other";
export type DocumentReviewStatus = "pending" | "approved" | "rejected";

export type NotificationCategory =
  | "application"
  | "interview"
  | "document"
  | "system";

export type CourseStatus = "open" | "upcoming" | "closed";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  candidateId?: string;
}

export interface Employer {
  id: string;
  companyName: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}

export interface EmployerInquiry {
  id: string;
  reference: string;
  employerId?: string;
  companyName: string;
  country: string;
  contactName: string;
  email: string;
  phone: string;
  position: string;
  jobCategorySlug: string;
  workersNeeded: number;
  requiredSkills: string;
  experience: string;
  destination: string;
  employmentType: EmploymentType;
  timeline: string;
  description: string;
  supportingFileName?: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  assignedTo: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  isDemo: true;
}

export interface JobCategory {
  slug: string;
  name: string;
  summary: string;
  description: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  destination: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  featured: boolean;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  requiredDocuments: string[];
  eligibility: string;
  salaryLabel?: string;
  salaryIsIllustrative: boolean;
  publishedAt?: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  isDemo: true;
}

export interface CandidateProfile {
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  city: string;
  skills: string[];
  experience: string;
  education: string;
  languages: string[];
  preferredCategories: string[];
  preferredDestinations: string[];
  completionPercent: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: CandidateProfile;
  notes: string;
  createdAt: string;
  isDemo: true;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  note: string;
  actor: string;
  createdAt: string;
}

export interface Application {
  id: string;
  reference: string;
  candidateId: string;
  jobId: string;
  status: ApplicationStatus;
  coverNote: string;
  submittedAt: string;
  updatedAt: string;
  events: ApplicationEvent[];
  isDemo: true;
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  interviewer: string;
  type: InterviewType;
  scheduledAt: string;
  outcome: InterviewOutcome;
  notes: string;
}

export interface DocumentRecord {
  id: string;
  candidateId: string;
  applicationId?: string;
  type: DocumentType;
  fileName: string;
  uploadedAt: string;
  reviewStatus: DocumentReviewStatus;
  rejectionReason?: string;
  expiresAt?: string;
  simulated: true;
}

export interface TrainingCourse {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  duration: string;
  eligibility: string;
  status: CourseStatus;
  scheduleNote: string;
  isVerifiedSchedule: boolean;
}

export interface TrainingInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  message: string;
  createdAt: string;
  status: "new" | "reviewed";
  isDemo: true;
}

export interface AppNotification {
  id: string;
  candidateId?: string;
  adminVisible: boolean;
  title: string;
  body: string;
  category: NotificationCategory;
  href?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  isDemo: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "employer" | "job-seeker" | "training" | "documents";
}

export interface SiteContent {
  announcement: string;
  announcementEnabled: boolean;
  heroHeadline: string;
  heroSupport: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  featuredJobIds: string[];
  faqs: FaqItem[];
  news: NewsItem[];
}

export interface SessionState {
  role: UserRole;
  userId?: string;
  candidateId?: string;
  name?: string;
  email?: string;
}

export interface PrototypeState {
  version: number;
  employers: Employer[];
  inquiries: EmployerInquiry[];
  jobs: Job[];
  categories: JobCategory[];
  candidates: Candidate[];
  applications: Application[];
  interviews: Interview[];
  documents: DocumentRecord[];
  courses: TrainingCourse[];
  trainingInquiries: TrainingInquiry[];
  notifications: AppNotification[];
  audit: AuditEvent[];
  content: SiteContent;
  session: SessionState;
  contactMessages: ContactMessage[];
}

export interface ContactMessage {
  id: string;
  audience: "employer" | "job-seeker";
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  isDemo: true;
}
