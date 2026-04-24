import { test, expect } from '@playwright/test';

test('landing page renders with expected title and role buttons', async ({ page }) => {
  await page.goto('/'); // This navigates to your local server

  // Check the title
  await expect(page).toHaveTitle(/Library Management System/i);

  // FIX: Use getByRole('button') instead of 'link'
  await expect(page.getByRole('button', { name: /user/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /admin/i })).toBeVisible();
});