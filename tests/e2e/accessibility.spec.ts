import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { E2E_FIXTURES } from "./fixtures";

async function dismissFeaturedPopup(page: Page) {
  const dialog = page.getByRole("dialog");
  const opened = await dialog
    .waitFor({ state: "visible", timeout: 3_000 })
    .then(() => true)
    .catch(() => false);
  if (opened) await page.getByRole("button", { name: "Fechar destaque" }).click();
}

async function expectNoSeriousA11yViolations(page: Page) {
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = scan.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious",
  );

  expect(
    blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      targets: violation.nodes.flatMap((node) => node.target),
    })),
    "Não deve haver violações críticas/sérias do axe nas rotas essenciais.",
  ).toEqual([]);
}

async function loginAdmin(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(E2E_FIXTURES.admin.email);
  await page.getByLabel("Senha").fill(E2E_FIXTURES.admin.password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("acessibilidade essencial", () => {
  test("Home não possui violações críticas/sérias", async ({ page }) => {
    await page.goto("/");
    await dismissFeaturedPopup(page);
    await expectNoSeriousA11yViolations(page);
  });

  test("detalhe de evento não possui violações críticas/sérias", async ({ page }) => {
    await page.goto(`/eventos/${E2E_FIXTURES.event.slug}`);
    await expect(
      page.getByRole("heading", { level: 1, name: E2E_FIXTURES.event.title }),
    ).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("login administrativo não possui violações críticas/sérias", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Entrar no painel" })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("formulário protegido de aula não possui violações críticas/sérias", async ({ page }) => {
    await loginAdmin(page);
    await page.goto("/admin/aulas");
    await page.getByRole("button", { name: "Nova aula" }).click();
    await expect(page.getByLabel("Modalidade")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("preferência de movimento reduzido mantém a navegação funcional", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await dismissFeaturedPopup(page);
    await page.getByRole("link", { name: "Ver aulas e horários" }).click();
    await expect(page.locator("#aulas")).toBeInViewport();
  });
});
