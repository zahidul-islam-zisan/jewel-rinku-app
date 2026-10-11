import { expect, test } from "@playwright/test";

test.setTimeout(60000);

test("employer journey: manpower request appears in admin", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Hire Skilled Workers" }).first().click();
  await expect(page).toHaveURL(/employers/);
  await page.goto("/employers/request");
  await page.getByLabel("Company name").fill("Playwright Demo Co");
  await page.getByLabel("Country").fill("UAE");
  await page.getByLabel("Contact person").fill("Alex Tester");
  await page.getByLabel("Business email").fill("alex@example.com");
  await page.getByLabel("Phone").fill("0500000000");
  await page.getByLabel("Position or role").fill("HR");
  await page.getByTestId("inquiry-next").click();
  await page.locator("#cat").selectOption("construction");
  await page.getByLabel("Number of workers").fill("5");
  await page.getByLabel("Required skills").fill("Carpentry finishing");
  await page.getByLabel("Experience requirements").fill("2 years");
  await page.locator("#dest").selectOption("UAE");
  await page.getByTestId("inquiry-next").click();
  await page.getByLabel("Preferred recruitment timeline").fill("30 days");
  await page.getByLabel("Requirements description").fill("Need five finishing carpenters for a demo project.");
  await page.getByLabel(/I understand this is a demonstration/).check();
  await page.getByTestId("inquiry-next").click();
  await page.getByRole("button", { name: "Submit demonstration request" }).click();
  await expect(page.getByText(/Reference REQ-/)).toBeVisible();
  await page.goto("/admin/login");
  await page.getByTestId("demo-admin").click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  await page.goto("/admin/employer-inquiries");
  await expect(page.getByText("Playwright Demo Co")).toBeVisible();
});

test("job seeker journey: apply and see application", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore Job Opportunities" }).click();
  await expect(page).toHaveURL(/jobs/);
  await page.getByLabel("Search jobs").fill("carpenter");
  await page.getByRole("link", { name: "Civil finishing carpenter" }).first().click();
  await page.getByLabel("Full name").fill("Playwright Applicant");
  await page.getByLabel("Phone").fill("01719999999");
  await page.getByLabel("Email").fill("playwright.applicant@example.com");
  await page.getByTestId("apply-job").click();
  await expect(page.getByText(/Reference APP-/)).toBeVisible();
  await page.goto("/admin/login");
  await page.getByTestId("demo-admin").click();
  await page.goto("/admin/applications");
  await expect(page.getByText("Playwright Applicant").first()).toBeVisible();
});

test("staff can publish a vacancy", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByTestId("demo-admin").click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  await page.goto("/admin/jobs/new");
  await page.getByLabel("Title").fill("E2E published helper");
  await page.getByLabel("Summary").fill("Created by Playwright to verify public listing.");
  await page.getByLabel("responsibilities (one per line)").fill("Help on site");
  await page.getByLabel("qualifications (one per line)").fill("Willingness to learn");
  await page.getByLabel("skills (one per line)").fill("Teamwork");
  await page.getByLabel("requiredDocuments (one per line)").fill("CV and certificates");
  await page.getByLabel("Eligibility").fill("Entry-level demo");
  const deadline = new Date(Date.now() + 86400000 * 40).toISOString().slice(0, 10);
  await page.getByLabel("Deadline").fill(deadline);
  await page.getByRole("button", { name: "Save and publish" }).click();
  await expect(page).toHaveURL(/\/admin\/jobs$/);
  await expect(page.getByText("E2E published helper")).toBeVisible();
  await page.goto("/jobs");
  await page.getByLabel("Search jobs").fill("E2E published helper");
  await expect(page.getByRole("link", { name: "E2E published helper" })).toBeVisible();
});

test("public navigation works on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "Contact" }).last().click();
  await expect(page).toHaveURL(/contact/);
});
