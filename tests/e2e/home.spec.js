const { test, expect } = require('@playwright/test');

test('landing page renders with expected title and role links', async ({ page }) => {
  await page.goto('http://localhost:5000');
  await expect(page).toHaveTitle(/Library Management System/i);
  // Change 'link' to 'button'
  await expect(page.getByRole('button', { name: /user/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /admin/i })).toBeVisible();
});
