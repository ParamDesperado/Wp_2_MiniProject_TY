export const mockSensorData = {
  soilMoisture: 32,
  temperature: 31,
  humidity: 68,
  rainfall: 2,
  waterLevel: 74,
};

export const mockAlerts = [
  { id: 1, type: 'warning', message: 'Low soil moisture detected in sector A', time: '10 mins ago' },
  { id: 2, type: 'critical', message: 'High temperature alert - heat wave expected', time: '1 hour ago' },
  { id: 3, type: 'normal', message: 'All sensors connected successfully', time: '2 hours ago' },
];

export const mockAdvisory = {
  recommendation: 'Irrigate Today',
  status: 'critical', // can be normal, warning, critical
  reasons: [
    'Soil moisture is below 40% (current: 32%)',
    'Temperature is high (31°C)',
    'No significant rainfall expected'
  ],
  nextIrrigation: 'Today, 6:00 PM',
  waterQuantity: '20,000 Liters / Hectare'
};

export const mockChartData = [
  { time: '08:00', moisture: 42, temp: 24 },
  { time: '10:00', moisture: 38, temp: 27 },
  { time: '12:00', moisture: 35, temp: 30 },
  { time: '14:00', moisture: 32, temp: 31 },
  { time: '16:00', moisture: 30, temp: 31 },
];
