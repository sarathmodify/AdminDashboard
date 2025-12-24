/**
 * OrderList Page
 * Main page for viewing and managing orders
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderFilters from './components/OrderFilters';
import OrdersTable from './components/OrdersTable';
import Pagination from './components/Pagination';
import CreateOrderModal from './components/CreateOrderModal';
import { fetchOrders } from '../../services/orderService';

export default function OrderList() {
    const navigate = useNavigate();

    // State management
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    });
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        dateFrom: null,
        dateTo: null
    });

    // Load orders when filters or page changes
    useEffect(() => {
        loadOrders();
    }, [filters, pagination.currentPage]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await fetchOrders({
                search: filters.search,
                status: filters.status,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo,
                page: pagination.currentPage,
                limit: pagination.limit
            });

            setOrders(result.orders);
            setPagination(prev => ({
                ...prev,
                totalPages: result.pagination.totalPages,
                total: result.pagination.total
            }));
        } catch (err) {
            console.error('Error loading orders:', err);
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        // Reset to page 1 when filters change
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Handle page change
    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle order click
    const handleOrderClick = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    // Handle create order click
    const handleCreateOrder = () => {
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        // Reload orders to show the newly created order
        loadOrders();
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Page Header */}
            <div className="mb-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                            Orders
                        </h1>
                        <p className="text-sm text-gray-600">
                            {loading ? (
                                'Loading orders...'
                            ) : (
                                `${pagination.total} total order${pagination.total !== 1 ? 's' : ''}`
                            )}
                        </p>
                    </div>

                    {/* Create Order Button */}
                    <button
                        onClick={handleCreateOrder}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Order</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <OrderFilters
                    onFilterChange={handleFilterChange}
                    activeFilters={filters}
                />
            </div>

            {/* Error State */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 animate-fadeIn">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-red-800 font-semibold mb-1">Error loading orders</h3>
                            <p className="text-red-600 text-sm">{error}</p>
                            <button
                                onClick={loadOrders}
                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Table */}
            <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <OrdersTable
                    orders={orders}
                    loading={loading}
                    onOrderClick={handleOrderClick} />
            </div> {/* Orders Table */}

            {/* Pagination */}
            {!loading && !error && pagination.totalPages > 1 && (
                <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Stats Summary (Optional Enhancement) */}
            {!loading && !error && orders.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {pagination.total}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Total Orders</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                {orders.filter(o => o.status === 'pending').length}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Pending</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {orders.filter(o => o.status === 'delivered').length}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Delivered</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {orders.filter(o => o.status === 'cancelled').length}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Cancelled</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            <CreateOrderModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </div>
    );
}
