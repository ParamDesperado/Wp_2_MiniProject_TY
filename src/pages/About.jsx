import React from 'react';
import { Code, Server, Cpu, Database, ArrowRight } from 'lucide-react';
import { DEMO_MODE } from '../services/api';

const About = () => (
  <div>
    <header className="page-header anim-fade-up">
      <h1>About the Project</h1>
      <p>WP2 Laboratory Mini Project</p>
    </header>

    <div className="card about-main-card anim-fade-up anim-delay-1">
      <div className="project-title">
        <h2>Irrigation Advisory System for Sugarcane Crop using AI and Sensor-based Technology</h2>
      </div>
      <div className="about-section">
        <h3>The Problem</h3>
        <p>Farmers often irrigate crops based on guesswork or fixed schedules. This leads to over-irrigation, under-irrigation, water wastage, and reduced crop yield.</p>
      </div>
      <div className="about-section">
        <h3>Our Solution</h3>
        <p>A smart irrigation system that reads field sensor data and uses a transparent rule engine to suggest exactly when and how much to irrigate – and explains every calculation step by step.</p>
      </div>
    </div>

    <h3 className="section-title anim-fade-up anim-delay-2">Technologies</h3>
    <div className="tech-grid">
      {[
        { icon:<Code size={28} color="#61dafb"/>, title:'Frontend', desc:'React + Vite, React Router, Recharts' },
        { icon:<Server size={28} color="#3c873a"/>, title:'Backend', desc:'Node.js + Express REST API, JWT login, bcrypt' },
        { icon:<Database size={28} color="var(--primary)"/>, title:'Database', desc:'MongoDB + Mongoose (5 collections)' },
        { icon:<Cpu size={28} color="var(--warning)"/>, title:'Logic', desc:'Rule engine + weather simulator (server/logic.js)' },
      ].map((t,i) => (
        <div key={i} className={`tech-card anim-fade-up anim-delay-${i+2}`}>
          {t.icon}
          <h4>{t.title}</h4>
          <p>{t.desc}</p>
        </div>
      ))}
    </div>

    <h3 className="section-title anim-fade-up anim-delay-3">How it works</h3>
    <div className="card arch-card anim-fade-up anim-delay-3">
      {(DEMO_MODE ? [
        { title: 'React', sub: 'Pages', file: 'src/pages/' },
        { title: 'API layer', sub: 'Same endpoints + logic, run in the browser', file: 'src/services/browserDb.js' },
        { title: 'localStorage', sub: 'Browser database (online version)', file: 'agrisense_db' },
      ] : [
        { title: 'React', sub: 'Browser · localhost:5173', file: 'src/pages/' },
        { title: 'Express API', sub: 'Node.js · localhost:5001', file: 'server/routes/' },
        { title: 'MongoDB', sub: 'localhost:27017 · db "agrisense"', file: 'server/models/' },
      ]).map((b, i) => (
        <React.Fragment key={b.title}>
          {i > 0 && <ArrowRight className="arch-arrow" size={22} />}
          <div className="arch-box"><b>{b.title}</b><span>{b.sub}</span><code>{b.file}</code></div>
        </React.Fragment>
      ))}
    </div>
    {DEMO_MODE
      ? <p className="arch-note">Online version: every page talks to one API layer (<code>src/services/api.js</code>). On Vercel it runs the endpoints in the browser and saves to localStorage. The full Express + MongoDB server is in <code>server/</code> and starts with <code>npm run dev</code>. Both use the same rules from <code>server/logic.js</code>.</p>
      : <p className="arch-note">The page calls the API with <code>fetch</code> (<code>src/services/api.js</code>), the API runs the rules in <code>server/logic.js</code> and saves to MongoDB. See it live on the <b>Database</b> page or in MongoDB Compass.</p>}

    <h3 className="section-title anim-fade-up anim-delay-3">Team Members</h3>
    <div className="team-grid">
      <div className="card team-member glass-card anim-fade-up anim-delay-3">
        <div className="member-avatar">P</div>
        <h4>Param Sangani</h4>
        <p>Batch B2, IT</p>
        <span className="roll-no">16010424108</span>
      </div>
      <div className="card team-member glass-card anim-fade-up anim-delay-4">
        <div className="member-avatar" style={{background:'linear-gradient(135deg,#1565c0,#42a5f5)'}}>A</div>
        <h4>Ankit Vishvakarma</h4>
        <p>Batch B2, IT</p>
        <span className="roll-no">16010424120</span>
      </div>
      <div className="card team-member glass-card anim-fade-up anim-delay-5">
        <div className="member-avatar" style={{background:'linear-gradient(135deg,#574009,#7E5D0D)'}}>A</div>
        <h4>Aarya Thota</h4>
        <p>Batch B2, IT</p>
        <span className="roll-no">16010424115</span>
      </div>
    </div>
  </div>
);

export default About;
