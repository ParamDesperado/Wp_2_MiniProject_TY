// Record of every time the farmer pressed "Irrigate Now".
import mongoose from 'mongoose';

const irrigationSchema = new mongoose.Schema({
  user: { type: String, required: true },   // who did it (email)
  waterQuantity: String,                    // e.g. "20,000 Liters / Hectare"
  moistureBefore: Number,
  moistureAfter: Number,
}, { timestamps: true });

export default mongoose.model('IrrigationLog', irrigationSchema);
