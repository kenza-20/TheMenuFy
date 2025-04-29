"use client"

import { useRef, useEffect } from "react"
import mapboxgl from "mapbox-gl" // Using mapbox-gl
import 'mapbox-gl/dist/mapbox-gl.css';

import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { motion } from "framer-motion"


const ContactPage = () => {
  // Replace with your Mapbox token
  const MAPBOX_TOKEN = "your_mapbox_token"

  // Create a ref for the map container
  const mapContainerRef = useRef(null)

  // Initialize the map
  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v10",
        center: [10.189, 36.898],
        zoom: 15,
      });
  
      new mapboxgl.Marker({ color: "#FFDD00" })
        .setLngLat([10.189, 36.898])
        .setPopup(new mapboxgl.Popup().setHTML("<p>B.P. 160, pôle Technologique</p><p>Z.I. Chotrana II, 2083</p>"))
        .addTo(map);
  
      return () => map.remove();
    }
  }, []);
  

  return (
    <div className=" flex flex-col min-h-screen items-center justify-center py-16">
  
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/about-bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-35">
        <motion.div
          className="border
          border-white/20 w-[70%] p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center space-y-6 mb-8">
            <h1 className="text-3xl font-bold text-white text-center">Contact Us</h1>
            <p className="text-white/80 text-center">
              We are here to help at <span className="font-semibold text-yellow-500">TheMenuFy</span>. Contact us for
              any questions or inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Send a Message</h3>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white text-sm font-medium mb-2">
                    Subject
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="Your subject"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white text-sm font-medium mb-2">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
                      placeholder="Your message"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full transition-all duration-300 font-semibold border-2 bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-yellow-500"
                  whileHover={{ scale: 1.05 }}
                >
                  Send Message
                </motion.button>
              </form>
            </div>

            {/* Location Map */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Our Location</h3>
              <div className="h-64 bg-white/10 border border-white/30 rounded-lg overflow-hidden mb-6">
                {/* Map container */}
                <div ref={mapContainerRef} className="w-full h-full"></div>
              </div>

              <div className="space-y-3 text-white/80">
                <p>B.P. 160, pôle Technologique, Z.I. Chotrana II, 2083</p>
                <p>Call: +1 514 803 3030</p>
                <p>
                  Email:{" "}
                  <a href="mailto:menu.comapp@gmail.com" className="text-yellow-500 hover:underline">
                    menu.comapp@gmail.com
                  </a>
                </p>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
                <div className="flex space-x-6">
                  <motion.a href="#" className="text-white/80 hover:text-yellow-500" whileHover={{ scale: 1.2 }}>
                    <FaFacebook size={24} />
                  </motion.a>
                  <motion.a href="#" className="text-white/80 hover:text-yellow-500" whileHover={{ scale: 1.2 }}>
                    <FaTwitter size={24} />
                  </motion.a>
                  <motion.a href="#" className="text-white/80 hover:text-yellow-500" whileHover={{ scale: 1.2 }}>
                    <FaLinkedin size={24} />
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="mt-12 text-center">
            <motion.a
              href="/"
              className="py-3 px-6 rounded-full transition-all duration-300 font-semibold border-2 bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-yellow-500 inline-block"
              whileHover={{ scale: 1.1 }}
            >
              Back to Home
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default ContactPage
