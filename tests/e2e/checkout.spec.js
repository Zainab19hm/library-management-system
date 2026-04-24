const { test, expect } = require('@playwright/test');

test('User can browse books, add to cart, and reach checkout', async ({ page }) => {
    // Abort external fonts/scripts that cause timeouts
    await page.route('**/*', route => {
        if (route.request().url().includes('fontawesome.com') || route.request().url().includes('bootstrapcdn.com') || route.request().url().includes('jquery') || route.request().url().includes('jsdelivr.net')) {
            route.abort();
        } else {
            route.continue();
        }
    });

    await page.goto('http://localhost:5000/user/userLogin');
    await page.fill('input[name="email"]', 'test@user.com'); 
    await page.fill('input[name="password"]', 'password123');
    
    await Promise.all([
        page.waitForNavigation(),
        page.click('button[type="submit"]')
    ]);

    await page.goto('http://localhost:5000/user/books', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.btn-cart', { timeout: 10000 });
    await page.screenshot({ path: 'test-results/books_page.png' });
    await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/user/cart') && resp.request().method() === 'POST'),
        page.click('.btn-cart')
    ]);

    await page.goto('http://localhost:5000/user/cart', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toContainText('Checkout'); 
    await page.screenshot({ path: 'test-results/checkout_success.png' });
});