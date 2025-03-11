import React from 'react';
import Sidebar from './Sidebar'; // pour la navigation
import UserManagement from './UserManagement'; // gestion des utilisateurs

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 p-8 bg-white shadow-xl rounded-lg ml-64">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">Tableau de bord Admin</h1>

        {/* Section User Management */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <UserManagement />
        </div>

        {/* Autres sections du tableau de bord */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Card 1 */}
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Utilisateurs</h3>
            <p className="text-lg">Gérez les utilisateurs, leurs rôles, et leurs permissions.</p>
          </div>
          
          {/* Card 2 */}
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Statistiques</h3>
            <p className="text-lg">Suivez les performances et les données clés de votre plateforme.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4">Paramètres</h3>
            <p className="text-lg">Accédez aux paramètres généraux de l'application.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
