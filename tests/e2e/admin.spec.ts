import { expect, test, type Page } from "@playwright/test";

import { E2E_CLASS_ORDER, E2E_FIXTURES } from "./fixtures";

async function login(page: Page, email: string, password: string) {
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Senha").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
}

test.describe("autenticação e shell administrativo", () => {
  test("usuário deslogado é enviado para o login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Entrar no painel" }),
    ).toBeVisible();
  });

  test("usuário autenticado sem app_metadata admin não entra", async ({ page }) => {
    await login(page, E2E_FIXTURES.member.email, E2E_FIXTURES.member.password);

    await expect(page).toHaveURL(/\/admin\/login\?erro=acesso$/);
    await expect(page.getByRole("alert")).toContainText(
      "Esta conta não possui acesso administrativo.",
    );
  });

  test("admin entra, visualiza aulas em ordem e sai com segurança", async ({ page }) => {
    await login(page, E2E_FIXTURES.admin.email, E2E_FIXTURES.admin.password);

    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Conteúdo da Arte Nativa" }),
    ).toBeVisible();

    await page.goto("/admin/aulas");
    await expect(
      page.getByRole("heading", { level: 1, name: "Aulas e períodos" }),
    ).toBeVisible();
    await expect(page.getByText(`Período atual: ${E2E_FIXTURES.period.name}`)).toBeVisible();

    const classIds = await page
      .getByTestId("admin-class-row")
      .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-class-id")));
    expect(classIds).toEqual(E2E_CLASS_ORDER);

    await page.getByRole("button", { name: "Nova aula" }).click();
    await expect(page.getByLabel("Modalidade")).toBeVisible();
    await expect(page.getByLabel("Dia da semana")).toBeVisible();
    await expect(page.getByLabel("Período")).toBeVisible();
    await expect(page.getByLabel("Local")).toBeVisible();
    await expect(page.getByLabel("Horário inicial")).toBeVisible();
    await expect(page.getByLabel("Horário final")).toBeVisible();
    await expect(page.getByLabel(/Professor/i)).toHaveCount(0);
    await expect(page.getByLabel(/Nível/i)).toHaveCount(0);

    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});
