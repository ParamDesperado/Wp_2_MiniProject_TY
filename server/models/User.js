// A farmer account. Passwords are stored HASHED (bcrypt), never as plain text.
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  location: String,
  crop: { type: String, default: 'sugarcane' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
