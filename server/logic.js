// =====================================================================
//  THE "BRAIN" OF AGRISENSE — every calculation lives in this one file.
//  Each function also returns `steps`: the same calculation written in
//  plain words with the real numbers, shown on the website under
//  "Show logic".
// =====================================================================

// ---------- 1. The rules (change a number here and the whole app follows) ----------
export const RULES = {
  dryBelow: 40,             // soil moisture below 40% = too dry  -> irrigate
  wetAbove: 70,             // soil moisture above 70% = too wet  -> don't irrigate
  targetMoisture: 70,       // when we irrigate, we fill the soil up to 70%
  litresPerPercent: 1000,   // simplified: 1,000 litres per hectare raises moisture by 1%
  hotAbove: 32,             // above 32°C water evaporates faster...
  hotExtraPercent: 20,      // ...so we give 20% more water
  rainLitresPerMm: 10000,   // 1 mm of rain on 1 hectare = 10,000 litres (real fact)
  heavyRain: 10,            // 10 mm or more of rain -> skip irrigation
  severeDryBelow: 25,       // below 25% moisture -> critical alert
  alertHotAbove: 35,        // above 35°C -> critical alert
  lowTankBelow: 30,         // water tank below 30% -> warning alert
  maxMoisture: 90,          // soil can't hold more than 90%
};

const litres = (n) => `${Math.round(n).toLocaleString('en-IN')} L/ha`;
const signed = (n) => (n >= 0 ? `+ ${n}` : `− ${Math.abs(n)}`);
const clamp = (n, min, max) => Math.min(max, Math.max(min, Math.round(n)));
const randInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));
const pick = (obj) => { const keys = Object.keys(obj); return keys[randInt(0, keys.length - 1)]; };

// ---------- 2. Irrigation advice: how much water, and should we irrigate? ----------
export function getAdvice(r) {
  const R = RULES;
  const steps = [];

  // How much water would bring the soil up to the target?
  const shortage = Math.max(0, R.targetMoisture - r.soilMoisture);
  steps.push(`Target moisture is ${R.targetMoisture}%, current is ${r.soilMoisture}% → shortage = ${R.targetMoisture} − ${r.soilMoisture} = ${shortage}%`);
  let water = shortage * R.litresPerPercent;
  steps.push(`Water needed = ${shortage} × ${R.litresPerPercent.toLocaleString('en-IN')} litres = ${litres(water)}`);

  // Hot day? Add extra for evaporation.
  if (r.temperature > R.hotAbove) {
    const before = water;
    water = water * (1 + R.hotExtraPercent / 100);
    steps.push(`Temperature ${r.temperature}°C is above ${R.hotAbove}°C → add ${R.hotExtraPercent}%: ${litres(before)} × 1.2 = ${litres(water)}`);
  } else {
    steps.push(`Temperature ${r.temperature}°C is not above ${R.hotAbove}°C → no extra water`);
  }

  // Rain already gave some water for free.
  if (r.rainfall > 0) {
    const rainWater = r.rainfall * R.rainLitresPerMm;
    const before = water;
    water = Math.max(0, water - rainWater);
    steps.push(`Rain: ${r.rainfall} mm × 10,000 = ${litres(rainWater)} free water → ${litres(before)} − ${litres(rainWater)} = ${litres(water)}`);
  } else {
    steps.push('No rain → nothing to subtract');
  }

  // Final decision.
  let recommendation, status, nextIrrigation;
  if (r.rainfall >= R.heavyRain) {
    recommendation = 'Hold – Rain Is Enough'; status = 'normal'; nextIrrigation = 'Check again tomorrow'; water = 0;
    steps.push(`DECISION: rain ${r.rainfall} mm ≥ ${R.heavyRain} mm → skip irrigation`);
  } else if (r.soilMoisture < R.dryBelow) {
    recommendation = 'Irrigate Today'; status = 'critical'; nextIrrigation = 'Today, 6:00 PM';
    steps.push(`DECISION: moisture ${r.soilMoisture}% < ${R.dryBelow}% → soil too dry → irrigate today with ${litres(water)}`);
  } else if (r.soilMoisture <= R.wetAbove) {
    recommendation = 'Monitor Moisture'; status = 'normal'; nextIrrigation = 'In 2-3 days';
    steps.push(`DECISION: ${R.dryBelow}% ≤ ${r.soilMoisture}% ≤ ${R.wetAbove}% → healthy range → no urgent irrigation`);
  } else {
    recommendation = 'No Irrigation Needed'; status = 'warning'; nextIrrigation = 'In 5+ days';
    steps.push(`DECISION: moisture ${r.soilMoisture}% > ${R.wetAbove}% → soil already wet → do not irrigate`);
  }

  // Short reasons for the "Why?" box
  const reasons = [
    r.soilMoisture < R.dryBelow ? `Soil moisture is below ${R.dryBelow}% (current: ${r.soilMoisture}%)`
      : r.soilMoisture > R.wetAbove ? `Soil is already wet (current: ${r.soilMoisture}%)`
      : `Soil moisture is in the healthy range (current: ${r.soilMoisture}%)`,
    r.temperature > R.hotAbove ? `Temperature is high (${r.temperature}°C), water evaporates faster` : `Temperature is moderate (${r.temperature}°C)`,
    r.rainfall >= R.heavyRain ? `Heavy rain (${r.rainfall} mm) has watered the field` : r.rainfall > 0 ? `Light rain (${r.rainfall} mm) reduces water needed` : 'No rainfall',
  ];

  return { recommendation, status, nextIrrigation, waterLitres: Math.round(water), waterQuantity: litres(water), reasons, steps };
}

