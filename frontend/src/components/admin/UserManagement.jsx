// src/components/admin/UserManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Utilise useNavigate au lieu de useHistory

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const API_URL = "http://localhost:3000/api/users"; // URL de ton API
  const navigate = useNavigate();  // Remplace useHistory par useNavigate

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
    navigate(`/edit-user/${userId}`);  // Redirige vers la page de modification de l'utilisateur
  };

  // Fonction pour ajouter un utilisateur
  const handleAddUser = () => {
    navigate('/add-user');  // Redirige vers la page d'ajout d'utilisateur
  };

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      
      {/* Bouton Ajouter un utilisateur */}
      <button
        onClick={handleAddUser}
        className="bg-blue-500 text-white p-2 rounded mb-4"
      >
        Ajouter un utilisateur
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Nom</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                {/* Boutons Ajouter, Modifier, Supprimer, Approuver, Bloquer/Débloquer */}
                <button
                  onClick={() => handleEdit(user._id)}
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white p-2 rounded mr-2"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => handleApprove(user._id)}
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Approuver
                </button>
                <button
                  onClick={() => handleBlock(user._id)}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  {user.isBlocked ? "Débloquer" : "Bloquer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
