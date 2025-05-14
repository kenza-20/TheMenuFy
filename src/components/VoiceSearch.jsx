// src/components/VoiceSearch.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const VoiceSearch = forwardRef(({ onResults }, ref) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée dans ce navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
      setListening(false);

      try {
        const response = await fetch('http://localhost:3000/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ speechText })
        });

        const data = await response.json();
        onResults(data.filteredMenu || []);
      } catch (err) {
        console.error("Erreur backend :", err);
      }
    };

    recognition.onerror = (e) => {
      console.error("Erreur vocale :", e);
      setListening(false);
    };

    recognition.start();
    setListening(true);
  };

  // Expose `startListening()` to parent via ref
  useImperativeHandle(ref, () => ({ startListening }));

  return (
    <div>
      <button
        onClick={startListening}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition duration-300"
      >
        <span role="img" aria-label="micro">🎤</span> Rechercher par la voix
      </button>

      {transcript && (
        <p className="mt-4 text-center text-white text-lg">
          Commande vocale : <span className="italic text-yellow-300">{transcript}</span>
        </p>
      )}
    </div>
  );
});

export default VoiceSearch;
