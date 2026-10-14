# Demo Guide

## The idea in one line
**Sense → Analyse → Act.** Get a sensor reading → the backend works out the advice → you irrigate.

## Start
```
npm run dev
```
Open http://localhost:5173 → **Use demo account**.

## Pages
| Page | What it shows |
|---|---|
| **Dashboard** | Everything: ① Sense ② Analyse ③ Act |
| **History** | Chart of the last 10 readings |
| **Alerts** | All alerts, with filters |
| **Database** | Every MongoDB table and where the database runs. Add/delete users, load sample data, erase everything |
| **About** | Diagram: React → Express → MongoDB |

## Demo in 5 steps
1. **① Sense**: pick Rajasthan + Heatwave + Afternoon → **Get Reading** → **Show logic**.
2. **② Analyse**: the advice appears → **Show logic** to see the water formula.
3. **③ Act**: **Irrigate Now** → moisture jumps, the advice changes, and an alert appears.
4. **History**: the moisture line jumps up.
5. **Database**: add a user (the password shows as a hash), check the Activity Log, then **Erase everything**.

## Which file to open
| Question | File |
|---|---|
| Logic / formulas | `server/logic.js` |
| API URLs | `server/routes/` |
| Database tables | `server/models/` |
| Login / password | `server/routes/auth.js` |
| React → backend calls | `src/services/api.js` |
| The main page | `src/pages/Dashboard.jsx` |

## Show the database
MongoDB Compass → `mongodb://127.0.0.1:27017` → `agrisense`

## Simple answers
- **Sensors?** Simulated: state average + weather + time of day + a small random number.
- **AI?** No. It uses fixed rules, so every answer can be explained.
- **Password?** Stored as a bcrypt hash, which can't be reversed.
- **Logged in?** Login gives a JWT token. Every request carries it, and the server checks it.
