/**
 * Validate product form data
 * @param {Object} formData - Product form data
 * @param {boolean} requireImage - Whether image is required (true for add, false for edit)
 * @returns {Object} - Object containing validation errors
 */
export const validateProductForm = (formData, requireImage = false) => {
    const errors = {};

    // Product name validation
    if (!formData.productName?.trim()) {
        errors.productName = 'Product name is required';
    }

    // Description validation
    if (!formData.description?.trim()) {
        errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
        errors.description = 'Description must be at least 10 characters';
    }

    // Price validation
    if (!formData.price) {
        errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        errors.price = 'Please enter a valid price';
    }

    // Discount validation (optional field)
    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
        errors.discount = 'Discount must be between 0 and 100';
    }

    // Category validation
    if (!formData.category) {
        errors.category = 'Please select a category';
    }

    // Stock validation
    if (!formData.stock) {
        errors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
        errors.stock = 'Please enter a valid stock quantity';
    }

    // Image validation (only for add product)
    if (requireImage && !formData.image) {
        errors.image = 'Product image is required';
    }

    return errors;
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {string|null} - Error message or null if valid
 */
export const validateImageFile = (file) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return 'Please select a valid image file';
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return 'Image size should be less than 5MB';
    }

    return null;
};
