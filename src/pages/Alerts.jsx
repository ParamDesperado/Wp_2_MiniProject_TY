import React, { useEffect, useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { fetchAlertsData, fetchOptions } from '../services/api';
import LogicBox from '../components/LogicBox';

const icons = {
  critical: <AlertTriangle size={20} color="var(--danger)"/>,
  warning: <AlertCircle size={20} color="var(--warning)"/>,
  normal: <CheckCircle size={20} color="var(--success)"/>,
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('');  // '' = all, or 'critical' / 'warning' / 'normal'
  const [rules, setRules] = useState(null);   // thresholds from server/logic.js

  useEffect(() => { fetchOptions().then(o => setRules(o.rules)); }, []);

  // Re-fetch from the backend whenever the filter changes (backend filters in MongoDB).
  useEffect(() => {
    fetchAlertsData(filter).then(setAlerts);
  }, [filter]);

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>Alerts & Notifications</h1>
        <p>System warnings and events</p>
      </header>

      <div className="card alerts-container anim-fade-up anim-delay-1">
        <div className="alerts-header-row">
          <h3>All Alerts</h3>
          <div className="alert-filters">
            <span className={`filter ${filter === '' ? 'active' : ''}`} onClick={() => setFilter('')}>All</span>
            <span className={`filter ${filter === 'critical' ? 'active' : ''}`} onClick={() => setFilter('critical')}>Critical</span>
            <span className={`filter ${filter === 'warning' ? 'active' : ''}`} onClick={() => setFilter('warning')}>Warnings</span>
            <span className={`filter ${filter === 'normal' ? 'active' : ''}`} onClick={() => setFilter('normal')}>Normal</span>
          </div>
        </div>
        {rules && <LogicBox label="Show logic: when is an alert created?" steps={[
          'Every new sensor reading is checked against these rules (server/logic.js → checkAlerts):',
          `Moisture below ${rules.severeDryBelow}% → CRITICAL "Severe dryness"`,
          `Moisture below ${rules.dryBelow}% → WARNING "Low soil moisture"`,
          `Temperature above ${rules.alertHotAbove}°C → CRITICAL "High temperature"`,
          `Rainfall ${rules.heavyRain} mm or more → WARNING "Heavy rain – hold irrigation"`,
          `Water tank below ${rules.lowTankBelow}% → WARNING "Water tank low"`,
          'Pressing "Irrigate Now" → NORMAL "Irrigation done"',
        ]} />}
        <div className="alerts-list-full">
          {alerts.length === 0 && <div className="empty-state">No alerts.</div>}
          {alerts.map((a, i) => (
            <div key={a.id} className={`alert-card-full type-${a.type} anim-fade-up anim-delay-${Math.min(i+1, 5)}`}>
              <div className="alert-icon-container">{icons[a.type]}</div>
              <div className="alert-content-full">
                <h4>{a.type.charAt(0).toUpperCase() + a.type.slice(1)}</h4>
                <p>{a.message}</p>
                <span className="alert-time">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
