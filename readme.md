## Prerequisites

- Node.js installed
- MySQL installed and running
- Python installed if you want to enable the local `pre-commit` hook
- (Optional) k6 for local performance tests

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Make sure your MySQL server is running.
   - Create a database named `library_db`.

3. **Run the app**
   ```bash
   npm run start
   ```

4. Open your browser and navigate to:
   - `http://localhost:5000`

## Test Commands

- Unit tests + coverage:
  ```bash
  npm run test:unit
  ```
- Integration tests:
  ```bash
  npm run test:integration
  ```
- All core automated tests:
  ```bash
  npm test
  ```
- Playwright E2E smoke test:
  ```bash
  npm run test:e2e
  ```
- Print performance run instructions:
  ```bash
  npm run test:perf:plan
  ```

## CI/CD Pipeline

GitHub Actions runs these stages on every push, pull request, and manual dispatch:

- **Testing Stage**: installs dependencies, runs unit tests with coverage, then integration tests.
- **E2E Stage**: runs Playwright smoke E2E test.
- **Security Scan Stage**: runs GitLeaks against the repository history after tests pass.
- **Performance Plan Stage**: prints repeatable performance execution steps.

## Local GitLeaks Pre-Commit Hook

To run GitLeaks before every commit:

1. Install `pre-commit`.
   ```bash
   pip install pre-commit
   ```
2. Install the repo hooks.
   ```bash
   pre-commit install
   ```
3. GitLeaks will now run automatically before each commit.

## How to reach full rubric score (24/24)

If your instructor requires evidence files, complete the following and attach artifacts:

1. **CI/CD + Security (4/4)**
   - Keep pipeline passing on PRs.
   - Upload coverage report artifact and enforce threshold in PR checks.

2. **Unit Testing (4/4)**
   - Add tests for success, edge, and error branches in business-critical controllers.
   - Keep coverage trend documented.

3. **Integration Testing (4/4)**
   - Add test DB-backed scenarios for cart/order/book flows.
   - Include setup + teardown scripts for deterministic runs.

4. **Performance Testing (4/4)**
   - Run `k6` using `tests/performance/books-catalog.k6.js`.
   - Save summary (p95/error/throughput + bottlenecks) in `docs/performance-results.md`.

5. **E2E Playwright (4/4)**
   - Keep smoke test in CI.
   - Add at least one authenticated user flow with seeded test data.

6. **In-session practical (4/4)**
   - Use `docs/testing-live-checklist.md` during your live session.
   - Fill TDD + MCP + manual testing evidence sections with timestamps/screenshots.
