import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchChartData } from '../services/api';

// Trend of the last 10 readings stored in MongoDB.
const History = () => {
  const [chart, setChart] = useState(null);
  useEffect(() => { fetchChartData().then(setChart); }, []);

  return (
    <div>
      <header className="page-header anim-fade-up">
        <h1>History</h1>
        <p>Last 10 readings from the database – watch moisture jump after irrigation</p>
      </header>
      <div className="card chart-card anim-fade-up">
        {chart && chart.length === 0 && <div className="empty-state">No readings yet.</div>}
        {chart && chart.length > 0 && (
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(38,74,51,0.18)" />
              <XAxis dataKey="time" stroke="#264A33" tick={{ fontSize: 12 }} />
              <YAxis stroke="#264A33" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moisture" name="Soil moisture %" stroke="#0B4F28" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="temp" name="Temperature °C" stroke="#B7791F" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default History;
