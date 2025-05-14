import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const Static = () => {
    const [usersCount, setUsersCount] = useState(0);
    const [reservationsCount, setReservationsCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [recipesCount, setRecipesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchCounts();
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchCounts = async () => {
        try {
            const [usersRes, reservationsRes, ordersRes, recipesRes] = await Promise.all([
                axios.get('http://localhost:3000/api/user/users'),
                axios.get('http://localhost:3000/api/user/getAllReservation'),
                axios.get('http://localhost:3000/api/placedOrders/getAll'),
                axios.get('http://localhost:3000/api/recipes/all'),
            ]);

            setUsersCount(usersRes.data.length);
            setReservationsCount(reservationsRes.data.length);
            console.log('hhhhhhhhhhhhh',usersRes.data.length)
            setOrdersCount(ordersRes.data.length);
            setRecipesCount(recipesRes.data.length);
        } catch (error) {
            console.error('Erreur lors du chargement des données :', error);
        }
    };

    const pieData = {
        labels: ['Utilisateurs', 'Réservations', 'Commandes', 'Recettes'],
        datasets: [
            {
                data: [usersCount, reservationsCount, ordersCount, recipesCount],
                backgroundColor: ['#3498db', '#2ecc71', '#f1c40f', '#e67e22'],
            },
        ],
    };

    const barData = {
        labels: ['Utilisateurs', 'Réservations', 'Commandes', 'Recettes'],
        datasets: [
            {
                label: 'Total par entité',
                data: [usersCount, reservationsCount, ordersCount, recipesCount],
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
                 style={{
                     backgroundImage: "url('/login1.jpg')",
                     boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
                 }}
            />

            <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20 mt-14">
                <div className="w-full max-w-7xl mx-auto space-y-12">
                    <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-emerald-400 to-yellow-300 bg-clip-text text-transparent animate-pulse">
                        Tableau de bord nutritionnel
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card
                            title="Utilisateurs"
                            count={usersCount}
                            color="emerald"
                            icon="👥"
                        />
                        <Card
                            title="Réservations"
                            count={reservationsCount}
                            color="yellow"
                            icon="📅"
                        />
                        <Card
                            title="Commandes"
                            count={ordersCount}
                            color="amber"
                            icon="📦"
                        />
                        <Card
                            title="Recettes"
                            count={recipesCount}
                            color="green"
                            icon="🍳"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg">
                            <h2 className="text-3xl font-semibold text-emerald-400 border-b border-emerald-400 pb-4">
                                🥗 Répartition nutritionnelle
                            </h2>
                            <div className="mt-6 h-96">
                                <Pie data={pieData} options={chartOptions} />
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg">
                            <h2 className="text-3xl font-semibold text-yellow-400 border-b border-yellow-400 pb-4">
                                📈 Statistiques globales
                            </h2>
                            <div className="mt-6 h-96">
                                <Bar data={barData} options={chartOptions} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-md">
                        <h3 className="text-2xl font-semibold text-emerald-400 mb-4">
                            📋 Synthèse des données
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-white">
                            <StatItem label="Nouveaux utilisateurs (7j)" value="24" trend="up" />
                            <StatItem label="Commandes en attente" value="12" trend="down" />
                            <StatItem label="Taux de satisfaction" value="94%" trend="stable" />
                            <StatItem label="Recettes actives" value="58" trend="up" />
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl backdrop-blur-lg">
                        <h2 className="text-xl font-semibold text-emerald-400 mb-4">🔔 Dernières activités</h2>
                        <div className="space-y-3">
                            <ActivityItem
                                time="2 min"
                                text="Nouvelle commande #4587"
                                type="order"
                            />
                            <ActivityItem
                                time="15 min"
                                text="3 nouvelles recettes ajoutées"
                                type="recipe"
                            />
                            <ActivityItem
                                time="1h"
                                text="Mise à jour du menu du jour"
                                type="update"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Card = ({ title, count, color, icon }) => (
    <div className={`p-6 bg-white/5 rounded-2xl backdrop-blur-lg border-l-4 border-${color}-400 hover:transform hover:scale-105 transition-all`}>
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-${color}-400/20`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <h3 className={`text-sm font-medium text-${color}-400`}>{title}</h3>
                <p className="text-3xl font-bold text-white">{count}</p>
            </div>
        </div>
    </div>
);

const StatItem = ({ label, value, trend }) => (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
        <span className="text-gray-300">{label}</span>
        <div className="flex items-center gap-2">
            <span className="font-bold text-white">{value}</span>
            {trend === 'up' && <span className="text-green-400">↑</span>}
            {trend === 'down' && <span className="text-red-400">↓</span>}
            {trend === 'stable' && <span className="text-yellow-400">→</span>}
        </div>
    </div>
);

const ActivityItem = ({ time, text, type }) => {
    const icons = {
        order: '📦',
        recipe: '🍳',
        update: '🔄'
    };

    return (
        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
            <span className="text-2xl">{icons[type]}</span>
            <div className="flex-1">
                <p className="text-white">{text}</p>
                <p className="text-sm text-gray-400">{time}</p>
            </div>
            <span className="text-sm text-emerald-400">→</span>
        </div>
    );
};

const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: '#fff',
                font: {
                    size: 14
                }
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#10b981',
            bodyColor: '#fff'
        }
    },
    scales: {
        y: {
            grid: { color: 'rgba(255,255,255,0.1)' },
            ticks: { color: '#fff' }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#fff' }
        }
    }
};

export default Static;