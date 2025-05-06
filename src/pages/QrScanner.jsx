import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

const QrScanner = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    const successHandler = (decodedText) => {
      if (decodedText.includes("http://localhost:5173/resto/")) {
        const url = new URL(decodedText);
        const path = url.pathname;
        
        scanner.clear().then(() => {
          navigate(path);
        });
      }
    };

    scanner.render(successHandler, console.error);

    return () => scanner.clear().catch(() => {});
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/login1.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-2xl mx-auto">
          {/* Title */}
          <h2 className="text-3xl font-bold text-yellow-400 text-center mb-8">
            Scannez le QR Code du restaurant
          </h2>

          {/* QR Scanner Container */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div id="qr-reader" className="w-full aspect-square rounded-lg overflow-hidden"></div>
          </div>

          {/* Help Text */}
          <p className="text-gray-300 text-center mt-6">
            Positionnez le QR Code dans le cadre pour le scanner
          </p>
        </div>
      </main>
    </div>
  );
};

export default QrScanner;