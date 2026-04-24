const plan = `
Performance Test Execution Plan
===============================
1) Install k6 if not installed: https://grafana.com/docs/k6/latest/set-up/install-k6/
2) Start app in test mode:
   npm run start:test
3) In another terminal run:
   BASE_URL=http://127.0.0.1:5000 k6 run tests/performance/books-catalog.k6.js
4) Capture these metrics in your report:
   - p95 latency
   - error rate
   - requests/sec
   - bottleneck observations
5) Save output summary under docs/performance-results.md.
`;

console.log(plan.trim());
