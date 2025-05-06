import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "An absolute culinary masterpiece! The wine pairing was exceptional.",
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Best dining experience in the city. Service was impeccable.",
  },
  {
    name: "Emma Wilson",
    rating: 4,
    comment: "Creative dishes with perfect flavor balance. Will definitely return!",
  },
];


const defaultOrderItem = {
  name: "",
  quantity: 0,
  price: 0,
  subtotal: 0,
  image: "",
};

const defaultOrder = {
  id: "",
  date: "",
  time: "",
  rawDate: new Date(),
  items: [],
  total: 0,
};

const HomePage = () => {
  const [recommendedDishes, setRecommendedDishes] = useState([]);
  const [similarDishes, setSimilarDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [user, setUser] = useState(null);
  const [popularDishes, setPopularDishes] = useState([]);
  const [friendsRecommendations, setFriendsRecommendations] = useState([]);
  const [lastOrder, setLastOrder] = useState(null); // ✅
  const navigate = useNavigate();
  const [promoFavorites, setPromoFavorites] = useState([]);
  const [behavioralRecommendations, setBehavioralRecommendations] = useState([]);

  // Recommandations d'amis


  const fetchFilteredDishes = async (type, mode) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (mode) params.append("mode", mode);
  
      console.log("👉 Requête envoyée avec : ", params.toString());
  
      const res = await axios.get(`http://localhost:3000/api/dish/filter?${params.toString()}`);
      console.log("✅ Résultat du filtre :", res.data);
      setFilteredDishes(res.data);
    } catch (err) {
      console.error("❌ Erreur lors du filtrage :", err);
    }
  };
  

  
  
  
  
  const [seasonalDishes, setSeasonalDishes] = useState([]);

useEffect(() => {
  const fetchSeasonalDishes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/dish/seasonal");
      console.log("🌱 Plats saisonniers :", res.data);
      setSeasonalDishes(res.data);
    } catch (err) {
      console.error("❌ Erreur plats saisonniers :", err);
    }
  };

  fetchSeasonalDishes();
}, []);


useEffect(() => {
  const fetchPopularDishes = async () => {
    try {
      if (!user) return;

      const neighborhood = user.neighborhood;
      console.log("📍 Quartier de l'utilisateur :", neighborhood);

      if (!neighborhood) {
        console.warn("❌ Aucun quartier défini pour cet utilisateur.");
        return;
      }

      const res = await axios.get(
        `http://localhost:3000/api/dish/neighborhood/popular?neighborhood=${neighborhood}`
      );
      console.log("🔥 Plats populaires reçus :", res.data);
      setPopularDishes(res.data);
    } catch (err) {
      console.error("❌ Erreur plats populaires :", err);
    }
  };

  fetchPopularDishes();
}, [user]); // 🔁 Dépend maintenant de l'état `user` et attend sa mise à jour

useEffect(() => {
  const fetchUserAndDishes = async () => {
    try {
      let storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("🧠 Utilisateur depuis localStorage :", storedUser);

      const res = await axios.get("http://localhost:3000/api/user/bytoken", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const freshUser = res.data.user;
      console.log("✅ Utilisateur récupéré par token :", freshUser);
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);

      const userId = (freshUser?._id || freshUser?.id)?.toString();
      console.log("🆔 ID extrait :", userId);

      if (userId && userId.length > 10) {
        const dishRes = await axios.get(`http://localhost:3000/api/dish/recommended/${userId}`);
        console.log("🍽️ Dishes recommandés reçus :", dishRes.data);
        setRecommendedDishes(dishRes.data);

        // ✅ Appel aux plats des amis ici
        const friendRes = await axios.get(`http://localhost:3000/api/user/friends/recommendations/${userId}`);
        console.log("👫 Recommandations des amis :", friendRes.data);
        setFriendsRecommendations(friendRes.data);
      }
    } catch (err) {
      console.error("❌ Erreur de récupération des données :", err);
    }
  };

  fetchUserAndDishes(); // 👈 on exécute notre fonction
}, []);


useEffect(() => {
  const fetchBehavioralRecommendations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;

      if (!userId) return;

      const res = await axios.get(`http://localhost:3000/api/user/behavioral-recommendations/${userId}`);
      console.log("🧠 Recommandations comportementales :", res.data);
      setBehavioralRecommendations(res.data);
    } catch (err) {
      console.error("❌ Erreur recommandations comportementales :", err);
    }
  };

  fetchBehavioralRecommendations();
}, []);





