// Local entry point: connect to MongoDB, then start the API on PORT.
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => console.log(`API running on http://localhost:${process.env.PORT}`));
}).catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
