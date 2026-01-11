/**
 * Redux Store Configuration
 * Configures the Redux store with slices and middleware
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['auth/setSession'],
                // Ignore these paths in the state
                ignoredPaths: ['auth.session']
            }
        }),
    devTools: process.env.NODE_ENV !== 'production'
});

export default store;
