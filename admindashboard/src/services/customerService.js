/**
 * Customer Service
 * Handles all customer-related operations with Supabase
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Fetch all customers with optional filtering and search
 * @param {Object} filters - { search, status }
 * @returns {Promise<Array>} - List of customers
 */
export const fetchCustomers = async (filters = {}) => {
    try {
        let query = supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false }); // sort the data by created_at in descending order

        // Apply search filter (searches across name, email, phone)
        if (filters.search && filters.search.trim()) {
            const searchTerm = filters.search.trim().toLowerCase();
            console.log(searchTerm, "searchTerm");
            query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);
        }

        // Apply status filter
        if (filters.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }

        console.log(query, "query");

        const { data, error } = await query;

        if (error) { // supabase return the error object that why we are throw the error
            throw new Error(`Failed to fetch customers: ${error.message}`);
        }

        console.log(error, 'error')

        return data || [];
    } catch (error) {
        console.error('Error in fetchCustomers:', error);
        throw error;
    }
};

/**
 * Fetch single customer by ID
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} - Customer object
 */
export const fetchCustomerById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Customer not found');
            }
            throw new Error(`Failed to fetch customer: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error in fetchCustomerById:', error);
        throw error;
    }
};

/**
 * Update customer status
 * @param {string} id - Customer ID
 * @param {string} newStatus - New status (active | inactive)
 * @returns {Promise<Object>} - Updated customer
 */
export const updateCustomerStatus = async (id, newStatus) => {
    try {
        // Validate status
        if (!['active', 'inactive'].includes(newStatus)) {
            throw new Error('Invalid status. Must be "active" or "inactive"');
        }

        const { data, error } = await supabase
            .from('customers')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to update customer status: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error in updateCustomerStatus:', error);
        throw error;
    }
};

/**
 * Get customer statistics
 * @returns {Promise<Object>} - Customer stats
 */
export const getCustomerStats = async () => {
    try {
        // Fetch all customers
        const { data: customers, error } = await supabase
            .from('customers')
            .select('status, created_at');

        if (error) {
            throw new Error(`Failed to fetch customer stats: ${error.message}`);
        }

        // Calculate statistics
        const total = customers.length;
        const active = customers.filter(c => c.status === 'active').length;
        const inactive = customers.filter(c => c.status === 'inactive').length;

        // Calculate new customers this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = customers.filter(c => {
            const createdAt = new Date(c.created_at);
            return createdAt >= firstDayOfMonth;
        }).length;

        return {
            total,
            active,
            inactive,
            newThisMonth
        };
    } catch (error) {
        console.error('Error in getCustomerStats:', error);
        throw error;
    }
};

/**
 * Create new customer
 * @param {Object} customerData - { name, email, phone, status }
 * @returns {Promise<Object>} - Created customer
 */
export const createCustomer = async (customerData) => {
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert([{
                name: customerData.name,
                email: customerData.email,
                phone: customerData.phone || null,
                status: customerData.status || 'active',
                total_orders: 0,
                total_spent: 0
            }])
            .select()
            .single();

        if (error) {
            // Handle unique constraint violation for email
            if (error.code === '23505') {
                throw new Error('A customer with this email already exists');
            }
            throw new Error(`Failed to create customer: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error in createCustomer:', error);
        throw error;
    }
};
