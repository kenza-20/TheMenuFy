import React, { useState } from "react";
import mapboxgl from "mapbox-gl"; // Using mapbox-gl
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Button from "../components/button"; // Ensure the Button is defined in your project

const ContactPage = () => {
  // Replace with your Mapbox token
  const MAPBOX_TOKEN = "your_mapbox_token";

  // Create a ref for the map container
  const mapContainerRef = React.useRef(null);

  // Initialize the map
  React.useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11", // Map style
        center: [-73.578, 45.507], // Longitude, Latitude for Laval
        zoom: 12,
      });
    }
  }, []);

  return (
    <div
      className="bg-cover bg-center bg-no-repeat min-h-screen flex flex-col pt-20"
      style={{ backgroundImage: "url('/register1.jpg')" }}
    >
      {/* Page Header */}
      <section className="text-white py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg">We are here to help, contact us for any questions or inquiries.</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 bg-white rounded-t-3xl shadow-xl backdrop-blur-lg bg-opacity-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg backdrop-blur-lg bg-opacity-60">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h3>
              <form action="#" method="POST">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="4"
                      className="mt-2 p-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full mt-6 w-full">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Location Map */}
            <div className="bg-white p-8 rounded-xl shadow-lg backdrop-blur-lg bg-opacity-60">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Location</h3>
              <div className="h-80 bg-gray-300 rounded-xl">
                {/* Map container */}
                <div ref={mapContainerRef} className="w-full h-full"></div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-500">Laval, Québec, Canada H7T0B2</p>
                <p className="text-gray-500">Call: +1 514 803 3030</p>
                <p className="text-gray-500">Email: <a href="mailto:menu.comapp@gmail.com" className="text-pink-600">menu.comapp@gmail.com</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Icons */}
      <section className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us on Social Media</h3>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
