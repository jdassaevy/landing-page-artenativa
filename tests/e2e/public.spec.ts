import { expect, test, type Page } from "@playwright/test";

import { E2E_CLASS_ORDER, E2E_FIXTURES } from "./fixtures";

async function dismissFeaturedPopup(page: Page) {
  const dialog = page.getByRole("dialog");
  const opened = await dialog
    .waitFor({ state: "visible", timeout: 3_000 })
    .then(() => true)
    .catch(() => false);

  if (opened) {
    await page.getByRole("button", { name: "Fechar destaque" }).click();
    await expect(dialog).toBeHidden();
  }
}

test.describe("experiência pública", () => {
  test("hero navega para aulas e mantém ordem segunda→domingo por horário", async ({ page }) => {
    await page.goto("/");
    await dismissFeaturedPopup(page);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "A cultura ganha vida quando a gente dança junto.",
      }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Ver aulas e horários" }).click();
    await expect(page.locator("#aulas")).toBeInViewport();

    const classIds = await page
      .getByTestId("class-card")
      .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-class-id")));

    expect(classIds).toEqual(E2E_CLASS_ORDER);
  });

  test("filtro de modalidade não altera a ordem relativa das aulas", async ({ page }) => {
    await page.goto("/aulas");

    await page.getByLabel("Modalidade").selectOption({ label: "Forró Básico" });
    await expect(page.getByText("2 aulas encontradas")).toBeVisible();

    const classIds = await page
      .getByTestId("class-card")
      .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-class-id")));

    expect(classIds).toEqual([
      E2E_FIXTURES.classes[0].id,
      E2E_FIXTURES.classes[2].id,
    ]);
  });

  test("mapa permanece lazy e rota continua disponível", async ({ page }) => {
    await page.goto("/");
    await dismissFeaturedPopup(page);

    const mapFrame = page.locator(
      `iframe[title="Mapa de ${E2E_FIXTURES.location.name}"]`,
    );
    await expect(mapFrame).toHaveCount(0);

    const locationHeading = page.getByRole("heading", {
      name: E2E_FIXTURES.location.name,
    });
    await locationHeading.scrollIntoViewIfNeeded();
    await expect(locationHeading).toBeVisible();
    await expect(
      page.getByText(E2E_FIXTURES.location.address, { exact: true }),
    ).toBeVisible();

    await expect(mapFrame).toHaveCount(1);

    const directions = page.getByRole("link", { name: "Traçar rota" }).first();
    await expect(directions).toHaveAttribute(
      "href",
      /google\.com\/maps\/dir\/\?api=1&destination=/,
    );
  });

  test("evento futuro aparece, evento passado fica fora e CTAs usam WhatsApp correto", async ({ page }) => {
    await page.goto("/eventos");

    await expect(page.getByText(E2E_FIXTURES.event.title)).toBeVisible();
    await expect(page.getByText(E2E_FIXTURES.pastEvent.title)).toHaveCount(0);

    await page.getByRole("link", { name: "Ver evento" }).click();
    await expect(page).toHaveURL(new RegExp(`/eventos/${E2E_FIXTURES.event.slug}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: E2E_FIXTURES.event.title }),
    ).toBeVisible();

    const normalizedPhone = `55${E2E_FIXTURES.event.phone}`;
    await expect(page.getByRole("link", { name: "Reservar mesa" })).toHaveAttribute(
      "href",
      `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(E2E_FIXTURES.event.reservationMessage)}`,
    );
    await expect(page.getByRole("link", { name: "Comprar ingresso" })).toHaveAttribute(
      "href",
      `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(E2E_FIXTURES.event.ticketMessage)}`,
    );
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

    await page.getByText("Abrir menu", { exact: true }).click();
    const mobileNavigation = page.getByRole("navigation", { name: "Navegação móvel" });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole("link", { name: "Aulas", exact: true }).click();

    await expect(page).toHaveURL(/\/aulas$/);
    await expect(page.getByRole("heading", { name: /Aulas/ }).first()).toBeVisible();
  });
});
