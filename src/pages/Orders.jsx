import React, { useEffect, useState } from 'react';

const Orders = () => {
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token envoyé :", token);

    fetch('http://localhost:3000/api/orders/my-orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => setUserOrders(data.orders))
      .catch(err => console.error("Erreur API:", err));
  }, []);

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
          <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8">Historique de mes achats</h1>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            {userOrders.length === 0 ? (
              <p className="text-gray-300 text-center">Aucun achat trouvé</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userOrders.map((order, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    {order.id_dish?.image && (
                      <img
                        src={order.id_dish.image}
                        alt={order.id_dish.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-yellow-400">{order.id_dish?.name || 'Nom indisponible'}</h2>
                      {order.id_dish?.price && (
                        <span className="text-lg font-bold text-yellow-500">{order.id_dish.price}€</span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{order.id_dish?.description || 'Pas de description.'}</p>
                    <p className="text-sm text-gray-400">
                      Acheté le {new Date(order.orderedAt).toLocaleString()}
                    </p>
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
