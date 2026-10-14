// Vercel entry point: every /api/... request runs this function (see vercel.json).
// Needs MONGO_URI (MongoDB Atlas connection string) in Vercel → Settings → Environment Variables.
import mongoose from 'mongoose';
import app from '../server/app.js';

let connecting = null; // reuse one connection between requests

export default async function handler(req, res) {
  // vercel.json sends /api/auth/demo as /api?path=auth/demo – rebuild the real URL for Express
  const url = new URL(req.url, 'http://localhost');
  if (url.searchParams.has('path')) {
    const path = url.searchParams.get('path');
    url.searchParams.delete('path');
    req.url = `/api/${path}${url.search}`;
  }

  if (!process.env.MONGO_URI) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: 'Database not connected: add MONGO_URI in Vercel → Settings → Environment Variables, then redeploy.' }));
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      connecting ??= mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
      await connecting;
    }
  } catch (err) {
    connecting = null;
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ message: `Cannot reach the database (${err.message}). Check MONGO_URI and Atlas Network Access (allow 0.0.0.0/0).` }));
  }

  return app(req, res);
}
