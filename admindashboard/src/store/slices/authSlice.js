/**
 * Auth Slice - Redux Toolkit
 * Manages authentication state with async thunks for API calls
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';

// Initial state
const initialState = {
    user: null,
    role: null,
    permissions: [],
    session: null,
    loading: true,
    error: null
};

/**
 * Async Thunk: Load User Data
 * Fetches user profile, role, and permissions
 */
export const loadUserData = createAsyncThunk(
    'auth/loadUserData',
    async ({ userId, userEmail }, { rejectWithValue }) => {
        try {
            console.log('🚀 Fetching user data (Redux)...', userId);
            const startTime = performance.now();

            // Step 1: Get user profile
            const { data: profileData, error: profileError } = await authService.fetchUserProfile(userId);

            // Handle profile errors
            if (profileError) {
                if (profileError.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                    console.log('📝 Creating user profile...');
                    await authService.createUserProfile(userId, userEmail);
                    // Retry
                    const retry = await authService.fetchUserProfile(userId);
                    if (retry.error) throw retry.error;
                    profileData = retry.data;
                } else if (profileError.code === 'RLS_POLICY_VIOLATION' || profileError.code === 'TIMEOUT') {
                    console.error('Profile fetch error:', profileError.message);
                    // Return fallback data
                    return {
                        user: {
                            id: userId,
                            email: userEmail,
                            full_name: userEmail?.split('@')[0] || 'User',
                            phone: null,
                            avatar_url: null
                        },
                        role: null,
                        permissions: []
                    };
                } else {
                    throw profileError;
                }
            }

            // Prepare user profile
            const userProfile = {
                id: userId,
                email: userEmail,
                full_name: profileData?.full_name || userEmail?.split('@')[0] || 'User',
                phone: profileData?.phone || null,
                avatar_url: profileData?.avatar_url || null,
            };

            // Step 2: Get user role
            const { data: roleData, error: roleError } = await authService.fetchUserRole(userId);

            if (roleError || !roleData || !roleData.roles) {
                console.log('⚠️ No role assigned');
                return {
                    user: userProfile,
                    role: null,
                    permissions: []
                };
            }

            const roleInfo = {
                name: roleData.roles.name,
                display_name: roleData.roles.display_name,
                description: roleData.roles.description,
            };

            // Step 3: Get role permissions
            const { data: permsData, error: permsError } = await authService.fetchRolePermissions(roleData.roles.id);

            let permissions = [];
            if (!permsError && permsData && permsData.length > 0) {
                permissions = permsData
                    .map(rp => rp.permissions?.name)
                    .filter(Boolean);
            }

            const endTime = performance.now();
            console.log(`✅ User data loaded in ${(endTime - startTime).toFixed(2)}ms`, {
                user: userProfile.full_name,
                role: roleInfo.display_name,
                permissions: permissions.length
            });

            return {
                user: userProfile,
                role: roleInfo,
                permissions
            };

        } catch (error) {
            console.error('❌ Error loading user data:', error);
            return rejectWithValue(error.message || 'Failed to load user data');
        }
    }
);

/**
 * Auth Slice
 */
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set session
        setSession: (state, action) => {
            state.session = action.payload;
        },

        // Clear session
        clearSession: (state) => {
            state.session = null;
        },

        // Set loading
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Logout
        logout: (state) => {
            state.user = null;
            state.role = null;
            state.permissions = [];
            state.session = null;
            state.error = null;
            state.loading = false;
        },

        // Update user
        updateUser: (state, action) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload
                };
            }
        },

        // Clear error
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Load user data - pending
            .addCase(loadUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // Load user data - fulfilled
            .addCase(loadUserData.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.role = action.payload.role;
                state.permissions = action.payload.permissions;
                state.loading = false;
                state.error = null;
            })
            // Load user data - rejected
            .addCase(loadUserData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Failed to load user data:', action.payload);
            });
    }
});

// Export actions
export const {
    setSession,
    clearSession,
    setLoading,
    logout,
    updateUser,
    clearError
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
