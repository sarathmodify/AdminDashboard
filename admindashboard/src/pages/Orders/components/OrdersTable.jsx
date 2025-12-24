/**
 * OrdersTable Component
 * Displays orders in a table (desktop) or cards (mobile)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';
import { formatOrderDate, formatCurrency, getCustomerInitials } from '../../../utils/orderHelpers';

export default function OrdersTable({ orders, loading, onOrderClick }) {
    const navigate = useNavigate();

    const handleRowClick = (orderId) => {
        if (onOrderClick) {
            onOrderClick(orderId);
        } else {
            navigate(`/orders/${orderId}`);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex items-center justify-center py-16">
                    <svg className="animate-spin h-10 w-10 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600 font-medium">Loading orders...</span>
                </div>
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">No orders found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search criteria</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                                onClick={() => handleRowClick(order.id)}
                                className="hover:bg-purple-50 transition-colors duration-150 cursor-pointer group animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Order ID */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                                        {order.id}
                                    </span>
                                </td>

                                {/* Customer */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                                            {getCustomerInitials(order.customer.name)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">
                                                {order.customer.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.customer.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-600">
                                        {formatOrderDate(order.created_at)}
                                    </span>
                                </td>

                                {/* Amount */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-bold text-gray-800">
                                        {formatCurrency(order.total)}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <OrderStatusBadge status={order.status} />
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
                        onClick={() => handleRowClick(order.id)}
                        className="p-4 hover:bg-purple-50 transition-colors duration-150 cursor-pointer animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Header: Order ID + Status */}
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-purple-600 mb-1">
                                    {order.id}
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                        {getCustomerInitials(order.customer.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {order.customer.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.customer.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <OrderStatusBadge status={order.status} size="sm" />
                        </div>

                        {/* Footer: Date + Amount */}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                                {formatOrderDate(order.created_at)}
                            </span>
                            <span className="font-bold text-gray-800">
                                {formatCurrency(order.total)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
