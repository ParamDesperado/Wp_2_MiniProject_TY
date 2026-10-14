// Endpoints behind the "Database" page in the app.
import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import SensorReading from '../models/SensorReading.js';
import Alert from '../models/Alert.js';
import IrrigationLog from '../models/IrrigationLog.js';
import ActivityLog from '../models/ActivityLog.js';
import { createUser } from './auth.js';
import { createSampleUsers, seedSensorData } from '../seedData.js';

const router = Router();

// GET /api/admin/overview -> every collection, for the tables
router.get('/overview', async (req, res) => {
  const [users, readings, alerts, irrigations, activity] = await Promise.all([
    User.find().sort({ createdAt: -1 }), // password is shown HASHED on purpose (to demo hashing)
    SensorReading.find().sort({ createdAt: -1 }).limit(100),
    Alert.find().sort({ createdAt: -1 }).limit(100),
    IrrigationLog.find().sort({ createdAt: -1 }).limit(100),
    ActivityLog.find().sort({ createdAt: -1 }).limit(100),
  ]);
  const { host, port, name } = mongoose.connection; // where the database lives
  res.json({ db: { host, port, name }, users, readings, alerts, irrigations, activity });
});

// POST /api/admin/users -> add a user from the Database page
router.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: `${user.name} added` });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

// DELETE /api/admin/users/:id -> remove a user
router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.userId) return res.status(400).json({ message: "You can't delete the account you're logged in with" });
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// POST /api/admin/sample-data -> clear readings/alerts/logs and load fresh random sample data
router.post('/sample-data', async (req, res) => {
  await Promise.all([SensorReading.deleteMany(), Alert.deleteMany(), IrrigationLog.deleteMany(), ActivityLog.deleteMany()]);
  await createSampleUsers();
  await seedSensorData();
  res.json({ message: 'Sample data loaded' });
});

// DELETE /api/admin/everything -> ERASE THE WHOLE DATABASE (users, readings, alerts, logs)
router.delete('/everything', async (req, res) => {
  await mongoose.connection.dropDatabase();
  res.json({ message: 'Database erased' });
});

export default router;
