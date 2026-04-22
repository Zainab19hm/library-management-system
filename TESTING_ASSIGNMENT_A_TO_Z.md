# Software Testing Practical — A to Z Execution Guide (Library Management System)

This guide translates your assignment sheet into **concrete tasks** for this repository.
It tells you:

- what to do,
- the exact commands/files,
- expected result,
- and how to verify you did it correctly.

---

## 0) Project Baseline (do this first)

### Task
Prepare and run the project locally.

### Steps
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create the MySQL database and tables from `database_setup.sql`.
3. Ensure DB config in `config/db.js` matches your local MySQL credentials.
4. Start app:
   ```bash
   npm run start
   ```
5. Open `http://localhost:5000`.

### Expected result
- Server starts without crash.
- Home page loads.
- User and admin login pages are reachable.

### How to verify correctness
- No startup errors in terminal.
- Manual check these routes:
  - `/`
  - `/user/userLogin`
  - `/admin/adminLogin`

---

## 1) CI/CD Pipeline with Security Check (GitHub Actions + Gitleaks)

### Task
Create a CI workflow that runs tests and scans secrets.

### Steps
1. Add workflow file:
   - `.github/workflows/ci.yml`
2. Include jobs:
   - `npm ci`
   - unit/integration test execution
   - `gitleaks` scan
3. Add Gitleaks config if needed:
   - `.gitleaks.toml` (optional)

### Minimal CI skeleton
```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitleaks/gitleaks-action@v2
```

### Expected result
- GitHub Actions starts automatically on push/PR.
- Test job passes.
- Gitleaks job passes with no leaks.

### How to verify correctness
- Repo “Actions” tab shows green check for CI.
- If a secret is committed intentionally in a test branch, Gitleaks fails (then remove immediately).

---

## 2) Unit Testing (core business logic)

### Task
Write unit tests for logic-heavy functions.

### Best targets in this repo
- `controllers/userController.js`
  - `updateCartQuantity`
  - `removeFromCart`
  - `getFilteredBooks`
- `controllers/adminController.js`
  - `updateOrderStatus` (mock model)

### Steps
1. Install framework (recommended Jest + Supertest):
   ```bash
   npm i -D jest supertest
   ```
2. Add scripts in `package.json`:
   - `test:unit`
   - `test:integration`
3. Create unit tests in `tests/unit/*.test.js`.
4. Mock `Book`, `User`, `Order` model calls.

### Expected result
- Unit tests run fast and independent from DB.
- Edge cases are covered (empty cart, invalid bookId, invalid action, missing filters).

### How to verify correctness
- Run:
  ```bash
  npm run test:unit
  ```
- Confirm pass rate and coverage report (if enabled).
- Ensure failed assertions clearly point to logic regressions.

---

## 3) Integration Testing

### Task
Test interaction between routes, middleware, controllers, and DB/session.

### Good integration scenarios
- Register → login → access protected page.
- Add-to-cart → update quantity → checkout.
- Admin login → add book → fetch book details.

### Steps
1. Export app from `index.js` (or create `app.js`) so Supertest can import without opening network port.
2. Create `tests/integration/*.test.js`.
3. Use test database (separate schema, e.g. `bookStore_test`).
4. Seed/cleanup data before and after tests.

### Expected result
- Endpoints work as a sequence.
- Middleware protections behave correctly (`401/redirect` when unauthorized).

### How to verify correctness
- Run:
  ```bash
  npm run test:integration
  ```
- Confirm status codes, redirects, and DB side effects are as expected.

---

## 4) Performance Testing

### Task
Measure at least one endpoint/flow under load.

### Recommended endpoint for this repo
- `GET /user/books` (catalog rendering)
- Optional: `POST /user/cart` and `/user/pay` flow

### Steps (k6 example)
1. Add script `performance/books-load.js`.
2. Simulate virtual users hitting selected endpoint.
3. Collect latency percentiles and failure rate.

### Example run
```bash
k6 run performance/books-load.js
```

### Expected result
- You get avg response time, p95, throughput, and error rate.
- You identify bottlenecks (DB query time, rendering delay, session handling).

### How to verify correctness
- Report includes:
  - VUs
  - duration
  - avg/p95 latency
  - requests/sec
  - non-2xx rate
- Save log/screenshot and include in repo.

---

## 5) E2E Testing with Playwright

### Task
Automate one real user scenario.

### Strong scenario for this repo
User registers/logs in, browses books, adds one to cart, checks out.

### Steps
1. Install Playwright:
   ```bash
   npm i -D @playwright/test
   npx playwright install
   ```
2. Add `playwright.config.js` and test file `tests/e2e/checkout.spec.js`.
3. Start app + DB.
4. Run tests:
   ```bash
   npx playwright test
   ```

### Expected result
- Browser automation passes all steps without manual intervention.

### How to verify correctness
- Playwright report shows green run.
- Save trace/video/screenshot for submission evidence.

---

## 6) In-Session Practical (TDD + AI + MCP + manual/visual)

### Task
Demonstrate testing workflow live.

### Steps
1. Pick a tiny feature change (e.g., prevent cart quantity > stock).
2. Write failing test first.
3. Implement minimal code to pass.
4. Refactor while keeping tests green.
5. Show manual/visual validation in browser.

### Expected result
- You can explain “red → green → refactor”.
- You can justify each assertion and test scope.

### How to verify correctness
- Demonstrate commit history or sequence:
  - failing test commit
  - implementation commit
  - cleanup/refactor commit
- Explain why this is unit/integration/e2e.

---

## 7) Bonus: Performance Optimization Case Study

### Task
Optimize one measurable bottleneck and prove improvement.

### High-impact candidates here
- Add DB indexing for frequent lookup fields.
- Reduce unnecessary book queries.
- Cache popular books list.

### Steps
1. Record baseline performance test numbers.
2. Implement optimization.
3. Re-run same test settings.
4. Compare before vs after.

### Expected result
- Numeric improvement (e.g., p95 drops from 900ms to 320ms).

### How to verify correctness
- Keep both reports in repo.
- Include short analysis of why performance improved.

---

## 8) Evaluation-Criteria Mapping Checklist

Use this before submission:

- [ ] CI pipeline exists and is passing (15%).
- [ ] Unit tests cover normal + edge cases (20%).
- [ ] Integration tests prove real component interaction (15%).
- [ ] Performance test has results summary (15%).
- [ ] At least one Playwright E2E scenario (15%).
- [ ] Ready to explain live TDD/AI process (20%).
- [ ] Optional optimization evidence (+10%).

---

## 9) Submission Checklist (from assignment sheet)

- [ ] Push code to GitHub/GitLab.
- [ ] README explains how to run all tests.
- [ ] CI status visible and green.
- [ ] Performance evidence included (log/report/screenshot).
- [ ] Team members listed (if group).
- [ ] Each member can explain any part of the work.

---

## 10) Definition of Done (DoD)

Your assignment is “done” only when:

1. All automated tests pass locally.
2. CI passes on remote.
3. Security scan passes.
4. You have evidence artifacts (screenshots/reports).
5. You can explain each test’s purpose and expected failure mode.

If any one of these is missing, submission is not fully complete.
