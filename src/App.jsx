import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppBackground from './components/AppBackground';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import CropInfo from './pages/CropInfo';
import Alerts from './pages/Alerts';
import About from './pages/About';
import Database from './pages/Database';

function App() {
  const [isAuth, setIsAuth] = React.useState(
    !!localStorage.getItem('auth_token')
  );

  return (
    <BrowserRouter>
      <AppBackground />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={isAuth ? <Layout setAuth={setIsAuth} /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="history" element={<History />} />
          {/* old pages are now part of the dashboard */}
          <Route path="advisory" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="sensors" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="crop" element={<CropInfo />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="database" element={<Database />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
