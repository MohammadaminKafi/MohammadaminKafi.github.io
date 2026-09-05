import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("switches profile modes with shareable state", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-mode", "balanced");
  await page.getByRole("radio", { name: "Job", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "job");
  await expect(page).toHaveURL(/mode=job/);
  await expect(page).toHaveURL(/section=experience/);
  await expect(
    page.getByRole("heading", { name: "Intelligence built for real systems." }),
  ).toBeVisible();

  await page.goBack();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "balanced");
  await page.goForward();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "job");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "job");
});

test("gives every mode a fixed atmosphere and distinct composition", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-world", "garden");
  await expect(page.locator(".profile-hero-balanced")).toBeVisible();
  await expect(page.getByRole("button", { name: /theme/i })).toHaveCount(0);

  await page.getByRole("radio", { name: "Job", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-world", "cathedral");
  await expect(page.locator(".profile-hero-job")).toBeVisible();

  await page.getByRole("radio", { name: "Academic", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-world", "tomorrow");
  await expect(page.locator(".profile-hero-academic")).toBeVisible();
});

test("opens the JSON-driven Pages navigation", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("link", { name: "All live pages" }).click();
  } else {
    await page.getByRole("button", { name: "Open live pages menu" }).click();
    await expect(
      page.getByRole("menuitem", { name: /RISC-V & Tomasulo Simulator/ }),
    ).toBeVisible();
    await page.getByRole("menuitem", { name: /View all pages/ }).click();
  }
  await expect(page).toHaveURL(/\/pages\//);
});

test("navigates sections and deep routes", async ({ page }) => {
  await page.goto("/?mode=academic&section=education");
  await expect(page.getByRole("tab", { name: "Education" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  const academicDetails = page
    .getByRole("link", { name: /View academic details/ })
    .first();
  await expect(academicDetails).toHaveAttribute(
    "href",
    /education\/iut-bsc-ce/,
  );
  await Promise.all([
    page.waitForURL(/education\/iut-bsc-ce/, { timeout: 15_000 }),
    academicDetails.click(),
  ]);
  await expect(
    page.getByRole("heading", { name: "Semesters and courses" }),
  ).toBeVisible();
});

test("serves pages, gallery, resume, and direct detail routes", async ({
  page,
  request,
}) => {
  for (const pathname of [
    "/pages/",
    "/gallery/",
    "/resume/",
    "/jobs/ai-agent-developer-iut/",
    "/education/iut-bsc-ce/",
  ]) {
    const response = await request.get(pathname);
    expect(response.ok(), pathname).toBeTruthy();
  }

  await page.goto("/pages/");
  await expect(
    page.getByRole("heading", { name: "RISC-V & Tomasulo Simulator" }),
  ).toBeVisible();
  await page.goto("/gallery/");
  await expect(page.locator(".gallery-card img")).toHaveCount(3);
  await page.goto("/resume/");
  await expect(
    page.getByRole("link", { name: "Download PDF" }),
  ).toHaveAttribute("href", "/Resume_MohammadaminKafi.pdf");
});

test("has no serious accessibility violations in any world", async ({
  page,
}) => {
  for (const mode of ["balanced", "job", "academic"]) {
    await page.goto(`/?mode=${mode}`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(
      results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      ),
      `${mode} accessibility`,
    ).toEqual([]);
  }
});

test("does not overflow any world at supported viewports", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    for (const mode of ["balanced", "job", "academic"]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/?mode=${mode}`);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `${mode} at ${width}px`).toBeLessThanOrEqual(1);
    }
  }
});

test("bypasses theatrical transitions for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("radio", { name: "Academic", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "academic");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-transitioning",
    "true",
  );
  await expect(page.locator(".tomorrow-orbit")).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("uses a vertical job nave only on desktop", async ({ page, isMobile }) => {
  await page.goto("/?mode=job&section=experience");
  await expect(page.getByRole("tablist")).toHaveAttribute(
    "aria-orientation",
    isMobile ? "horizontal" : "vertical",
  );
});

test("locks the full-scene mode transition and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const jobMode = page.getByRole("radio", { name: "Job", exact: true });
  await jobMode.click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-transitioning",
    "true",
  );
  await expect(page.locator("html")).toHaveAttribute("data-mode", "job");
  await expect(page.locator("html")).not.toHaveAttribute(
    "data-transitioning",
    "true",
  );
  await expect(jobMode).toBeFocused();
});
