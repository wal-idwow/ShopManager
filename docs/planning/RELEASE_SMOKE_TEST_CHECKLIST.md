# Release Smoke Test Checklist (Desktop + Mobile)

Run this checklist before sharing a release link.

## Build and Services
- [ ] Frontend production build succeeds (`npm run build` in `frontend`).
- [ ] Backend starts without errors (`node backend/index.js`).
- [ ] ngrok tunnel starts and provides an HTTPS URL.
- [ ] Root URL loads the app through ngrok.

## Desktop Smoke Tests
- [ ] Home page loads metrics without console errors.
- [ ] Products page loads and search filters products.
- [ ] Add/edit/delete product actions work.
- [ ] Transactions page loads and search filters transactions.
- [ ] Create purchase transaction updates stock correctly.
- [ ] Create sale transaction updates stock correctly.
- [ ] Admin page loads stats and health values.
- [ ] Admin refresh button updates displayed data.

## Mobile Smoke Tests
- [ ] Home page layout is readable on small screens.
- [ ] Product and transaction tables scroll horizontally when needed.
- [ ] Buttons are tappable and visible without overlap.
- [ ] Product search and transaction search fields are usable.
- [ ] Admin page cards stack and remain readable.

## Data Consistency Checks
- [ ] Home product count matches admin product count.
- [ ] Home transaction count matches admin transaction count.
- [ ] No orphaned transactions reported unless expected.

## Basic UX and Accessibility Checks
- [ ] Language toggle works (Arabic/English).
- [ ] Theme toggle works (light/dark).
- [ ] Tooltips appear on key action buttons.
- [ ] Error banners are visible and understandable when actions fail.

## Sign-off
- [ ] Desktop smoke checks passed.
- [ ] Mobile smoke checks passed.
- [ ] Release approved for sharing.