// ---------- 3. Irrigating: how much does moisture go up? ----------
export function applyIrrigation(moistureBefore, waterLitres) {
  const R = RULES;
  const rise = Math.round(waterLitres / R.litresPerPercent);
  const after = Math.min(moistureBefore + rise, R.maxMoisture);
  const steps = [
    `Water given = ${litres(waterLitres)}`,
    `Moisture rise = ${waterLitres.toLocaleString('en-IN')} ÷ ${R.litresPerPercent.toLocaleString('en-IN')} = +${rise}%`,
    `New moisture = ${moistureBefore} + ${rise} = ${moistureBefore + rise}%` + (moistureBefore + rise > R.maxMoisture ? ` → capped at ${R.maxMoisture}%` : ''),
  ];
  return { after, steps };
}

// ---------- 4. Alerts: which warnings does a reading trigger? ----------
export function checkAlerts(r) {
  const R = RULES;
  const alerts = [];
  const steps = [];
  const rule = (question, yes, alert) => {
    steps.push(`${question}? ${yes ? 'YES → ' + alert.type + ' alert' : 'no'}`);
    if (yes) alerts.push(alert);
  };
  rule(`Is moisture ${r.soilMoisture}% < ${R.severeDryBelow}%`, r.soilMoisture < R.severeDryBelow,
    { type: 'critical', message: `Severe dryness: soil moisture only ${r.soilMoisture}%` });
  rule(`Is moisture ${r.soilMoisture}% < ${R.dryBelow}%`, r.soilMoisture >= R.severeDryBelow && r.soilMoisture < R.dryBelow,
    { type: 'warning', message: `Low soil moisture detected (${r.soilMoisture}%)` });
  rule(`Is temperature ${r.temperature}°C > ${R.alertHotAbove}°C`, r.temperature > R.alertHotAbove,
    { type: 'critical', message: `High temperature alert (${r.temperature}°C)` });
  rule(`Is rainfall ${r.rainfall} mm ≥ ${R.heavyRain} mm`, r.rainfall >= R.heavyRain,
    { type: 'warning', message: `Heavy rain (${r.rainfall} mm) – hold irrigation` });
  rule(`Is water tank ${r.waterLevel}% < ${R.lowTankBelow}%`, r.waterLevel < R.lowTankBelow,
    { type: 'warning', message: `Water tank low (${r.waterLevel}%)` });
  return { alerts, steps };
}

