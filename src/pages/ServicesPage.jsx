import React from "react";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Page Header with blurred background image */}
      <section
        className="bg-cover bg-center text-white py-35 relative"
        style={{
          backgroundImage: "url('/bg.jpg')", // Add your background image path here
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 backdrop-blur-lg"></div> {/* Adding blur effect */}
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold sm:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg">
            Healthy meals tailored for specific profiles such as athletes, allergy sufferers, and more.
          </p>
        </div>
      </section>

      {/* Description section with a centered line */}
      <section className="py-5 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="mt-4 text-lg">
            Explore our meal kit services and how we can enhance your culinary experience.
          </p>
          <div className="mt-5 mb-8 border-b-4 border-gray-800 w-48 mx-auto rounded-full shadow-lg"></div> {/* Enhanced Divider Line */}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-1 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {/* Service 1: Detailed Meal Kits */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <img
                src="Detailed.jpg"
                alt="Detailed Meal Kits"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">Detailed Meal Kits</h3>
              <p className="mt-4 text-gray-600">
                Order meal kits with detailed ingredients and recipes tailored to the number of people.
              </p>
            </div>

            {/* Service 2: Meal Customization */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <img
                src="Customization.jpg"
                alt="Meal Customization"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">Meal Customization</h3>
              <p className="mt-4 text-gray-600">
                Customize your meals based on your preferences for themed events or special occasions.
              </p>
            </div>

            {/* Service 3: Client Ambassadors */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <img
                src="Ambassadors.jpg"
                alt="Client Ambassadors"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">Client Ambassadors</h3>
              <p className="mt-4 text-gray-600">
                Discover suggestions from our client ambassadors with photos and videos of their culinary experiences.
              </p>
            </div>

            {/* Service 4: Healthy Meals */}
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <img
                src="Healthy.jpg"
                alt="Healthy Meals"
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900">Healthy Meals</h3>
              <p className="mt-4 text-gray-600">
                Healthy meals tailored for specific profiles such as athletes, allergy sufferers, and more.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
