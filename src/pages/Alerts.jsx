import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { mockAlerts } from '../data/mockData';

const icons = {
  critical: <AlertTriangle size={20} color="var(--danger)"/>,
  warning: <AlertCircle size={20} color="var(--warning)"/>,
  normal: <CheckCircle size={20} color="var(--success)"/>,
};

const allAlerts = [
  ...mockAlerts,
  { id:4, type:'warning', message:'Rainfall expected tomorrow. Hold irrigation.', time:'5 hours ago' },
  { id:5, type:'critical', message:'Soil Moisture Sensor 2 disconnected.', time:'1 day ago' },
  { id:6, type:'normal', message:'Irrigation cycle completed successfully.', time:'2 days ago' },
];

const Alerts = () => (
  <div>
    <header className="page-header anim-fade-up">
      <h1>Alerts & Notifications</h1>
      <p>System warnings and events</p>
    </header>

    <div className="card alerts-container anim-fade-up anim-delay-1">
      <div className="alerts-header-row">
        <h3>All Alerts</h3>
        <div className="alert-filters">
          <span className="filter active">All</span>
          <span className="filter">Critical</span>
          <span className="filter">Warnings</span>
        </div>
      </div>
      <div className="alerts-list-full">
        {allAlerts.map((a, i) => (
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

export default Alerts;
