// Values for the public landing page preview (not logged in, so no API call).
// Random on every page load, within realistic ranges — nothing hard-coded.
const rand = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

export const mockSensorData = {
  soilMoisture: rand(25, 75),
  temperature: rand(24, 36),
  humidity: rand(45, 85),
  rainfall: rand(0, 8),
  waterLevel: rand(40, 90),
};
