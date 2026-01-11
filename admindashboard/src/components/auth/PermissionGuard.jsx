import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * PermissionGuard Component
 * Shows/hides children based on user's permissions
 * 
 * @param {string[]} requiredPermissions - Array of permission names required to see content
 * @param {React.ReactNode} children - Content to show if user has permissions
 * @param {React.ReactNode} fallback - Optional content to show if user lacks permissions (default: null)
 * @param {boolean} requireAll - If true, user must have ALL permissions. If false, user needs ANY permission (default: true)
 */
const PermissionGuard = ({
    requiredPermissions = [],
    children,
    fallback = null,
    requireAll = true
}) => {
    const { permissions, loading, hasAllPermissions, hasAnyPermission } = useAuth();

    // Show nothing while loading
    if (loading) {
        return null;
    }

    // No permissions assigned
    if (!permissions || permissions.length === 0) {
        return fallback;
    }

    // Check if user has required permission(s)
    const hasAccess = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

    return hasAccess ? children : fallback;
};

export default PermissionGuard;
