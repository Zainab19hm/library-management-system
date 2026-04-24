const { test, expect } = require('@playwright/test');

test('User can browse books, add to cart, and reach checkout', async ({ page }) => {
    await page.goto('http://localhost:5000/');

    await page.goto('http://localhost:5000/user/userLogin');
    await page.fill('input[name="email"]', 'test@user.com'); 
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.goto('http://localhost:5000/user/books');
    await page.click('button:has-text("Add to Cart")'); 

    await page.goto('http://localhost:5000/user/cart');
    await expect(page.locator('body')).toContainText('Checkout'); 
});