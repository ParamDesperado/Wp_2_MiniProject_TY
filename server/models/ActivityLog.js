// Every action done on the website (register, login, simulate, irrigate…) is written here.
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: String,  // "Logged in", "Irrigated field"…
  user: String,    // who did it
  success: Boolean,
  request: String, // the raw API call, e.g. "POST /api/irrigation"
}, { timestamps: true });

export default mongoose.model('ActivityLog', activitySchema);
