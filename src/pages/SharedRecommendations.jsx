// src/pages/SharedRecommendations.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SharedRecommendations() {
  const { userId } = useParams();
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/user/shared-recommendations/${userId}`)
      .then(res => setDishes(res.data))
      .catch(err => console.error("Erreur chargement des recommandations partagées :", err));
  }, [userId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Plats recommandés par vos amis</h1>
      {dishes.length === 0 ? (
        <p>Aucune recommandation à afficher.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dishes.map(dish => (
            <div key={dish.id_dish} className="border p-4 rounded shadow">
              <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover mb-2" />
              <h2 className="text-lg font-semibold">{dish.name}</h2>
              <p className="text-sm text-gray-600">{dish.description}</p>
              <p className="mt-2 text-sm font-bold">Commandé {dish.count} fois</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
