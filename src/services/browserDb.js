// =====================================================================
//  DEMO MODE (used only on Vercel, where there is no MongoDB server).
//  The same API endpoints as server/routes/, running inside the browser.
//  Data is saved in the browser's localStorage instead of MongoDB.
//  The calculations come from the SAME file the real server uses: server/logic.js
// =====================================================================
import bcrypt from 'bcryptjs';
import { simulateReading, checkAlerts, getAdvice, applyIrrigation, timeOfDayFor, RULES, REGIONS, WEATHER, TIMES } from '../../server/logic.js';

const KEY = 'agrisense_db';
const EMPTY = () => ({ users: [], readings: [], alerts: [], irrigations: [], activity: [] });

// ---- tiny "database": one JSON object in localStorage ----
const load = () => { try { return { ...EMPTY(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return EMPTY(); } };
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));
const newId = () => Math.random().toString(16).slice(2, 10) + Date.now().toString(16);
const doc = (fields, at = new Date()) => ({ _id: newId(), ...fields, createdAt: at.toISOString(), updatedAt: at.toISOString() });
const newestFirst = (list) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
const latest = (db) => newestFirst(db.readings)[0] || null;

const SAMPLE_USERS = [
  { name: 'Param', email: 'param@agrisense.com', location: 'Pune, Maharashtra', crop: 'sugarcane' },
  { name: 'Ramesh Patil', email: 'ramesh@agrisense.com', location: 'Kolhapur, Maharashtra', crop: 'sugarcane' },
  { name: 'Sita Devi', email: 'sita@agrisense.com', location: 'Belagavi, Karnataka', crop: 'rice' },
];

