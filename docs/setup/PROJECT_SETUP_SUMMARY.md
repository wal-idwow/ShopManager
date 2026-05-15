# MiniShop Project Setup Summary

**Last Updated**: May 13, 2026
**Project Status**: Live deployed via local backend + ngrok
**Environment**: Linux development and live phone testing

## Quick Reference

| Component | Stack | Port | Status |
|---|---|---|---|
| Backend | Node.js + Express + SQLite | 3000 | Running |
| Frontend | React 18 (built bundle) | Served by backend | Running |
| Database | SQLite (`better-sqlite3`) | Local file | Active |
| Public Access | ngrok tunnel | Forward to 3000 | Active during testing |

## Project Layout

- `backend/`: API, controllers, routes, SQLite access
- `frontend/`: React app source and production build
- `tests/`: backend and frontend tests
- `docs/planning/`: plans and prioritized tasks
- `docs/setup/`: setup and environment requirements

## Run Modes

### 1) Development Mode
Use this while editing frontend and backend separately.

```bash
cd /home/medal/Shop_Manager/backend
npm install
node index.js
```

```bash
cd /home/medal/Shop_Manager/frontend
npm install
npm start
```

### 2) Production-Style Local Mode (current live workflow)
Use this mode for deployment-like validation and phone testing.

```bash
cd /home/medal/Shop_Manager/frontend
npm run build
cd /home/medal/Shop_Manager
node backend/index.js
```

Backend serves `frontend/build` from port `3000`.

### 3) Public Testing via ngrok

```bash
cd /home/medal/Shop_Manager
npx ngrok http 3000
```

Use the generated HTTPS URL on other devices. If ngrok shows a browser warning page, continue once to reach the app.

## Core API Endpoints

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

### Transactions
- `GET /transactions`
- `GET /transactions/:id`
- `POST /transactions`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/health`
- `POST /api/admin/reset`
- `POST /api/admin/cleanup`

## Test Commands

### Backend
```bash
cd /home/medal/Shop_Manager/backend
npm test
```

### Frontend
```bash
cd /home/medal/Shop_Manager/frontend
npm test -- --watchAll=false
```

## Current Verified State

- Frontend build succeeds.
- Backend serves production build correctly.
- Admin and home screens now reflect the same live database values.
- Live URL tested in browser and on other phones.

## Next Setup Improvements

- Add `.env.example` files for backend and frontend.
- Add one-command start scripts for production-style mode.
- Add staging/production deployment targets beyond ngrok.
