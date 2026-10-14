// Guards private routes: the request must carry "Authorization: Bearer <token>".
// The token is the JWT we handed out at login; we verify it and load the user.
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default async function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not logged in' });
  let id;
  try {
    id = jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return res.status(401).json({ message: 'Session expired, please log in again' });
  }
  const user = await User.findById(id).select('-password');
  if (!user) return res.status(401).json({ message: 'Account no longer exists' }); // e.g. after "Erase everything"
  req.userId = id;
  req.user = user;
  next();
}
