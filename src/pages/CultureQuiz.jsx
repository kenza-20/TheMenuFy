// 📁 src/pages/CultureQuiz.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CultureQuiz = () => {
  const { country } = useParams();
  const [data, setData] = useState(null);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchCulture = async () => {
      try {
        const res = await axios.get(`/api/culture/${country}`);
        setData(res.data);
      } catch (err) {
        console.error('Erreur culture:', err);
      }
    };
    fetchCulture();
  }, [country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected === data.quiz[current].answer) {
      setScore((prev) => prev + 1);
    }

    if (current + 1 < data.quiz.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
  };

  if (!data) return <div className="text-white text-center mt-10">Chargement...</div>;

  return (
    <div className="min-h-screen relative flex items-center justify-center py-16 px-6 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-blue-900 -z-10 animate-fade" />

      <div className="w-full max-w-3xl bg-black/70 rounded-2xl border border-yellow-500 shadow-2xl p-10">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-6">
          🌍 Culture : {country}
        </h1>
        <p className="text-gray-300 text-center mb-10">{data.info}</p>

        {!showResult ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              ❓ {data.quiz[current].question}
            </h2>

            <div className="grid gap-4">
              {data.quiz[current].options.map((option, i) => (
                <label
                  key={i}
                  className={`flex items-center px-5 py-3 rounded-lg border transition cursor-pointer ${
                    selected === option
                      ? 'bg-yellow-500 text-black border-yellow-500'
                      : 'border-white/10 hover:border-yellow-500 hover:bg-white/5'
                  }`}
                >
                  <input
                    type="radio"
                    value={option}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                    className="form-radio h-5 w-5 text-yellow-500 mr-4"
                  />
                  {option}
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={!selected}
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-full hover:bg-yellow-400 transition"
            >
              {current + 1 < data.quiz.length ? 'Suivant' : 'Voir le résultat'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-400 mb-2">🎉 Quiz terminé !</h2>
            <p className="text-lg mb-2">Score : {score} / {data.quiz.length}</p>

            {score === data.quiz.length ? (
              <p className="text-yellow-400 font-semibold">🏆 Bravo ! Tu gagnes un badge culturel !</p>
            ) : (
              <p className="text-gray-300">Tu peux réessayer pour obtenir un meilleur score !</p>
            )}

            <button
              onClick={resetQuiz}
              className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
            >
              🔁 Rejouer le quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CultureQuiz;
