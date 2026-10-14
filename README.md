# AgriSense – Smart Irrigation Advisory

A MERN mini project (MongoDB · Express · React · Node.js). It gives sugarcane irrigation advice from sensor readings. No hardware is used: a built-in weather simulator makes the readings.

## Setup
```bash
brew services start mongodb-community   # start MongoDB
npm install
cp .env.example .env
npm run seed                            # sample data (optional)
npm run dev                             # API on :5001, website on http://localhost:5173
```
Demo login: `param@agrisense.com` / `1234` (or click **Use demo account**).

## Folders
```
src/pages/            React pages
src/services/api.js   every call from React to the backend
server/app.js         Express app (middleware + routes)
server/index.js       local start: connect MongoDB + listen
src/services/browserDb.js  online demo mode (used on Vercel)
server/routes/        API URLs
server/logic.js       all calculations (advice, simulator, alerts, irrigation)
server/models/        MongoDB collections
server/middleware/    login check (JWT) and activity log
```

## API
| Method | URL | What it does |
|---|---|---|
| POST | /api/auth/register, /login, /demo | create account / log in |
| POST | /api/sensors/simulate | random reading for chosen state + weather + time |
| POST | /api/sensors | save a typed-in reading |
| GET | /api/sensors/latest, /history, /options | readings + dropdown choices |
| GET | /api/advisory | advice + calculation steps |
| POST | /api/irrigation | irrigate (new reading + log + alert) |
| GET | /api/alerts?type= | alerts |
| GET | /api/admin/overview | every collection (Database page) |
| POST/DELETE | /api/admin/users | add / delete user |
| POST | /api/admin/sample-data | reload random sample data |
| DELETE | /api/admin/everything | erase the whole database |

## Two modes
| Where | Backend | Database |
|---|---|---|
| **Your laptop** (`npm run dev`) | Express API (`server/`) | MongoDB |
| **Vercel** (online) | Same endpoints, run in the browser (`src/services/browserDb.js`) | The browser's localStorage |

The switch is automatic: Vercel sets `VERCEL=1` while building (see `vite.config.js`). Both modes use the same calculations from `server/logic.js`. No database setup is needed online.

## Hosting on Vercel
1. vercel.com → **Add New → Project** → import `Wp_2_MiniProject_TY` from GitHub.
2. Leave every setting as it is (Vercel detects Vite) → **Deploy**.
3. Open the link → **Use demo account**.

See **DEMO_GUIDE.md** for the presentation script.
