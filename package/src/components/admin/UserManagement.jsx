import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:3000/api/users"; // URL de ton API
  const navigate = useNavigate(); // Remplace useHistory par useNavigate

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis l'API
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Erreur:', err));
  }, []);

  const fetchUsers = () => {
    // Cette fonction permet de récupérer les utilisateurs après chaque action
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Erreur lors de la récupération des utilisateurs:', err));
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/approve/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Utilisateur approuvé !");
        fetchUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        console.error("Erreur lors de l'approbation");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Fonction pour bloquer un utilisateur
  const handleBlock = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/block/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Utilisateur bloqué/débloqué !");
        fetchUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        console.error("Erreur lors du blocage");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Utilisateur supprimé !");
        fetchUsers(); // Rafraîchir la liste des utilisateurs
      } else {
        console.error("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  // Fonction pour rediriger vers la page de modification d'un utilisateur
  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`); // Redirige vers la page de modification de l'utilisateur
  };

  // Fonction pour ajouter un utilisateur
  const handleAddUser = () => {
    navigate('/add-user'); // Redirige vers la page d'ajout d'utilisateur
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Gestion des utilisateurs</h2>

      {/* Bouton Ajouter un utilisateur */}
      <button
        onClick={handleAddUser}
        className="bg-blue-600 text-white p-3 rounded-lg mb-6 transition duration-200 hover:bg-blue-500"
      >
        Ajouter un utilisateur
      </button>

      {/* Tableau des utilisateurs */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Rôle</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-100">
                <td className="px-6 py-3">{user._id}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.role}</td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="bg-yellow-500 text-white p-2 rounded transition duration-200 hover:bg-yellow-400"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white p-2 rounded transition duration-200 hover:bg-red-400"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => handleApprove(user._id)}
                    className="bg-green-500 text-white p-2 rounded transition duration-200 hover:bg-green-400"
                  >
                    Approuver
                  </button>
                  <button
                    onClick={() => handleBlock(user._id)}
                    className="bg-red-500 text-white p-2 rounded transition duration-200 hover:bg-red-400"
                  >
                    {user.isBlocked ? "Débloquer" : "Bloquer"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
