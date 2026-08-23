// Dummy API service layer to prepare for Python backend integration

/**
 * FUTURE PYTHON INTEGRATION:
 * 
 * Replace the dummy data imports with actual fetch calls to your Python backend.
 * Example Python backend endpoints:
 * 
 * GET http://localhost:5000/api/sensors -> returns current sensor data
 * GET http://localhost:5000/api/advisory -> returns AI prediction and recommendation
 * GET http://localhost:5000/api/alerts -> returns recent system alerts
 */

import { mockSensorData, mockAdvisory, mockAlerts, mockChartData } from '../data/mockData';

// Simulated API calls with promises
export const fetchSensorData = async () => {
  // return fetch('http://localhost:5000/api/sensors').then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSensorData);
    }, 500);
  });
};

export const fetchAdvisoryData = async () => {
  // return fetch('http://localhost:5000/api/advisory').then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAdvisory);
    }, 500);
  });
};

export const fetchAlertsData = async () => {
  // return fetch('http://localhost:5000/api/alerts').then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlerts);
    }, 500);
  });
};

export const fetchChartData = async () => {
  // return fetch('http://localhost:5000/api/history').then(res => res.json());
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockChartData);
    }, 500);
  });
};
