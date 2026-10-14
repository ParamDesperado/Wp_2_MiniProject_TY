// One snapshot of all field sensors at a point in time.
import mongoose from 'mongoose';

const sensorSchema = new mongoose.Schema({
  soilMoisture: Number, // %
  temperature: Number,  // °C
  humidity: Number,     // %
  rainfall: Number,     // mm
  waterLevel: Number,   // % of water tank
  source: { type: String, default: 'simulator' }, // simulator / manual / irrigation
  region: String,       // e.g. Maharashtra (simulator only)
  weather: String,      // e.g. Sunny
  timeOfDay: String,    // e.g. Afternoon
  steps: [String],      // how this reading was made (shown under "Show logic")
  alertSteps: [String], // which alert rules were checked
}, { timestamps: true }); // createdAt = when the reading was taken

export default mongoose.model('SensorReading', sensorSchema);
