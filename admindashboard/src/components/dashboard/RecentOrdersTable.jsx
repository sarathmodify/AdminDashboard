import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentOrdersTable = () => {
    const navigate = useNavigate();
    // Dummy order data
    const orders = [
        { id: '#ORD-1234', customer: 'John Doe', amount: 245.50, status: 'completed', date: '2025-12-12' },
        { id: '#ORD-1235', customer: 'Sarah Smith', amount: 189.99, status: 'pending', date: '2025-12-12' },
        { id: '#ORD-1236', customer: 'Michael Johnson', amount: 567.00, status: 'completed', date: '2025-12-11' },
        { id: '#ORD-1237', customer: 'Emily Davis', amount: 123.45, status: 'cancelled', date: '2025-12-11' },
        { id: '#ORD-1238', customer: 'David Wilson', amount: 890.25, status: 'completed', date: '2025-12-11' },
        { id: '#ORD-1239', customer: 'Lisa Anderson', amount: 345.80, status: 'pending', date: '2025-12-10' },
        { id: '#ORD-1240', customer: 'Robert Taylor', amount: 678.90, status: 'completed', date: '2025-12-10' },
        { id: '#ORD-1241', customer: 'Jennifer Brown', amount: 234.60, status: 'pending', date: '2025-12-10' }
    ];

    const getStatusBadge = (status) => {
        const statusConfig = {
            completed: {
                bg: 'bg-green-100',
                text: 'text-green-700',
                dot: 'bg-green-500',
                label: 'Completed'
            },
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-700',
                dot: 'bg-yellow-500',
                label: 'Pending'
            },
            cancelled: {
                bg: 'bg-red-100',
                text: 'text-red-700',
                dot: 'bg-red-500',
                label: 'Cancelled'
            }
        };

        const config = statusConfig[status];

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`}></span>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Recent Orders</h2>
                        <p className="text-xs sm:text-sm text-gray-500">Latest transactions from your store</p>
                    </div>

                    <button
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto"
                    >
                        <span>View All</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map((order, index) => (
                            <tr
                                key={order.id}
                                onClick={() => navigate(`/orders/ORD-${1234 + index}`)}
                                className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                                        {order.id}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                            {order.customer.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            {order.customer}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600">{order.date}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-800">
                                        ${order.amount.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(order.status)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-100">
                {orders.map((order, index) => (
                    <div
                        key={order.id}
                        onClick={() => navigate(`/orders/ORD-${1234 + index}`)}
                        className="p-4 hover:bg-purple-50 transition-colors duration-150 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-purple-600 mb-1">{order.id}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {order.customer.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{order.customer}</p>
                                </div>
                            </div>
                            {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">{order.date}</span>
                            <span className="font-bold text-gray-800">${order.amount.toFixed(2)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentOrdersTable;
