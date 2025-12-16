import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import { uploadProductImage, insertProduct } from '../../services/productService';

export default function ProductAdd() {
    const navigate = useNavigate();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        stock: '',
        image: null
    });

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    // Category options
    const categories = [
        { value: '', label: 'Select Category' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'accessories', label: 'Accessories' }
    ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file, 'file');
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Please select a valid image file'
                }));
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Image size should be less than 5MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear error
            setErrors(prev => ({
                ...prev,
                image: ''
            }));
        }
    };

    // Remove image
    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.productName.trim()) {
            newErrors.productName = 'Product name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Please enter a valid price';
        }

        if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.stock) {
            newErrors.stock = 'Stock quantity is required';
        } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
            newErrors.stock = 'Please enter a valid stock quantity';
        }

        if (!formData.image) {
            newErrors.image = 'Product image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset form function
    const resetForm = () => {
        setFormData({
            productName: '',
            description: '',
            price: '',
            discount: '',
            category: '',
            stock: '',
            image: null
        });
        setImagePreview(null);
        setErrors({});

        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Step 1: Upload image to Supabase Storage
            const { url: imageUrl } = await uploadProductImage(formData.image);

            // Step 2: Insert product into database
            const productData = {
                name: formData.productName,
                description: formData.description,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                category: formData.category,
                stock: parseInt(formData.stock),
                imageUrl: imageUrl
            };

            const newProduct = await insertProduct(productData);
            console.log('Product added to Supabase:', newProduct);

            // Reset form
            resetForm();

            // Show success message
            alert('Product added successfully!');

            // Navigate back to product list
            navigate('/products');
        } catch (error) {
            console.error('Error adding product:', error);
            alert(error.message || 'Failed to add product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/products');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Navbar */}
                <Navbar onMobileSidebarToggle={toggleMobileSidebar} />

                {/* Add Product Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                        {/* Page Header */}
                        <div className="mb-6 animate-fadeIn">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Products
                                </button>
                                <span>/</span>
                                <span className="text-gray-900">Add Product</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Add New Product</h1>
                            <p className="text-sm text-gray-600 mt-1">Fill in the details to add a new product to your inventory</p>
                        </div>

                        {/* Form Card */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fadeIn" style={{ animationDelay: '100ms' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="p-6 sm:p-8">
                                    {/* Product Name */}
                                    <div className="mb-6">
                                        <label htmlFor="productName" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Product Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="productName"
                                            name="productName"
                                            value={formData.productName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.productName
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                }`}
                                            placeholder="Enter product name"
                                        />
                                        {errors.productName && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.productName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <div className="mb-6">
                                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${errors.description
                                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                }`}
                                            placeholder="Enter product description (minimum 10 characters)"
                                        ></textarea>
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Price and Discount */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* Price */}
                                        <div>
                                            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Price ($) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    id="price"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.price
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            {errors.price && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.price}
                                                </p>
                                            )}
                                        </div>

                                        {/* Discount */}
                                        <div>
                                            <label htmlFor="discount" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Discount (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="discount"
                                                    name="discount"
                                                    value={formData.discount}
                                                    onChange={handleInputChange}
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.discount
                                                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                        }`}
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                            {errors.discount && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.discount}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category and Stock */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        {/* Category */}
                                        <div>
                                            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id="category"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.category
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.value} value={cat.value}>
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.category}
                                                </p>
                                            )}
                                        </div>

                                        {/* Stock */}
                                        <div>
                                            <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Stock Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                id="stock"
                                                name="stock"
                                                value={formData.stock}
                                                onChange={handleInputChange}
                                                min="0"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.stock
                                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                    }`}
                                                placeholder="0"
                                            />
                                            {errors.stock && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.stock}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Product Image <span className="text-red-500">*</span>
                                        </label>

                                        {!imagePreview ? (
                                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${errors.image
                                                ? 'border-red-300 bg-red-50'
                                                : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                                                }`}>
                                                <input
                                                    type="file"
                                                    id="image-upload"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <div className="flex flex-col items-center">
                                                        <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                                            Click to upload or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF up to 5MB
                                                        </p>
                                                    </div>
                                                </label>
                                            </div>
                                        ) : (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {errors.image && (
                                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Form Footer */}
                                <div className="bg-gray-50 px-6 py-4 sm:px-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all ${isSubmitting
                                            ? 'bg-blue-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding Product...
                                            </span>
                                        ) : (
                                            'Add Product'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
