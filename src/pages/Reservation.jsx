import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const Reservation = () => {
  const location = useLocation();
  const { item } = location.state || {};
  const navigate = useNavigate();
  const [reservationConfirmed, setReservationConfirmed] = useState(false);

  useEffect(() => {
    const savedReservation = JSON.parse(localStorage.getItem('reservation'));
    if (savedReservation) {
      setReservationConfirmed(true); // Show confirmation message if data is already saved
    }
  }, []);

  const handleReservationConfirm = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const newCommande = {
      id_commande: Date.now(),
      id_user: userId,
      id_plat: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image // Store the image URL here
    };

    localStorage.setItem('reservation', JSON.stringify(newCommande));

    setReservationConfirmed(true);

    const allCommandes = JSON.parse(localStorage.getItem('commandes')) || [];
    allCommandes.push(newCommande);
    localStorage.setItem('commandes', JSON.stringify(allCommandes));

    navigate('/orders');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Reservation Details', 10, 10);
    doc.text(`Name: ${item.name}`, 10, 20);
    doc.text(`Description: ${item.description}`, 10, 30);
    doc.text(`Price: ${item.price}€`, 10, 40);

    // Optional: Add an image to the PDF if available
    if (item.image) {
      doc.addImage(item.image, 'JPEG', 10, 50, 100, 50); // Adjust image size and position
    }

    doc.save('reservation.pdf'); // Save the PDF with the given name
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <div className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="bg-white/10 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
              <h2 className="text-2xl font-semibold text-center mb-4 text-yellow-400">Reservation</h2>
              {item ? (
                <>
                  <h3 className="text-xl font-semibold text-yellow-400 mb-2">{item.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-yellow-500">{item.price}€</span>
                    <button
                      onClick={handleReservationConfirm}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600 transition-all"
                    >
                      Confirm Reservation
                    </button>
                  </div>
                  <div className="mt-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </>
              ) : (
                <p>No information available.</p>
              )}
              {reservationConfirmed && <p className="text-green-500 mt-4">Reservation confirmed!</p>}
              {reservationConfirmed && (
                <button
                  onClick={generatePDF}
                  className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm mt-4 hover:bg-yellow-500 transition-all"
                >
                  Download Reservation PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
