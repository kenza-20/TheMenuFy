import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
  const { userId } = useParams();
  console.log("User ID:", userId);  // Vérifie si l'ID est bien récupéré
  // Récupère l'ID de l'utilisateur dans l'URL
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const API_URL = `http://localhost:3000/api/users/${userId}`; // URL de l'API pour un utilisateur spécifique

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) {
          throw new Error('Utilisateur non trouvé');
        }
        return res.json();
      })
      .then(data => {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setRole(data.role);
      })
      .catch(err => console.error('Erreur lors de la récupération de l\'utilisateur:', err));
  }, [userId]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = { name, email, password, role };

    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        alert('Utilisateur modifié avec succès !');
        navigate('/users'); // Rediriger vers la gestion des utilisateurs après modification
      } else {
        console.error('Erreur lors de la modification de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  if (!user) return <div>Chargement...</div>;  // Afficher un message de chargement si l'utilisateur n'est pas encore récupéré

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">Modifier l'utilisateur</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom */}
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-white">Nom</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-white p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-white p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium text-white">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-white p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Rôle */}
        <div>
          <label htmlFor="role" className="block text-lg font-medium text-white">Rôle</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-white p-3 w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="user">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        {/* Bouton submit */}
        <button 
          type="submit" 
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Modifier l'utilisateur
        </button>
      </form>
    </div>
  );
};

export default EditUser;
