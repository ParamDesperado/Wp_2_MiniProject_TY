import { Router } from 'express';
import IrrigationLog from '../models/IrrigationLog.js';
import SensorReading from '../models/SensorReading.js';
import Alert from '../models/Alert.js';
import { getAdvice, applyIrrigation } from '../logic.js';

const router = Router();

// POST /api/irrigation -> farmer irrigates the field with the advised amount of water.
// 1) work out water + new moisture  2) save a NEW reading  3) save a log  4) add an alert
router.post('/', async (req, res) => {
  const last = await SensorReading.findOne().sort({ createdAt: -1 });
  if (!last) return res.status(400).json({ message: 'No sensor reading yet – simulate one first' });

  const advice = getAdvice(last);
  const { after, steps } = applyIrrigation(last.soilMoisture, advice.waterLitres);

  const { temperature, humidity, rainfall, waterLevel, region, weather, timeOfDay } = last;
  await SensorReading.create({ soilMoisture: after, temperature, humidity, rainfall, waterLevel, region, weather, timeOfDay, source: 'irrigation',
    steps, alertSteps: ['Reading made by irrigation → one "Irrigation done" alert added'] });
  const log = await IrrigationLog.create({
    user: req.user.email, waterQuantity: advice.waterQuantity, moistureBefore: last.soilMoisture, moistureAfter: after,
  });
  await Alert.create({ type: 'normal', message: `Irrigation done by ${req.user.name}: ${advice.waterQuantity} (moisture ${last.soilMoisture}% → ${after}%)` });
  res.status(201).json({ log, steps });
});

export default router;
