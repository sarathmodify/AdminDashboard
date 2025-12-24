/**
 * CreateOrderModal Component
 * Modal for creating new orders with customer info, product selection, and shipping
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductLineItem from './ProductLineItem';
import { createOrder, getAvailableProducts } from '../../../services/orderService';
import { calculateOrderTotals, formatCurrency, isValidEmail, isValidPhone } from '../../../utils/orderHelpers';

export default function CreateOrderModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    // State
    const [step, setStep] = useState(1); // 1: Customer, 2: Products, 3: Shipping
    const [loading, setLoading] = useState(false);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [errors, setErrors] = useState({});

    // Form data
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States'
    });

    // Load available products when modal opens
    useEffect(() => {
        if (isOpen) {
            loadProducts();
            // Reset form when opening
            resetForm();
        }
    }, [isOpen]);

    const loadProducts = async () => {
        try {
            const products = await getAvailableProducts();
            setAvailableProducts(products);
        } catch (err) {
            console.error('Error loading products:', err);
        }
    };

    const resetForm = () => {
        setStep(1);
        setCustomer({ name: '', email: '', phone: '' });
        setSelectedProducts([]);
        setSearchQuery('');
        setShippingAddress({
            street: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            country: 'United States'
        });
        setErrors({});
    };

    // Calculate order totals
    const orderTotals = calculateOrderTotals(
        selectedProducts.map(p => ({
            unit_price: p.price,
            quantity: p.quantity
        }))
    );

    // Validate customer info
    const validateCustomer = () => {
        const newErrors = {};

        if (!customer.name.trim()) {
            newErrors.name = 'Customer name is required';
        }

        if (!customer.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(customer.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!customer.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhone(customer.phone)) {
            newErrors.phone = 'Please enter a valid phone number (10-11 digits)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate products
    const validateProducts = () => {
        if (selectedProducts.length === 0) {
            setErrors({ products: 'Please add at least one product' });
            return false;
        }
        setErrors({});
        return true;
    };

    // Validate shipping
    const validateShipping = () => {
        const newErrors = {};

        if (!shippingAddress.street.trim()) {
            newErrors.street = 'Street address is required';
        }

        if (!shippingAddress.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!shippingAddress.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!shippingAddress.zip.trim()) {
            newErrors.zip = 'ZIP code is required';
        }

        if (!shippingAddress.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle next step
    const handleNext = () => {
        if (step === 1 && validateCustomer()) {
            setStep(2);
        } else if (step === 2 && validateProducts()) {
            setStep(3);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setStep(step - 1);
        setErrors({});
    };

    // Handle product selection
    const handleAddProduct = (product) => {
        const exists = selectedProducts.find(p => p.id === product.id);
        if (exists) {
            alert('This product is already added');
            return;
        }
        setSelectedProducts([...selectedProducts, { ...product, quantity: 1 }]);
        setSearchQuery('');
    };

    // Handle quantity change
    const handleQuantityChange = (productId, newQuantity) => {
        setSelectedProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, quantity: newQuantity } : p
            )
        );
    };

    // Handle remove product
    const handleRemoveProduct = (productId) => {
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateShipping()) {
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                customer: {
                    name: customer.name.trim(),
                    email: customer.email.trim(),
                    phone: customer.phone.trim()
                },
                items: selectedProducts.map(p => ({
                    product_id: p.id,
                    quantity: p.quantity
                })),
                shipping_address: {
                    street: shippingAddress.street.trim(),
                    apt: shippingAddress.apt.trim(),
                    city: shippingAddress.city.trim(),
                    state: shippingAddress.state.trim(),
                    zip: shippingAddress.zip.trim(),
                    country: shippingAddress.country.trim()
                }
            };

            const newOrder = await createOrder(orderData);

            // Success!
            alert(`Order ${newOrder.id} created successfully!`);
            onClose();
            resetForm();

            // Navigate to the new order details
            navigate(`/orders/${newOrder.id}`);
        } catch (err) {
            console.error('Error creating order:', err);
            alert('Failed to create order: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on search
    const filteredProducts = availableProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Create New Order</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Step {step} of 3: {step === 1 ? 'Customer Info' : step === 2 ? 'Select Products' : 'Shipping Address'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map(num => (
                                <div key={num} className="flex-1">
                                    <div className={`h-2 rounded-full transition-all duration-300 ${num <= step ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-200'
                                        }`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                        {/* Step 1: Customer Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={customer.name}
                                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={customer.email}
                                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="john@example.com"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={customer.phone}
                                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="+1-234-567-8900"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Products */}
                        {step === 2 && (
                            <div className="space-y-4">
                                {/* Product Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search Products
                                    </label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Search for products..."
                                    />
                                </div>

                                {/* Product Suggestions */}
                                {searchQuery && filteredProducts.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                        {filteredProducts.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleAddProduct(product)}
                                                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                                <div className="flex-1">
                                                    <div className="text-sm font-medium text-gray-800">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{formatCurrency(product.price)}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Selected Products */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Selected Products {selectedProducts.length > 0 && `(${selectedProducts.length})`}
                                    </label>
                                    {selectedProducts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                            <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-sm">No products added yet</p>
                                            <p className="text-xs mt-1">Search and click to add products</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 rounded-lg p-4 divide-y divide-gray-200">
                                            {selectedProducts.map(product => (
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
                                            ))}
                                        </div>
                                    )}
                                    {errors.products && <p className="mt-2 text-sm text-red-600">{errors.products}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Shipping */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.street}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="123 Main Street"
                                    />
                                    {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apartment, Suite, etc. (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={shippingAddress.apt}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, apt: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Apt 4B"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.city}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="New York"
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.state}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="NY"
                                        />
                                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.zip}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.zip ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="10001"
                                        />
                                        {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Country *
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.country}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.country ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="United States"
                                        />
                                        {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Summary (Always Visible) */}
                        {selectedProducts.length > 0 && (
                            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal:</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(orderTotals.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (10%):</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(orderTotals.tax)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping:</span>
                                        <span className="font-medium text-gray-800">
                                            {orderTotals.shipping === 0 ? 'FREE' : formatCurrency(orderTotals.shipping)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <span className="font-bold text-gray-800">Total:</span>
                                        <span className="font-bold text-blue-600 text-lg">{formatCurrency(orderTotals.total)}</span>
                                    </div>
                                </div>
                                {orderTotals.subtotal > 100 && (
                                    <p className="mt-2 text-xs text-green-700 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Free shipping on orders over $100!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>

                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={handlePrevious}
                                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Previous
                                    </button>
                                )}

                                {step < 3 ? (
                                    <button
                                        onClick={handleNext}
                                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all flex items-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Order'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
