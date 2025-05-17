import { useDrop } from 'react-dnd';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Plate({ updateNutrition, setItems }) {
    const [localItems, setLocalItems] = useState([]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FOOD',
        drop: (item) => setLocalItems(prev => [...prev, item.name]),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    useEffect(() => {
        setItems(localItems);

        const calculateNutrition = async () => {
            try {
                const response = await axios.post('http://localhost:3000/api/nutrition/nutrition', {
                    foodItems: localItems
                });
                updateNutrition(response.data);
            } catch (error) {
                console.error("Erreur calcul nutrition:", error);
            }
        };

        if(localItems.length > 0) calculateNutrition();
    }, [localItems]);

    return (
        <div
            ref={drop}
            className={`min-h-[250px] transition-colors duration-200 ${
                isOver ? 'bg-gray-700' : 'bg-gray-800'
            } border-2 border-dashed border-white/30 rounded-xl p-5 text-white`}
        >
            <h3 className="text-center mb-4">🍽️ Mon assiette</h3>
            <div className="flex flex-wrap gap-2">
                {localItems.map((item, index) => (
                    <div key={index} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        🍴 {item}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Plate;