import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; 

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Footer */}
      <footer className="bg-black py-12">
         <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
           <div className="space-y-4">
             <h5 className="text-yellow-400 text-lg font-bold">TheMenuFy</h5>
             <p className="text-gray-400 text-sm">Experience gastronomic excellence since 1998</p>
           </div>
           <div className="space-y-2">
             <h6 className="text-white font-medium mb-2">Navigation</h6>
             {['Menu', 'Reservation', 'About', 'Contact'].map((item, i) => (
               <Link key={i} to={`/${item.toLowerCase()}`} className="block text-gray-400 hover:text-yellow-400 text-sm">
                 {item}
               </Link>
             ))}
           </div>
           <div className="space-y-2">
             <h6 className="text-white font-medium mb-2">Contact</h6>
             <p className="text-gray-400 text-sm">123 Gourmet Street</p>
             <p className="text-gray-400 text-sm">New York, NY 10001</p>
             <p className="text-gray-400 text-sm">reservations@themenufy.com</p>
           </div>
           <div className="space-y-2">
             <h6 className="text-white font-medium mb-2">Follow Us</h6>
             <div className="flex space-x-4">
               {['instagram', 'twitter', 'facebook'].map((platform, i) => (
                 <a key={i} href="#" className="text-gray-400 hover:text-yellow-400 transition">
                   <span className="sr-only">{platform}</span>
                   <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                     {/* SVG icons here */}
                   </svg>
                 </a>
               ))}
             </div>
           </div>
         </div>
       </footer>
    </>
       
  );
};

export default Footer;
