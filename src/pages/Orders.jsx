import React, { useEffect, useState } from 'react';

const menuItems = [
  { id: 1, name: 'Salade César', price: 8.90, image: '/salade-cesar.jpg' },
  { id: 2, name: 'Bœuf Bourguignon', price: 18.50, image: '/boeuf-bourguignon.jpg' },
  { id: 3, name: 'Crème Brûlée', price: 6.90, image: '/creme-brulee.jpg' },
];

const Orders = () => {
  const [userCommandes, setUserCommandes] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Utilisateur non connecté.");
      return;
    }

    const allCommandes = JSON.parse(localStorage.getItem('commandes')) || [];
    const commandesUser = allCommandes
      .filter(c => c.id_user === userId)
      .map(c => ({
        ...c, 
        plat: menuItems.find(p => p.id === c.id_plat)
      }));

    setUserCommandes(commandesUser);
  }, []);

  const handleDelete = (commandeId) => {
    const updatedCommandes = userCommandes.filter(c => c.id_commande !== commandeId);
    setUserCommandes(updatedCommandes);
    localStorage.setItem('commandes', JSON.stringify(updatedCommandes));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8">
            Mes Commandes
          </h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            {userCommandes.length === 0 ? (
              <p className="text-gray-300 text-center">Aucune commande trouvée</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCommandes.map(cmd => (
                  <div 
                    key={cmd.id_commande} 
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={cmd.plat.image}
                      alt={cmd.plat.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-yellow-400">{cmd.plat.name}</h2>
                      <span className="text-lg font-bold text-yellow-500">{cmd.plat.price}€</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleDelete(cmd.id_commande)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-6 w-6" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Orders;