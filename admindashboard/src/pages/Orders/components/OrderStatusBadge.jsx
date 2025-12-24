/**
 * OrderStatusBadge Component
 * Displays order status with color-coded badge and animated pulse dot
 */

import React from 'react';
import { getStatusConfig } from '../../../utils/orderHelpers';

export default function OrderStatusBadge({ status, size = 'md', showDot = true, className = '' }) {
    const config = getStatusConfig(status);

    // Size variants
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm'
    };

    const dotSizeClasses = {
        sm: 'w-1 h-1',
        md: 'w-1.5 h-1.5',
        lg: 'w-2 h-2'
    };

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 rounded-full font-semibold
                ${config.bg} ${config.text}
                ${sizeClasses[size]}
                ${className}
            `}
        >
            {showDot && (
                <span
                    className={`
                        rounded-full animate-pulse
                        ${config.dot}
                        ${dotSizeClasses[size]}
                    `}
                ></span>
            )}
            {config.label}
        </span>
    );
}
