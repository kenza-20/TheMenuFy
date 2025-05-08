import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import BlurContainer from "../components/blurContainer"
import ChatSupport from "../components/chat-support"
import { isAuthenticated } from "../selectors/AuthSelector";
import { useSelector } from "react-redux";


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
    const authenticated = useSelector(isAuthenticated);
  

    const handleLiveChatClick = () => {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === "function") {
        window.Tawk_API.toggle();
      } else {
        console.warn("Tawk API not loaded yet");
      }
    };
    

  const handleChange = (e:any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }



  return (
    <div className="py-16 relative min-h-screen flex flex-col ">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Main content */}
      <div className="relative flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl">
          <BlurContainer blur="xl" opacity={50} padding={8} rounded="2xl" className="w-full mx-auto p-10">
            <div className="flex flex-col space-y-10">
              {/* Header */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white">Contact Us</h2>
                <p className="mt-4 text-lg text-white/80">We'd love to hear from you</p>
                <motion.div
                  className="mt-5 mb-8 border-b-4 border-yellow-500 w-48 rounded-full shadow-lg mx-auto"
                  initial={{ width: 0 }}
                  animate={{ width: "12rem" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                ></motion.div>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center"
                    >
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="h-8 w-8 text-green-400" />
                      </div>
                      <h4 className="text-xl font-medium text-white mb-2">Message Sent!</h4>
                      <p className="text-white/80">
                        Thank you for reaching out. We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 ${
                          isSubmitting ? "bg-yellow-500/50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"
                        } text-black font-medium transition-colors`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin h-5 w-5 border-2 border-black/20 border-t-black rounded-full"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-semibold text-white mb-6">Get in touch</h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500/20 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Our Location</h4>
                        <p className="text-white/70">123 Restaurant Street, Paris, France</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500/20 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Phone Number</h4>
                        <p className="text-white/70">+33 1 23 45 67 89</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-yellow-500/20 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">Email Address</h4>
                        <p className="text-white/70">contact@themenufy.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Support Options */}
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-lg font-medium text-white mb-4">Live Support</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
  onClick={handleLiveChatClick}
  className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition"
>
  <MessageSquare size={20} />
  <span>Live Chat</span>
</button>


                      <a
                        href={`https://wa.me/+21611111111?text=${encodeURIComponent(
                            "Hello! I need assistance with my order.",
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg text-white transition-colors"
                      >
                        <FaWhatsapp className="h-5 w-5 text-green-500" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-lg font-medium text-white mb-4">Business Hours</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Monday - Friday:</span>
                        <span className="text-white">9:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Saturday:</span>
                        <span className="text-white">10:00 AM - 11:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Sunday:</span>
                        <span className="text-white">10:00 AM - 9:00 PM</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>

      {/* Chat Support Widget */}
      {authenticated && <ChatSupport />}
    </div>
  )
}

export default ContactPage
