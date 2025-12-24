/**
 * Mock Order Data Generator
 * Generates realistic sample order data for testing
 */

// Sample customer data
const CUSTOMERS = [
    { name: 'John Doe', email: 'john.doe@example.com', phone: '+1-234-567-8901' },
    { name: 'Sarah Smith', email: 'sarah.smith@example.com', phone: '+1-234-567-8902' },
    { name: 'Michael Johnson', email: 'michael.j@example.com', phone: '+1-234-567-8903' },
    { name: 'Emily Davis', email: 'emily.davis@example.com', phone: '+1-234-567-8904' },
    { name: 'David Wilson', email: 'david.wilson@example.com', phone: '+1-234-567-8905' },
    { name: 'Lisa Anderson', email: 'lisa.anderson@example.com', phone: '+1-234-567-8906' },
    { name: 'Robert Taylor', email: 'robert.taylor@example.com', phone: '+1-234-567-8907' },
    { name: 'Jennifer Brown', email: 'jennifer.b@example.com', phone: '+1-234-567-8908' },
    { name: 'James Martinez', email: 'james.martinez@example.com', phone: '+1-234-567-8909' },
    { name: 'Patricia Garcia', email: 'patricia.g@example.com', phone: '+1-234-567-8910' },
    { name: 'Christopher Lee', email: 'chris.lee@example.com', phone: '+1-234-567-8911' },
    { name: 'Maria Rodriguez', email: 'maria.r@example.com', phone: '+1-234-567-8912' },
    { name: 'Daniel White', email: 'daniel.white@example.com', phone: '+1-234-567-8913' },
    { name: 'Linda Harris', email: 'linda.harris@example.com', phone: '+1-234-567-8914' },
    { name: 'Matthew Clark', email: 'matthew.clark@example.com', phone: '+1-234-567-8915' },
];

// Sample products (matching your product structure)
const PRODUCTS = [
    { id: 'prod_1', name: 'Premium Cotton T-Shirt', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', price: 29.99 },
    { id: 'prod_2', name: 'Denim Jeans', image_url: 'https://images.unsplash.com/photo-1512499617640-c2f999fe4f7f', price: 59.99 },
    { id: 'prod_3', name: 'Leather Jacket', image_url: 'https://images.unsplash.com/photo-1585386959984-a41552231693', price: 199.99 },
    { id: 'prod_4', name: 'Running Shoes', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', price: 89.99 },
    { id: 'prod_5', name: 'Wool Sweater', image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f', price: 79.99 },
    { id: 'prod_6', name: 'Canvas Backpack', image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', price: 49.99 },
    { id: 'prod_7', name: 'Sunglasses', image_url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a', price: 39.99 },
    { id: 'prod_8', name: 'Watch', image_url: 'https://images.unsplash.com/photo-1593032465171-8cdd36b0a7b3', price: 149.99 },
    { id: 'prod_9', name: 'Wallet', image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90', price: 34.99 },
    { id: 'prod_10', name: 'Belt', image_url: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23', price: 24.99 },
];

// Sample addresses
const ADDRESSES = [
    { street: '123 Main Street', apt: 'Apt 4B', city: 'New York', state: 'NY', zip: '10001', country: 'United States' },
    { street: '456 Oak Avenue', apt: '', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'United States' },
    { street: '789 Elm Road', apt: 'Suite 200', city: 'Chicago', state: 'IL', zip: '60601', country: 'United States' },
    { street: '321 Pine Street', apt: '', city: 'Houston', state: 'TX', zip: '77001', country: 'United States' },
    { street: '654 Maple Drive', apt: 'Unit 15', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'United States' },
    { street: '987 Cedar Lane', apt: '', city: 'Philadelphia', state: 'PA', zip: '19101', country: 'United States' },
    { street: '147 Birch Court', apt: 'Apt 3A', city: 'San Antonio', state: 'TX', zip: '78201', country: 'United States' },
    { street: '258 Willow Way', apt: '', city: 'San Diego', state: 'CA', zip: '92101', country: 'United States' },
];

// Statuses
const STATUSES = ['pending', 'delivered', 'cancelled'];

// Card brands
const CARD_BRANDS = ['Visa', 'Mastercard', 'Amex', 'Discover'];

/**
 * Generate a random order ID
 */
function generateOrderId(index) {
    return `ORD-${1000 + index}`;
}

/**
 * Generate random date within last 30 days
 */
function generateRandomDate(daysAgo = 30) {
    const now = new Date();
    const randomDays = Math.floor(Math.random() * daysAgo);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    now.setDate(now.getDate() - randomDays); // if return negative it automatically adjust to previous month
    now.setHours(randomHours, randomMinutes, 0, 0);

    return now.toISOString();
}

/**
 * Generate random order items
 */
function generateOrderItems() {
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    const items = [];

    // Get random products without duplicates
    const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffled.slice(0, itemCount);

    selectedProducts.forEach(product => {
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const unitPrice = product.price;
        const totalPrice = unitPrice * quantity;

        items.push({
            id: product.id,
            name: product.name,
            image_url: product.image_url,
            quantity,
            unit_price: unitPrice,
            total_price: totalPrice
        });
    });

    return items;
}

/**
 * Calculate order totals
 */
function calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const tax = subtotal * 0.10; // 10% tax
    const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
    const total = subtotal + tax + shipping;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping_cost: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}

/**
 * Generate a single mock order
 */
function generateMockOrder(index) {
    const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const address = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const cardBrand = CARD_BRANDS[Math.floor(Math.random() * CARD_BRANDS.length)];

    const items = generateOrderItems(); // Generate random order items
    const totals = calculateTotals(items); // Calculate totals
    const createdAt = generateRandomDate(); // Generate random date

    console.log(createdAt, "createdAt")

    // Payment status: paid if delivered, random for pending, always unpaid for cancelled
    let paymentStatus = 'paid';
    if (status === 'pending') {
        paymentStatus = Math.random() > 0.5 ? 'paid' : 'pending';
    } else if (status === 'cancelled') {
        paymentStatus = 'failed';
    }

    return {
        id: generateOrderId(index),
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        },
        items,
        shipping_address: { ...address },
        payment: {
            status: paymentStatus,
            method: 'credit_card',
            last4: String(Math.floor(1000 + Math.random() * 9000)),
            card_brand: cardBrand,
            paid_at: paymentStatus === 'paid' ? createdAt : null
        },
        ...totals,
        status,
        created_at: createdAt,
        updated_at: createdAt
    };
}

/**
 * Generate multiple mock orders
 */
export function generateMockOrders(count = 50) {
    const orders = [];

    for (let i = 0; i < count; i++) {
        orders.push(generateMockOrder(i));
    }

    // Sort by created_at descending (newest first)
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return orders;
}

/**
 * Get mock products list (for product selector in create order modal)
 */
export function getMockProducts() {
    return PRODUCTS;
}

// Generate and export the mock orders
export const MOCK_ORDERS = generateMockOrders(60);
