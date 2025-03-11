import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Valeur par défaut 'user'
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const API_URL = "http://localhost:3000/api/users"; // URL de ton API

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, password, role, isBlocked: false, validated: false, confirmed: false };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        alert('Utilisateur ajouté avec succès !');
        navigate('/users'); // Rediriger vers la gestion des utilisateurs après ajout
      } else {
        setErrorMessage('Erreur lors de l\'ajout de l\'utilisateur.');
      }
    } catch (error) {
      setErrorMessage('Erreur réseau, veuillez réessayer plus tard.');
      console.error('Erreur réseau:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-xl rounded-lg">
      <h2 className="text-3xl font-semibold text-white mb-6 text-center">Ajouter un utilisateur</h2>
      {errorMessage && <p className="text-red-600 text-center mt-2">{errorMessage}</p>} {/* Affichage des erreurs */}

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
            required
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
          Ajouter l'utilisateur
        </button>
      </form>
    </div>
  );
};

export default AddUser;
