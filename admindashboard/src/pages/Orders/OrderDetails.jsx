/**
 * OrderDetails Page
 * Displays complete information about a single order
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderStatusBadge from './components/OrderStatusBadge';
import OrderDetailsCard from './components/OrderDetailsCard';
import ProductLineItem from './components/ProductLineItem';
import { fetchOrderById, updateOrderStatus, cancelOrder } from '../../services/orderService';
import { formatOrderDateTime, formatCurrency, formatAddress, getPaymentStatusConfig } from '../../utils/orderHelpers';

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Load order on mount
    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchOrderById(id);
            setOrder(data);
        } catch (err) {
            console.error('Error loading order:', err);
            setError(err.message || 'Failed to load order');
        } finally {
            setLoading(false);
        }
    };

    // Handle status update
    const handleUpdateStatus = async (newStatus) => {
        if (!confirm(`Update order status to "${newStatus}"?`)) {
            return;
        }

        try {
            setUpdating(true);
            const updatedOrder = await updateOrderStatus(id, newStatus);
            setOrder(updatedOrder);
            alert(`Order status updated to ${newStatus}!`);
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Handle cancel order
    const handleCancelOrder = async () => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            return;
        }

        try {
            setUpdating(true);
            const cancelledOrder = await cancelOrder(id);
            setOrder(cancelledOrder);
            alert('Order has been cancelled.');
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert('Failed to cancel order: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    // Handle print invoice
    const handlePrintInvoice = () => {
        window.print();
    };

    // Loading state
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="flex items-center justify-center py-20">
                    <svg className="animate-spin h-10 w-10 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-600 font-medium">Loading order details...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                    <div className="flex flex-col items-center text-center">
                        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Order</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <div className="flex gap-3">
                            <button
                                onClick={loadOrder}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Back to Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Order not found
    if (!order) {
        return (
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const paymentConfig = getPaymentStatusConfig(order.payment.status);

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 animate-fadeIn">
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="font-medium">Back to Orders</span>
                </button>
            </div>

            {/* Order Header */}
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '50ms' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                {order.id}
                            </h1>
                            <OrderStatusBadge status={order.status} size="lg" />
                        </div>
                        <p className="text-sm text-gray-600">
                            Placed on {formatOrderDateTime(order.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Info */}
                <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                    <OrderDetailsCard
                        title="Customer Info"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    >
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</div>
                                <div className="text-sm font-medium text-gray-800">{order.customer.name}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</div>
                                <div className="text-sm text-gray-700">{order.customer.email}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                                <div className="text-sm text-gray-700">{order.customer.phone}</div>
                            </div>
                        </div>
                    </OrderDetailsCard>
                </div>

                {/* Order Summary */}
                <div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
                    <OrderDetailsCard
                        title="Order Summary"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        }
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium text-gray-800">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (10%):</span>
                                <span className="font-medium text-gray-800">{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-medium text-gray-800">
                                    {order.shipping_cost === 0 ? 'FREE' : formatCurrency(order.shipping_cost)}
                                </span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-bold text-gray-800">Total:</span>
                                <span className="font-bold text-blue-600 text-lg">{formatCurrency(order.total)}</span>
                            </div>
                        </div>
                    </OrderDetailsCard>
                </div>

                {/* Shipping Address */}
                <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                    <OrderDetailsCard
                        title="Shipping Address"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        }
                    >
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {formatAddress(order.shipping_address)}
                        </div>
                    </OrderDetailsCard>
                </div>

                {/* Payment Status */}
                <div className="animate-fadeIn" style={{ animationDelay: '250ms' }}>
                    <OrderDetailsCard
                        title="Payment Status"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        }
                    >
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${paymentConfig.bg} ${paymentConfig.text}`}>
                                    {paymentConfig.icon} {paymentConfig.label}
                                </span>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Method</div>
                                <div className="text-sm text-gray-700">
                                    {order.payment.card_brand} •••• {order.payment.last4}
                                </div>
                            </div>
                            {order.payment.paid_at && (
                                <div>
                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Paid On</div>
                                    <div className="text-sm text-gray-700">
                                        {formatOrderDateTime(order.payment.paid_at)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </OrderDetailsCard>
                </div>
            </div>

            {/* Products Section */}
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <OrderDetailsCard
                    title="Products in Order"
                    icon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                >
                    <div className="divide-y divide-gray-100">
                        {order.items.map(item => (
                            <ProductLineItem
                                key={item.id}
                                product={item}
                                quantity={item.quantity}
                                total={item.total_price}
                            />
                        ))}
                    </div>
                </OrderDetailsCard>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fadeIn print:hidden" style={{ animationDelay: '350ms' }}>
                {/* Update Status Dropdown */}
                {order.status !== 'cancelled' && (
                    <div className="relative flex-1">
                        <select
                            onChange={(e) => handleUpdateStatus(e.target.value)}
                            disabled={updating}
                            value={order.status}
                            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <option value={order.status} disabled>Update Status</option>
                            {order.status !== 'pending' && <option value="pending">Mark as Pending</option>}
                            {order.status !== 'delivered' && <option value="delivered">Mark as Delivered</option>}
                        </select>
                    </div>
                )}

                {/* Print Invoice Button */}
                <button
                    onClick={handlePrintInvoice}
                    className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Invoice
                </button>

                {/* Cancel Order Button */}
                {order.status !== 'cancelled' && (
                    <button
                        onClick={handleCancelOrder}
                        disabled={updating}
                        className="flex-1 px-4 py-3 text-sm font-medium text-red-700 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                    </button>
                )}
            </div>

            {/* Cancelled Order Notice */}
            {order.status === 'cancelled' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                    <p className="text-sm text-red-800 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        This order has been cancelled and cannot be modified.
                    </p>
                </div>
            )}
        </div>
    );
}
