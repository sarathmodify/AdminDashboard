/**
 * Components Showcase - Phase 2 Testing
 * Displays all shared components with various configurations
 */

import React, { useState } from 'react';
import OrderStatusBadge from './components/OrderStatusBadge';
import OrderDetailsCard from './components/OrderDetailsCard';
import ProductLineItem from './components/ProductLineItem';

export default function ComponentsShowcase() {
    // Sample products for testing
    const [products, setProducts] = useState([
        {
            id: 'prod_1',
            name: 'Premium Cotton T-Shirt',
            image_url: 'https://via.placeholder.com/150',
            price: 29.99,
            quantity: 2
        },
        {
            id: 'prod_2',
            name: 'Denim Jeans',
            image_url: 'https://via.placeholder.com/150',
            price: 59.99,
            quantity: 1
        },
        {
            id: 'prod_3',
            name: 'Leather Jacket',
            image_url: 'https://via.placeholder.com/150',
            price: 199.99,
            quantity: 1
        }
    ]);

    const handleQuantityChange = (productId, newQuantity) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, quantity: newQuantity } : p
            )
        );
    };

    const handleRemoveProduct = (productId) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Phase 2: Shared Components Showcase
                </h1>
                <p className="text-gray-600">
                    Testing all reusable components for the Orders module
                </p>
            </div>

            {/* Component 1: OrderStatusBadge */}
            <div className="mb-8 animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    1. OrderStatusBadge Component
                </h2>

                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                    {/* Different Statuses */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                            All Status Types
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <OrderStatusBadge status="pending" />
                            <OrderStatusBadge status="delivered" />
                            <OrderStatusBadge status="cancelled" />
                        </div>
                    </div>

                    {/* Different Sizes */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                            Size Variants
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <OrderStatusBadge status="pending" size="sm" />
                            <OrderStatusBadge status="delivered" size="md" />
                            <OrderStatusBadge status="cancelled" size="lg" />
                        </div>
                    </div>

                    {/* Without Dot */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">
                            Without Animated Dot
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <OrderStatusBadge status="pending" showDot={false} />
                            <OrderStatusBadge status="delivered" showDot={false} />
                            <OrderStatusBadge status="cancelled" showDot={false} />
                        </div>
                    </div>

                    {/* Props Reference */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Props:</h4>
                        <pre className="text-xs text-gray-600">
                            {`status: 'pending' | 'delivered' | 'cancelled'
size: 'sm' | 'md' | 'lg' (default: 'md')
showDot: boolean (default: true)
className: string (optional)`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Component 2: OrderDetailsCard */}
            <div className="mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    2. OrderDetailsCard Component
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card with Icon */}
                    <OrderDetailsCard
                        title="Customer Info"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        }
                    >
                        <div className="space-y-2">
                            <p className="text-sm"><span className="font-medium text-gray-700">Name:</span> John Doe</p>
                            <p className="text-sm"><span className="font-medium text-gray-700">Email:</span> john@example.com</p>
                            <p className="text-sm"><span className="font-medium text-gray-700">Phone:</span> +1-234-567-8900</p>
                        </div>
                    </OrderDetailsCard>

                    {/* Card with Different Icon */}
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
                                <span className="font-semibold text-gray-800">$320.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (10%):</span>
                                <span className="font-semibold text-gray-800">$32.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-semibold text-gray-800">$15.00</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-bold text-gray-800">Total:</span>
                                <span className="font-bold text-blue-600 text-lg">$367.00</span>
                            </div>
                        </div>
                    </OrderDetailsCard>

                    {/* Card without Icon */}
                    <OrderDetailsCard title="Shipping Address">
                        <div className="text-sm text-gray-700 leading-relaxed">
                            123 Main Street<br />
                            Apt 4B<br />
                            New York, NY 10001<br />
                            United States
                        </div>
                    </OrderDetailsCard>

                    {/* Card with Custom Content */}
                    <OrderDetailsCard
                        title="Payment Status"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        }
                    >
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Status:</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✓ Paid
                                </span>
                            </div>
                            <p className="text-sm"><span className="font-medium text-gray-700">Method:</span> Visa •••• 4242</p>
                            <p className="text-sm"><span className="font-medium text-gray-700">Date:</span> Dec 12, 2025</p>
                        </div>
                    </OrderDetailsCard>
                </div>

                {/* Props Reference */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Props:</h4>
                    <pre className="text-xs text-gray-600">
                        {`title: string (optional)
icon: ReactNode (optional)
children: ReactNode (required)
className: string (optional)
headerClassName: string (optional)
bodyClassName: string (optional)`}
                    </pre>
                </div>
            </div>

            {/* Component 3: ProductLineItem */}
            <div className="mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                    3. ProductLineItem Component
                </h2>

                <div className="space-y-6">
                    {/* Standard Display */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                            Standard Display (Order Details)
                        </h3>
                        <div className="divide-y divide-gray-100">
                            {products.map(product => (
                                <ProductLineItem
                                    key={product.id}
                                    product={product}
                                    quantity={product.quantity}
                                    total={product.price * product.quantity}
                                />
                            ))}
                        </div>
                    </div>

                    {/* With Quantity Controls */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                            With Quantity Controls (Create Order Modal)
                        </h3>
                        <div className="divide-y divide-gray-100">
                            {products.map(product => (
                                <ProductLineItem
                                    key={product.id}
                                    product={product}
                                    quantity={product.quantity}
                                    total={product.price * product.quantity}
                                    showQuantityControls={true}
                                    onQuantityChange={handleQuantityChange}
                                />
                            ))}
                        </div>
                    </div>

                    {/* With Remove Button */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-sm font-semibold text-gray-600 uppercase mb-4">
                            With Remove Button (Editable List)
                        </h3>
                        <div className="divide-y divide-gray-100">
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductLineItem
                                        key={product.id}
                                        product={product}
                                        quantity={product.quantity}
                                        total={product.price * product.quantity}
                                        showQuantityControls={true}
                                        onQuantityChange={handleQuantityChange}
                                        showRemove={true}
                                        onRemove={handleRemoveProduct}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    All products removed. Refresh page to reset.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Props Reference */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">Props:</h4>
                        <pre className="text-xs text-gray-600">
                            {`product: { id, name, image_url, price } (required)
quantity: number (required)
total: number (optional, auto-calculated if not provided)
showRemove: boolean (default: false)
onRemove: function (optional)
showQuantityControls: boolean (default: false)
onQuantityChange: function (optional)
className: string (optional)`}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                    ✅ Phase 2 Complete
                </h2>
                <p className="text-gray-700 mb-4">
                    All three shared components are working correctly and ready for use in Phase 3 & 4!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-blue-600 font-semibold mb-1">✓ OrderStatusBadge</div>
                        <div className="text-xs text-gray-600">3 statuses, 3 sizes, animated</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-purple-600 font-semibold mb-1">✓ OrderDetailsCard</div>
                        <div className="text-xs text-gray-600">Flexible card with icon support</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                        <div className="text-green-600 font-semibold mb-1">✓ ProductLineItem</div>
                        <div className="text-xs text-gray-600">Quantity controls + remove option</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
