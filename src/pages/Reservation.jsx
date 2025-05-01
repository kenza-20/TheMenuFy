import React, { useState, useEffect } from "react";
import Button from "../components/button";
import { Mail } from "lucide-react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Important for PDF tables

const Reservation = () => {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUserId(savedUser.id);
      setUserEmail(savedUser.email);
    } else {
      setMessage('User not found in localStorage.');
    }
  }, []);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("User ID is missing. Please log in again.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/user/reservations', {
        userId,
        date,
        time,
        numberOfGuests,
        specialRequests,
        userEmail,
      });

      if (response.status === 201) {
        setMessage('Reservation successfully added! A confirmation email has been sent.');
      }
    } catch (error) {
      setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header background
    doc.setFillColor('#facc15'); // Tailwind yellow-400
    doc.rect(0, 0, 210, 40, 'F');

    // Restaurant Name: THE MENUFY
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#1f2937'); // gray-800
    doc.setFontSize(26);
    doc.text('THE MENUFY', 15, 20);

    // Subheading
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor('#374151'); // gray-700
    doc.text('Reservation Summary', 15, 30);

    // Table of reservation details
    autoTable(doc, {
      startY: 50,
      head: [['Field', 'Details']],
      body: [
        ['Email', userEmail],
        ['Date', date],
        ['Time', time],
        ['Guests', numberOfGuests.toString()],
        ['Special Requests', specialRequests || 'None']
      ],
      styles: {
        font: 'helvetica',
        fontSize: 12,
        cellPadding: 6,
        textColor: '#111827',
      },
      headStyles: {
        fillColor: '#fbbf24',
        textColor: '#1f2937',
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: '#fef3c7' },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(12);
    doc.setTextColor('#6b7280');
    doc.text('Thank you for your reservation! ❤️', 15, pageHeight - 15);

    doc.save('reservation_summary.pdf');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{ backgroundImage: "url('/Reservation.jpg')" }}
      />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="w-full max-w-md px-6 py-8 rounded-2xl bg-white/20 backdrop-blur-lg text-white">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl font-bold">Make a Reservation</h1>

            <form className="space-y-4 w-full" onSubmit={handleReservationSubmit}>
              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <Mail className="text-yellow-500" size={20} />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Date:</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Time:</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center space-x-3 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Guests:</span>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  min="1"
                  className="bg-transparent text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col space-y-2 bg-white/10 p-4 rounded-lg">
                <span className="text-yellow-500">Special Requests:</span>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="bg-transparent text-white focus:outline-none w-full h-24"
                />
              </div>

              <Button
                type="submit"
                className="bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
              >
                Submit Reservation
              </Button>

              <Button
                type="button"
                onClick={generatePDF}
                className="bg-yellow-500 text-white hover:bg-yellow-600 font-semibold py-3 px-6 rounded-full transition-all duration-300 w-full"
              >
                📄 Download PDF Summary
              </Button>
            </form>

            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reservation;
