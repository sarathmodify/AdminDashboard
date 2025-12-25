/**
 * CustomerDetailsModal Component
 * Modal popup for viewing detailed customer information
 */

import React, { useState } from 'react';
import CustomerStatusBadge from './CustomerStatusBadge';
import { updateCustomerStatus } from '../../../services/customerService';

export default function CustomerDetailsModal({ customer, isOpen, onClose, onUpdate }) {
    const [updating, setUpdating] = useState(false);

    if (!isOpen || !customer) return null;

    // Format date to readable string
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Handle status toggle
    const handleToggleStatus = async () => {
        const newStatus = customer.status === 'active' ? 'inactive' : 'active';
        // eslint-disable-next-line no-restricted-globals
        if (!confirm(`Change customer status to "${newStatus}"?`)) {
            return;
        }

        try {
            setUpdating(true);
            await updateCustomerStatus(customer.id, newStatus);
            onUpdate(); // Refresh the customer list
            alert(`Customer status updated to ${newStatus}!`);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Contact Information Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name</div>
                                <div className="text-base font-medium text-gray-800">{customer.name}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</div>
                                <div className="text-sm text-gray-700">{customer.email}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                                <div className="text-sm text-gray-700">{customer.phone || 'Not provided'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Account Status Card */}
                    <div className="bg-gray-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</div>
                                <CustomerStatusBadge status={customer.status} size="lg" />
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Registration Date</div>
                                <div className="text-sm text-gray-700">{formatDate(customer.registration_date || customer.created_at)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Order History Card */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Orders</div>
                                <div className="text-2xl font-bold text-gray-800">{customer.total_orders || 0}</div>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Spent</div>
                                <div className="text-2xl font-bold text-green-600">${(customer.total_spent || 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 rounded-b-2xl flex gap-3">
                    <button
                        onClick={handleToggleStatus}
                        disabled={updating}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${customer.status === 'active'
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-green-600 text-white hover:bg-green-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {updating ? 'Updating...' : customer.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
