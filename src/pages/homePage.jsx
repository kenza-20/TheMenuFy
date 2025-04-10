import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [userName, setUserName] = useState("");
  const [cart, setCart] = useState([]); // State to store the cart items

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) {
      setUserName(name);
    }
  }, []);

  const addToCart = (item) => {
    setCart([...cart, item]); // Add the selected item to the cart
  };

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

          {userName && (
            <p className="text-xl text-gray-200 mt-4">
              Welcome back, <span className="font-semibold text-yellow-400">{userName}</span>!
            </p>
          )}

          <div className="space-x-4">
            <Link
              to="/reservation"
              className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-full 
              hover:bg-yellow-500 transform transition duration-300 hover:scale-105 shadow-lg"
            >
              Book a Table
            </Link>
            <Link
              to="/Menu"
              className="inline-block border-2 border-yellow-400 text-yellow-400 px-8 py-3 rounded-full 
              hover:bg-yellow-400/10 transition duration-300"
            >
              Explore Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-[url('/texture.jpg')] bg-cover">
        <div className="container mx-auto px-6">
          <h2 className="text-6xl font-bold text-center mb-16 text-yellow-400 drop-shadow-[0_4px_4px_rgba(250,204,21,0.3)]">
            Our Culinary Masterpieces
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Truffle Infused Wagyu", 
                image: "/wagyu.jpg",
                desc: "A5 Japanese Wagyu with black truffle shavings and gold leaf garnish",
                price: "$89"
              },
              { 
                name: "Mediterranean Seafood Symphony", 
                image: "/seafood.jpg",
                desc: "Fresh catch of the day with saffron risotto and citrus foam",
                price: "$75"
              },
              { 
                name: "Heritage Vegetable Garden", 
                image: "/vegetables.jpg",
                desc: "Heirloom vegetables with edible soil and truffle vinaigrette",
                price: "$65"
              },
            ].map((item, idx) => (
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
                    <button
                      onClick={() => addToCart(item)} // Add item to cart on button click
                      className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm 
                      hover:bg-yellow-500 transition transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Display Cart Count */}
      <div className="fixed bottom-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full">
        <Link to="/reservation">
          Cart ({cart.length})
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
