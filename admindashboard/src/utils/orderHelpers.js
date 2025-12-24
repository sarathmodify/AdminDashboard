/**
 * Order Utility Helper Functions
 * Reusable functions for order formatting and calculations
 */

/**
 * Get status badge configuration
 * @param {string} status - Order status (pending | delivered | cancelled)
 * @returns {Object} - Status configuration { bg, text, dot, label }
 */
export function getStatusConfig(status) {
    const configs = {
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            dot: 'bg-yellow-500',
            label: 'Pending'
        },
        delivered: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            dot: 'bg-green-500',
            label: 'Delivered'
        },
        cancelled: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            dot: 'bg-red-500',
            label: 'Cancelled'
        }
    };

    return configs[status] || configs.pending;
}

/**
 * Get payment status configuration
 * @param {string} status - Payment status (paid | pending | failed)
 * @returns {Object} - Status configuration { bg, text, icon, label }
 */
export function getPaymentStatusConfig(status) {
    const configs = {
        paid: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: '✓',
            label: 'Paid'
        },
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-700',
            icon: '⏱',
            label: 'Pending'
        },
        failed: {
            bg: 'bg-red-100',
            text: 'text-red-700',
            icon: '✗',
            label: 'Failed'
        }
    };

    return configs[status] || configs.pending;
}

/**
 * Format order date (short format)
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date (e.g., "Dec 12, 2025")
 */
export function formatOrderDate(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

/**
 * Format order datetime (full format with time)
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted datetime (e.g., "Dec 12, 2025 at 2:30 PM")
 */
export function formatOrderDateTime(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        const datePart = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const timePart = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${datePart} at ${timePart}`;
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return 'Invalid Date';
    }
}

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency (e.g., "$123.45")
 */
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '$0.00';

    try {
        return `$${Number(amount).toFixed(2)}`;
    } catch (error) {
        console.error('Error formatting currency:', error);
        return '$0.00';
    }
}

/**
 * Calculate order totals from items
 * @param {Array} items - Order items
 * @param {number} taxRate - Tax rate (default 0.10 for 10%)
 * @param {number} shippingCost - Base shipping cost (default 15)
 * @returns {Object} - { subtotal, tax, shipping, total }
 */
export function calculateOrderTotals(items, taxRate = 0.10, shippingCost = 15) {
    if (!items || items.length === 0) {
        return {
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0
        };
    }

    const subtotal = items.reduce((sum, item) => {
        const itemTotal = (item.unit_price || 0) * (item.quantity || 0);
        return sum + itemTotal;
    }, 0);

    const tax = subtotal * taxRate;

    // Free shipping over $100
    const shipping = subtotal > 100 ? 0 : shippingCost;

    const total = subtotal + tax + shipping;

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
}

/**
 * Format address for display
 * @param {Object} address - Address object { street, apt, city, state, zip, country }
 * @returns {string} - Formatted multi-line address
 */
export function formatAddress(address) {
    if (!address) return 'No address provided';

    const { street, apt, city, state, zip, country } = address;

    const lines = [
        street,
        apt,
        `${city || ''}, ${state || ''} ${zip || ''}`.trim(),
        country
    ].filter(line => line && line.trim() !== '' && line.trim() !== ',');

    return lines.join('\n');
}

/**
 * Format address for single line display
 * @param {Object} address - Address object
 * @returns {string} - Single line address
 */
export function formatAddressOneLine(address) {
    if (!address) return 'No address';

    const { street, apt, city, state, zip } = address;

    const parts = [
        street,
        apt,
        city,
        state,
        zip
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
}

/**
 * Generate a unique order ID
 * @returns {string} - New order ID
 */
export function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${timestamp}-${random}`;
}

/**
 * Get customer initials for avatar
 * @param {string} name - Customer name
 * @returns {string} - Initials (e.g., "JD" for "John Doe")
 */
export function getCustomerInitials(name) {
    if (!name || name.trim() === '') return '?';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
    if (!email) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} - True if valid
 */
export function isValidPhone(phone) {
    if (!phone) return false;

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if it has 10 or 11 digits
    return digits.length >= 10 && digits.length <= 11;
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} - Formatted phone (e.g., "+1-234-567-8900")
 */
export function formatPhoneNumber(phone) {
    if (!phone) return '';

    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Format based on length
    if (digits.length === 10) {
        return `+1-${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11) {
        return `+${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }

    return phone; // Return as-is if format doesn't match
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time string
 */
export function getRelativeTime(dateString) {
    if (!dateString) return 'Unknown';

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
        if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
        if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

        return formatOrderDate(dateString);
    } catch (error) {
        console.error('Error calculating relative time:', error);
        return 'Unknown';
    }
}

/**
 * Get order count by status
 * @param {Array} orders - Array of orders
 * @param {string} status - Status to count
 * @returns {number} - Count of orders with that status
 */
export function getOrderCountByStatus(orders, status) {
    if (!orders || !Array.isArray(orders)) return 0;

    return orders.filter(order => order.status === status).length;
}

/**
 * Get card icon based on brand
 * @param {string} brand - Card brand (Visa, Mastercard, etc.)
 * @returns {string} - Emoji or text representation
 */
export function getCardIcon(brand) {
    const icons = {
        'Visa': '💳',
        'Mastercard': '💳',
        'Amex': '💳',
        'Discover': '💳',
        'credit_card': '💳'
    };

    return icons[brand] || '💳';
}
