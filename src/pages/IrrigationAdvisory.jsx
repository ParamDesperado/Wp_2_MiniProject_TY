import React from 'react';
import { Droplets, Thermometer, CloudRain, Cpu, CheckCircle } from 'lucide-react';
import { mockSensorData, mockAdvisory } from '../data/mockData';

const IrrigationAdvisory = () => (
  <div>
    <header className="page-header anim-fade-up">
      <h1>Irrigation Advisory</h1>
      <p>AI-driven recommendations based on real-time sensor data</p>
    </header>

    <div className="card advisory-main-card anim-fade-up anim-delay-1">
      <div className="advisory-header">
        <div className="ai-badge"><Cpu size={14}/> AI Powered</div>
        <h2 style={{fontSize:'1.2rem'}}>Advisory for Sugarcane</h2>
      </div>
      <div className="advisory-content">
        <div className="recommendation-box">
          <h3>Recommendation: <span className="highlight-critical">{mockAdvisory.recommendation}</span></h3>
          <div className="recommendation-details">
            <div className="detail-item">
              <CheckCircle size={18} color="var(--primary)"/>
              <p><strong>Time:</strong> {mockAdvisory.nextIrrigation}</p>
            </div>
            <div className="detail-item">
              <CheckCircle size={18} color="var(--primary)"/>
              <p><strong>Water:</strong> {mockAdvisory.waterQuantity}</p>
            </div>
          </div>
        </div>
        <div className="reason-box">
          <h3>Why?</h3>
          <ul>{mockAdvisory.reasons.map((r,i) => <li key={i}>{r}</li>)}</ul>
        </div>
      </div>
    </div>

    <h3 className="section-title anim-fade-up anim-delay-2">Current Field Conditions</h3>
    <div className="conditions-grid">
      {[
        { title:'Soil Moisture', val:`${mockSensorData.soilMoisture}%`, ideal:'60% - 80%', icon:<Droplets size={28} color="var(--primary)"/>, pct:mockSensorData.soilMoisture, pcls:'warning' },
        { title:'Temperature', val:`${mockSensorData.temperature}°C`, ideal:'25°C - 32°C', icon:<Thermometer size={28} color="var(--warning)"/>, pct:60, pcls:'normal' },
        { title:'Rainfall Prediction', val:'Low (0-2mm)', ideal:'No rain expected in 48h', icon:<CloudRain size={28} color="var(--accent)"/> },
      ].map((c,i) => (
        <div key={i} className={`card condition-card anim-fade-up anim-delay-${i+2}`}>
          <div className="condition-icon">{c.icon}</div>
          <div className="condition-info">
            <h4>{c.title}</h4>
            <div className="condition-value">{c.val}</div>
            <p>Ideal: {c.ideal}</p>
            {c.pct && <div className="progress-bar"><div className={`progress-fill ${c.pcls}`} style={{width:`${c.pct}%`}}/></div>}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default IrrigationAdvisory;
