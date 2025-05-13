import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FoodItem from './FoofItem';
import Plate from './Plate';
import NutritionSummary from './NutritionSummary';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ComposeAssiette() {
    const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [plateItems, setPlateItems] = useState([]);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        const loadIngredients = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/nutrition/ingredients');
                setFoods(response.data);
            } catch (error) {
                console.error('Erreur chargement ingrédients:', error);
            }
        };
        loadIngredients();
    }, []);

    const handleGenerateImage = async () => {
        if(plateItems.length === 0) return;

        setIsGenerating(true);
        try {
            const response = await axios.post('http://localhost:3000/api/generate-image', {
                items: plateItems
            });
            setGeneratedImage(response.data.imageUrl);
        } catch (error) {
            console.error('Erreur génération image:', error);
            alert('Erreur lors de la génération de l\'image');
        }
        setIsGenerating(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col min-h-screen">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                     style={{
                         backgroundImage: "url('/login1.jpg')",
                         boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
                     }}
                />

                <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20 mt-14">                    <div className="w-full max-w-7xl mx-auto space-y-12">
                    <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                        Composez votre assiette équilibrée
                    </h1>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Section Ingrédients */}
                        <div className="space-y-6 p-6 bg-white/5 rounded-2xl backdrop-blur-lg">
                            <h2 className="text-3xl font-semibold text-emerald-400 border-b border-emerald-400 pb-4">
                                🥦 Ingrédients disponibles
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {foods.map(food => (
                                    <FoodItem
                                        key={food._id}
                                        food={food}
                                        className="hover:transform hover:scale-105 transition-all"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Section Assiette */}
                        <div className="space-y-6 p-6 bg-white/5 rounded-2xl backdrop-blur-lg">
                            <h2 className="text-3xl font-semibold text-yellow-400 border-b border-yellow-400 pb-4">
                                🍽️ Votre composition
                            </h2>
                            <Plate
                                updateNutrition={setNutrition}
                                setItems={setPlateItems}
                            />
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGenerateImage}
                            disabled={isGenerating}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full
                                        transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <span className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                                        </svg>
                                        Génération en cours...
                                    </span>
                            ) : (
                                '🍳 Visualiser mon assiette'
                            )}
                        </button>
                    </div>

                    {generatedImage && (
                        <div className="mt-8 p-4 bg-white/10 backdrop-blur-lg rounded-2xl text-center">
                            <h3 className="text-xl text-yellow-400 mb-4">Votre assiette générée 🎨</h3>
                            <img
                                src={generatedImage}
                                alt="Assiette générée"
                                className="mx-auto rounded-lg shadow-xl max-h-64"
                            />
                            <p className="mt-4 text-sm text-gray-200">
                                Image générée par intelligence artificielle
                            </p>
                        </div>
                    )}

                    <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-yellow-400">📊 Résumé nutritionnel</h3>
                        <NutritionSummary nutrition={nutrition} />
                    </div>
                </div>
                </main>
            </div>
        </DndProvider>
    );
}

export default ComposeAssiette;