// API service layer: every call to the Express backend lives here.
// The login token (JWT) is kept in localStorage and sent with each request.
import { browserRequest } from './browserDb';

const BASE = '/api';

// On Vercel there is no MongoDB server, so the app switches to "demo mode":
// the same endpoints run inside the browser (see browserDb.js). Locally = real Express + MongoDB.
export const DEMO_MODE = import.meta.env.VITE_BROWSER_DB === 'true';

export const logoutLocally = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_name');
};

const request = async (path, options = {}) => {
  const token = localStorage.getItem('auth_token');
  let status, data;
  if (DEMO_MODE) {
    ({ status, data } = await browserRequest(options.method || 'GET', path, options.body ? JSON.parse(options.body) : {}, token));
  } else {
    const res = await fetch(BASE + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    status = res.status;
    data = await res.json().catch(() => ({}));
  }
  if (status >= 400) {
    // Token expired / invalid -> force a fresh login
    if (status === 401 && token) {
      logoutLocally();
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ---- Auth ----
export const registerUser = (form) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify(form) });
export const loginUser = (email, password) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const demoLogin = () => request('/auth/demo', { method: 'POST' });

// ---- Sensors (the simulator stands in for real hardware) ----
export const fetchSensorData = () => request('/sensors/latest');
export const fetchChartData = () => request('/sensors/history');
export const fetchOptions = () => request('/sensors/options');
export const simulateReading = (choice) =>
  request('/sensors/simulate', { method: 'POST', body: JSON.stringify(choice) });
export const postSensorReading = (reading) =>
  request('/sensors', { method: 'POST', body: JSON.stringify(reading) });

// ---- Advice, irrigation, alerts ----
export const fetchAdvisoryData = () => request('/advisory');
export const irrigateNow = () => request('/irrigation', { method: 'POST' });
export const fetchAlertsData = (type = '') => request(`/alerts${type ? `?type=${type}` : ''}`);

// ---- Database page ----
export const fetchOverview = () => request('/admin/overview');
export const addUser = (form) => request('/admin/users', { method: 'POST', body: JSON.stringify(form) });
export const deleteUser = (id) => request(`/admin/users/${id}`, { method: 'DELETE' });
export const loadSampleData = () => request('/admin/sample-data', { method: 'POST' });
export const eraseEverything = () => request('/admin/everything', { method: 'DELETE' });
