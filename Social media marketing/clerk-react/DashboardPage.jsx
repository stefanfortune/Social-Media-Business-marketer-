import React from 'react';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Your Marketing Dashboard</h1>
        <Dashboard />
      </div>
    </div>
  );
}