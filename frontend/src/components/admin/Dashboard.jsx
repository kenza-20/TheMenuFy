// src/components/admin/Dashboard.js
import React from 'react';
import Sidebar from './Sidebar'; // pour la navigation
import UserManagement from './UserManagement'; // gestion des utilisateurs

const Dashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '200px', padding: '20px' }}>
        <h1>Tableau de bord Admin</h1>
        <UserManagement />
      </div>
    </div>
  );
};

export default Dashboard;
