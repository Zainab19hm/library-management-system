# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\checkout.spec.js >> User can browse books, add to cart, and reach checkout
- Location: tests\e2e\checkout.spec.js:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:5000/user/userLogin", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e7]: 
    - heading "User Login" [level=2] [ref=e8]
  - generic [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: 
        - text: Email Address
      - textbox "Email Address" [ref=e14]:
        - /placeholder: Enter your email
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]: 
        - text: Password
      - textbox "Password" [ref=e18]:
        - /placeholder: Enter your password
    - button "Login" [ref=e19] [cursor=pointer]:
      - generic [ref=e20]: 
      - text: Login
  - generic [ref=e21]:
    - text: New user?
    - link "Create an account" [ref=e22] [cursor=pointer]:
      - /url: /user/register
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('User can browse books, add to cart, and reach checkout', async ({ page }) => {
  4  |     await page.goto('http://localhost:5000/');
  5  | 
> 6  |     await page.goto('http://localhost:5000/user/userLogin');
     |                ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  |     await page.fill('input[name="email"]', 'test@user.com'); 
  8  |     await page.fill('input[name="password"]', 'password123');
  9  |     await page.click('button[type="submit"]');
  10 | 
  11 |     await page.goto('http://localhost:5000/user/books');
  12 |     await page.click('button:has-text("Add to Cart")'); 
  13 | 
  14 |     await page.goto('http://localhost:5000/user/cart');
  15 |     await expect(page.locator('body')).toContainText('Checkout'); 
  16 | });
```