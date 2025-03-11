import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-blue-800 text-white w-64 h-screen p-6">
      <h2 className="text-2xl font-semibold mb-8">Panneau Admin</h2>

      <ul className="space-y-4">
        <li>
          <Link 
            to="/admin/dashboard" 
            className="text-white hover:bg-blue-600 hover:text-white p-3 rounded-lg block transition-all duration-200"
          >
            Tableau de bord
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/users" 
            className="text-white hover:bg-blue-600 hover:text-white p-3 rounded-lg block transition-all duration-200"
          >
            Gestion des utilisateurs
          </Link>
        </li>
        {/* Ajoute d'autres liens selon tes besoins */}
        <li>
          <Link 
            to="/admin/statistics" 
            className="text-white hover:bg-blue-600 hover:text-white p-3 rounded-lg block transition-all duration-200"
          >
            Statistiques
          </Link>
        </li>
        <li>
          <Link 
            to="/admin/settings" 
            className="text-white hover:bg-blue-600 hover:text-white p-3 rounded-lg block transition-all duration-200"
          >
            Paramètres
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
