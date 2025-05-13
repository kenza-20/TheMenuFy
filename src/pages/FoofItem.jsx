import { useDrag } from 'react-dnd';

function FoodItem({ food }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "FOOD",
        item: { name: food.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            ref={drag}
            className={`px-4 py-2 rounded-xl cursor-move transition-all ${
                isDragging
                    ? 'bg-yellow-400 text-black scale-95 opacity-75'
                    : 'bg-white/10 hover:bg-yellow-500/20 text-white'
            }`}
            title={`${food.calories}kcal | Protéines: ${food.protein}g | Glucides: ${food.carbs}g | Lipides: ${food.fat}g`}
        >
            {food.name}
        </div>
    );
}

export default FoodItem;