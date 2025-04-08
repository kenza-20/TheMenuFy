import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/about-bg.jpg')" }} // Remplace par ton image
    >
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Contenu principal */}
      <motion.div
        className="relative bg-white/10 backdrop-blur-md text-white p-10 md:p-16 rounded-2xl shadow-lg w-11/12 md:w-3/4 lg:w-2/3 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <h1 className="text-5xl font-bold mb-6 uppercase tracking-wider">
          About Us
        </h1>
        <p className="text-lg mb-6">
          Welcome to <span className="font-semibold text-[#00D4FF]">TheMenuFy</span>, your one-stop destination for personalized meal kits and a seamless dining experience.
        </p>

        {/* Notre mission */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#00D4FF]">
            Our Mission
          </h2>
          <p className="text-md text-gray-200 leading-relaxed">
            We strive to revolutionize the way people experience food. Whether you seek healthy meals, event-specific menus, or customized meal kits, we’ve got you covered. Join us in shaping the future of dining!
          </p>
        </div>

        {/* Bouton d'appel à l'action */}
        <div className="mt-12">
          <motion.a
            href="/contact"
            className="bg-[#00D4FF] text-black font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-[#00AACC] transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            Get in Touch
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
