"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BlurContainer from "../components/blurContainer"

const ServicesPage = () => {
  // Track which service is being hovered
  const [hoveredId, setHoveredId] = useState(null)

  const services = [
    {
      id: 1,
      title: "Detailed Meal Kits",
      description: "Order meal kits with detailed ingredients and recipes tailored to the number of people.",
      image: "Detailed.jpg",
    },
    {
      id: 2,
      title: "Meal Customization",
      description: "Customize your meals based on your preferences for themed events or special occasions.",
      image: "Customization.jpg",
    },
    {
      id: 3,
      title: "Client Ambassadors",
      description:
        "Discover suggestions from our client ambassadors with photos and videos of their culinary experiences.",
      image: "Ambassadors.jpg",
    },
    {
      id: 4,
      title: "Healthy Meals",
      description: "Healthy meals tailored for specific profiles such as athletes, allergy sufferers, and more.",
      image: "Healthy.jpg",
    },
  ]

  // Animation variants
  const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  }

  const imageOverlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-15">
          <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full mx-auto p-6">
            <div className="flex flex-col space-y-10">
              {/* Header Section */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white">Our Services</h2>
                <p className="mt-4 text-lg text-white">
                  Healthy meals tailored for specific profiles such as athletes, allergy sufferers, and more.
                </p>
                <motion.div
                  className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 mx-auto rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: "12rem" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                ></motion.div>
              </motion.div>

              {/* Description Section */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p className="text-lg text-white">
                  Explore our meal kit services and how we can enhance your culinary experience.
                </p>
              </motion.div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatePresence>
                  {services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      className="bg-black/10 rounded-xl p-4 backdrop-blur-sm flex flex-col items-center text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 * index  }}
                      variants={cardVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredId(service.id)}
                      onHoverEnd={() => setHoveredId(null)}
                    >
                      <div className="w-full h-60 relative flex justify-center items-center cursor-pointer">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <motion.div
                          className="absolute inset-0 bg-black/20 rounded-lg"
                          variants={imageOverlayVariants}
                          initial="initial"
                          animate={hoveredId === service.id ? "hover" : "initial"}
                        ></motion.div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                        <p className="text-sm text-white">{service.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
