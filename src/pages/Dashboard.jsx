import React from 'react';
import { Droplets, Thermometer, Wind, CloudRain, Waves, Zap, ArrowRight, TrendingDown } from 'lucide-react';
import { mockSensorData, mockAdvisory, mockAlerts } from '../data/mockData';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, status, delay }) => (
  <div className={`stat-card card anim-fade-up anim-delay-${delay}`}>
    <div className="stat-icon" style={{ background: `${color}18`, color }}>
      {icon}
    </div>
    <div className="stat-details">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
      {status && <div className={`stat-status status-${status.type}`}>● {status.text}</div>}
    </div>
  </div>
);

const Dashboard = () => {
  const moisture = mockSensorData.soilMoisture;
  const rec = moisture < 40
    ? { title: 'Irrigation Recommended', cls: 'critical', icon: <TrendingDown size={18}/> }
    : moisture <= 70
      ? { title: 'Moisture Level Normal', cls: 'normal', icon: <Zap size={18}/> }
      : { title: 'Irrigation Not Required', cls: 'warning', icon: <Zap size={18}/> };

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>Welcome back, Param</h1>
        <p>Here's your farm overview for today</p>
      </header>

      {/* Hero Banner */}
      <div className="hero-banner anim-fade-up anim-delay-1">
        <div className={`rec-badge rec-${rec.cls}`}>
          {rec.icon} {rec.title}
        </div>
        <h2>
          {moisture < 40
            ? 'Your sugarcane needs water today'
            : 'Your crop is doing well'}
        </h2>
        <p>
          Soil moisture at <strong style={{color:'var(--primary)'}}>{moisture}%</strong> · 
          Temperature {mockSensorData.temperature}°C · 
          Next irrigation: <strong>{mockAdvisory.nextIrrigation}</strong>
        </p>
        <Link to="/app/advisory" className="btn" style={{marginTop:'1.25rem'}}>
          View Full Advisory <ArrowRight size={16}/>
        </Link>
      </div>

      {/* Sensor Stats */}
      <div className="stats-grid">
        <StatCard title="Soil Moisture" value={`${mockSensorData.soilMoisture}%`}
          icon={<Droplets size={22}/>} color="var(--primary)"
          status={moisture < 40 ? {type:'warning',text:'Low'} : {type:'normal',text:'OK'}} delay={1} />
        <StatCard title="Temperature" value={`${mockSensorData.temperature}°C`}
          icon={<Thermometer size={22}/>} color="var(--warning)" delay={2} />
        <StatCard title="Humidity" value={`${mockSensorData.humidity}%`}
          icon={<Wind size={22}/>} color="var(--accent)" delay={3} />
        <StatCard title="Rainfall" value={`${mockSensorData.rainfall} mm`}
          icon={<CloudRain size={22}/>} color="#b0bec5" delay={4} />
        <StatCard title="Water Level" value={`${mockSensorData.waterLevel}%`}
          icon={<Waves size={22}/>} color="var(--primary-light)" delay={5} />
      </div>

      {/* Bottom Grid */}
      <div className="dashboard-grid">
        <div className="card alerts-widget anim-fade-up anim-delay-3">
          <h3>Recent Alerts</h3>
          <div className="alert-list">
            {mockAlerts.map(a => (
              <div key={a.id} className={`alert-item alert-${a.type}`}>
                <div className="alert-content">
                  <p>{a.message}</p>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/app/alerts" className="view-all">View All →</Link>
        </div>

        <div className="card info-widget anim-fade-up anim-delay-4">
          <h3>Crop Health</h3>
          <div className="health-status">
            <div className="health-circle">
              <span>Good</span>
            </div>
            <p>Sugarcane is in Grand Growth stage. Maintain moisture above 40%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
