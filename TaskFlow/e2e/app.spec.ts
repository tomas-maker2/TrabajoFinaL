import { test, expect } from '@playwright/test';

test('E2E-01: login exitoso redirige a /tasks', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', '1234');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/tasks/);
});

test('E2E-02: login fallido muestra mensaje de error', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'incorrecta');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page).not.toHaveURL(/\/tasks/);
});

test('E2E-03: crear tarea aparece en la lista', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', '1234');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tasks/);

  await page.fill('input[name="name"]', 'Tarea de prueba E2E');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Tarea de prueba E2E')).toBeVisible();
});

test('E2E-04: ruta protegida redirige a login', async ({ page }) => {
  await page.goto('/tasks');
  await expect(page).toHaveURL(/\/login/);
});

test('E2E-05: logout redirige a login', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', '1234');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/tasks/);

  await page.click('button.btn-logout');
  await expect(page).toHaveURL(/\/login/);
});
