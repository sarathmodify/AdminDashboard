/**
 * Auth Action Types
 * Redux-style action type constants for AuthContext
 */

export const AUTH_ACTIONS = {
    // Loading states
    SET_LOADING: 'SET_LOADING',

    // Session actions
    SET_SESSION: 'SET_SESSION',
    CLEAR_SESSION: 'CLEAR_SESSION',

    // User actions
    SET_USER: 'SET_USER',
    UPDATE_USER: 'UPDATE_USER',
    CLEAR_USER: 'CLEAR_USER',

    // Role actions
    SET_ROLE: 'SET_ROLE',
    CLEAR_ROLE: 'CLEAR_ROLE',

    // Permission actions
    SET_PERMISSIONS: 'SET_PERMISSIONS',
    CLEAR_PERMISSIONS: 'CLEAR_PERMISSIONS',

    // Combined actions
    SET_AUTH_DATA: 'SET_AUTH_DATA',
    CLEAR_AUTH_DATA: 'CLEAR_AUTH_DATA',

    // Error handling
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR'
};
