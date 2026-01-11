import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * PermissionGuard Component (UI Version)
 * Conditionally renders children based on user permissions
 * This is for hiding/showing UI elements, not for route protection
 * 
 * @param {string[]} requiredPermissions - Array of permission names required
 * @param {boolean} requireAll - If true, user must have ALL permissions. If false, needs ANY (default: true)
 * @param {React.ReactNode} children - Content to render if user has permissions
 * @param {React.ReactNode} fallback - Optional content to render if user doesn't have permissions
 */
const PermissionGuardUI = ({
    requiredPermissions = [],
    requireAll = true,
    children,
    fallback = null
}) => {
    const { hasAllPermissions, hasAnyPermission } = useAuth();

    if (!requiredPermissions || requiredPermissions.length === 0) {
        // No permissions required, render children
        return <>{children}</>;
    }

    const hasRequiredPermissions = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
        return fallback;
    }

    return <>{children}</>;
};

export default PermissionGuardUI;
