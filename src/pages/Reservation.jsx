import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { jsPDF } from "jspdf";

const Reservation = () => {
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    date: "",
    time: "",
    guests: 1,
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({ ...prev, userId: user._id }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, date, time, guests } = formData;
    if (!email || !date || !time || guests <= 0) {
      setError("Please fill in all the required fields.");
      return;
    } else {
      setError(""); 
    }
  
    const reservationData = {
      userId: formData.userId, // The user ID
      reservationDetails: formData, // Reservation data
    };
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/reservations",
        reservationData, // Send the data as the request body
        {
          headers: { "Content-Type": "application/json" }, // Ensure proper content type
        }
      );
      console.log("Reservation successful:", response.data);
    } catch (error) {
      console.error("Reservation failed:", error.response?.data || error.message);
    }
  };
  
  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reservation Details", 20, 20);
    doc.text(`Email: ${formData.email}`, 20, 30);
    doc.text(`Date: ${formData.date}`, 20, 40);
    doc.text(`Time: ${formData.time}`, 20, 50);
    doc.text(`Number of Guests: ${formData.guests}`, 20, 60);
    doc.text(`Notes: ${formData.notes || "N/A"}`, 20, 70);
    doc.save("reservation-details.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center py-16">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/about-bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.4)",
        }}
      />

      <main className="relative flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-35">
        <motion.div
          className="border border-white/20 w-[90%] md:w-[70%] p-8 sm:p-10 rounded-2xl bg-white/10 backdrop-blur-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center space-y-6 mb-8">
            <h1 className="text-3xl font-bold text-white text-center">Make a Reservation</h1>
            <p className="text-white/80 text-center">
              Book your table at <span className="font-semibold text-yellow-500">TheMenuFy</span> and enjoy a premium dining experience.
            </p>
          </div>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>} {/* Error message */}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
              {!formData.email && (
                <p className="text-red-500 text-sm">Email is required</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
              {!formData.date && (
                <p className="text-red-500 text-sm">Date is required</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
              {!formData.time && (
                <p className="text-red-500 text-sm">Time is required</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Number of Guests</label>
              <input
                type="number"
                name="guests"
                min="1"
                value={formData.guests}
                onChange={handleChange}
                placeholder="e.g. 2"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
              {formData.guests <= 0 && (
                <p className="text-red-500 text-sm">Guests number must be greater than 0</p>
              )}
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any special requests?"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg backdrop-blur-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 px-6 rounded-full transition-all duration-300 font-semibold border-2 bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-yellow-500"
              whileHover={{ scale: 1.05 }}
            >
              Confirm Reservation
            </motion.button>
          </form>

          {/* PDF Button */}
          <div className="mt-6 text-center">
            <motion.button
              onClick={generatePDF}
              className="py-3 px-6 rounded-full transition-all duration-300 font-semibold border-2 bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-yellow-500"
              whileHover={{ scale: 1.05 }}
            >
              Download as PDF
            </motion.button>
          </div>

          {/* Back Button */}
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
  );
};

export default Reservation;
