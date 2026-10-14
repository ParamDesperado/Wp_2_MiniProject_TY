// A system notification. Created automatically when a sensor reading looks bad.
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  type: { type: String, enum: ['normal', 'warning', 'critical'], required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Alert', alertSchema);
