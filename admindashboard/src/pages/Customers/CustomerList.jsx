/**
 * CustomerList Page
 * Main page for viewing and managing customers
 */

import React, { useState, useEffect } from 'react';
import CustomerStatusBadge from './components/CustomerStatusBadge';
import CustomerDetailsModal from './components/CustomerDetailsModal';
import { fetchCustomers } from '../../services/customerService';

export default function CustomerList() {
    // State management
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load customers on mount and when filters change
    useEffect(() => {
        loadCustomers();
    }, [searchQuery, statusFilter]);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await fetchCustomers({
                search: searchQuery,
                status: statusFilter
            });

            setCustomers(data);
        } catch (err) {
            console.error('Error loading customers:', err);
            setError(err.message || 'Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    // Handle customer row click
    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    // Handle customer update (refresh list)
    const handleCustomerUpdate = () => {
        loadCustomers();
    };

    // Format date to readable string
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Page Header */}
            <div className="mb-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                            Customers
                        </h1>
                        <p className="text-sm text-gray-600">
                            {loading ? (
                                'Loading customers...'
                            ) : (
                                `${customers.length} customer${customers.length !== 1 ? 's' : ''} found`
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <div className="bg-white rounded-2xl shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn" style={{ animationDelay: '200ms' }}>
                {/* Table Header - Desktop */}
                <div className="hidden md:grid md:grid-cols-6 gap-4 px-6 py-4 bg-white border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Loading customers...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 font-medium mb-2">Failed to load customers</p>
                        <p className="text-sm text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={loadCustomers}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Table Body */}
                {!loading && !error && (
                    <div className="divide-y divide-gray-100">
                        {customers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-gray-600 font-medium mb-1">No customers found</p>
                                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            customers.map((customer, index) => (
                                <div
                                    key={customer.id}
                                    className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer animate-fadeIn"
                                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                                    onClick={() => handleCustomerClick(customer)}
                                >
                                    {/* Customer Name */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-gray-100">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">{customer.name}</span>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600">
                                            <span className="md:hidden font-medium text-gray-700">Email: </span>
                                            {customer.email}
                                        </span>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600">
                                            <span className="md:hidden font-medium text-gray-700">Phone: </span>
                                            {customer.phone || 'N/A'}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center">
                                        <CustomerStatusBadge status={customer.status} />
                                    </div>

                                    {/* Registration Date */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600">
                                            <span className="md:hidden font-medium text-gray-700">Registered: </span>
                                            {formatDate(customer.registration_date || customer.created_at)}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCustomerClick(customer);
                                            }}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                            title="View Details"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Customer Details Modal */}
            <CustomerDetailsModal
                customer={selectedCustomer}
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onUpdate={handleCustomerUpdate}
            />
        </div>
    );
}
