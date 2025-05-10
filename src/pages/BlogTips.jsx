import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const BlogTips = () => {
  const { t } = useTranslation();
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tips'); // Ensure your backend API URL is correct

        // Check if the response data is an array
        if (Array.isArray(response.data)) {
          setTips(response.data);
        } else {
          setError('Data format error: expected an array of tips.');
        }
      } catch (err) {
        console.error('Error fetching tips:', err);
        setError(t('blogTips.error')); // Using English error translation
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">{t('blogTips.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

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
          <h2 className="text-3xl text-center text-yellow-400 mb-8">📝 {t('blogTips.title')}</h2>

          {/* Tips List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.length === 0 ? (
                <p className="text-center text-gray-300">{t('blogTips.noTips')}</p>
              ) : (
                tips.map(tip => (
                  <div
                    key={tip._id}
                    className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    {tip.image && (
                      <img
                        src={tip.image}
                        alt={tip.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-yellow-400 mb-2">{tip.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{tip.content}</p>
                    <p className="text-sm text-gray-500">
                      {t('blogTips.date')} {new Date(tip.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogTips;
