// Writes every "doing" request (POST / DELETE) into the ActivityLog collection.
import ActivityLog from '../models/ActivityLog.js';

const ACTIONS = [
  ['POST /api/auth/register', 'Registered new account'],
  ['POST /api/auth/login', 'Logged in'],
  ['POST /api/auth/demo', 'Logged in with demo account'],
  ['POST /api/sensors/simulate', 'Simulated weather reading'],
  ['POST /api/sensors', 'Entered manual sensor reading'],
  ['POST /api/irrigation', 'Irrigated the field'],
  ['POST /api/admin/users', 'Added a user'],
  ['DELETE /api/admin/users', 'Deleted a user'],
  ['POST /api/admin/sample-data', 'Loaded sample data'],
];

export default function activity(req, res, next) {
  if (req.method === 'GET') return next();
  res.on('finish', () => {
    const call = `${req.method} ${req.originalUrl}`;
    const match = ACTIONS.find(([prefix]) => call.startsWith(prefix));
    if (!match) return; // e.g. "Erase everything" is not logged (the log was just wiped)
    ActivityLog.create({
      action: match[1],
      user: req.user?.email || req.body?.email || 'unknown',
      success: res.statusCode < 400,
      request: `${call} → ${res.statusCode}`,
    }).catch(() => {});
  });
  next();
}
