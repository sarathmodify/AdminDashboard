import React from 'react';
import { useAuth } from '../../Context/AuthContext.jsx';

/**
 * RoleGuard Component
 * Shows/hides children based on user's role
 * 
 * @param {string[]} allowedRoles - Array of role names that can see the content
 * @param {React.ReactNode} children - Content to show if user has allowed role
 * @param {React.ReactNode} fallback - Optional content to show if user doesn't have role (default: null)
 * @param {boolean} requireAll - If true, user must have ALL roles. If false, user needs ANY role (default: false)
 */
const RoleGuard = ({
    allowedRoles = [],
    children,
    fallback = null,
    requireAll = false
}) => {
    const { role, loading } = useAuth();

    // Show nothing while loading
    if (loading) {
        return null;
    }

    // No role assigned
    if (!role) {
        return fallback;
    }

    // Check if user has required role(s)
    const hasAccess = requireAll
        ? allowedRoles.every(allowedRole => role.name === allowedRole)
        : allowedRoles.some(allowedRole => role.name === allowedRole);

    return hasAccess ? children : fallback;
};

export default RoleGuard;
