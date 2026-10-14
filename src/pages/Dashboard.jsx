import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Thermometer, Wind, CloudRain, Waves, CloudSun, Shuffle, Keyboard, Radar, Brain, Sprout } from 'lucide-react';
import { fetchSensorData, fetchAdvisoryData, fetchAlertsData, fetchOptions, simulateReading, postSensorReading, irrigateNow } from '../services/api';
import LogicBox from '../components/LogicBox';

const EMPTY_MANUAL = { soilMoisture: '', temperature: '', humidity: '', rainfall: '', waterLevel: '' };

// The whole app in one page:  ① SENSE (get a reading)  →  ② ANALYSE (advice)  →  ③ ACT (irrigate)
const Dashboard = () => {
  const [reading, setReading] = useState(undefined); // latest reading (null = database empty)
  const [advice, setAdvice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [options, setOptions] = useState(null);      // dropdown lists + rule numbers
  const [choice, setChoice] = useState({ region: 'Maharashtra', weather: 'Sunny', timeOfDay: 'Afternoon' });
  const [manual, setManual] = useState(EMPTY_MANUAL);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState('');

  // Load everything from the backend
  const load = () =>
    Promise.all([fetchSensorData(), fetchAdvisoryData(), fetchAlertsData()]).then(([r, a, al]) => {
      setReading(r); setAdvice(a); setAlerts(al.slice(0, 4));
    });

  useEffect(() => { load(); fetchOptions().then(setOptions); }, []);

  const run = async (fn) => {
    setError('');
    try { await fn(); load(); } catch (e) { setError(e.message); }
  };

  // ① SENSE
  const getReading = (random) => run(async () => {
    const res = await simulateReading(random ? {} : choice);
    if (random) setChoice({ region: res.reading.region, weather: res.reading.weather, timeOfDay: res.reading.timeOfDay });
  });
  const saveManual = (e) => { e.preventDefault(); run(async () => { await postSensorReading(manual); setManual(EMPTY_MANUAL); }); };
  // ③ ACT
  const irrigate = () => run(irrigateNow);

  const R = options?.rules;
  const tiles = reading && R ? [
    { name: 'Soil Moisture', value: `${reading.soilMoisture}%`, icon: <Droplets size={20} />,
      bad: reading.soilMoisture < R.dryBelow ? 'Dry' : reading.soilMoisture > R.wetAbove ? 'Wet' : null },
    { name: 'Temperature', value: `${reading.temperature}°C`, icon: <Thermometer size={20} />,
      bad: reading.temperature > R.hotAbove ? 'Hot' : null },
    { name: 'Humidity', value: `${reading.humidity}%`, icon: <Wind size={20} />, bad: reading.humidity < 40 ? 'Dry air' : null },
    { name: 'Rainfall', value: `${reading.rainfall} mm`, icon: <CloudRain size={20} />, bad: reading.rainfall >= R.heavyRain ? 'Heavy' : null },
    { name: 'Water Tank', value: `${reading.waterLevel}%`, icon: <Waves size={20} />, bad: reading.waterLevel < R.lowTankBelow ? 'Low' : null },
  ] : [];

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>Hello, {localStorage.getItem('user_name') || 'Farmer'}</h1>
        <p>Sense the field → analyse the data → act on the advice</p>
      </header>

      {/* ① SENSE */}
      <section className="card step-card anim-fade-up">
        <div className="step-head"><span className="step-num">1</span><Radar size={18} /> <h3>Sense – get a sensor reading</h3></div>
        <p className="step-sub">No hardware is connected, so pick the conditions and the simulator makes realistic random readings.</p>
        {options && (
          <div className="sim-row">
            {[['region', 'State', options.regions], ['weather', 'Weather', options.weathers], ['timeOfDay', 'Time of day', options.times]].map(([key, label, list]) => (
              <div className="form-group" key={key}>
                <label>{label}</label>
                <select value={choice[key]} onChange={e => setChoice({ ...choice, [key]: e.target.value })}>
                  {list.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <button className="btn" onClick={() => getReading(false)}><CloudSun size={16} /> Get Reading</button>
            <button className="btn btn-ghost" onClick={() => getReading(true)}><Shuffle size={16} /> Random</button>
            <button className="btn btn-ghost" onClick={() => setShowManual(!showManual)}><Keyboard size={16} /> Type values</button>
          </div>
        )}
        {showManual && (
          <form className="sim-row" style={{ marginTop: '.9rem' }} onSubmit={saveManual}>
            {[['soilMoisture', 'Moisture %'], ['temperature', 'Temp °C'], ['humidity', 'Humidity %'], ['rainfall', 'Rain mm'], ['waterLevel', 'Tank %']].map(([k, label]) => (
              <div className="form-group" key={k}>
                <label>{label}</label>
                <input type="number" value={manual[k]} onChange={e => setManual({ ...manual, [k]: e.target.value })} />
              </div>
            ))}
            <button className="btn" type="submit">Save</button>
          </form>
        )}
        {error && <p className="msg" style={{ color: 'var(--danger)' }}>{error}</p>}

        {reading === null && <div className="empty-state">No readings yet – press <b>Get Reading</b>.</div>}
        {reading && (
          <>
            <div className="tile-grid">
              {tiles.map(t => (
                <div key={t.name} className={`tile ${t.bad ? 'tile-bad' : ''}`}>
                  <div className="tile-top">{t.icon}<span>{t.name}</span></div>
                  <div className="tile-value">{t.value}</div>
                  <div className="tile-status">{t.bad || 'OK'}</div>
                </div>
              ))}
            </div>
            <p className="step-sub" style={{ marginTop: '.75rem' }}>
              Reading from {reading.region ? `${reading.region} · ${reading.weather} · ${reading.timeOfDay}` : `${reading.source} entry`} at {new Date(reading.createdAt).toLocaleTimeString('en-IN')}
            </p>
            <LogicBox label="Show logic" sections={[
              { title: 'How the reading was made', steps: reading.steps },
              { title: 'Alert checks', steps: reading.alertSteps },
            ]} />
          </>
        )}
      </section>

      {/* ② ANALYSE + ③ ACT */}
      {advice && (
        <div className="two-col">
          <section className={`card step-card advice-card advice-${advice.status} anim-fade-up anim-delay-1`}>
            <div className="step-head"><span className="step-num">2</span><Brain size={18} /> <h3>Analyse – advice</h3></div>
            <div className="advice-title">{advice.recommendation}</div>
            <div className="advice-facts">
              <div><span>Water needed</span><b>{advice.waterQuantity}</b></div>
              <div><span>Next irrigation</span><b>{advice.nextIrrigation}</b></div>
            </div>
            <ul className="advice-reasons">{advice.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
            <LogicBox label="Show logic" steps={advice.steps} />
          </section>

          <section className="card step-card anim-fade-up anim-delay-2">
            <div className="step-head"><span className="step-num">3</span><Sprout size={18} /> <h3>Act – irrigate</h3></div>
            <p className="step-sub">Gives the advised water. The backend saves a new, wetter reading, an irrigation log and an alert.</p>
            <button className="btn big-btn" onClick={irrigate} disabled={advice.waterLitres === 0}>
              <Droplets size={18} /> {advice.waterLitres === 0 ? 'No water needed' : `Irrigate Now – ${advice.waterQuantity}`}
            </button>

            <h4 style={{ margin: '1.25rem 0 .5rem' }}>Latest alerts</h4>
            <div className="mini-alerts">
              {alerts.length === 0 && <p className="step-sub">No alerts</p>}
              {alerts.map(a => (
                <div key={a.id} className={`mini-alert mini-${a.type}`}><b>{a.type}</b> {a.message} <span>{a.time}</span></div>
              ))}
            </div>
            <Link to="/app/alerts" className="view-all">All alerts →</Link>
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
