// Wipes the database and fills it with sample data. Run with: npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import { createSampleUsers, seedSensorData } from './seedData.js';

await mongoose.connect(process.env.MONGO_URI);
await mongoose.connection.dropDatabase();
await createSampleUsers();
await seedSensorData();
console.log('Seeded. Demo login -> param@agrisense.com / 1234');
await mongoose.disconnect();
