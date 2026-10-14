# Demo Guide (presenting on the Vercel site)

## The idea in one line
**Sense → Analyse → Act.** Get a sensor reading → the system works out the advice → you irrigate.

## Before the presentation
Open the Vercel link → **Use demo account**. If you tested earlier, go to **Database → Load sample data** for a clean start.

## Demo in 5 steps
1. **Dashboard ① Sense**: pick Rajasthan + Heatwave + Afternoon → **Get Reading** → **Show logic**.
2. **② Analyse**: the advice appears → **Show logic** to see the water formula.
3. **③ Act**: **Irrigate Now** → moisture jumps, the advice changes, and an alert appears.
4. **History**: the moisture line jumps up.
5. **Database**: add a user (the password shows as a hash), check the Activity Log, then **Erase everything** → register a new user.

## Show where the data is
Press **F12 → Application → Local Storage → `agrisense_db`**. That's the live data, in the same collections as the MongoDB version.

## If ma'am asks "where is the backend?" (say it honestly)
- *"The full backend is Express + MongoDB, in the `server/` folder."*
  - Show `server/routes/` (API URLs), `server/models/` (database tables) and `server/logic.js` (the rules).
- *"Vercel hosts static sites, so the online version runs the same endpoints and the same `logic.js` in the browser."*
  - That's `src/services/browserDb.js`, which saves to localStorage.
- *"Locally, `npm run dev` runs the real Express server with MongoDB."*

## Which file to open
| Question | File |
|---|---|
| Logic / formulas | `server/logic.js` |
| API URLs (Express) | `server/routes/` |
| Database tables (MongoDB) | `server/models/` |
| Login / password hashing | `server/routes/auth.js` |
| Online version of the API | `src/services/browserDb.js` |
| Where React calls the API | `src/services/api.js` |

## Simple answers
- **Sensors?** Simulated: state average + weather + time of day + a small random number.
- **AI?** No. It uses fixed rules, so every answer can be explained.
- **Password?** Stored as a bcrypt hash, which can't be reversed.
