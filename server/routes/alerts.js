import { Router } from 'express';
import Alert from '../models/Alert.js';

const router = Router();

// "10 mins ago" style text for the UI
const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - date) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

// GET /api/alerts            -> all alerts, newest first
// GET /api/alerts?type=critical -> only that type (used by the filter buttons)
router.get('/', async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(30);
  res.json(alerts.map(a => ({ id: a._id, type: a.type, message: a.message, time: timeAgo(a.createdAt) })));
});

export default router;
