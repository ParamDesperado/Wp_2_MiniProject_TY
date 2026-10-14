import { Router } from 'express';
import SensorReading from '../models/SensorReading.js';
import Alert from '../models/Alert.js';
import { simulateReading, checkAlerts, RULES, REGIONS, WEATHER, TIMES } from '../logic.js';

const router = Router();

// Save a reading + any alerts it triggers. Returns everything the page needs to "show logic".
async function saveReading(values, steps) {
  const { alerts, steps: alertSteps } = checkAlerts(values);
  const reading = await SensorReading.create({ ...values, steps, alertSteps });
  await Alert.insertMany(alerts);
  return { reading, alerts };
}

// GET /api/sensors/options -> dropdown choices + the rule numbers (for the "logic" boxes)
router.get('/options', (req, res) => {
  res.json({ regions: Object.keys(REGIONS), weathers: Object.keys(WEATHER), times: Object.keys(TIMES), rules: RULES });
});

// GET /api/sensors/latest -> newest reading (null if database is empty)
router.get('/latest', async (req, res) => {
  res.json(await SensorReading.findOne().sort({ createdAt: -1 }));
});

// GET /api/sensors/history -> last 10 readings, oldest first (for the trend chart)
router.get('/history', async (req, res) => {
  const rows = await SensorReading.find().sort({ createdAt: -1 }).limit(10);
  res.json(rows.reverse().map(r => ({
    time: r.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    moisture: r.soilMoisture,
    temp: r.temperature,
  })));
});

// POST /api/sensors/simulate { region, weather, timeOfDay } -> random reading for that weather
// (this replaces real hardware; anything left empty is picked randomly)
router.post('/simulate', async (req, res) => {
  const { reading, steps } = simulateReading(req.body);
  res.status(201).json(await saveReading({ ...reading, source: 'simulator' }, steps));
});

// POST /api/sensors { soilMoisture, temperature, ... } -> type the values in yourself
router.post('/', async (req, res) => {
  const v = {};
  for (const k of ['soilMoisture', 'temperature', 'humidity', 'rainfall', 'waterLevel']) {
    v[k] = Number(req.body[k]);
    if (req.body[k] === '' || req.body[k] == null || Number.isNaN(v[k])) return res.status(400).json({ message: `Please enter ${k}` });
  }
  res.status(201).json(await saveReading({ ...v, source: 'manual' }, [`Values typed in manually: moisture ${v.soilMoisture}%, temp ${v.temperature}°C, humidity ${v.humidity}%, rain ${v.rainfall} mm, tank ${v.waterLevel}%`]));
});

export default router;
