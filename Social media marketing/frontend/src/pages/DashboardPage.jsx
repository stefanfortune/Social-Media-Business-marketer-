import React from 'react';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <div className="dashboard-page">
        <div className="dashboard-wrapper">
          <h1 className="dashboard-title">Content Creator Dashboard</h1>
          <Dashboard />
        </div>
        <style>{`
          .dashboard-page {
            background: linear-gradient(to bottom right, #f7f9fc, #edf2fa);
            min-height: 100vh;
            padding: 2rem 1rem;
            font-family: 'Inter', sans-serif;
          }

          .dashboard-wrapper {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            padding: 2rem;
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #1d3557;
            text-align: center;
          }
        `}</style>
      </div>
    </>
  );
}