// ---------- 5. Weather simulator (stands in for real hardware sensors) ----------
// Reading = typical value for the state + effect of weather + effect of time of day + small random wobble.
export const REGIONS = {
  Maharashtra:     { temperature: 30, humidity: 60, soilMoisture: 45 },
  Karnataka:       { temperature: 28, humidity: 65, soilMoisture: 48 },
  'Uttar Pradesh': { temperature: 29, humidity: 60, soilMoisture: 45 },
  'Tamil Nadu':    { temperature: 32, humidity: 70, soilMoisture: 40 },
  Punjab:          { temperature: 26, humidity: 55, soilMoisture: 50 },
  Rajasthan:       { temperature: 35, humidity: 30, soilMoisture: 25 },
  Kerala:          { temperature: 28, humidity: 80, soilMoisture: 65 },
};
export const WEATHER = {
  Sunny:    { temperature: +3,  humidity: -10, soilMoisture: -5,  rain: [0, 0] },
  Cloudy:   { temperature: -2,  humidity: +10, soilMoisture: 0,   rain: [0, 2] },
  Rainy:    { temperature: -4,  humidity: +25, soilMoisture: +25, rain: [10, 30] },
  Heatwave: { temperature: +8,  humidity: -20, soilMoisture: -15, rain: [0, 0] },
  Winter:   { temperature: -10, humidity: 0,   soilMoisture: +5,  rain: [0, 1] },
};
export const TIMES = {
  Morning:   { temperature: -3, humidity: +10 },
  Afternoon: { temperature: +4, humidity: -10 },
  Evening:   { temperature: 0,  humidity: 0 },
  Night:     { temperature: -6, humidity: +15 },
};

export function timeOfDayFor(date) {
  const h = date.getHours();
  return h >= 5 && h < 11 ? 'Morning' : h < 16 && h >= 11 ? 'Afternoon' : h >= 16 && h < 20 ? 'Evening' : 'Night';
}

export function simulateReading({ region, weather, timeOfDay } = {}) {
  region = REGIONS[region] ? region : pick(REGIONS);
  weather = WEATHER[weather] ? weather : pick(WEATHER);
  timeOfDay = TIMES[timeOfDay] ? timeOfDay : pick(TIMES);
  const base = REGIONS[region], w = WEATHER[weather], t = TIMES[timeOfDay];
  const steps = [`Chosen: ${region}, ${weather}, ${timeOfDay}`];

  const wobble = { temperature: randInt(-2, 2), humidity: randInt(-5, 5), soilMoisture: randInt(-5, 5) };

  const temperature = clamp(base.temperature + w.temperature + t.temperature + wobble.temperature, 0, 50);
  steps.push(`Temperature = ${base.temperature} (${region} average) ${signed(w.temperature)} (${weather}) ${signed(t.temperature)} (${timeOfDay}) ${signed(wobble.temperature)} (random) = ${temperature}°C`);

  const humidity = clamp(base.humidity + w.humidity + t.humidity + wobble.humidity, 5, 100);
  steps.push(`Humidity = ${base.humidity} ${signed(w.humidity)} (${weather}) ${signed(t.humidity)} (${timeOfDay}) ${signed(wobble.humidity)} (random) = ${humidity}%`);

  const soilMoisture = clamp(base.soilMoisture + w.soilMoisture + wobble.soilMoisture, 5, RULES.maxMoisture);
  steps.push(`Soil moisture = ${base.soilMoisture} ${signed(w.soilMoisture)} (${weather}) ${signed(wobble.soilMoisture)} (random) = ${soilMoisture}%`);

  const rainfall = randInt(w.rain[0], w.rain[1]);
  steps.push(`Rainfall = random number between ${w.rain[0]} and ${w.rain[1]} mm (${weather}) = ${rainfall} mm`);

  const waterLevel = clamp(randInt(25, 80) + (weather === 'Rainy' ? 20 : 0), 0, 100);
  steps.push(`Water tank = random 25–80%${weather === 'Rainy' ? ' + 20 (rain fills the tank)' : ''} = ${waterLevel}%`);

  return { reading: { soilMoisture, temperature, humidity, rainfall, waterLevel, region, weather, timeOfDay }, steps };
}
