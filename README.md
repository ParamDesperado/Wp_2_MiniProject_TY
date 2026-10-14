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
api/index.js          Vercel start (same app)
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

## Deploying on Vercel
Frontend and backend deploy together: `api/index.js` runs the Express app as a Vercel function, and `vercel.json` sends every `/api/*` request to it. Vercel can't reach the MongoDB on your laptop, so it needs a free cloud database:
1. **MongoDB Atlas** (free M0 cluster) → *Database Access*: create a user → *Network Access*: allow `0.0.0.0/0` → *Connect → Drivers*: copy the connection string, and put `/agrisense` before the `?`.
2. **Vercel** → import the GitHub repo (framework: Vite) → *Environment Variables*: `MONGO_URI` = the Atlas string, `JWT_SECRET` = any secret word → **Deploy**.
3. Open the site → **Use demo account**. Sample data is created automatically.

Without `MONGO_URI`, the site still loads but login shows "Database not connected".

See **DEMO_GUIDE.md** for the presentation script.
