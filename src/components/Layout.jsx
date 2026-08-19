import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Droplets } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = ({ setAuth }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setAuth={setAuth} />
      <div className="main-content">
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
            <Droplets size={20} color="var(--primary)"/>
            <span style={{fontWeight:700,color:'var(--primary)'}}>AgriSense</span>
          </Link>
        </div>
        <Outlet />
      </div>

      <style>{`
        .mobile-header { display:none; align-items:center; gap:1rem; }
        .menu-btn { background:none; border:none; color:var(--text); cursor:pointer; }
        @media (max-width:768px) {
          .mobile-header {
            display:flex; position:fixed; top:0; left:0; right:0;
            height:4rem; background:rgba(252,254,251,0.85); backdrop-filter:blur(22px) saturate(140%);
            z-index:50; padding:0 1rem; border-bottom:1px solid var(--border);
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
