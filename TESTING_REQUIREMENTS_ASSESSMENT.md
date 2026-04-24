# Software Testing Practical — Repository Assessment

Assessment date: 2026-04-24

Scoring scale:
- 0 = Not implemented
- 1 = Minimal / incomplete
- 2 = Partially implemented
- 3 = Good implementation
- 4 = Excellent / comprehensive

## 1) CI/CD Pipeline with Security Check — **3/4 (Good)**
- GitHub Actions pipeline exists and triggers on push/PR/manual dispatch.
- It installs dependencies and runs unit + integration tests.
- A dedicated security stage runs GitLeaks.
- A local pre-commit GitLeaks hook is configured.

**Gap to reach 4/4:** add test coverage artifact/reporting and optional quality gates (coverage threshold, lint, dependency audit/SAST).

## 2) Unit Testing — **2/4 (Partial)**
- Unit tests exist for a core controller flow (`updateCartQuantity`) including success and invalid-action behavior.
- Current unit scope appears narrow (single controller path), with limited edge/error matrix.

**Gap to reach 4/4:** broaden unit coverage to business-critical controllers/services/models and add explicit error-path assertions.

## 3) Integration Testing — **2/4 (Partial)**
- Integration tests exist using Supertest for selected routes.
- DB and middleware are mocked, which is useful for route-level checks but not full component interaction.

**Gap to reach 4/4:** add tests against a real test DB (or containerized DB) for key CRUD/order flows and failure scenarios.

## 4) Performance Testing — **0/4 (Not implemented)**
- No load/performance test scripts or results were found.

**Gap to reach 4/4:** add at least one reproducible load test scenario (k6/Locust/JMeter) with baseline metrics and bottleneck notes.

## 5) E2E Testing using Playwright — **2/4 (Partial)**
- One Playwright E2E scenario exists covering login → browse → add-to-cart → checkout page.
- Test includes waits and screenshots.
- No CI execution path for E2E is currently defined in npm scripts/workflow.

**Gap to reach 4/4:** add multiple realistic E2E journeys, test data setup/teardown, and CI job integration.

## 6) In-Session Practical (Live) Readiness — **1/4 (Minimal evidence)**
- There is evidence of automated testing setup, but no direct artifacts for:
  - TDD with AI agents,
  - MCP-based testing workflow,
  - documented manual/visual test protocol.

**Gap to reach 4/4:** document and demo these practices in a concise checklist + session artifacts.

## Bonus: Performance Optimization Case Study — **0/4 (Not implemented)**
- No before/after performance case study found.

---

## Overall score
- **10/24 (41.7%)** across required sections.
- **Primary weaknesses:** performance testing, breadth/depth of unit + integration tests, and live-practical evidence.

## Priority improvement plan (tips focused on weak areas)
1. **Add performance baseline this week**
   - Pick one endpoint (e.g., catalog listing or checkout).
   - Run k6 with staged load (e.g., 10/50/100 virtual users).
   - Record p95 latency, error rate, throughput, CPU/memory.
2. **Strengthen integration realism**
   - Introduce a dedicated test DB schema.
   - Add seed/cleanup per suite.
   - Cover success + failure + boundary scenarios for books/cart/orders.
3. **Expand unit test matrix**
   - Target high-risk business logic first (stock updates, order total, auth/validation).
   - Add table-driven cases for edge inputs and error branches.
4. **Productionize E2E**
   - Add `test:e2e` script and CI job.
   - Keep tests deterministic (stable fixtures, explicit waits, isolated accounts).
5. **Prepare live-practical artifacts**
   - Create `docs/testing-live-checklist.md` with TDD + MCP + manual test evidence placeholders.
   - Include sample prompts/steps used during live session.
