// src/components/admin/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', background: '#f4f4f4', height: '100vh', padding: '20px' }}>
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin/dashboard">Tableau de bord</Link></li>
        <li><Link to="/admin/users">Gestion des utilisateurs</Link></li>
        {/* Ajoute d'autres liens selon tes besoins */}
      </ul>
    </div>
  );
};

export default Sidebar;
