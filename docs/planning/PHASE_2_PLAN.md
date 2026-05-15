# Phase 2 Development Plan: Security and Advanced Features

**Planned Period**: Q3 2026 (rolling)
**Status**: In planning after live deployment validation
**Last Updated**: May 13, 2026

## Current Baseline (Completed)

- [x] Core product and transaction flows are live.
- [x] Admin page is live and aligned with dashboard data.
- [x] Production build is served by backend on port 3000.
- [x] ngrok live URL tested in browser and on other phones.
- [x] Backend and frontend test suites are available.

## Phase 2 Objectives

- [ ] Add authentication and authorization.
- [ ] Deliver owner-focused analytics and reporting.
- [ ] Improve UI/UX for speed and mobile clarity.
- [ ] Increase automated coverage and release confidence.
- [ ] Prepare stable hosting beyond temporary ngrok tunnels.

## Sprint Plan

### Sprint 1: Authentication and Authorization (2 weeks)

Scope
- [ ] `backend/models/userModel.js`
- [ ] `backend/controllers/authController.js`
- [ ] `backend/routes/authRoutes.js`
- [ ] Auth middleware for JWT verification and roles
- [ ] Frontend auth screens and protected routes

Acceptance
- [ ] Register/login/logout flows work.
- [ ] Protected endpoints reject unauthorized access.
- [ ] Role checks enforce admin-only operations.

### Sprint 2: Reporting and Analytics (2 weeks)

Scope
- [ ] Sales trends by day/week/month
- [ ] Top products by quantity and revenue
- [ ] Profit margin by product
- [ ] Inventory turnover and low-stock alerts
- [ ] CSV/PDF exports

Acceptance
- [ ] Reports API returns consistent metrics.
- [ ] Reports screen renders charts and filters.
- [ ] Exports are downloadable and valid.

### Sprint 3: UX and Reliability (1 week)

Scope
- [ ] Search on products and transactions
- [ ] Better mobile table/list behavior
- [ ] Loading skeletons and improved empty states
- [ ] Toast feedback for mutations

Acceptance
- [ ] Critical flows stay usable on small screens.
- [ ] Loading and error states are clear and actionable.

### Sprint 4: Testing and Release Quality (1 week)

Scope
- [ ] Expand backend unit/integration tests
- [ ] Expand frontend component and screen tests
- [ ] Add end-to-end smoke tests for deployed route
- [ ] Add release checklist for desktop/mobile

Acceptance
- [ ] Backend coverage improves toward >80%.
- [ ] Frontend coverage improves toward >75%.
- [ ] Smoke tests pass before release.

## Technical Additions (Planned)

Backend packages
- `jsonwebtoken`
- `bcryptjs`
- `dotenv`

Frontend packages
- `jwt-decode`
- `recharts` (or equivalent)
- `react-hot-toast`

## Risks and Mitigation

- Auth scope creep: keep initial roles minimal (`admin`, `viewer`) then expand.
- Reporting complexity: ship core KPIs first, advanced slices second.
- Deployment instability: define stable hosting plan before heavy feature rollout.

## Definition of Done for Phase 2

- [ ] Authentication is active and enforced on protected routes.
- [ ] Reports provide actionable owner KPIs.
- [ ] Mobile UX is improved for daily operations.
- [ ] Coverage and smoke tests are integrated into release workflow.
- [ ] Staging/production deployment approach is documented.
