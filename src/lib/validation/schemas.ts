import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const jobApplySchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a phone number"),
  coverNote: z.string().optional(),
});

export const inquiryStep1 = z.object({
  companyName: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Country is required"),
  contactName: z.string().min(2, "Contact name is required"),
  email: z.string().email("Valid business email required"),
  phone: z.string().min(8, "Phone is required"),
  position: z.string().min(2, "Role is required"),
});

export const inquiryStep2 = z.object({
  jobCategorySlug: z.string().min(1, "Select a job category"),
  workersNeeded: z.coerce.number().min(1, "Enter at least one worker"),
  requiredSkills: z.string().min(3, "Describe required skills"),
  experience: z.string().min(2, "Experience requirement is required"),
  destination: z.string().min(2, "Destination is required"),
  employmentType: z.enum(["full-time", "contract", "seasonal"]),
});

export const inquiryStep3 = z.object({
  timeline: z.string().min(2, "Timeline is required"),
  description: z.string().min(10, "Please describe the requirement"),
  supportingFileName: z.string().optional(),
  consent: z.boolean().refine((v) => v, "Consent is required"),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(8, "Phone is required"),
  message: z.string().min(10, "Please enter a message"),
});

export const jobFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  categorySlug: z.string().min(1, "Category is required"),
  destination: z.string().min(2, "Destination is required"),
  employmentType: z.enum(["full-time", "contract", "seasonal"]),
  experienceLevel: z.enum(["entry", "skilled", "supervisor"]),
  summary: z.string().min(10, "Summary is required"),
  responsibilities: z.string().min(10, "Add responsibilities"),
  qualifications: z.string().min(5, "Add qualifications"),
  skills: z.string().min(3, "Add skills"),
  requiredDocuments: z.string().min(2, "List documents"),
  eligibility: z.string().min(5, "Eligibility is required"),
  salaryLabel: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  featured: z.boolean().optional(),
});

export const trainingInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  courseId: z.string().min(1),
  message: z.string().min(5),
});
