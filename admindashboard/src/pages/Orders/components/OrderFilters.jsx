/**
 * OrderFilters Component
 * Search, date range, and status filtering for orders
 */

import React, { useState } from 'react';

export default function OrderFilters({ onFilterChange, activeFilters }) {
    const [searchQuery, setSearchQuery] = useState(activeFilters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(activeFilters.status || 'all');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, 7days, 30days, custom

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onFilterChange({ search: value });
    };

    // Handle status filter change
    const handleStatusChange = (e) => {
        const value = e.target.value;
        setSelectedStatus(value);
        onFilterChange({ status: value });
    };

    // Handle date filter change
    const handleDateFilterChange = (e) => {
        const value = e.target.value;
        setDateFilter(value);

        const today = new Date();
        let dateFrom = null;
        let dateTo = null;

        switch (value) {
            case 'today':
                dateFrom = new Date(today.setHours(0, 0, 0, 0));
                dateTo = new Date(today.setHours(23, 59, 59, 999));
                break;
            case '7days':
                dateTo = new Date();
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 7);
                break;
            case '30days':
                dateTo = new Date();
                dateFrom = new Date();
                dateFrom.setDate(dateFrom.getDate() - 30);
                break;
            case 'all':
            default:
                dateFrom = null;
                dateTo = null;
                break;
        }

        onFilterChange({ dateFrom, dateTo });
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setDateFilter('all');
        onFilterChange({ search: '', status: 'all', dateFrom: null, dateTo: null });
    };

    // Check if any filters are active
    const hasActiveFilters = searchQuery || selectedStatus !== 'all' || dateFilter !== 'all';

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by order ID, customer name, or amount..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 pl-12 pr-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Date Range Filter */}
                <div className="flex-1">
                    <select
                        value={dateFilter}
                        onChange={handleDateFilterChange}
                        className="w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex-1">
                    <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear
                    </button>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-600">Active filters:</span>
                    {searchQuery && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            Search: "{searchQuery}"
                        </span>
                    )}
                    {selectedStatus !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                            Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                        </span>
                    )}
                    {dateFilter !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                            Date: {dateFilter === 'today' ? 'Today' :
                                dateFilter === '7days' ? 'Last 7 Days' :
                                    'Last 30 Days'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
