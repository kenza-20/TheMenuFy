// src/pages/VoiceMenu.jsx
import React, { useRef, useState } from 'react';
import VoiceSearch from '../components/VoiceSearch';

const VoiceMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const voiceRef = useRef();

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat pt-28 px-4"
      style={{
        backgroundImage: "url('/bg.jpg')",
        boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.65)"
      }}
    >
      <div className="max-w-6xl mx-auto text-white">
        <h1 className="text-5xl font-bold text-center mb-10 text-yellow-400 drop-shadow">
          🎙️ Recherche vocale IA
        </h1>

        <div className="flex justify-center mb-10">
          <div className="bg-black/40 border border-yellow-500 p-6 rounded-xl backdrop-blur-md shadow-xl w-full max-w-xl text-center">
            <VoiceSearch ref={voiceRef} onResults={setMenuItems} />
          </div>
        </div>

        {menuItems.length === 0 ? (
          <p className="text-center text-gray-300 text-lg">
            Parlez pour rechercher un plat (ex: "plats végétariens sans gluten").
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {menuItems.map((dish) => (
              <div
                key={dish._id || dish.name}
                className="bg-white/10 rounded-2xl shadow-lg backdrop-blur-md text-white overflow-hidden hover:scale-105 transition"
              >
                <img
                  src={
                    dish.image?.startsWith('http')
                      ? dish.image
                      : `http://localhost:3000/${dish.image || 'placeholder.jpg'}`
                  }
                  alt={dish.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-2xl font-semibold mb-1">{dish.name}</h3>
                  <p className="text-sm text-gray-300 mb-2">{dish.description}</p>
                  <div className="flex justify-between items-center text-yellow-400 font-bold">
                    <span>{dish.price} TND</span>
                    <span className="text-sm text-gray-300">{dish.origin}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceMenu;
