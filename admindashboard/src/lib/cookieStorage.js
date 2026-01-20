/**
 * Cookie Storage Adapter for Supabase
 * Replaces localStorage with secure cookies for token storage
 * 
 * Security Features:
 * - Secure: HTTPS only in production
 * - SameSite: CSRF protection
 * - Auto-expiration: 7 days
 */

import Cookies from 'js-cookie';

export class CookieStorage {
    constructor(cookieOptions = {}) {
        // Default cookie configuration
        this.cookieOptions = {
            // HTTPS only in production
            secure: process.env.NODE_ENV === 'production',

            // Strict CSRF protection (cookies only sent to same site)
            sameSite: 'strict',

            // Token expires in 7 days
            expires: 7,

            // Available to all paths in the app
            path: '/',

            // Allow custom options to override defaults
            ...cookieOptions
        };

        console.log('🍪 Cookie Storage initialized:', {
            secure: this.cookieOptions.secure,
            sameSite: this.cookieOptions.sameSite,
            expires: this.cookieOptions.expires
        });
    }

    /**
     * Get item from cookie
     * @param {string} key - Cookie name
     * @returns {string|null} - Cookie value or null
     */
    getItem(key) {
        const value = Cookies.get(key);
        // Supabase expects null for missing items, not undefined
        return value !== undefined ? value : null;
    }

    /**
     * Set item in cookie
     * @param {string} key - Cookie name
     * @param {string} value - Cookie value
     */
    setItem(key, value) {
        Cookies.set(key, value, this.cookieOptions);
        console.log(`🍪 Cookie set: ${key.substring(0, 20)}...`);
    }

    /**
     * Remove item from cookie
     * @param {string} key - Cookie name
     */
    removeItem(key) {
        Cookies.remove(key, { path: this.cookieOptions.path });
        console.log(`🍪 Cookie removed: ${key}`);
    }
}
