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

test("keeps theme preference independent from profile mode", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page.getByRole("button", { name: "Light theme" }).click();
  } else {
    await page.getByRole("button", { name: "Switch to light theme" }).click();
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("radio", { name: "Academic", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
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
  await page
    .getByRole("link", { name: /View academic details/ })
    .first()
    .click();
  await expect(page).toHaveURL(/education\/iut-bsc-ce/);
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

test("has no serious accessibility violations", async ({ page }) => {
  await page.goto("/?mode=balanced&section=overview");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
});

test("does not overflow supported viewports", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/?mode=balanced");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `${width}px viewport`).toBeLessThanOrEqual(1);
  }
});

test("disables aurora animation for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".aurora").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});
