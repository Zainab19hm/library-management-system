# Software Testing Practical — 24/24 Readiness Pack

Assessment date: 2026-04-24

This repository now includes implementation + evidence templates for every rubric section.
If any section cannot be fully executed in this environment (for example: local k6 binary, live in-session recording), exact execution steps and artifact templates are provided.

## Rubric alignment summary

| Section | Status | What is implemented now | What to do for final submission proof |
|---|---|---|---|
| CI/CD + Security | ✅ Implemented | GitHub Actions runs unit, integration, E2E, GitLeaks, and performance-plan stages. | Attach CI run URL + passing checks screenshot. |
| Unit Testing | ✅ Implemented | Expanded unit tests now cover success, edge, and error paths in `updateCartQuantity` and `payForm`. | Keep tests green and include coverage report screenshot. |
| Integration Testing | ✅ Implemented | Route integration tests cover user/admin routes plus app home and 404 handling. | Add DB-backed integration suite for full runtime proof if required by instructor. |
| Performance Testing | 🟨 Implemented with runnable script + template | Added k6 script and repeatable execution plan; result template added. | Run k6 locally and paste real metrics in `docs/performance-results.md`. |
| E2E using Playwright | ✅ Implemented | Added deterministic Playwright smoke E2E with web server orchestration and CI job. | Keep E2E passing in CI and include run artifact. |
| In-session Practical (Live) | 🟨 Prepared with complete checklist | Added live checklist with TDD/MCP/manual-test evidence slots. | Fill checklist during session with timestamps/screenshots. |
| Bonus (Optimization Case Study) | 🟨 Prepared template | Added before/after performance results template. | Execute baseline + optimization + rerun and fill comparison table. |

## Exact execution steps for sections that require local/live evidence

### A) Performance test execution
1. Start server in test mode:
   ```bash
   npm run start:test
   ```
2. In a second terminal run:
   ```bash
   BASE_URL=http://127.0.0.1:5000 k6 run tests/performance/books-catalog.k6.js
   ```
3. Copy results into `docs/performance-results.md`.

### B) Live practical evidence capture
1. Open `docs/testing-live-checklist.md` during the session.
2. Complete every checkbox while performing TDD + MCP + manual testing.
3. Add timestamps and screenshot links before submission.

## Target outcome
Following the above steps and attaching generated artifacts is designed to satisfy all rubric evidence requirements and make the project submission ready for **24/24**.
