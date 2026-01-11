import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchRoles, fetchPermissions, getRolePermissions, updateRolePermissions } from '../../../services/roleService';
import { assignUserRole } from '../../../services/authService';
import { getUsersWithRoles } from '../../../services/roleService';
import RoleBadge from './RoleBadge';

/**
 * PermissionChangeForm Component
 * Admin-only component for managing user roles and role permissions
 * Table-style UI matching Figma design
 */
const PermissionChangeForm = () => {
    const { user, role } = useAuth();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [rolePermissionsMap, setRolePermissionsMap] = useState({}); // Map of roleId -> permissions[]
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch initial data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rolesRes, permsRes, usersRes] = await Promise.all([
                fetchRoles(),
                fetchPermissions(),
                getUsersWithRoles()
            ]);
            console.log(rolesRes, permsRes, usersRes, 'whole map data');
            if (rolesRes.data) {
                setRoles(rolesRes.data);
                // Load permissions for all roles
                await loadAllRolePermissions(rolesRes.data);
            }
            if (permsRes.data) setPermissions(permsRes.data);
            if (usersRes?.data) setUsers(usersRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setMessage({ type: 'error', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    // Load permissions for all roles
    const loadAllRolePermissions = async (rolesList) => {
        const permissionsMap = {};
        for (const r of rolesList) {
            const { data, error } = await getRolePermissions(r.id);
            console.log(data, 'role permissions');
            if (!error && data) {
                permissionsMap[r.id] = data; // it return object of array of permission id
            } else {
                permissionsMap[r.id] = [];
            }
        }
        console.log(permissionsMap, 'permissions map');
        setRolePermissionsMap(permissionsMap);
    };

    const handleAssignRole = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedRole) {
            setMessage({ type: 'error', text: 'Please select both user and role' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        console.log(selectedUser, selectedRole, 'selected user and role');
        try {
            const { error } = await assignUserRole(selectedUser, selectedRole);
            if (error) throw error;

            setMessage({ type: 'success', text: 'Role assigned successfully!' });
            setSelectedUser('');
            setSelectedRole('');

            const usersRes = await getUsersWithRoles();
            console.log(usersRes, 'usersres');
            if (usersRes.data) setUsers(usersRes.data);
        } catch (error) {
            console.error('Error assigning role:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to assign role' });
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionToggle = async (roleId, permission) => {
        const currentPerms = rolePermissionsMap[roleId] || [];
        const exists = currentPerms.find(p => p.id === permission.id);

        let newPerms;
        if (exists) {
            newPerms = currentPerms.filter(p => p.id !== permission.id);
        } else {
            newPerms = [...currentPerms, permission];
        }

        // Update local state immediately for responsive UI
        setRolePermissionsMap(prev => ({
            ...prev,
            [roleId]: newPerms
        }));

        // Save to database
        try {
            const permissionIds = newPerms.map(p => p.id);
            const { error } = await updateRolePermissions(roleId, permissionIds);
            if (error) throw error;

            setMessage({ type: 'success', text: 'Permission updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 2000);
        } catch (error) {
            console.error('Error updating permission:', error);
            setMessage({ type: 'error', text: 'Failed to update permission' });
            // Revert on error
            setRolePermissionsMap(prev => ({
                ...prev,
                [roleId]: currentPerms
            }));
        }
    };

    // Group permissions by category
    const groupedPermissions = permissions.reduce((acc, perm) => {
        const category = perm.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(perm);
        return acc;
    }, {});

    // Get category icon
    const getCategoryIcon = (category) => {
        const icons = {
            products: '📦',
            orders: '🛒',
            customers: '👥',
            reports: '📊',
            settings: '⚙️',
            other: '🔐'
        };
        return icons[category] || icons.other;
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Role & Permission Management</h2>
                <p className="text-sm text-gray-600">Manage user roles and role permissions (Admin Only)</p>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-500'
                    : 'bg-red-100 text-red-800 border border-red-500'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Your Role Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
                <h3 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-6">
                    <span className="text-2xl">👤</span>
                    Your Role
                </h3>
                <div>
                    {role ? (
                        <RoleBadge roleName={role.name} displayName={role.display_name} size="large" />
                    ) : (
                        <p className="text-gray-500">No role assigned</p>
                    )}
                </div>
            </div>

            {/* Assign User Role Section */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
                <h3 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-6">
                    <span className="text-2xl">👥</span>
                    Assign User Role
                </h3>
                <form onSubmit={handleAssignRole} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="user-select" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select User
                            </label>
                            <select
                                id="user-select"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300"
                            >
                                <option value="">Choose a user...</option>
                                {users.map((userRole) => (
                                    <option key={userRole.id} value={userRole.id}>
                                        {userRole?.full_name || userRole.id}
                                        {userRole.role && ` (${userRole.role.display_name})`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="role-select" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Role
                            </label>
                            <select
                                id="role-select"
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300"
                            >
                                <option value="">Choose a role...</option>
                                {roles.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.display_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedUser || !selectedRole}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? 'Assigning...' : '✓ Assign Role'}
                    </button>
                </form>
            </div>

            {/* Manage Role Permissions Section - Table Style */}
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
                <h3 className="flex items-center gap-3 text-lg font-bold text-gray-900 mb-6">
                    <span className="text-2xl">🔐</span>
                    Manage Role Permissions
                </h3>

                {roles.length > 0 && permissions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-bold text-gray-700 text-sm">Actions</th>
                                    {roles.map((r) => (
                                        <th key={r.id} className="text-center py-4 px-4 font-bold text-gray-700 text-sm">
                                            {r.display_name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {Object.entries(groupedPermissions).map(([category, perms]) => (
                                    <React.Fragment key={category}>
                                        {/* Category Header Row */}
                                        <tr className="bg-gray-50">
                                            <td colSpan={roles.length + 1} className="py-3 px-4">
                                                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                                                    <span className="text-lg">{getCategoryIcon(category)}</span>
                                                    <span className="uppercase tracking-wide">
                                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Permission Rows */}
                                        {perms.map((perm) => (
                                            <tr key={perm.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {perm.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                    </div>
                                                    {perm.description && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            {perm.description}
                                                        </div>
                                                    )}
                                                </td>
                                                {roles.map((r) => {
                                                    const rolePerms = rolePermissionsMap[r.id] || [];
                                                    const isChecked = rolePerms.some(p => p.id === perm.id);
                                                    return (
                                                        <td key={r.id} className="py-4 px-4 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => handlePermissionToggle(r.id, perm)}
                                                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                                            />
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Loading permissions...
                    </div>
                )}
            </div>
        </div>
    );
};

export default PermissionChangeForm;
