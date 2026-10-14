// Sample data used by `npm run seed`, the "Load sample data" button and the demo login.
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import SensorReading from './models/SensorReading.js';
import Alert from './models/Alert.js';
import { simulateReading, checkAlerts, timeOfDayFor } from './logic.js';

export const DEMO_USER = { name: 'Param', email: 'param@agrisense.com', location: 'Pune, Maharashtra', crop: 'sugarcane' };
const SAMPLE_USERS = [
  DEMO_USER,
  { name: 'Ramesh Patil', email: 'ramesh@agrisense.com', location: 'Kolhapur, Maharashtra', crop: 'sugarcane' },
  { name: 'Sita Devi', email: 'sita@agrisense.com', location: 'Belagavi, Karnataka', crop: 'rice' },
];

// Creates the sample users that don't exist yet (password for all: 1234)
export async function createSampleUsers() {
  for (const u of SAMPLE_USERS) {
    if (!(await User.exists({ email: u.email })))
      await User.create({ ...u, password: await bcrypt.hash('1234', 10) });
  }
}

// 6 RANDOM readings, one every 2 hours, using the weather simulator (nothing hard-coded)
export async function seedSensorData() {
  const weather = ['Sunny', 'Cloudy', 'Heatwave'][Math.floor(Math.random() * 3)];
  for (let i = 5; i >= 0; i--) {
    const at = new Date(Date.now() - i * 2 * 3600 * 1000);
    const { reading, steps } = simulateReading({ region: 'Maharashtra', weather, timeOfDay: timeOfDayFor(at) });
    const { alerts, steps: alertSteps } = checkAlerts(reading);
    await SensorReading.create({ ...reading, steps, alertSteps, createdAt: at, updatedAt: at });
    for (const a of alerts) await Alert.create({ ...a, createdAt: at, updatedAt: at });
  }
  await Alert.create({ type: 'normal', message: 'All sensors connected successfully' });
}
