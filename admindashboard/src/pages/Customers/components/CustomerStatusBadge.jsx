/**
 * CustomerStatusBadge Component
 * Displays customer status with color-coded badge
 */

import React from 'react';

export default function CustomerStatusBadge({ status, size = 'md' }) {
    // Size variants
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm'
    };

    // Status configurations
    const statusConfig = {
        active: {
            bg: 'bg-green-50',
            text: 'text-green-600',
            label: 'Active',
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )
        },
        inactive: {
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            label: 'Inactive',
            icon: (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )
        }
    };

    const config = statusConfig[status] || statusConfig.inactive;
    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <span className={`inline-flex items-center gap-1 rounded-full font-semibold ${config.bg} ${config.text} ${sizeClass}`}>
            {config.icon}
            {config.label}
        </span>
    );
}
