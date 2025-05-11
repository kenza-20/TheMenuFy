import React, { useEffect, useState } from 'react';

const QRCodeDisplay = () => {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Retrieve userId from localStorage
  const userId = localStorage.getItem('userId'); // Assuming userId is stored as 'userId' in localStorage

  useEffect(() => {
    const fetchQRCode = async () => {
      setLoading(true);
      if (!userId) {
        setError('User ID not available. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/orders/generate-qr/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        console.log('QR Code Data:', data);

        if (data.qrCode) {
          setQrCode(data.qrCode);
        } else {
          setError('QR code not found in response');
        }
      } catch (err) {
        console.error('Error fetching QR code:', err);
        setError('Failed to load QR code.');
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [userId]); // Depend on userId to re-trigger the effect if it changes

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
          <h2 className="text-3xl text-center text-yellow-400 mb-8">📱 QR Code</h2>

          {/* Error and Loading States */}
          {error && (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
              <p>{error}</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
              <p className="text-lg">Loading QR code...</p>
            </div>
          )}

          {/* QR Code Display */}
          {!loading && !error && qrCode && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Your QR Code</h3>
              <img src={qrCode} alt="QR Code" className="w-64 h-64 object-cover mx-auto rounded-lg mb-4" />
              <p className="text-sm text-gray-300">Scan the QR code to complete your order.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QRCodeDisplay;
