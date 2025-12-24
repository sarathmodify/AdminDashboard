/**
 * ProductLineItem Component
 * Displays a product row in orders with image, name, quantity, and pricing
 * Used in order details and create order modal
 */

import React from 'react';
import { formatCurrency } from '../../../utils/orderHelpers';

export default function ProductLineItem({
    product,
    quantity,
    total,
    showRemove = false,
    onRemove = null,
    showQuantityControls = false,
    onQuantityChange = null,
    className = ''
}) {
    const { id, name, image_url, price } = product;
    const unitPrice = price || product.unit_price || 0;
    const lineTotal = total || (unitPrice * quantity);

    const handleIncrement = () => {
        if (onQuantityChange) {
            onQuantityChange(id, quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (onQuantityChange && quantity > 1) {
            onQuantityChange(id, quantity - 1);
        }
    };

    return (
        <div className={`flex items-center gap-4 py-3 ${className}`}>
            {/* Product Image */}
            <div className="flex-shrink-0">
                <img
                    src={image_url || 'https://via.placeholder.com/60'}
                    alt={name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover ring-2 ring-gray-100"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60';
                    }}
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                    {name}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                    {formatCurrency(unitPrice)} each
                </p>
            </div>

            {/* Quantity Display or Controls */}
            <div className="flex items-center gap-3">
                {showQuantityControls ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 font-semibold transition-colors"
                        >
                            −
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-800">
                            {quantity}
                        </span>
                        <button
                            onClick={handleIncrement}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold transition-colors"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Qty:</span> {quantity}
                    </div>
                )}

                {/* Line Total */}
                <div className="w-20 text-right">
                    <p className="text-sm font-bold text-gray-800">
                        {formatCurrency(lineTotal)}
                    </p>
                </div>

                {/* Remove Button */}
                {showRemove && onRemove && (
                    <button
                        onClick={() => onRemove(id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove product"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
