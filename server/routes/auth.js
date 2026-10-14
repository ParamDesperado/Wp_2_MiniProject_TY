import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SensorReading from '../models/SensorReading.js';
import { DEMO_USER, seedSensorData } from '../seedData.js';

const router = Router();

// Build the response sent to the frontend: a token + safe user info (no password).
const sendSession = (res, user, status = 200) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(status).json({
    token,
    user: { name: user.name, email: user.email, location: user.location, crop: user.crop },
  });
};

// Shared by /register and the "Add user" form on the Database page.
export async function createUser({ name, email, password, location, crop }) {
  if (!name || !email || !password) throw { status: 400, message: 'Please fill name, email and password' };
  if (password.length < 4) throw { status: 400, message: 'Password must be at least 4 characters' };
  if (await User.findOne({ email: email.toLowerCase() })) throw { status: 409, message: 'Email already registered' };
  const hashed = await bcrypt.hash(password, 10); // "1234" -> "$2b$10$..." (cannot be reversed)
  return User.create({ name, email, password: hashed, location, crop });
}

// POST /api/auth/register  -> create account
router.post('/register', async (req, res) => {
  try {
    sendSession(res, await createUser(req.body), 201);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

// POST /api/auth/login  -> check password, return token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  // bcrypt.compare hashes the typed password and checks it matches the stored hash
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  sendSession(res, user);
});

// POST /api/auth/demo -> one-click demo login. Re-creates the demo account
// (and sample readings) if the database was erased.
router.post('/demo', async (req, res) => {
  let user = await User.findOne({ email: DEMO_USER.email });
  if (!user) user = await User.create({ ...DEMO_USER, password: await bcrypt.hash('1234', 10) });
  if (!(await SensorReading.exists({}))) await seedSensorData();
  req.user = user; // for the activity log
  sendSession(res, user);
});

export default router;
