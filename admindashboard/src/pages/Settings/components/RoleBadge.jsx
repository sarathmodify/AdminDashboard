import React from 'react';

/**
 * RoleBadge Component
 * Displays a user's role with appropriate styling using Tailwind CSS
 * 
 * @param {string} roleName - Role name (admin, manager, staff)
 * @param {string} displayName - Display name for the role
 * @param {string} size - Badge size: 'small', 'medium', 'large' (default: 'medium')
 */
const RoleBadge = ({ roleName, displayName, size = 'medium' }) => {
    // Map role names to Tailwind gradient classes
    const getRoleClasses = (role) => {
        const roleClasses = {
            admin: 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30',
            manager: 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-500/30',
            staff: 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/30',
            default: 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-500/30'
        };
        return roleClasses[role?.toLowerCase()] || roleClasses.default;
    };

    // Map role names to icons
    const getRoleIcon = (role) => {
        const roleIcons = {
            admin: '👑',
            manager: '⚡',
            staff: '👤',
            default: '🔹'
        };
        return roleIcons[role?.toLowerCase()] || roleIcons.default;
    };

    // Map size to Tailwind classes
    const getSizeClasses = (size) => {
        const sizeClasses = {
            small: 'px-2 py-1 text-xs gap-1',
            medium: 'px-3 py-1.5 text-sm gap-1.5',
            large: 'px-4 py-2 text-base gap-2'
        };
        return sizeClasses[size] || sizeClasses.medium;
    };

    const colorClasses = getRoleClasses(roleName);
    const sizeClasses = getSizeClasses(size);
    const icon = getRoleIcon(roleName);

    return (
        <span className={`inline-flex items-center ${sizeClasses} rounded-full font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap ${colorClasses}`}>
            <span className="text-current">{icon}</span>
            <span className="capitalize">{displayName || roleName}</span>
        </span>
    );
};

export default RoleBadge;
