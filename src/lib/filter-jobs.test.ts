import { describe, expect, it } from "vitest";
import { filterJobs, paginate } from "./filter-jobs";
import { createSeedState } from "./mock-data/seed";
import { canTransition } from "./status-rules";
import { inquiryStep1 } from "./validation/schemas";

describe("filterJobs", () => {
  const jobs = createSeedState().jobs;

  it("hides unpublished vacancies by default", () => {
    const result = filterJobs(jobs, {});
    expect(result.every((j) => j.status === "published")).toBe(true);
    expect(result.find((j) => j.id === "job_12")).toBeUndefined();
  });

  it("filters by category and destination", () => {
    const result = filterJobs(jobs, { category: "welding", destination: "Qatar" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((j) => j.categorySlug === "welding" && j.destination === "Qatar")).toBe(true);
  });

  it("searches titles", () => {
    const result = filterJobs(jobs, { query: "carpenter" });
    expect(result.some((j) => j.slug.includes("carpenter"))).toBe(true);
  });
});

describe("paginate", () => {
  it("returns the requested page", () => {
    const { items, pages, total } = paginate([1, 2, 3, 4, 5], 2, 2);
    expect(total).toBe(5);
    expect(pages).toBe(3);
    expect(items).toEqual([3, 4]);
  });
});

describe("application transitions", () => {
  it("allows submitted to under-review", () => {
    expect(canTransition("submitted", "under-review")).toBe(true);
  });
  it("rejects illegal jumps", () => {
    expect(canTransition("submitted", "approved-next-stage")).toBe(false);
  });
});

describe("inquiry validation", () => {
  it("requires a valid email", () => {
    const r = inquiryStep1.safeParse({
      companyName: "A",
      country: "UAE",
      contactName: "B",
      email: "nope",
      phone: "12345678",
      position: "HR",
    });
    expect(r.success).toBe(false);
  });
});
