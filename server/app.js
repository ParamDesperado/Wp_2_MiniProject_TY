// The Express app: middleware + all API routes. (Started by server/index.js locally, or api/index.js on Vercel.)
import express from 'express';
import cors from 'cors';
import auth from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import sensorRoutes from './routes/sensors.js';
import advisoryRoutes from './routes/advisory.js';
import alertRoutes from './routes/alerts.js';
import irrigationRoutes from './routes/irrigation.js';
import adminRoutes from './routes/admin.js';
import activity from './middleware/activity.js';

// Secret used to sign login tokens. Set JWT_SECRET in .env / Vercel; this fallback keeps the demo working.
process.env.JWT_SECRET ||= 'agrisense_demo_secret';

const app = express();
app.use(cors());          // allow the React app to call us
app.use(express.json());  // parse JSON request bodies

// Print every request in the terminal (great for showing live API calls)
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode}`));
  next();
});
app.use(activity); // save actions into the ActivityLog collection

app.use('/api/auth', authRoutes);                 // public: register / login
app.use('/api/sensors', auth, sensorRoutes);      // private: need a valid token
app.use('/api/advisory', auth, advisoryRoutes);
app.use('/api/alerts', auth, alertRoutes);
app.use('/api/irrigation', auth, irrigationRoutes);
app.use('/api/admin', auth, adminRoutes);

// Any error thrown in a route (Express 5 catches async ones too) ends up here
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

export default app;
