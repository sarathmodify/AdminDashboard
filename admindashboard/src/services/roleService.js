/**
 * Role Service - Handles role and permission management operations
 * Separates role/permission logic from components
 */

import { supabase } from '../lib/supabaseClient';

/**
 * Fetch all roles from database
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const fetchRoles = async () => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching roles:', error);
            return { data: [], error };
        }

        return { data: data || [], error: null };
    } catch (error) {
        console.error('Exception in fetchRoles:', error);
        return { data: [], error };
    }
};

/**
 * Fetch all permissions from database
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const fetchPermissions = async () => {
    try {
        const { data, error } = await supabase
            .from('permissions')
            .select('*')
            .order('category, name');

        if (error) {
            console.error('Error fetching permissions:', error);
            return { data: [], error };
        }

        return { data: data || [], error: null };
    } catch (error) {
        console.error('Exception in fetchPermissions:', error);
        return { data: [], error };
    }
};

/**
 * Get all permissions for a specific role
 * @param {string} roleId - Role ID
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const getRolePermissions = async (roleId) => {
    try {
        const { data, error } = await supabase
            .from('role_permissions')
            .select(`
                permission_id,
                permissions (
                    id,
                    name,
                    description,
                    category
                )
            `)
            .eq('role_id', roleId);

        if (error) {
            console.error('Error fetching role permissions:', error);
            return { data: [], error };
        }

        // Flatten the data structure
        const permissions = data?.map(rp => rp.permissions).filter(Boolean) || [];

        return { data: permissions, error: null };
    } catch (error) {
        console.error('Exception in getRolePermissions:', error);
        return { data: [], error };
    }
};

/**
 * Update permissions for a specific role (Admin only)
 * This replaces all existing permissions with the new set
 * @param {string} roleId - Role ID
 * @param {string[]} permissionIds - Array of permission IDs to assign
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export const updateRolePermissions = async (roleId, permissionIds) => {
    try {
        // Step 1: Delete existing permissions for this role
        const { error: deleteError } = await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId);

        if (deleteError) {
            console.error('Error deleting old permissions:', deleteError);
            return { success: false, error: deleteError };
        }

        // Step 2: Insert new permissions
        if (permissionIds && permissionIds.length > 0) {
            const permissionsToInsert = permissionIds.map(permissionId => ({
                role_id: roleId,
                permission_id: permissionId
            }));

            const { error: insertError } = await supabase
                .from('role_permissions')
                .insert(permissionsToInsert);

            if (insertError) {
                console.error('Error inserting new permissions:', insertError);
                return { success: false, error: insertError };
            }
        }

        return { success: true, error: null };
    } catch (error) {
        console.error('Exception in updateRolePermissions:', error);
        return { success: false, error };
    }
};

/**
 * Get role details with its permissions
 * @param {string} roleId - Role ID
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const getRoleWithPermissions = async (roleId) => {
    try {
        // Get role details
        const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('*')
            .eq('id', roleId)
            .single();

        if (roleError) {
            console.error('Error fetching role:', roleError);
            return { data: null, error: roleError };
        }

        // Get role permissions
        const { data: permissions, error: permsError } = await getRolePermissions(roleId);

        if (permsError) {
            return { data: roleData, error: permsError };
        }

        return {
            data: {
                ...roleData,
                permissions
            },
            error: null
        };
    } catch (error) {
        console.error('Exception in getRoleWithPermissions:', error);
        return { data: null, error };
    }
};

/**
 * Get all users with their assigned roles
 * Uses manual join approach (no foreign key required)
 * @returns {Promise<{data: array, error: object|null}>}
 */
export const getUsersWithRoles = async () => {
    try {
        console.log('🔍 Fetching all users with roles...');

        // Step 1: Get all user profiles
        const { data: profiles, error: profilesError } = await supabase
            .from('user_profiles')
            .select('id, full_name, phone, avatar_url');

        if (profilesError) {
            console.error('❌ Error fetching profiles:', profilesError);
            return { data: [], error: profilesError };
        }

        console.log('📊 Profiles fetched:', profiles?.length);

        // Step 2: Get all user roles
        const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select(`
                user_id,
                role_id,
                roles (
                    id,
                    name,
                    display_name
                )
            `);

        if (rolesError) {
            console.error('❌ Error fetching user roles:', rolesError);
            return { data: [], error: rolesError };
        }

        console.log('📊 User roles fetched:', userRoles?.length);

        // Step 3: Manually join profiles with roles
        const users = profiles?.map(profile => {
            const userRole = userRoles?.find(ur => ur.user_id === profile.id);
            return {
                id: profile.id,
                full_name: profile.full_name,
                phone: profile.phone,
                avatar_url: profile.avatar_url,
                role: userRole?.roles || null
            };
        }) || [];

        console.log('✅ Users with roles:', users);
        console.log('📈 Total users returned:', users.length);

        return { data: users, error: null };
    } catch (error) {
        console.error('❌ Exception in getUsersWithRoles:', error);
        return { data: [], error };
    }
};

/**
 * Create a new role
 * @param {object} roleData - Role data (name, display_name, description)
 * @returns {Promise<{data: object|null, error: object|null}>}
 */
export const createRole = async (roleData) => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .insert([roleData])
            .select()
            .single();

        if (error) {
            console.error('Error creating role:', error);
            return { data: null, error };
        }

        return { data, error: null };
    } catch (error) {
        console.error('Exception in createRole:', error);
        return { data: null, error };
    }
};

/**
 * Delete a role (Admin only)
 * Note: This will cascade delete user_roles and role_permissions
 * @param {string} roleId - Role ID
 * @returns {Promise<{success: boolean, error: object|null}>}
 */
export const deleteRole = async (roleId) => {
    try {
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', roleId);

        if (error) {
            console.error('Error deleting role:', error);
            return { success: false, error };
        }

        return { success: true, error: null };
    } catch (error) {
        console.error('Exception in deleteRole:', error);
        return { success: false, error };
    }
};
