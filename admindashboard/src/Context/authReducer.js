/**
 * Auth Reducer
 * Redux-style reducer for managing authentication state
 */

import { AUTH_ACTIONS } from './authActionTypes';

export const initialState = {
    user: null,
    role: null,
    permissions: [],
    loading: true,
    session: null,
    error: null
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };

        case AUTH_ACTIONS.SET_SESSION:
            return {
                ...state,
                session: action.payload
            };

        case AUTH_ACTIONS.CLEAR_SESSION:
            return {
                ...state,
                session: null
            };

        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload
            };

        case AUTH_ACTIONS.UPDATE_USER:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload
                }
            };

        case AUTH_ACTIONS.CLEAR_USER:
            return {
                ...state,
                user: null
            };

        case AUTH_ACTIONS.SET_ROLE:
            return {
                ...state,
                role: action.payload
            };

        case AUTH_ACTIONS.CLEAR_ROLE:
            return {
                ...state,
                role: null
            };

        case AUTH_ACTIONS.SET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload
            };

        case AUTH_ACTIONS.CLEAR_PERMISSIONS:
            return {
                ...state,
                permissions: []
            };

        case AUTH_ACTIONS.SET_AUTH_DATA:
            // Set user, role, and permissions at once
            return {
                ...state,
                user: action.payload.user,
                role: action.payload.role,
                permissions: action.payload.permissions,
                loading: false,
                error: null
            };

        case AUTH_ACTIONS.CLEAR_AUTH_DATA:
            // Clear all auth data (logout)
            return {
                ...state,
                user: null,
                role: null,
                permissions: [],
                session: null,
                error: null
            };

        case AUTH_ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};
