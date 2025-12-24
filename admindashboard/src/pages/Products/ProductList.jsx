import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, deleteProduct } from '../../services/productService';

export default function ProductList() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Fetch products from Supabase
    useEffect(() => {
        loadProducts();
    }, [searchQuery]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await fetchProducts();
            const filteredProducts = data.filter(product => {
                const productName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
                const productCategory = product.category.toLowerCase().includes(searchQuery.toLowerCase());
                const productSku = product.sku.toLowerCase().includes(searchQuery.toLowerCase());
                const productStatus = product.status.toLowerCase().includes(searchQuery.toLowerCase());
                return productName || productCategory || productSku || productStatus
            });
            setProducts(filteredProducts);
            setError(null);
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (product) => {
        // Confirm deletion
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            // Delete product (includes image cleanup)
            await deleteProduct(product.id);

            // Update local state - remove from list
            setProducts(prevProducts =>
                prevProducts.filter(p => p.id !== product.id)
            );

            alert('Product deleted successfully!');
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message || 'Failed to delete product');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Page Header with Search */}
            <div className="mb-6 animate-fadeIn">
                {/* Search Bar */}
                <div className="max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search anything here..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-4 pr-10 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Table Card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn" style={{ animationDelay: '100ms' }}>
                {/* Table Header - Desktop */}
                <div className="hidden md:grid md:grid-cols-7 gap-4 px-6 py-4 bg-white border-b border-gray-100">
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Sku</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-3 text-gray-600">Loading products...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <svg className="w-12 h-12 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-600 font-medium mb-2">Failed to load products</p>
                        <p className="text-sm text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={loadProducts}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Table Body */}
                {!loading && !error && (
                    <div className="divide-y divide-gray-100">
                        {products.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-600 font-medium mb-1">No products yet</p>
                                <p className="text-sm text-gray-500">Click "Add Product" to create your first product</p>
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="grid grid-cols-1 md:grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-150 animate-fadeIn"
                                    style={{ animationDelay: `${(index + 2) * 50}ms` }}
                                >
                                    {/* Product Name with Image */}
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/40'}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-full ring-2 ring-gray-100 object-cover"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                        />
                                        <span className="text-sm font-medium text-gray-800">{product.name}</span>
                                    </div>

                                    {/* Category */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600 md:text-gray-600 capitalize">
                                            <span className="md:hidden font-medium text-gray-700">Category: </span>
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600">
                                            <span className="md:hidden font-medium text-gray-700">Quantity: </span>
                                            {product.stock}
                                        </span>
                                    </div>

                                    {/* SKU */}
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-600">
                                            <span className="md:hidden font-medium text-gray-700">SKU: </span>
                                            {product.sku}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-800">
                                            <span className="md:hidden font-medium text-gray-700">Price: </span>
                                            ${product.price}
                                        </span>
                                    </div>

                                    {/* Status - Dynamic based on stock */}
                                    <div className="flex items-center">
                                        <span className={`
                                                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                                        ${product.stock > 0
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-600'
                                            }
                                                    `}>
                                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => navigate(`/products/edit/${product.id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                                            title="Edit Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteProduct(product)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                            title="Delete Product"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Add Product Button - Fixed position (bottom right) */}
            <button
                onClick={() => navigate('/products/add')}
                className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 z-30"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add Product</span>
            </button>
        </div>
    );
}
