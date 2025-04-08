import React, { useState } from "react"; 
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router-dom"; // ✅ Importer useNavigate
import Button from "../components/button"; 
import BlurContainer from "../components/blurContainer";

function LandingPage() {
  const navigate = useNavigate(); 

  const handleSignupClick = () => {
    navigate("/Register"); 
  };

  const handleSigninClick = () => {
    navigate("/Login"); 
  };

  const menuItems = [
    { id: 1, name: "Must Explain", price: "$15.00", image: "/test.png" },
    { id: 2, name: "Must Explain", price: "$25.00", image: "/1.png" },
    { id: 3, name: "Must Explain", price: "$25.00", image: "/2.png" },
    { id: 4, name: "Must Explain", price: "$15.00", image: "/3.png" },
  ];

  const services = [
    { id: 1, title: "Meal Kits", description: "Order meal kits with detailed ingredients and recipes tailored to the number of people.", image: "Detailed.jpg" },
    { id: 2, title: "Customization", description: "Customize your meals based on your preferences for themed events or special occasions.", image: "Customization.jpg" },
    { id: 3, title: "Client Ambassadors", description: "Discover suggestions from our client ambassadors with photos and videos of their culinary experiences.", image: "Ambassadors.jpg" },
    { id: 4, title: "Healthy Meals", description: "Healthy meals tailored for specific profiles such as athletes, allergy sufferers, and more.", image: "Healthy.jpg" },
  ];

  const [mainImage, setMainImage] = useState(menuItems[0].image);
  const [direction, setDirection] = useState(1);

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Arrière-plan */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Contenu principal */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-15">
          <BlurContainer
            blur="xl"
            opacity={50}
            padding={8}
            rounded="2xl"
            className="w-full mx-auto p-6"
          >
            <div className="flex flex-col space-y-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold text-white">
                    Welcome to TheMenuFy!
                  </h1>
                  <p className="text-lg text-white">
                    Manage your restaurant menus with ease and style. Customize,
                    update in real-time, and enhance customer experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                      onClick={handleSignupClick}
                      className="bg-customYellow hover:bg-customYellow-dark text-white font-semibold py-3 px-6 rounded-full transition-all"
                    >
                      Signup
                    </Button>
                    <Button
                      onClick={handleSigninClick}
                      className="bg-transparent hover:bg-customYellow text-customYellow hover:text-white border-2 border-customYellow font-semibold py-3 px-6 rounded-full transition-all duration-300"
                    >
                      Signin
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center overflow-hidden">
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt="MenuFy Preview"
                    className="w-3/4 max-w-sm rounded-xl object-contain"
                    initial={{ x: direction * 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -direction * 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Menu Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/10 rounded-xl p-4 backdrop-blur-sm group hover:bg-black/20 transition-all flex flex-col items-center text-center"
                    onMouseEnter={() => handleHover(item.image)}
                  >
                    <div className="w-full aspect-square relative flex justify-center items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-sm text-white">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Services Section */}
              <div className="py-10 text-center bg-cover bg-center relative mt-1">
                <div className="relative z-10">
                  <h2 className="text-3xl font-semibold text-white mb-16">Our Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-black/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center text-center"
                      >
                        <div className="w-full h-60 relative flex justify-center items-center cursor-pointer group">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all"></div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                          <p className="text-sm text-white">{service.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
