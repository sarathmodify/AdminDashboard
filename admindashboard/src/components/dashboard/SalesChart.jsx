import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SalesChart = () => {
    // Sample sales data for the last 7 days
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales Revenue ($)',
                data: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
                borderColor: 'rgb(147, 51, 234)',
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgb(147, 51, 234)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: 'rgb(126, 34, 206)',
                pointHoverBorderColor: '#fff',
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderWidth: 1,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        return ' $' + context.parsed.y.toLocaleString();
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    callback: function (value) {
                        return '$' + value.toLocaleString();
                    },
                    font: {
                        size: 11
                    },
                    padding: 10
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: {
                        size: 11,
                        weight: '500'
                    },
                    padding: 10
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Sales Overview</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Last 7 days performance</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                        This Week
                    </div>
                </div>
            </div>

            <div className="h-64 sm:h-80">
                <Bar data={data} options={options} />
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Average</p>
                    <p className="text-base sm:text-lg font-bold text-gray-800">$1,871</p>
                </div>
                <div className="text-center border-x border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Highest</p>
                    <p className="text-base sm:text-lg font-bold text-green-600">$2,400</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Lowest</p>
                    <p className="text-base sm:text-lg font-bold text-orange-600">$1,200</p>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
