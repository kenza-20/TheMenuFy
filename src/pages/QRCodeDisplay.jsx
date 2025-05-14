import React, { useState, useEffect } from 'react';

const QRCodeDisplay = ({ tableId }) => {
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the QR code from the backend
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/orders/qr/generate/${tableId}`);
        if (!response.ok) {
          throw new Error('Failed to generate QR code');
        }
        const data = await response.json();
        setQrCodeImage(data.qrCodeImage); // Set the QR code image
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQRCode(); // Fetch the QR code when the component mounts
  }, [tableId]); // Re-run the effect if tableId changes

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl text-center text-yellow-400 mb-8">📱 QR Code for Table {tableId}</h2>

          {/* Error and Loading States */}
          {loading && (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <p className="text-lg">Loading QR code...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
              <p>{error}</p>
            </div>
          )}

          {/* QR Code Display */}
          {!loading && !error && qrCodeImage && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Your QR Code</h3>
              <img
                src={qrCodeImage}
                alt={`QR Code for Table ${tableId}`}
                className="w-64 h-64 object-cover mx-auto rounded-lg mb-4"
              />
              <p className="text-sm text-gray-300">Scan the QR code to complete your order.</p>
            </div>
          )}

          {/* In case there's no QR code */}
          {!loading && !error && !qrCodeImage && (
            <div className="text-center text-gray-300">No QR code available for this table.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QRCodeDisplay;
