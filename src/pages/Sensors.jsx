import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Wind, CloudRain, Waves, RefreshCw } from 'lucide-react';
import { mockSensorData, mockChartData } from '../data/mockData';

const Sensors = () => {
  // useState stores the current soil moisture reading and how many
  // times the sensor has been checked.
  const [moisture, setMoisture] = useState(mockSensorData.soilMoisture);
  const [checks, setChecks] = useState(0);

  // useEffect runs whenever `moisture` changes — here it just logs it,
  // the way we were taught to watch a piece of state with useEffect.
  useEffect(() => {
    console.log('Moisture updated:', moisture);
  }, [moisture]);

  const checkSensor = () => {
    const value = Math.floor(Math.random() * 101); // random 0-100
    setMoisture(value);
    setChecks((c) => c + 1);
  };

  const sensors = [
    { title: 'Soil Moisture', value: moisture, unit: '%', status: moisture < 40 ? { type: 'warning', text: 'Low' } : { type: 'normal', text: 'OK' }, icon: <Droplets size={22} />, color: 'var(--primary)' },
    { title: 'Temperature', value: mockSensorData.temperature, unit: '°C', status: { type: 'normal', text: 'Normal' }, icon: <Thermometer size={22} />, color: 'var(--warning)' },
    { title: 'Humidity', value: mockSensorData.humidity, unit: '%', status: { type: 'normal', text: 'Normal' }, icon: <Wind size={22} />, color: 'var(--accent)' },
    { title: 'Rainfall', value: mockSensorData.rainfall, unit: 'mm', status: { type: 'normal', text: 'Low' }, icon: <CloudRain size={22} />, color: 'var(--text-muted)' },
    { title: 'Water Level', value: mockSensorData.waterLevel, unit: '%', status: { type: 'normal', text: 'Good' }, icon: <Waves size={22} />, color: 'var(--primary-light)' },
  ];

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>Sensor Monitoring</h1>
        <p>Live data from your field sensors</p>
      </header>

      <div className="card anim-fade-up" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ fontWeight: 600 }}>{moisture < 40 ? 'Irrigation Needed' : 'Moisture is Sufficient'}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sensor checked {checks} time{checks === 1 ? '' : 's'} this session</p>
        </div>
        <button className="btn" onClick={checkSensor}><RefreshCw size={16} /> Check Sensor</button>
      </div>

      <div className="sensors-grid">
        {sensors.map((s, i) => (
          <div key={i} className={`card sensor-detail-card anim-fade-up anim-delay-${i + 1}`}>
            <div className="sensor-header">
              <div className="sensor-title">
                <div className="sensor-icon" style={{ background: 'var(--primary-tint)', color: s.color }}>{s.icon}</div>
                <h3>{s.title}</h3>
              </div>
              <span className={`status-badge badge-${s.status.type}`}>{s.status.text}</span>
            </div>
            <div className="sensor-value">{s.value}<span className="unit">{s.unit}</span></div>
          </div>
        ))}
      </div>

      <div className="card chart-card anim-fade-up anim-delay-3">
        <h3>Moisture & Temperature Trends</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,74,51,0.18)" />
            <XAxis dataKey="time" stroke="#264A33" tick={{ fontSize: 12 }} />
            <YAxis stroke="#264A33" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid var(--border-strong)', borderRadius: 12, color: 'var(--text)', boxShadow: 'var(--shadow)', fontFamily: 'var(--font-ui)', fontSize: '0.85rem' }} />
            <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="#0B4F28" strokeWidth={2.5} dot={{ r: 4, fill: '#0B4F28' }} />
            <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#6E4708" strokeWidth={2.5} dot={{ r: 4, fill: '#6E4708' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Sensors;