useEffect(() => {
  const fetchPromoFavorites = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;

      if (!userId) return;

      const res = await axios.get(`http://localhost:3000/api/user/favorites/promotions/${userId}`);
      console.log("🎯 Favoris en promotion :", res.data);
      setPromoFavorites(res.data);
    } catch (err) {
      console.error("❌ Erreur favoris en promo :", err);
    }
  };

  fetchPromoFavorites();
}, []);



useEffect(() => {
  const fetchLastOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id || user?.id;

      if (!userId) {
        console.warn("❌ Aucun ID utilisateur disponible.");
        return;
      }

      console.log("🔁 Fetching last order for user:", userId);

      const res = await axios.get(`http://localhost:3000/api/user/last-order/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("🧾 Dernière commande reçue :", res.data);
      setLastOrder(res.data);
    } catch (err) {
      console.error("❌ Erreur lors de la récupération de la dernière commande :", err);
    }
  };

  fetchLastOrder();
}, []);






  useEffect(() => {
    const fetchSimilarDishes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/dish/recommendations/like?category=Pasta');
        setSimilarDishes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des plats similaires :", err);
      }
    };

    fetchSimilarDishes();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-4xl px-4 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold animate-fade-in">
            <span className="text-yellow-400">Experience</span> Culinary Artistry
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Where passion meets perfection - crafted by our Michelin-starred chefs with seasonal ingredients
          </p>
          <div className="space-x-4">
          
        
             <Link to="/time-based-meals" className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition duration-300">
              Time-Based Meal Suggestions
            </Link>
            
            <Link to="/mood" className="inline-block bg-teal-500 text-white px-8 py-3 rounded-full hover:bg-teal-600 transition duration-300">
              Choose your meals depends on your current mood
            </Link>
    
          </div>
        </div>
      </section>





      {/* Recommended Dishes */}
      <section className="py-20 bg-[url('/bg.jpg')] bg-cover">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-12 text-yellow-400 drop-shadow-[0_3px_3px_rgba(250,204,21,0.3)]">
            {Array.isArray(user?.allergies) && user.allergies.length
              ? `Here are dishes that do not contain: ${user.allergies.join(", ")}`
              : "Recommended for You"}
          </h2>

          {Array.isArray(recommendedDishes) && recommendedDishes.length > 0 ? (
  <div className="grid md:grid-cols-3 gap-8">
    {recommendedDishes.map((dish) => (
      <div key={dish._id} className="bg-black/40 rounded-2xl shadow-lg backdrop-blur-md text-white overflow-hidden">
        <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
        <div className="p-5">
          <h3 className="text-2xl font-semibold mb-2">{dish.name}</h3>
          <p className="text-sm text-gray-300 mb-3">{dish.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-yellow-400 font-bold">{dish.price} TND</span>
            <button className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm hover:bg-yellow-500 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-white">No dishes found matching your preferences.</p>
)}

        </div>
      </section>

      {friendsRecommendations.length > 0 && (
  <section className="py-20 bg-black/75">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-10 text-yellow-400">
        🍽️ Plats appréciés par vos amis
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {friendsRecommendations.map((dish, idx) => (
          <div key={idx} className="bg-white/10 p-4 rounded-xl text-white shadow-md">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{dish.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{dish.description}</p>
            <p className="text-yellow-400 font-bold text-sm">Commandé {dish.count} fois</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
    
      {popularDishes.length > 0 && (
  <section className="py-16 bg-black/80">
    <div className="container mx-auto px-6">
      <h2 className="text-5xl font-bold text-center text-yellow-400 mb-12">
        🥇 Plats populaires dans votre quartier
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {popularDishes.map((dish) => (
          <div key={dish._id} className="bg-white/10 p-4 rounded-xl text-white shadow-lg">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{dish.name}</h3>
            <p className="text-sm text-gray-300">{dish.description}</p>
            <span className="text-yellow-400 font-bold">{dish.price} TND</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

      {/* Filter Buttons */}
      <section className="py-10 bg-black/70 text-center">
        <h2 className="text-4xl font-bold text-yellow-400 mb-6">Filtrer les plats</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => fetchFilteredDishes('low-budget')}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full"
          >
            Low Budget
          </button>
          <button
            onClick={() => fetchFilteredDishes('fast')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
          >
            Quick Meals
          </button>
          <button
            onClick={() => fetchFilteredDishes(null, 'solo')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full"
          >
            Repas en Solo
          </button>
          <button
            onClick={() => fetchFilteredDishes(null, 'shared')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
          >
            Repas à Partager
          </button>
          <button
            onClick={() => setFilteredDishes([])}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full"
          >
            Réinitialiser
          </button>
        </div>
      </section>

      {/* Filtered Results */}
      {filteredDishes.length > 0 && (
        <section className="py-16 bg-black/70">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
              Résultats filtrés
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div key={dish._id} className="bg-white/10 p-4 rounded-xl text-white">
                  <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
                  <h3 className="text-xl font-semibold mt-2">{dish.name}</h3>
                  <p className="text-sm text-gray-300">{dish.description}</p>
                  <span className="text-yellow-400 font-bold">{dish.price} TND</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


{lastOrder && (
  <section className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl text-white mb-8 mx-4">
    <h2 className="text-xl font-bold mb-3">🍽️ Reprenez votre dernière commande</h2>
    <ul className="mb-3">
      {lastOrder.items.map((item, idx) => (
        <li key={idx} className="flex justify-between text-sm">
          <span>{item.name} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </li>
      ))}
    </ul>
    <div className="flex justify-between items-center">
      <span className="font-semibold text-lg text-yellow-400">Total : ${lastOrder.total.toFixed(2)}</span>
      <button
        onClick={() => navigate("/resto/2/menu")}
        className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition"
      >
        Commander à nouveau
      </button>
    </div>
  </section>
)}


{behavioralRecommendations.length > 0 && (
  <section className="py-20 bg-black/70">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">
        🔁 Vos plats préférés (basé sur vos commandes)
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {behavioralRecommendations.map((dish) => (
          <div key={dish._id} className="bg-white/10 p-5 rounded-xl text-white shadow-md">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-3">{dish.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{dish.description}</p>
            <span className="text-yellow-400 font-bold">{dish.price} TND</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)}



{promoFavorites.length > 0 && (
  <section className="py-16 bg-black/70">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center text-yellow-400 mb-10">
        🎁 Vos plats favoris en promotion
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {promoFavorites.map((dish) => (
          <div key={dish._id} className="bg-white/10 p-5 rounded-xl text-white shadow-md">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-3">{dish.name}</h3>
            <p className="text-sm text-gray-300 mb-2">{dish.description}</p>
            <div className="flex justify-between items-center mt-3">
              <span className="text-yellow-400 font-bold">{dish.price} TND</span>
              <span className="text-green-400 text-sm font-semibold">-{dish.promotion}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}


{seasonalDishes.length > 0 && (
  <section className="py-16 bg-black/80">
    <div className="container mx-auto px-6">
      <h2 className="text-5xl font-bold text-center text-yellow-400 mb-12">
        🌸 Plats de saison
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {seasonalDishes.map((dish) => (
          <div key={dish._id} className="bg-white/10 p-4 rounded-xl text-white shadow-lg">
            <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded" />
            <h3 className="text-xl font-semibold mt-2">{dish.name}</h3>
            <p className="text-sm text-gray-300">{dish.description}</p>
            <span className="text-yellow-400 font-bold">{dish.price} TND</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

      {/* Similar Dishes */}
      <section className="py-20 bg-black/70">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-12 text-yellow-400 drop-shadow-[0_3px_3px_rgba(250,204,21,0.3)]">
            Vous aimerez aussi ?
          </h2>

          {similarDishes.length === 0 ? (
            <p className="text-center text-white">Aucune recommandation similaire trouvée.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {similarDishes.map((dish) => (
                <div key={dish._id} className="bg-white/10 rounded-2xl shadow-xl backdrop-blur-md text-white overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
                  <div className="p-5">
                    <h3 className="text-2xl font-semibold mb-2">{dish.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold">{dish.price} TND</span>
                      <button className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm hover:bg-yellow-500 transition">
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-[url('/texture.jpg')] bg-cover">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-bold text-center mb-16 text-yellow-400 drop-shadow-[0_4px_4px_rgba(250,204,21,0.3)]">
            Our Culinary Masterpieces
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
              name: "Truffle Infused Wagyu",
              image: "/wagyu.jpg",
              desc: "A5 Japanese Wagyu with black truffle shavings and gold leaf garnish",
              price: "$89",
            }, {
              name: "Mediterranean Seafood Symphony",
              image: "/seafood.jpg",
              desc: "Fresh catch of the day with saffron risotto and citrus foam",
              price: "$75",
            }, {
              name: "Heritage Vegetable Garden",
              image: "/vegetables.jpg",
              desc: "Heirloom vegetables with edible soil and truffle vinaigrette",
              price: "$65",
            }].map((item, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl shadow-xl">
                <div className="h-96 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{item.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">{item.price}</span>
                    <button className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm hover:bg-yellow-500 transition transform hover:scale-105">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black/70">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Guest Reviews
          </h2>
          <div className="space-y-6">
            {testimonials.slice(0, 3).map((review, i) => (
              <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10">
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="font-medium text-yellow-400">{review.name}</h4>
                  <span className="text-sm text-gray-400">{review.rating}/5 Stars</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};



export default HomePage;
