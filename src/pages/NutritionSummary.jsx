function NutritionSummary({ nutrition }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-yellow-400 font-bold text-xl">{nutrition.calories}</div>
                <div className="text-sm">Calories</div>
                <div className="text-xs text-gray-400">kcal</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-yellow-400 font-bold text-xl">{nutrition.protein}</div>
                <div className="text-sm">Protéines</div>
                <div className="text-xs text-gray-400">g</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-yellow-400 font-bold text-xl">{nutrition.carbs}</div>
                <div className="text-sm">Glucides</div>
                <div className="text-xs text-gray-400">g</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center">
                <div className="text-yellow-400 font-bold text-xl">{nutrition.fat}</div>
                <div className="text-sm">Lipides</div>
                <div className="text-xs text-gray-400">g</div>
            </div>
        </div>
    );
}

export default NutritionSummary;