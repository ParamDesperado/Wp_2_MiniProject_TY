import React from 'react';
import { Leaf, Droplets, Sun, Calendar, Info } from 'lucide-react';

const stages = [
  { num:1, name:'Germination', time:'0-60 days', state:'completed' },
  { num:2, name:'Tillering', time:'60-120 days', state:'completed' },
  { num:3, name:'Grand Growth', time:'120-270 days', state:'active' },
  { num:4, name:'Maturity', time:'270-360 days', state:'pending' },
];

const CropInfo = () => (
  <div>
    <header className="page-header anim-fade-up">
      <h1>Crop Information</h1>
      <p>Essential data for sugarcane cultivation</p>
    </header>

    <div className="card crop-header-card anim-fade-up anim-delay-1">
      <div className="crop-main-info">
        <div className="crop-icon-large"><Leaf size={48} color="var(--primary)"/></div>
        <div>
          <h2>Sugarcane</h2>
          <p className="crop-stage">Current Stage: <strong>Grand Growth Phase</strong></p>
          <p className="crop-desc">A tall perennial grass cultivated for juice from which sugar is processed. Requires high temperatures and adequate water.</p>
        </div>
      </div>
    </div>

    <h3 className="section-title anim-fade-up anim-delay-2">Growth Stages</h3>
    <div className="card stages-container anim-fade-up anim-delay-2">
      {stages.map(s => (
        <div key={s.num} className={`stage-item ${s.state}`}>
          <div className="stage-marker">{s.num}</div>
          <div className="stage-info">
            <h4>{s.name}</h4>
            <p>{s.time}</p>
            {s.state === 'active' && <span className="stage-badge">Current</span>}
          </div>
        </div>
      ))}
    </div>

    <div className="req-grid">
      {[
        { icon:<Droplets size={28} color="var(--accent)"/>, title:'Water Requirement', val:'1500-2500 mm', desc:'Irrigate every 7-10 days during grand growth.' },
        { icon:<Sun size={28} color="var(--warning)"/>, title:'Temperature', val:'27°C - 38°C', desc:'Growth slows below 20°C.' },
        { icon:<Calendar size={28} color="var(--primary)"/>, title:'Duration', val:'12-18 Months', desc:'Depending on variety and planting season.' },
      ].map((r,i) => (
        <div key={i} className={`card req-card anim-fade-up anim-delay-${i+3}`}>
          {r.icon}
          <h3>{r.title}</h3>
          <p className="req-val">{r.val}</p>
          <p className="req-desc">{r.desc}</p>
        </div>
      ))}
    </div>

    <div className="card tips-card anim-fade-up anim-delay-5">
      <h3 style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.75rem'}}>
        <Info size={20} color="var(--primary)"/> Irrigation Tips
      </h3>
      <ul className="tips-list">
        <li><strong>Avoid waterlogging:</strong> Ensure proper drainage at all times.</li>
        <li><strong>Critical stages:</strong> Grand growth phase needs the most water. Stress here reduces yield.</li>
        <li><strong>Before harvest:</strong> Stop irrigation 15-20 days before harvest for better sugar recovery.</li>
      </ul>
    </div>
  </div>
);

export default CropInfo;
