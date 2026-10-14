import React, { useEffect, useState } from 'react';
import { RefreshCw, RotateCcw, Trash2, UserPlus, Users, Activity, Bell, Droplets, ListChecks } from 'lucide-react';
import { fetchOverview, logoutLocally, addUser, deleteUser, loadSampleData, eraseEverything } from '../services/api';
import LogicBox from '../components/LogicBox';

const fmt = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const EMPTY_USER = { name: '', email: '', password: '', location: '', crop: 'sugarcane' };

// Each tab = one MongoDB collection. `cols` = [column title, how to show it].
const TABS = [
  { key: 'users', label: 'Registered Users', collection: 'users', icon: <Users size={16} />,
    cols: [['Name', r => r.name], ['Email', r => r.email], ['Location', r => r.location || '-'], ['Crop', r => r.crop],
      ['Password (hashed)', r => <code title={r.password}>{r.password.slice(0, 22)}…</code>], ['Joined', r => fmt(r.createdAt)]],
    note: 'Everyone who registered. Passwords are stored as a bcrypt hash, never as plain text.',
    logic: ['You type the password "1234"', 'bcrypt mixes it with a random "salt" and scrambles it 1,024 times (2^10)',
      'Result looks like $2b$10$Xk9… – this is what MongoDB stores', 'It cannot be turned back into "1234"',
      'At login, bcrypt scrambles what you typed the same way and checks if the results match'] },
  { key: 'readings', label: 'Sensor Readings', collection: 'sensorreadings', icon: <Activity size={16} />,
    cols: [['Time', r => fmt(r.createdAt)], ['Source', r => r.source], ['Weather', r => r.region ? `${r.region}, ${r.weather}, ${r.timeOfDay}` : '-'],
      ['Moisture %', r => r.soilMoisture], ['Temp °C', r => r.temperature], ['Humidity %', r => r.humidity], ['Rain mm', r => r.rainfall], ['Tank %', r => r.waterLevel]],
    note: 'Every reading. Added by the simulator / manual entry on the Sensors page, and by "Irrigate Now".' },
  { key: 'alerts', label: 'Alerts', collection: 'alerts', icon: <Bell size={16} />,
    cols: [['Time', r => fmt(r.createdAt)], ['Type', r => <span className={`status-badge badge-${r.type}`}>{r.type}</span>], ['Message', r => r.message]],
    note: 'Created automatically by the alert rules when a reading is saved.' },
  { key: 'irrigations', label: 'Irrigation Log', collection: 'irrigationlogs', icon: <Droplets size={16} />,
    cols: [['Time', r => fmt(r.createdAt)], ['By', r => r.user], ['Water', r => r.waterQuantity], ['Moisture before', r => `${r.moistureBefore}%`], ['After', r => `${r.moistureAfter}%`]],
    note: 'One row each time "Irrigate Now" is pressed on the Advisory page.' },
  { key: 'activity', label: 'Activity Log', collection: 'activitylogs', icon: <ListChecks size={16} />,
    cols: [['Time', r => fmt(r.createdAt)], ['Action', r => r.action], ['User', r => r.user],
      ['Result', r => <span className={`status-badge badge-${r.success ? 'normal' : 'critical'}`}>{r.success ? 'success' : 'failed'}</span>], ['API call', r => <code>{r.request}</code>]],
    note: 'Every action on the website (register, login, simulate, irrigate…) – including failed logins.' },
];

const Database = () => {
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('users');
  const [form, setForm] = useState(EMPTY_USER);
  const [msg, setMsg] = useState(null);

  const load = () => fetchOverview().then(setData);
  useEffect(() => { load(); }, []);

  const run = async (fn) => {
    try { const r = await fn(); setMsg({ ok: true, text: r.message }); load(); }
    catch (e) { setMsg({ ok: false, text: e.message }); }
  };

  const onAddUser = (e) => {
    e.preventDefault();
    run(async () => { const r = await addUser(form); setForm(EMPTY_USER); return r; });
  };

  const onSample = () => {
    if (window.confirm('Replace readings, alerts and logs with fresh random sample data? (Users are kept)')) run(loadSampleData);
  };

  // Wipes EVERY collection. Your account is gone too, so we log out.
  const onErase = async () => {
    if (!window.confirm('ERASE THE ENTIRE DATABASE? All users, readings, alerts and logs will be deleted.')) return;
    await eraseEverything();
    logoutLocally();
    alert('Database erased. Register a new account or use the demo login.');
    window.location.href = '/login'; // full reload so the app forgets the old login
  };

  if (!data) return <p style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading database…</p>;
  const current = TABS.find(t => t.key === tab);
  const rows = data[tab];
  const cols = tab === 'users'
    ? [...current.cols, ['', r => <button className="link-btn" onClick={() => window.confirm(`Delete ${r.name}?`) && run(() => deleteUser(r._id))}>Delete</button>]]
    : current.cols;

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>Database Viewer</h1>
        {data.db.mode === 'browser'
          ? <p>Online demo mode: data is saved in this browser (localStorage). Run the project locally to use the real MongoDB.</p>
          : <p>Live contents of MongoDB database <strong>{data.db.name}</strong> running at <code>mongodb://{data.db.host}:{data.db.port}</code> – the same data you see in MongoDB Compass</p>}
      </header>

      <div className="stats-grid" style={{ marginBottom: '1.25rem' }}>
        {TABS.map(t => (
          <div key={t.key} className="card stat-card" style={{ cursor: 'pointer', outline: tab === t.key ? '2px solid var(--primary)' : 'none' }} onClick={() => setTab(t.key)}>
            <div className="stat-details"><h3>{t.collection}</h3><div className="stat-value">{data[t.key].length}</div><div style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>documents</div></div>
          </div>
        ))}
      </div>

      <div className="card anim-fade-up">
        <div className="alerts-header-row">
          <div className="alert-filters">
            {TABS.map(t => <span key={t.key} className={`filter ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</span>)}
          </div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={load}><RefreshCw size={14} /> Refresh</button>
            <button className="btn btn-ghost" onClick={onSample}><RotateCcw size={14} /> Load sample data</button>
            <button className="btn btn-danger" onClick={onErase}><Trash2 size={14} /> Erase everything</button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', margin: '.75rem 0' }}>{current.note}</p>
        <LogicBox steps={current.logic} label="Show logic: how passwords are stored" />
        {msg && <p className="msg" style={{ color: msg.ok ? 'var(--success)' : 'var(--danger)' }}>{msg.text}</p>}

        {tab === 'users' && (
          <form className="add-user-form" onSubmit={onAddUser}>
            {[['name', 'Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'text'], ['location', 'Location', 'text']].map(([k, label, type]) => (
              <div key={k}><label>{label}</label><input type={type} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
            <div><label>Crop</label>
              <select value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })}>
                {['sugarcane', 'wheat', 'cotton', 'rice'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <button className="btn" type="submit"><UserPlus size={14} /> Add user</button>
          </form>
        )}

        <div className="table-wrap">
          <table className="db-table">
            <thead><tr>{cols.map(([h], i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={cols.length}>No documents</td></tr>}
              {rows.map(r => <tr key={r._id}>{cols.map(([, f], i) => <td key={i}>{f(r)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Database;
