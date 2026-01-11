/**
 * useAuth Hook - Redux Version
 * Provides the same API as the old Context-based useAuth hook
 * Ensures backward compatibility - no component changes needed!
 */

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
    loadUserData,
    logout as logoutAction,
    updateUser as updateUserAction
} from '../store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();

    // Select state from Redux store
    const { user, role, permissions, loading, session, error } = useSelector(
        (state) => state.auth
    );

    // Helper functions
    const hasRole = useCallback((roleName) => {
        if (!role) return false;
        return role.name === roleName;
    }, [role]);

    const hasPermission = useCallback((permissionName) => {
        if (!permissions || permissions.length === 0) return false;
        return permissions.includes(permissionName);
    }, [permissions]);

    const hasAllPermissions = useCallback((requiredPermissions = []) => {
        if (!permissions || permissions.length === 0) return false;
        return requiredPermissions.every(perm => permissions.includes(perm));
    }, [permissions]);

    const hasAnyPermission = useCallback((requiredPermissions = []) => {
        if (!permissions || permissions.length === 0) return false;
        return requiredPermissions.some(perm => permissions.includes(perm));
    }, [permissions]);

    const canAccess = useCallback((requiredPermissions = []) => {
        return hasAllPermissions(requiredPermissions);
    }, [hasAllPermissions]);

    const isAdmin = useCallback(() => {
        return hasRole('admin');
    }, [hasRole]);

    const isManagerOrAdmin = useCallback(() => {
        return hasRole('admin') || hasRole('manager');
    }, [hasRole]);

    const refreshUser = useCallback(async () => {
        if (session?.user) {
            await dispatch(loadUserData({
                userId: session.user.id,
                userEmail: session.user.email
            }));
        }
    }, [session, dispatch]);

    const logout = useCallback(() => {
        dispatch(logoutAction());
    }, [dispatch]);

    const updateUser = useCallback((updates) => {
        dispatch(updateUserAction(updates));
    }, [dispatch]);

    return {
        user,
        role,
        permissions,
        loading,
        session,
        error,
        hasRole,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        canAccess,
        isAdmin,
        isManagerOrAdmin,
        refreshUser,
        logout,
        updateUser
    };
};

// Export useRole for backward compatibility
export const useRole = () => {
    const { role } = useAuth();
    return role;
};
