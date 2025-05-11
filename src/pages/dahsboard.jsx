import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    Cell
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

dayjs.extend(isSameOrAfter);

const Dashboard = () => {
    const [mealHistory, setMealHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todayCalories, setTodayCalories] = useState(0);
    const [weeklyCalories, setWeeklyCalories] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [graphType, setGraphType] = useState("line"); // line | bar
    const [filterMonth, setFilterMonth] = useState("");
    const [filterDish, setFilterDish] = useState("");
    const [prevWeekCalories, setPrevWeekCalories] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem("userId");
            try {
                const response = await axios.get(`http://localhost:3000/api/placedorders/history/${userId}`);
                const history = response.data;

                const updatedMeals = [];

                for (const record of history) {
                    const dishes = [];

                    for (const item of record.items) {
                        const recipeRes = await axios.get(`http://localhost:3000/api/recipes/name/${item.name}`);
                        dishes.push({
                            name: item.name,
                            category: recipeRes.data.category,
                            ingredients: recipeRes.data.ingredients
                        });
                    }

                    updatedMeals.push({ date: record.createdAt, dishes });
                }

                setMealHistory(updatedMeals);
                setLoading(false);

                const today = dayjs().startOf("day");
                const startOfWeek = dayjs().startOf("week");
                const prevWeekStart = startOfWeek.subtract(7, "day");

                let tCal = 0;
                let wCal = 0;
                let pCal = 0;
                const dayMap = {};

                updatedMeals.forEach(({ date, dishes }) => {
                    if (!date) return;

                    const parsedDate = dayjs(date);
                    const formattedDate = parsedDate.format("YYYY-MM-DD");

                    if (filterMonth && parsedDate.format("YYYY-MM") !== filterMonth) {
                        return;
                    }

                    if (filterDish && !dishes.some(d => d.name.includes(filterDish))) {
                        return;
                    }

                    const dishCalories = dishes.reduce(
                        (sum, d) => sum + d.ingredients.reduce((iSum, ing) => iSum + (ing.calories || 0), 0),
                        0
                    );

                    if (parsedDate.isSame(today, "day")) {
                        tCal += dishCalories;
                    }

                    if (parsedDate.isSameOrAfter(startOfWeek, "day")) {
                        wCal += dishCalories;
                    }

                    if (parsedDate.isAfter(prevWeekStart) && parsedDate.isBefore(startOfWeek)) {
                        pCal += dishCalories;
                    }

                    dayMap[formattedDate] = (dayMap[formattedDate] || 0) + dishCalories;
                });

                const sortedData = Object.entries(dayMap)
                    .sort(([a], [b]) => new Date(a) - new Date(b))
                    .map(([date, calories]) => ({ date, calories }));

                setPrevWeekCalories(pCal);
                setTodayCalories(tCal);
                setWeeklyCalories(wCal);
                setChartData(sortedData);
            } catch (err) {
                console.error("Erreur de chargement :", err);
            }
        };

        fetchData();
    }, [filterMonth, filterDish]);

    const renderGraph = () => {
        if (graphType === "line") {
            return (
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="calories"
                        stroke={weeklyCalories > prevWeekCalories ? "#4caf50" : "#ff4d4f"}
                        strokeWidth={3}
                        dot={{ fill: "#ff7300" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            );
        } else {
            return (
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calories">
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.calories > 2000 ? "#ff4d4f" : "#82ca9d"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            );
        }
    };

    const exportToPDF = async () => {
        const originalElement = document.getElementById("chart");
        if (!originalElement) return;

        try {
            // 1. Cloner l'élément
            const clone = originalElement.cloneNode(true);
            clone.id = "chart-clone";
            clone.style.position = 'fixed';
            clone.style.left = '-10000px';
            document.body.appendChild(clone);

            // 2. Injecter des styles de remplacement
            const overrideStyles = document.createElement('style');
            overrideStyles.textContent = `
            * {
                background-color: #1a1a1a !important;
                color: #e5e7eb !important;
                border-color: #4b5563 !important;
            }
            
            .recharts-tooltip-wrapper {
                background: #1f2937 !important;
                border: 1px solid #374151 !important;
            }
            
            path.recharts-curve {
                stroke: #eab308 !important;
            }
        `;
            clone.appendChild(overrideStyles);

            // 3. Configuration avancée html2canvas
            const canvas = await html2canvas(clone, {
                backgroundColor: '#1a1a1a',
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc) => {
                    // Nettoyage final avant capture
                    clonedDoc.querySelectorAll('*').forEach(el => {
                        const styles = window.getComputedStyle(el);
                        ['background', 'color', 'border'].forEach(prop => {
                            const value = styles.getPropertyValue(prop);
                            if (value.includes('oklch')) {
                                el.style.setProperty(prop, '#1a1a1a', 'important');
                            }
                        });
                    });
                }
            });

            // 4. Génération PDF
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const imgWidth = 280; // Largeur A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(canvas, 'PNG', 5, 5, imgWidth, imgHeight);
            pdf.save(`rapput-nutrition-${Date.now()}.pdf`);

        } catch (error) {
            console.error('Erreur génération PDF:', error);
            alert('Erreur lors de l\'export. Vérrez la console pour plus de détails.');
        } finally {
            // Nettoyage final
            const clone = document.getElementById("chart-clone");
            if (clone) clone.remove();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (

        <div className="flex flex-col min-h-screen">
            <style>{`
    @media print {
        body {
            background-color: #1a1a1a !important;
            -webkit-print-color-adjust: exact;
        }
    }
    
    .pdf-export-hide {
        display: none !important;
    }
`}</style>
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                style={{
                    backgroundImage: "url('/login1.jpg')",
                    boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
                }}
            />
            <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
                <div className="w-full max-w-7xl mx-auto">
                    <h2 className="text-3xl text-center text-yellow-400 mb-8">Tableau de bord nutritionnel</h2>

                    {/* Filtres */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <input
                                type="month"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="bg-white/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-300"
                            />
                            <input
                                type="text"
                                placeholder="Filtrer par plat"
                                value={filterDish}
                                onChange={(e) => setFilterDish(e.target.value)}
                                className="bg-white/20 border border-white/10 rounded-lg p-2 text-white placeholder-gray-300"
                            />
                            <select
                                value={graphType}
                                onChange={(e) => setGraphType(e.target.value)}
                                className="bg-white/20 border border-white/10 rounded-lg p-2 text-white"
                            >
                                <option value="line" className="bg-gray-800">Ligne</option>
                                <option value="bar" className="bg-gray-800">Barres</option>
                            </select>
                            <button
                                onClick={() => {
                                    setFilterDish("");
                                    setFilterMonth("");
                                }}
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg p-2 transition-colors"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>

                    {/* Graphique */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
                        <h3 className="text-xl text-yellow-400 mb-4">Évolution des calories</h3>
                        <div id="chart" className="[&_.recharts-cartesian-axis-tick]:[&_text]:!fill-gray-300">
                            <ResponsiveContainer width="100%" height={400}>
                                {renderGraph()}
                            </ResponsiveContainer>
                        </div>

                        <button
                            onClick={exportToPDF}
                            className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors
               active:scale-95 transform-gpu print:hidden"
                            disabled={loading}
                        >
    <span className="flex items-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M12 16L12 8M12 16L9 13M12 16L15 13" stroke="currentColor" strokeWidth="2"/>
            <path d="M20 16H4V8H20V16Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M4 8L4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V8" stroke="currentColor" strokeWidth="2"/>
        </svg>
        Exporter PDF
    </span>
                        </button>
                    </div>
                </div>
            </main>
        </div>

    );

};

export default Dashboard;