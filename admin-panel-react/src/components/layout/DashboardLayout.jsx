import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="content-area animate-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
