import { supabase } from '../lib/supabaseClient';

/**
 * Upload product image to Supabase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadProductImage = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to storage
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
};

/**
 * Insert new product into database
 * @param {Object} productData - Product data
 * @returns {Promise<Object>}
 */
export const insertProduct = async (productData) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    // Prepare product data for insertion
    const productToInsert = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discount: productData.discount || 0,
        category: productData.category,
        stock: productData.stock,
        image_url: productData.imageUrl,
        sku: productData.sku || `SKU-${Date.now()}`,
        status: productData.stock > 0 ? 'In Stock' : 'Out of Stock',
        created_by: user.id
    };

    const { data, error } = await supabase
        .from('products')
        .insert([productToInsert])
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to add product: ${error.message}`);
    }

    return data;
};

/**
 * Fetch all products from database
 * @returns {Promise<Array>}
 */
export const fetchProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data || [];
};

/**
 * Update existing product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>}
 */
export const updateProduct = async (id, productData) => {
    const updateData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        discount: productData.discount || 0,
        category: productData.category,
        stock: productData.stock,
        status: productData.stock > 0 ? 'In Stock' : 'Out of Stock'
    };

    // Only update image_url if a new image URL is provided
    if (productData.imageUrl) {
        updateData.image_url = productData.imageUrl;
    }

    const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update product: ${error.message}`);
    }

    return data;
};

/**
 * Delete product from database
 * @param {string} id - Product ID
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete product: ${error.message}`);
    }
};

/**
 * Delete image from Supabase Storage
 * @param {string} imagePath - Path to the image in storage
 * @returns {Promise<void>}
 */
export const deleteProductImage = async (imagePath) => {
    if (!imagePath) return;

    const { error } = await supabase.storage
        .from('product-images')
        .remove([imagePath]);

    if (error) {
        console.error('Failed to delete image:', error.message);
        // Don't throw error for image deletion failures
    }
};
