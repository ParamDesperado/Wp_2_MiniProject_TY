import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Droplets, Activity, Leaf, Bell, Info, X, LogOut, Home, Database } from 'lucide-react';

const navItems = [
  { path: '/app/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { path: '/app/history', name: 'History', icon: <Activity size={18} /> },
  { path: '/app/crop', name: 'Crop Info', icon: <Leaf size={18} /> },
  { path: '/app/alerts', name: 'Alerts', icon: <Bell size={18} /> },
  { path: '/app/database', name: 'Database', icon: <Database size={18} /> },
  { path: '/app/about', name: 'About', icon: <Info size={18} /> },
];

const Sidebar = ({ mobileOpen, setMobileOpen, setAuth }) => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('user_name') || 'Farmer';

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_name');
    if (setAuth) setAuth(false);
    navigate('/login');
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <Droplets color="var(--primary)" size={24} />
            <h2>AgriSense</h2>
          </Link>
          <button className="close-btn" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}>
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
          <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
            <Home size={18} />
            <span>Back to Home</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{userName[0].toUpperCase()}</div>
            <div className="user-info">
              <span className="name">{userName}</span>
              <span className="role">Farmer</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
