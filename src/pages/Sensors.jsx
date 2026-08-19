import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Wind, CloudRain, Waves, RefreshCw } from 'lucide-react';
import { mockSensorData, mockChartData } from '../data/mockData';

const sensors = [
  { title:'Soil Moisture', value:mockSensorData.soilMoisture, unit:'%', status:{type:'warning',text:'Low'}, icon:<Droplets size={22}/>, color:'var(--primary)', updated:'Just now' },
  { title:'Temperature', value:mockSensorData.temperature, unit:'°C', status:{type:'normal',text:'Normal'}, icon:<Thermometer size={22}/>, color:'var(--warning)', updated:'2 min ago' },
  { title:'Humidity', value:mockSensorData.humidity, unit:'%', status:{type:'normal',text:'Normal'}, icon:<Wind size={22}/>, color:'var(--accent)', updated:'5 min ago' },
  { title:'Rainfall', value:mockSensorData.rainfall, unit:'mm', status:{type:'normal',text:'Low'}, icon:<CloudRain size={22}/>, color:'var(--text-muted)', updated:'10 min ago' },
  { title:'Water Level', value:mockSensorData.waterLevel, unit:'%', status:{type:'normal',text:'Good'}, icon:<Waves size={22}/>, color:'var(--primary-light)', updated:'1 min ago' },
];

const Sensors = () => (
  <div>
    <header className="page-header anim-fade-up">
      <h1>Sensor Monitoring</h1>
      <p>Live data from your field sensors</p>
    </header>

    <div className="sensors-grid">
      {sensors.map((s, i) => (
        <div key={i} className={`card sensor-detail-card anim-fade-up anim-delay-${i+1}`}>
          <div className="sensor-header">
            <div className="sensor-title">
              <div className="sensor-icon" style={{background:'var(--primary-tint)', color:s.color}}>{s.icon}</div>
              <h3>{s.title}</h3>
            </div>
            <span className={`status-badge badge-${s.status.type}`}>{s.status.text}</span>
          </div>
          <div className="sensor-value">{s.value}<span className="unit">{s.unit}</span></div>
          <div className="sensor-footer"><RefreshCw size={12}/> {s.updated}</div>
        </div>
      ))}
    </div>

    <div className="card chart-card anim-fade-up anim-delay-3">
      <h3>Moisture & Temperature Trends</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={mockChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,74,51,0.18)"/>
          <XAxis dataKey="time" stroke="#264A33" tick={{fontSize:12}}/>
          <YAxis stroke="#264A33" tick={{fontSize:12}}/>
          <Tooltip contentStyle={{background:'#FFFFFF',border:'1px solid var(--border-strong)',borderRadius:12,color:'var(--text)',boxShadow:'var(--shadow)',fontFamily:'var(--font-ui)',fontSize:'0.85rem'}}/>
          <Line type="monotone" dataKey="moisture" name="Moisture %" stroke="#0B4F28" strokeWidth={2.5} dot={{r:4,fill:'#0B4F28'}}/>
          <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#6E4708" strokeWidth={2.5} dot={{r:4,fill:'#6E4708'}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Sensors;
