/**
 * Auth Service - Handles all authentication and RBAC data fetching
 * Separates backend logic from React context
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Helper function to add timeout to promises
 */
const withTimeout = (promise, timeoutMs = 1000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Query timeout after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

/**
 * ✅ OPTIMIZED: Fetch user profile with role and permissions in single query
 * Replaces 3 sequential API calls with 1 optimized query
 * @param {string} userId - User ID
 * @param {string} userEmail - User email (fallback)
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const fetchUserWithRoleAndPermissions = async (userId, userEmail) => {
    try {
        console.log('🚀 Fetching user data (optimized single query)...');
        const startTime = performance.now();

        const { data, error } = await supabase
            .from('user_profiles')
            .select(`
                id,
                full_name,
                phone,
                avatar_url,
                user_roles (
                    role_id,
                    roles (
                        id,
                        name,
                        display_name,
                        description,
                        role_permissions (
                            permissions (
                                name,
                                category,
                                description
                            )
                        )
                    )
                )
            `)
            .eq('id', userId)
            .maybeSingle();

        const endTime = performance.now();

        // Check for PGRST200 error (missing foreign key relationship)
        if (error && error.code === 'PGRST200') {
            console.warn('⚠️ Foreign key relationships missing. Falling back to sequential queries...');
            console.warn('💡 Run fix_foreign_keys_complete.sql to enable optimized query');

            // Fallback to sequential queries
            return await fetchUserWithRoleAndPermissionsSequential(userId, userEmail);
        }

        if (error) {
            console.error('❌ Error fetching user data:', error);
            return { data: null, error };
        }

        console.log(`⚡ Optimized query completed in ${(endTime - startTime).toFixed(2)}ms`);

        if (!data) {
            // Profile doesn't exist
            return {
                data: null,
                error: {
                    code: 'PROFILE_NOT_FOUND',
                    message: 'User profile not found'
                }
            };
        }

        // Transform nested data structure
        const userRole = data.user_roles?.[0];
        const role = userRole?.roles;
        const rolePermissions = role?.role_permissions || [];
        const permissions = rolePermissions.map(rp => rp.permissions?.name).filter(Boolean);

        const result = {
            user: {
                id: data.id,
                email: userEmail,
                full_name: data.full_name || userEmail?.split('@')[0] || 'User',
                phone: data.phone,
                avatar_url: data.avatar_url
            },
            role: role ? {
                id: role.id,
                name: role.name,
                display_name: role.display_name,
                description: role.description
            } : null,
            permissions: permissions
        };

        console.log('✅ User data loaded:', {
            user: result.user.full_name,
            role: result.role?.display_name || 'No role',
            permissionsCount: result.permissions.length
        });

        return { data: result, error: null };

    } catch (error) {
        console.error('❌ Exception in fetchUserWithRoleAndPermissions:', error);
        console.warn('⚠️ Attempting fallback to sequential queries...');

        // Try fallback on any error
        try {
            return await fetchUserWithRoleAndPermissionsSequential(userId, userEmail);
        } catch (fallbackError) {
            console.error('❌ Fallback also failed:', fallbackError);
            return { data: null, error };
        }
    }
};

/**
 * FALLBACK: Fetch user data using sequential queries (old method)
 * Used when foreign keys are missing (PGRST200 error)
 * @param {string} userId - User ID
 * @param {string} userEmail - User email
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
const fetchUserWithRoleAndPermissionsSequential = async (userId, userEmail) => {
    try {
        console.log('🔄 Using sequential queries (fallback method)...');
        const startTime = performance.now();
        
        // Query 1: Get user profile
        const { data: profileData, error: profileError } = await fetchUserProfile(userId);
        if (profileError) {
            return { data: null, error: profileError };
        }

        // Query 2: Get user role
        const { data: roleData, error: roleError } = await fetchUserRole(userId);
        
        let role = null;
        let permissions = [];

        if (!roleError && roleData && roleData.roles) {
            role = {
                id: roleData.roles.id,
                name: roleData.roles.name,
                display_name: roleData.roles.display_name,
                description: roleData.roles.description
            };

            // Query 3: Get role permissions
            const { data: permsData, error: permsError } = await fetchRolePermissions(roleData.roles.id);
            if (!permsError && permsData) {
                permissions = permsData.map(rp => rp.permissions?.name).filter(Boolean);
            }
        }

        const result = {
            user: {
                id: userId,
                email: userEmail,
                full_name: profileData?.full_name || userEmail?.split('@')[0] || 'User',
                phone: profileData?.phone || null,
                avatar_url: profileData?.avatar_url || null
            },
            role,
            permissions
        };

        const endTime = performance.now();
        console.log(`⚡ Sequential queries completed in ${(endTime - startTime).toFixed(2)}ms`);
        console.log('✅ User data loaded (sequential):', {
            user: result.user.full_name,
            role: result.role?.display_name || 'No role',
            permissionsCount: result.permissions.length
        });

        return { data: result, error: null };

    } catch (error) {
        console.error('❌ Exception in sequential fallback:', error);
        return { data: null, error };
    }
};


export const fetchUserProfile = async (userId) => {
    try {
        const response = await withTimeout(
            supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle(),
            1000
        );

        // Check if this looks like an RLS issue
        if (!response.data && !response.error) {
            return {
                data: null,
                error: {
                    message: 'Row Level Security policy may be blocking access',
                    code: 'RLS_POLICY_VIOLATION'
                }
            };
        }

        return { data: response.data, error: response.error };

    } catch (error) {
        console.error('Error in fetchUserProfile:', error.message);

        return {
            data: null,
            error: {
                message: error.message || 'Unknown error',
                code: error.message && error.message.includes('timeout') ? 'TIMEOUT' : 'ERROR'
            }
        };
    }
};

/**
 * Create a new user profile
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const createUserProfile = async (userId, email) => {
    try {
        const { data, error } = await supabase
            .from('user_profiles')
            .insert([{
                id: userId,
                full_name: email?.split('@')[0] || 'User',
                phone: null,
                avatar_url: null,
            }])
            .select()
            .single();

        return { data, error };
    } catch (error) {
        console.error('Error in createUserProfile:', error);
        return { data: null, error };
    }
};

/**
 * Fetch user's assigned role
 * @param {string} userId - User ID
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const fetchUserRole = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select('role_id, roles(id, name, display_name, description)')
            .eq('user_id', userId)
            .maybeSingle();

        return { data, error };
    } catch (error) {
        console.error('Error in fetchUserRole:', error);
        return { data: null, error };
    }
};

/**
 * Fetch permissions for a specific role
 * @param {string} roleId - Role ID
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const fetchRolePermissions = async (roleId) => {
    try {
        const { data, error } = await supabase
            .from('role_permissions')
            .select('permissions(name, category, description)')
            .eq('role_id', roleId);

        return { data: data || [], error };
    } catch (error) {
        console.error('Error in fetchRolePermissions:', error);
        return { data: [], error };
    }
};

/**
 * Fetch all available roles
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const fetchAllRoles = async () => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('name');

        return { data: data || [], error };
    } catch (error) {
        console.error('Error in fetchAllRoles:', error);
        return { data: [], error };
    }
};

/**
 * Fetch all available permissions
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const fetchAllPermissions = async () => {
    try {
        const { data, error } = await supabase
            .from('permissions')
            .select('*')
            .order('category, name');

        return { data: data || [], error };
    } catch (error) {
        console.error('Error in fetchAllPermissions:', error);
        return { data: [], error };
    }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        console.log('🔍 Updating profile for userId:', userId);
        console.log('📝 Updates:', updates);

        // First, check if profile exists
        const { data: existingProfile, error: checkError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();

        console.log('🔍 Existing profile check:', { existingProfile, checkError });

        if (checkError) {
            console.error('❌ Error checking profile:', checkError);
            return { data: null, error: checkError };
        }

        if (!existingProfile) {
            console.error('❌ Profile not found for userId:', userId);
            return {
                data: null,
                error: {
                    message: `Profile not found for user ID: ${userId}`,
                    code: 'PROFILE_NOT_FOUND'
                }
            };
        }

        // Profile exists, proceed with update
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        console.log('✅ Update result:', { data, error });

        return { data, error };
    } catch (error) {
        console.error('❌ Error in updateUserProfile:', error);
        return { data: null, error };
    }
};

/**
 * Assign a role to a user
 * @param {string} userId - User ID
 * @param {string} roleId - Role ID
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const assignUserRole = async (userId, roleId) => {
    try {
        // First, remove any existing roles
        await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId);

        // Then assign new role
        const { data, error } = await supabase
            .from('user_roles')
            .insert([{ user_id: userId, role_id: roleId }])
            .select()
            .single();

        return { data, error };
    } catch (error) {
        console.error('Error in assignUserRole:', error);
        return { data: null, error };
    }
};

/**
 * Upload user avatar
 * @param {string} userId - User ID
 * @param {File} file - Image file
 * @returns {Promise<{data: string|null, error: object|null}>}
 */
export const uploadAvatar = async (userId, file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('user-avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('user-avatars')
            .getPublicUrl(filePath);

        return { data: publicUrl, error: null };
    } catch (error) {
        console.error('Error in uploadAvatar:', error);
        return { data: null, error };
    }
};

/**
 * Change user password
 * @param {string} newPassword - New password
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const changePassword = async (newPassword) => {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        return { data, error };
    } catch (error) {
        console.error('Error in changePassword:', error);
        return { data: null, error };
    }
};

/**
 * Alias for fetchUserProfile (for Phase 3 API consistency)
 */
export const getUserProfile = fetchUserProfile;
