/**
 * AuthContext - React Context for Authentication State
 * Uses authService.js for all backend calls
 * Redux-style state management with useReducer
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import * as authService from '../services/authService';
import { authReducer, initialState } from './authReducer';
import { AUTH_ACTIONS } from './authActionTypes';

// Create the context
const AuthContext = createContext({});

/**
 * AuthProvider Component
 * Manages authentication state using Redux-style reducer
 */
export const AuthProvider = ({ children }) => {
    // Redux-style state management
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Destructure state for backward compatibility
    const { user, role, permissions, loading, session, error } = state;

    // Load user data from backend
    const loadUserData = async (userId, userEmail) => {


        try {
            // Step 1: Get user profile
            const { data: profileData, error: profileError } = await authService.fetchUserProfile(userId);

            // Handle different error types
            if (profileError) {
                if (profileError.code === 'RLS_POLICY_VIOLATION') {
                    console.error('RLS policy error on user_profiles table');

                    dispatch({
                        type: AUTH_ACTIONS.SET_AUTH_DATA,
                        payload: {
                            user: { id: userId, email: userEmail, full_name: userEmail?.split('@')[0] || 'User', phone: null, avatar_url: null },
                            role: null,
                            permissions: []
                        }
                    });
                    return;
                } else if (profileError.code === 'TIMEOUT') {
                    console.error('Query timeout on user_profiles');

                    dispatch({
                        type: AUTH_ACTIONS.SET_AUTH_DATA,
                        payload: {
                            user: { id: userId, email: userEmail, full_name: userEmail?.split('@')[0] || 'User', phone: null, avatar_url: null },
                            role: null,
                            permissions: []
                        }
                    });
                    return;
                } else if (profileError.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                    await authService.createUserProfile(userId, userEmail);
                    return await loadUserData(userId, userEmail);
                } else {
                    console.error('Profile fetch error:', profileError?.message);
                }
            }

            // Set basic user info immediately
            const userProfile = {
                id: userId,
                email: userEmail,
                full_name: profileData?.full_name || userEmail?.split('@')[0] || 'User',
                phone: profileData?.phone || null,
                avatar_url: profileData?.avatar_url || null,
            };
            console.log('✅ Profile fetched:', userProfile?.avatar_url);

            // Step 2: Get user role
            const { data: roleData, error: roleError } = await authService.fetchUserRole(userId);

            if (roleError || !roleData || !roleData.roles) {
                // No role assigned - set user but no role/permissions
                console.log('⚠️ No role assigned');
                dispatch({
                    type: AUTH_ACTIONS.SET_AUTH_DATA,
                    payload: {
                        user: userProfile,
                        role: null,
                        permissions: []
                    }
                });
                return;
            }
            console.log('✅ User role fetched:', roleData);
            const roleInfo = {
                name: roleData.roles.name,
                display_name: roleData.roles.display_name,
                description: roleData.roles.description,
            };
            // Role will be set with permissions below


            // Step 3: Get role permissions
            const { data: permsData, error: permsError } = await authService.fetchRolePermissions(roleData.roles.id);

            if (permsError || !permsData || permsData.length === 0) {
                // No permissions assigned - set user and role but no permissions
                console.log('⚠️ No permissions assigned');
                dispatch({
                    type: AUTH_ACTIONS.SET_AUTH_DATA,
                    payload: {
                        user: userProfile,
                        role: roleInfo,
                        permissions: []
                    }
                });
                return;
            }

            console.log('✅ Role permissions fetched:', permsData);

            const userPermissions = permsData
                .map(rp => rp.permissions?.name)
                .filter(Boolean);
            console.log('✅ User permissions:', userPermissions);

            // Success! Dispatch all data at once
            dispatch({
                type: AUTH_ACTIONS.SET_AUTH_DATA,
                payload: {
                    user: userProfile,
                    role: roleInfo,
                    permissions: userPermissions
                }
            });

        } catch (error) {
            console.error('❌ Error loading user data:', error);

            // Set basic user info even on error
            dispatch({
                type: AUTH_ACTIONS.SET_AUTH_DATA,
                payload: {
                    user: {
                        id: userId,
                        email: userEmail,
                        full_name: userEmail?.split('@')[0] || 'User',
                        phone: null,
                        avatar_url: null,
                    },
                    role: null,
                    permissions: []
                }
            });
        }
    };

    // Initialize auth on mount
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                console.log('✅ Current session:', currentSession, session);
                dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: currentSession });

                if (currentSession?.user) {
                    await loadUserData(currentSession.user.id, currentSession.user.email);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        };

        initializeAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                dispatch({ type: AUTH_ACTIONS.SET_SESSION, payload: newSession });

                if (newSession?.user) {
                    await loadUserData(newSession.user.id, newSession.user.email);
                } else {
                    // User logged out
                    dispatch({ type: AUTH_ACTIONS.CLEAR_AUTH_DATA });
                }

                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
            }
        );

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Helper Functions
     */

    const hasRole = useCallback((roleName) => {
        if (!role) return false;
        console.log(role, roleName, 'hasRole');
        return role.name === roleName;
    }, [role]); // Only recreate when 'role' changes

    const hasPermission = useCallback((permissionName) => {
        if (!permissions || permissions.length === 0) return false;
        return permissions.includes(permissionName);
    }, [permissions]); // Only recreate when 'permissions' changes

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
            await loadUserData(session.user.id, session.user.email);
        }
    }, [session]);

    // ✅ Memoize the entire context value
    const value = useMemo(() => ({
        user,
        role,
        permissions,
        session,
        loading,
        hasRole,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        canAccess,
        isAdmin,
        isManagerOrAdmin,
        refreshUser,
    }), [
        user,
        role,
        permissions,
        session,
        loading,
        hasRole,
        hasPermission,
        hasAllPermissions,
        hasAnyPermission,
        canAccess,
        isAdmin,
        isManagerOrAdmin,
        refreshUser,
    ]);
    console.log('✅ AuthContext value:', value);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom Hooks
 */

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
// refactor the code
export const useRole = () => {
    const { role } = useAuth();
    return role;
};

export const usePermissions = () => {
    const { permissions } = useAuth();
    return permissions;
};

export const useUser = () => {
    const { user } = useAuth();
    return user;
};

export default AuthContext;
