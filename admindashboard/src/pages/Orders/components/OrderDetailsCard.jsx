/**
 * OrderDetailsCard Component
 * Reusable card wrapper for displaying order information sections
 */

import React from 'react';

export default function OrderDetailsCard({
    title,
    icon,
    children,
    className = '',
    headerClassName = '',
    bodyClassName = ''
}) {
    return (
        <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${className}`}>
            {/* Card Header */}
            {(title || icon) && (
                <div className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                                <div className="text-blue-600">
                                    {icon}
                                </div>
                            </div>
                        )}
                        {title && (
                            <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                                {title}
                            </h3>
                        )}
                    </div>
                </div>
            )}

            {/* Card Body */}
            <div className={`px-6 py-5 ${bodyClassName}`}>
                {children}
            </div>
        </div>
    );
}
