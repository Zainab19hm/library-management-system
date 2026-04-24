const { test, expect } = require('@playwright/test');

test('landing page renders with expected title and role links', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Library Management System/i);
  await expect(page.getByRole('link', { name: /user/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /admin/i })).toBeVisible();
});
