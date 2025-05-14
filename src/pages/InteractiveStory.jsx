// 📁 src/pages/InteractiveStory.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const InteractiveStory = () => {
  const [step, setStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storyEnded, setStoryEnded] = useState(false);
  const [generatedPlate, setGeneratedPlate] = useState(null);

  const loadStep = async (stepId = '') => {
    setLoading(true);
    console.log('🔄 Chargement de l’étape :', stepId || 'start');
    try {
      const res = await axios.get(`/api/narrative/step/${stepId}`);
      console.log('✅ Étape chargée :', res.data);
      setStep(res.data);
      setStoryEnded(!!res.data.end);
      setGeneratedPlate(null);
    } catch (err) {
      console.error('❌ Erreur lors du chargement de l’étape :', err);
    } finally {
      setLoading(false);
    }
  };

  const submitChoice = async (nextStepId) => {
    console.log('👉 Choix sélectionné :', nextStepId);
    setLoading(true);
    try {
      const res = await axios.get(`/api/narrative/step/${nextStepId}`);
      console.log('✅ Étape chargée :', res.data);
      setStep(res.data);

      if (res.data.end) {
        console.log('🎯 Fin détectée — génération du plat...');
        const plateRes = await axios.post('/api/narrative/end');
        console.log('🍽️ Plat généré :', plateRes.data.plate);
        setGeneratedPlate({
          ...plateRes.data.plate,
          similarInMenu: plateRes.data.similarInMenu,
        });
        setStoryEnded(true);
      }
    } catch (err) {
      console.error('❌ Erreur lors de la soumission du choix :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStep();
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/images/bg-kitchen.jpg')",
      }}
    >
      {/* Dark layer over background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      <div className="z-10 max-w-3xl w-full px-6 py-12 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-yellow-400 drop-shadow text-center mb-10 animate-fade-in">
          🎭 Aventure Culinaires Interactives
        </h1>

        {loading && <Loader2 className="animate-spin mx-auto h-8 w-8" />}

        {!loading && step && (
          <Card className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-xl p-8 border border-yellow-500 text-left shadow-2xl animate-fade-in">
            <CardContent>
              <p className="text-lg mb-6">{step.text}</p>

              {!storyEnded && step.choices && (
                <div className="space-y-4">
                  {step.choices.map((choice, index) => (
                    <Button
                      key={index}
                      onClick={() => submitChoice(choice.next)}
                      className="w-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 hover:brightness-110 text-white font-bold px-5 py-3 rounded-full shadow-lg hover:scale-105 transition transform duration-300"
                    >
                      {choice.label}
                    </Button>
                  ))}
                </div>
              )}

              {storyEnded && generatedPlate && (
                <div className="mt-6 space-y-4 text-center">
                  <h2 className="text-xl font-semibold text-yellow-300">🍽️ Ton plat final :</h2>

                  <img
                    src={generatedPlate.image}
                    alt={generatedPlate.name}
                    className="rounded-xl shadow-lg mx-auto max-h-64 object-cover"
                  />

                  <p className="mt-2 text-white font-bold text-2xl">{generatedPlate.name}</p>
                  <p className="text-sm text-gray-300">{generatedPlate.description}</p>

                  {generatedPlate.similarInMenu && (
                    <div className="mt-6 p-4 bg-white/10 border border-green-400 rounded-xl shadow">
                      <h3 className="text-lg text-green-300 font-semibold">🧾 Plat similaire dans notre menu :</h3>

                      <div className="flex flex-col items-center mt-2">
                        <img
                          src={generatedPlate.similarInMenu.image}
                          alt={generatedPlate.similarInMenu.name}
                          className="h-40 rounded-lg shadow-md object-cover"
                        />
                        <p className="mt-2 text-white font-bold">{generatedPlate.similarInMenu.name}</p>
                        <Button
                          className="mt-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-4 py-1 transition"
                          onClick={() =>
                            window.location.href = `/dish/${generatedPlate.similarInMenu.id}`
                          }
                        >
                          Voir la recette
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => loadStep()}
                    className="mt-6 bg-white/20 text-white border border-yellow-400 px-5 py-2 rounded-full hover:bg-white/30 transition"
                  >
                    🔁 Rejouer l'aventure
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InteractiveStory;
