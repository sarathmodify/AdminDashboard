/**
 * Order Service
 * Handles all order-related operations with mock API
 */

import { MOCK_ORDERS, getMockProducts } from './mockOrderData';

// Clone the mock data to allow modifications without affecting the original
let ordersDatabase = [...MOCK_ORDERS];

/**
 * Simulate API delay
 */
const simulateDelay = (ms = 500) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Fetch all orders with optional filtering and pagination
 * @param {Object} filters - { search, status, dateFrom, dateTo, page, limit }
 * @returns {Promise<Object>} - { orders: Order[], pagination: PaginationInfo }
 */
export async function fetchOrders(filters = {}) {
    console.log('Fetching orders with filters:', filters);
    await simulateDelay();
    const {
        search = '',
        status = 'all',
        dateFrom = null,
        dateTo = null,
        page = 1,
        limit = 10
    } = filters;

    try {
        // Start with all orders
        let filteredOrders = [...ordersDatabase];

        // Apply search filter (search by order ID, customer name, or amount)
        if (search && search.trim() !== '') {
            const searchLower = search.toLowerCase().trim();
            filteredOrders = filteredOrders.filter(order => {
                const matchesId = order.id.toLowerCase().includes(searchLower);
                const matchesName = order.customer.name.toLowerCase().includes(searchLower);
                const matchesEmail = order.customer.email.toLowerCase().includes(searchLower);
                const matchesAmount = order.total.toString().includes(searchLower);

                return matchesId || matchesName || matchesEmail || matchesAmount;
            });
        }

        // Apply status filter
        if (status && status !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        // Apply date range filter
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            fromDate.setHours(0, 0, 0, 0);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate >= fromDate;
            });
        }

        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.created_at);
                return orderDate <= toDate;
            });
        }

        // Calculate pagination
        const totalOrders = filteredOrders.length;
        const totalPages = Math.ceil(totalOrders / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Get paginated results
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

        return {
            orders: paginatedOrders,
            pagination: {
                total: totalOrders,
                page,
                limit,
                totalPages
            }
        };
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
}

/**
 * Fetch single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Order object
 */
export async function fetchOrderById(orderId) {
    await simulateDelay();

    try {
        const order = ordersDatabase.find(o => o.id === orderId);

        console.log(order);

        if (!order) {
            throw new Error('Order not found');
        }

        return { ...order }; // Return a copy
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

/**
 * Create new order
 * @param {Object} orderData - { customer, items, shipping_address }
 * @returns {Promise<Object>} - Created order
 */
export async function createOrder(orderData) {
    await simulateDelay(800); // Slightly longer delay for create operation

    try {
        // Validate order data
        if (!orderData.customer || !orderData.customer.name || !orderData.customer.email) {
            throw new Error('Customer information is required');
        }

        if (!orderData.items || orderData.items.length === 0) {
            throw new Error('Order must contain at least one item');
        }

        if (!orderData.shipping_address || !orderData.shipping_address.street || !orderData.shipping_address.city) {
            throw new Error('Shipping address is required');
        }

        // Get product details for items
        const products = getMockProducts();
        const orderItems = orderData.items.map(item => {
            const product = products.find(p => p.id === item.product_id);
            if (!product) {
                throw new Error(`Product not found: ${item.product_id}`);
            }

            return {
                id: product.id,
                name: product.name,
                image_url: product.image_url,
                quantity: item.quantity,
                unit_price: product.price,
                total_price: product.price * item.quantity
            };
        });

        // Calculate totals
        const subtotal = orderItems.reduce((sum, item) => sum + item.total_price, 0);
        const tax = subtotal * 0.10;
        const shipping_cost = subtotal > 100 ? 0 : 15;
        const total = subtotal + tax + shipping_cost;

        // Generate new order ID
        const newOrderNumber = ordersDatabase.length + 1000;
        const newOrderId = `ORD-${newOrderNumber}`;

        // Create new order object
        const newOrder = {
            id: newOrderId,
            customer: {
                name: orderData.customer.name,
                email: orderData.customer.email,
                phone: orderData.customer.phone || ''
            },
            items: orderItems,
            shipping_address: { ...orderData.shipping_address },
            payment: {
                status: 'pending',
                method: 'credit_card',
                last4: String(Math.floor(1000 + Math.random() * 9000)),
                card_brand: 'Visa',
                paid_at: null
            },
            subtotal: parseFloat(subtotal.toFixed(2)),
            tax: parseFloat(tax.toFixed(2)),
            shipping_cost: parseFloat(shipping_cost.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Add to database at the beginning (newest first)
        ordersDatabase.unshift(newOrder);

        return { ...newOrder };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status (pending | delivered | cancelled)
 * @returns {Promise<Object>} - Updated order
 */
export async function updateOrderStatus(orderId, newStatus) {
    await simulateDelay();

    try {
        const validStatuses = ['pending', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid status. Must be: pending, delivered, or cancelled');
        }

        const orderIndex = ordersDatabase.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            throw new Error('Order not found');
        }

        // Update order
        ordersDatabase[orderIndex] = {
            ...ordersDatabase[orderIndex],
            status: newStatus,
            updated_at: new Date().toISOString()
        };

        // Update payment status if delivered
        if (newStatus === 'delivered') {
            ordersDatabase[orderIndex].payment = {
                ...ordersDatabase[orderIndex].payment,
                status: 'paid',
                paid_at: ordersDatabase[orderIndex].payment.paid_at || new Date().toISOString()
            };
        }

        // Update payment status if cancelled
        if (newStatus === 'cancelled') {
            ordersDatabase[orderIndex].payment = {
                ...ordersDatabase[orderIndex].payment,
                status: 'failed'
            };
        }

        return { ...ordersDatabase[orderIndex] };
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

/**
 * Cancel order (sets status to cancelled)
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Updated order
 */
export async function cancelOrder(orderId) {
    return updateOrderStatus(orderId, 'cancelled');
}

/**
 * Get available products for order creation
 * @returns {Promise<Array>} - List of products
 */
export async function getAvailableProducts() {
    await simulateDelay(300);

    try {
        return getMockProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

/**
 * Get order statistics
 * @returns {Promise<Object>} - Order statistics
 */
export async function getOrderStats() {
    await simulateDelay();

    try {
        const totalOrders = ordersDatabase.length;
        const pendingOrders = ordersDatabase.filter(o => o.status === 'pending').length;
        const deliveredOrders = ordersDatabase.filter(o => o.status === 'delivered').length;
        const cancelledOrders = ordersDatabase.filter(o => o.status === 'cancelled').length;

        const totalRevenue = ordersDatabase
            .filter(o => o.status === 'delivered')
            .reduce((sum, order) => sum + order.total, 0);

        // Today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaysOrders = ordersDatabase.filter(o => {
            const orderDate = new Date(o.created_at);
            return orderDate >= today;
        });

        const todaysRevenue = todaysOrders
            .filter(o => o.status === 'delivered')
            .reduce((sum, order) => sum + order.total, 0);

        return {
            totalOrders,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            todaysOrders: todaysOrders.length,
            todaysRevenue: parseFloat(todaysRevenue.toFixed(2))
        };
    } catch (error) {
        console.error('Error fetching order stats:', error);
        throw new Error('Failed to fetch order statistics');
    }
}
