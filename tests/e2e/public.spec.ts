import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { E2E_FIXTURES } from "./fixtures";

async function dismissFeaturedPopup(page: Page) {
  const closeButton = page.getByRole("button", { name: "Fechar destaque" });
  if (await closeButton.isVisible().catch(() => false)) {
    await closeButton.click();
  }
}

test.describe("experiência pública", () => {
  test("aulas aparecem em ordem cronológica e o filtro funciona", async ({ page }) => {
    await page.goto("/aulas");

    const classRows = page.getByTestId("public-class-row");
    await expect(classRows).toHaveCount(3);

    const weekdays = await classRows.evaluateAll((rows) =>
      rows.map((row) => row.getAttribute("data-weekday")),
    );
    expect(weekdays).toEqual(["monday", "wednesday", "sunday"]);

    await page.getByLabel("Filtrar por local").selectOption(E2E_FIXTURES.location.id);
    await expect(page.getByText("2 aulas encontradas")).toBeVisible();
  });

  test("locais carregam mapa sob demanda e preservam alternativa externa", async ({ page }) => {
    await page.goto("/locais");

    const locationCard = page.getByTestId("public-location-card").filter({
      hasText: E2E_FIXTURES.location.name,
    });
    await expect(locationCard).toBeVisible();
    await expect(
      locationCard.getByRole("link", { name: "Abrir no Google Maps" }),
    ).toHaveAttribute("href", E2E_FIXTURES.location.mapsUrl);

    await locationCard.scrollIntoViewIfNeeded();
    await expect(locationCard.locator("iframe")).toBeVisible();
  });

  test("evento futuro mantém CTA WhatsApp e evento passado não aparece publicamente", async ({ page }) => {
    await page.goto("/eventos");

    await expect(page.getByText(E2E_FIXTURES.event.title)).toBeVisible();
    await expect(page.getByText(E2E_FIXTURES.pastEvent.title)).toHaveCount(0);

    await page.getByRole("link", { name: `Ver detalhes de ${E2E_FIXTURES.event.title}` }).click();
    await expect(page).toHaveURL(new RegExp(`/eventos/${E2E_FIXTURES.event.slug}$`));
    await expect(page.getByRole("heading", { name: E2E_FIXTURES.event.title })).toBeVisible();

    const whatsappCta = page.getByRole("link", { name: /WhatsApp/i }).first();
    await expect(whatsappCta).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  });

  test("páginas públicas críticas não têm violações axe sérias", async ({ page }) => {
    for (const path of ["/", "/aulas", "/locais", "/eventos"] as const) {
      await page.goto(path);
      await dismissFeaturedPopup(page);

      const results = await new AxeBuilder({ page })
        .disableRules(["color-contrast"])
        .analyze();
      const seriousViolations = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );

      expect(seriousViolations, `${path} possui violações sérias`).toEqual([]);
    }
  });

  test("popup em destaque pode ser fechado e respeita silêncio no mesmo navegador", async ({ page }) => {
    await page.goto("/");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(E2E_FIXTURES.event.title);
    await page.getByRole("button", { name: "Fechar destaque" }).click();
    await expect(dialog).toBeHidden();

    await page.reload();
    await expect(dialog).toBeHidden();
  });
});

test.describe("experiência pública mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("menu móvel permite navegar para aulas", async ({ page }) => {
    await page.goto("/");
    await dismissFeaturedPopup(page);

    await page.locator("summary").filter({ hasText: "Abrir menu" }).click();
    const mobileNavigation = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole("link", { name: "Aulas", exact: true }).click();

    await expect(page).toHaveURL(/\/aulas$/);
    await expect(page.getByRole("heading", { name: /Aulas/ }).first()).toBeVisible();
  });
});
