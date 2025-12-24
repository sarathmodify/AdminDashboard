/**
 * Order Service Test Component
 * This component tests all the order service functions
 * TEMPORARY - For Phase 1 testing only
 */

import React, { useState, useEffect } from 'react';
import { fetchOrders, fetchOrderById, createOrder, updateOrderStatus, cancelOrder, getAvailableProducts, getOrderStats } from '../../services/orderService';
import { formatOrderDate, formatCurrency, getStatusConfig } from '../../utils/orderHelpers';

export default function OrderServiceTest() {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addResult = (test, success, data = null, error = null) => {
        setTestResults(prev => [...prev, {
            test,
            success,
            data,
            error,
            timestamp: new Date().toISOString()
        }]);
    };

    const runTests = async () => {
        setLoading(true);
        setTestResults([]);

        try {
            // Test 1: Fetch all orders
            console.log('Test 1: Fetching all orders...');
            const allOrders = await fetchOrders();
            addResult('Fetch All Orders', true, {
                count: allOrders.orders.length,
                total: allOrders.pagination.total,
                pages: allOrders.pagination.totalPages
            });

            // Test 2: Fetch with filters (pending only)
            console.log('Test 2: Fetching pending orders...');
            const pendingOrders = await fetchOrders({ status: 'pending' });
            addResult('Fetch Pending Orders', true, {
                count: pendingOrders.orders.length
            });

            // Test 3: Fetch with search
            console.log('Test 3: Searching for orders...');
            const searchResults = await fetchOrders({ search: 'john' });
            addResult('Search Orders', true, {
                count: searchResults.orders.length,
                query: 'john'
            });

            // Test 4: Fetch single order
            if (allOrders.orders.length > 0) {
                console.log('Test 4: Fetching single order...');
                const firstOrderId = allOrders.orders[0].id;
                const singleOrder = await fetchOrderById(firstOrderId);
                addResult('Fetch Order By ID', true, {
                    orderId: singleOrder.id,
                    customer: singleOrder.customer.name,
                    total: formatCurrency(singleOrder.total)
                });

                // Test 5: Update order status
                console.log('Test 5: Updating order status...');
                const updatedOrder = await updateOrderStatus(firstOrderId, 'delivered');
                addResult('Update Order Status', true, {
                    orderId: updatedOrder.id,
                    newStatus: updatedOrder.status
                });
            }

            // Test 6: Get available products
            console.log('Test 6: Fetching available products...');
            const products = await getAvailableProducts();
            addResult('Get Available Products', true, {
                count: products.length
            });

            // Test 7: Create new order
            console.log('Test 7: Creating new order...');
            const newOrderData = {
                customer: {
                    name: 'Test Customer',
                    email: 'test@example.com',
                    phone: '+1-555-123-4567'
                },
                items: [
                    { product_id: products[0].id, quantity: 2 },
                    { product_id: products[1].id, quantity: 1 }
                ],
                shipping_address: {
                    street: '123 Test Street',
                    apt: 'Suite 100',
                    city: 'Test City',
                    state: 'TC',
                    zip: '12345',
                    country: 'Test Country'
                }
            };
            const createdOrder = await createOrder(newOrderData);
            addResult('Create Order', true, {
                orderId: createdOrder.id,
                total: formatCurrency(createdOrder.total),
                itemCount: createdOrder.items.length
            });

            // Test 8: Cancel order
            console.log('Test 8: Cancelling order...');
            const cancelledOrder = await cancelOrder(createdOrder.id);
            addResult('Cancel Order', true, {
                orderId: cancelledOrder.id,
                status: cancelledOrder.status
            });

            // Test 9: Get order statistics
            console.log('Test 9: Getting order statistics...');
            const stats = await getOrderStats();
            addResult('Get Order Stats', true, stats);

        } catch (error) {
            addResult('Error', false, null, error.message);
            console.error('Test failed:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-run tests on component mount
        runTests();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Phase 1: Order Service Tests
                </h1>
                <p className="text-gray-600">Testing all order service functions and utilities</p>
            </div>

            {/* Run Tests Button */}
            <div className="mb-6">
                <button
                    onClick={runTests}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                    {loading ? 'Running Tests...' : 'Run Tests Again'}
                </button>
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Test Results</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {testResults.length} test{testResults.length !== 1 ? 's' : ''} completed
                    </p>
                </div>

                <div className="divide-y divide-gray-100">
                    {testResults.length === 0 && !loading && (
                        <div className="p-8 text-center text-gray-500">
                            Click "Run Tests" to start testing
                        </div>
                    )}

                    {loading && (
                        <div className="p-8 flex items-center justify-center">
                            <svg className="animate-spin h-8 w-8 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-600">Running tests...</span>
                        </div>
                    )}

                    {testResults.map((result, index) => (
                        <div
                            key={index}
                            className={`p-4 ${result.success ? 'bg-white hover:bg-green-50' : 'bg-red-50'} transition-colors`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${result.success
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {result.success ? '✓' : '✗'}
                                        </span>
                                        <h3 className="font-semibold text-gray-800">
                                            Test {index + 1}: {result.test}
                                        </h3>
                                    </div>

                                    {result.success && result.data && (
                                        <div className="ml-11 bg-gray-50 rounded-lg p-3">
                                            <pre className="text-xs text-gray-700 overflow-x-auto">
                                                {JSON.stringify(result.data, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    {!result.success && result.error && (
                                        <div className="ml-11 text-sm text-red-600">
                                            Error: {result.error}
                                        </div>
                                    )}
                                </div>

                                <div className="ml-4 text-xs text-gray-500">
                                    {new Date(result.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            {testResults.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-xl p-4">
                        <div className="text-green-700 text-sm font-medium">Passed</div>
                        <div className="text-2xl font-bold text-green-800 mt-1">
                            {testResults.filter(r => r.success).length}
                        </div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                        <div className="text-red-700 text-sm font-medium">Failed</div>
                        <div className="text-2xl font-bold text-red-800 mt-1">
                            {testResults.filter(r => !r.success).length}
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                        <div className="text-blue-700 text-sm font-medium">Total</div>
                        <div className="text-2xl font-bold text-blue-800 mt-1">
                            {testResults.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