const timeAgo = (iso) => {
  const mins = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

async function createSampleUsers(db) {
  for (const u of SAMPLE_USERS)
    if (!db.users.some(x => x.email === u.email)) db.users.push(doc({ ...u, password: await bcrypt.hash('1234', 10) }));
}

function seedSensorData(db) {
  const weather = ['Sunny', 'Cloudy', 'Heatwave'][Math.floor(Math.random() * 3)];
  for (let i = 5; i >= 0; i--) {
    const at = new Date(Date.now() - i * 2 * 3600 * 1000);
    const { reading, steps } = simulateReading({ region: 'Maharashtra', weather, timeOfDay: timeOfDayFor(at) });
    const { alerts, steps: alertSteps } = checkAlerts(reading);
    db.readings.push(doc({ ...reading, source: 'simulator', steps, alertSteps }, at));
    alerts.forEach(a => db.alerts.push(doc(a, at)));
  }
  db.alerts.push(doc({ type: 'normal', message: 'All sensors connected successfully' }));
}

function saveReading(db, values, steps) {
  const { alerts, steps: alertSteps } = checkAlerts(values);
  const reading = doc({ ...values, steps, alertSteps });
  db.readings.push(reading);
  alerts.forEach(a => db.alerts.push(doc(a)));
  return { reading, alerts };
}

const session = (user) => ({
  token: `local.${user._id}`,
  user: { name: user.name, email: user.email, location: user.location, crop: user.crop },
});

async function createUser(db, { name, email, password, location, crop }) {
  if (!name || !email || !password) throw [400, 'Please fill name, email and password'];
  if (password.length < 4) throw [400, 'Password must be at least 4 characters'];
  if (db.users.some(u => u.email === email.toLowerCase())) throw [409, 'Email already registered'];
  const user = doc({ name, email: email.toLowerCase(), password: await bcrypt.hash(password, 10), location, crop: crop || 'sugarcane' });
  db.users.push(user);
  return user;
}

// Same names as server/middleware/activity.js
const ACTIONS = [
  ['POST /auth/register', 'Registered new account'], ['POST /auth/login', 'Logged in'],
  ['POST /auth/demo', 'Logged in with demo account'], ['POST /sensors/simulate', 'Simulated weather reading'],
  ['POST /sensors', 'Entered manual sensor reading'], ['POST /irrigation', 'Irrigated the field'],
  ['POST /admin/users', 'Added a user'], ['DELETE /admin/users', 'Deleted a user'], ['POST /admin/sample-data', 'Loaded sample data'],
];

// ---- the "routes" ----
async function route(db, method, path, query, body, me) {
  const call = `${method} ${path}`;
  const needLogin = () => { if (!me) throw [401, 'Not logged in']; };

  // auth
  if (call === 'POST /auth/register') return [201, session(await createUser(db, body))];
  if (call === 'POST /auth/login') {
    const user = db.users.find(u => u.email === (body.email || '').toLowerCase());
    if (!user || !(await bcrypt.compare(body.password || '', user.password))) throw [401, 'Invalid email or password'];
    return [200, session(user)];
  }
  if (call === 'POST /auth/demo') {
    let user = db.users.find(u => u.email === SAMPLE_USERS[0].email);
    if (!user) { await createSampleUsers(db); user = db.users.find(u => u.email === SAMPLE_USERS[0].email); }
    if (db.readings.length === 0) seedSensorData(db);
    return [200, session(user)];
  }

  needLogin();

  // sensors
  if (call === 'GET /sensors/options')
    return [200, { regions: Object.keys(REGIONS), weathers: Object.keys(WEATHER), times: Object.keys(TIMES), rules: RULES }];
  if (call === 'GET /sensors/latest') return [200, latest(db)];
  if (call === 'GET /sensors/history')
    return [200, newestFirst(db.readings).slice(0, 10).reverse().map(r => ({
      time: new Date(r.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), moisture: r.soilMoisture, temp: r.temperature,
    }))];
  if (call === 'POST /sensors/simulate') {
    const { reading, steps } = simulateReading(body);
    return [201, saveReading(db, { ...reading, source: 'simulator' }, steps)];
  }
  if (call === 'POST /sensors') {
    const v = {};
    for (const k of ['soilMoisture', 'temperature', 'humidity', 'rainfall', 'waterLevel']) {
      v[k] = Number(body[k]);
      if (body[k] === '' || body[k] == null || Number.isNaN(v[k])) throw [400, `Please enter ${k}`];
    }
    return [201, saveReading(db, { ...v, source: 'manual' }, [`Values typed in manually: moisture ${v.soilMoisture}%, temp ${v.temperature}°C, humidity ${v.humidity}%, rain ${v.rainfall} mm, tank ${v.waterLevel}%`])];
  }

  // advice + irrigation
  if (call === 'GET /advisory') { const r = latest(db); return [200, r ? getAdvice(r) : null]; }
  if (call === 'POST /irrigation') {
    const last = latest(db);
    if (!last) throw [400, 'No sensor reading yet – simulate one first'];
    const advice = getAdvice(last);
    const { after, steps } = applyIrrigation(last.soilMoisture, advice.waterLitres);
    const { temperature, humidity, rainfall, waterLevel, region, weather, timeOfDay } = last;
    db.readings.push(doc({ soilMoisture: after, temperature, humidity, rainfall, waterLevel, region, weather, timeOfDay, source: 'irrigation',
      steps, alertSteps: ['Reading made by irrigation → one "Irrigation done" alert added'] }));
    const log = doc({ user: me.email, waterQuantity: advice.waterQuantity, moistureBefore: last.soilMoisture, moistureAfter: after });
    db.irrigations.push(log);
    db.alerts.push(doc({ type: 'normal', message: `Irrigation done by ${me.name}: ${advice.waterQuantity} (moisture ${last.soilMoisture}% → ${after}%)` }));
    return [201, { log, steps }];
  }

  // alerts
  if (call === 'GET /alerts')
    return [200, newestFirst(db.alerts).filter(a => !query.get('type') || a.type === query.get('type')).slice(0, 30)
      .map(a => ({ id: a._id, type: a.type, message: a.message, time: timeAgo(a.createdAt) }))];

  // database page
  if (call === 'GET /admin/overview')
    return [200, {
      db: { name: 'agrisense', mode: 'browser' },
      users: newestFirst(db.users), readings: newestFirst(db.readings), alerts: newestFirst(db.alerts),
      irrigations: newestFirst(db.irrigations), activity: newestFirst(db.activity),
    }];
  if (call === 'POST /admin/users') { const u = await createUser(db, body); return [201, { message: `${u.name} added` }]; }
  if (method === 'DELETE' && path.startsWith('/admin/users/')) {
    const id = path.split('/').pop();
    if (id === me._id) throw [400, "You can't delete the account you're logged in with"];
    db.users = db.users.filter(u => u._id !== id);
    return [200, { message: 'User deleted' }];
  }
  if (call === 'POST /admin/sample-data') {
    Object.assign(db, { readings: [], alerts: [], irrigations: [], activity: [] });
    await createSampleUsers(db);
    seedSensorData(db);
    return [200, { message: 'Sample data loaded' }];
  }
  if (call === 'DELETE /admin/everything') { Object.assign(db, EMPTY()); return [200, { message: 'Database erased' }]; }

  throw [404, 'Not found'];
}

// Called by src/services/api.js instead of fetch() when in demo mode. Returns { status, data } like a real response.
export async function browserRequest(method, fullPath, body = {}, token) {
  const db = load();
  const [path, qs = ''] = fullPath.split('?');
  const me = token?.startsWith('local.') ? db.users.find(u => u._id === token.slice(6)) : null;
  if (token && !me && !path.startsWith('/auth')) return { status: 401, data: { message: 'Account no longer exists' } };

  let status, data;
  try { [status, data] = await route(db, method, path, new URLSearchParams(qs), body, me); }
  catch (e) { if (!Array.isArray(e)) throw e; [status, data] = [e[0], { message: e[1] }]; }

  const action = method !== 'GET' && ACTIONS.find(([p]) => `${method} ${path}`.startsWith(p));
  if (action && path !== '/admin/everything')
    db.activity.push(doc({ action: action[1], user: me?.email || body.email || (path === '/auth/demo' ? SAMPLE_USERS[0].email : 'unknown'),
      success: status < 400, request: `${method} /api${fullPath} → ${status}` }));
  save(db);
  return { status, data };
}
