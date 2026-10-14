import { Router } from 'express';
import SensorReading from '../models/SensorReading.js';
import { getAdvice } from '../logic.js';

const router = Router();

// GET /api/advisory -> irrigation advice for the LATEST reading.
// All the maths is in getAdvice() in server/logic.js.
router.get('/', async (req, res) => {
  const latest = await SensorReading.findOne().sort({ createdAt: -1 });
  if (!latest) return res.json(null); // no readings yet
  res.json(getAdvice(latest));
});

export default router;
