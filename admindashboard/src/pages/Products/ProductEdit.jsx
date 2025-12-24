import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById, updateProduct, uploadProductImage, deleteProductImage } from '../../services/productService';
import { validateProductForm, validateImageFile } from '../../utils/validation';

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        price: '',
        discount: '',
        category: '',
        stock: ''
    });



    // Category options
    const categories = [
        { value: '', label: 'Select Category' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'shoes', label: 'Shoes' },
        { value: 'accessories', label: 'Accessories' }
    ];

    // Fetch product data on mount
    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await fetchProductById(id);

            // Pre-fill form with existing data
            setFormData({
                productName: data.name,
                description: data.description,
                price: data.price.toString(),
                discount: data.discount ? data.discount.toString() : '',
                category: data.category,
                stock: data.stock.toString()
            });

            setCurrentImageUrl(data.image_url);
            setError(null);
        } catch (err) {
            console.error('Error loading product:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle new image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate image file
            const imageError = validateImageFile(file);
            if (imageError) {
                setErrors(prev => ({
                    ...prev,
                    image: imageError
                }));
                return;
            }

            setNewImageFile(file);

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

    // Remove new image (revert to original)
    const removeNewImage = () => {
        setNewImageFile(null);
        setImagePreview(null);
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Validate form
    const validateForm = () => {
        const validationErrors = validateProductForm(formData, false); // requireImage = false for edit
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrl = currentImageUrl; // Keep existing by default

            // If user uploaded a new image
            if (newImageFile) {
                // Upload new image
                const { url } = await uploadProductImage(newImageFile);
                imageUrl = url;

                // Delete old image from storage
                if (currentImageUrl) {
                    const urlParts = currentImageUrl.split('/');
                    const oldImagePath = urlParts[urlParts.length - 1];
                    await deleteProductImage(oldImagePath);
                }
            }

            // Update product
            const productData = {
                name: formData.productName,
                description: formData.description,
                price: parseFloat(formData.price),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                category: formData.category,
                stock: parseInt(formData.stock),
                imageUrl: imageUrl
            };

            await updateProduct(id, productData);

            alert('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            alert(error.message || 'Failed to update product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/products');
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 font-medium">Loading product...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center px-4">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Product</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
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
                    <span className="text-gray-900">Edit Product</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Product</h1>
                <p className="text-sm text-gray-600 mt-1">Update product details and save changes</p>
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
                                Product Image
                            </label>

                            {/* Show current image or new image preview */}
                            {imagePreview || currentImageUrl ? (
                                <div className="relative inline-block">
                                    <img
                                        src={imagePreview || currentImageUrl}
                                        alt="Product"
                                        className="w-full max-w-md h-64 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                    {imagePreview && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={removeNewImage}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                                                New Image
                                            </span>
                                        </>
                                    )}
                                    {!imagePreview && (
                                        <div className="mt-3">
                                            <input
                                                type="file"
                                                id="image-upload"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Change Image
                                            </label>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                                    <p className="text-gray-500 text-sm">No image available</p>
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
                                    Updating Product...
                                </span>
                            ) : (
                                'Update Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}