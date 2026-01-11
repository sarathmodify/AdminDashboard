import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProfileUpdateForm from './components/ProfileUpdateForm';
import PermissionChangeForm from './components/PermissionChangeForm';

/**
 * Settings Page Component
 * Main settings page with tabbed navigation using Tailwind CSS
 * - Profile Tab: Available to all users
 * - Permissions Tab: Only visible to admins
 */
const Settings = () => {
    const { hasRole } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const isAdmin = hasRole('admin');

    // Define tabs based on user role
    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤', visible: true },
        { id: 'permissions', label: 'Permissions', icon: '🔐', visible: isAdmin }
    ].filter(tab => tab.visible); // Only show tabs user has access to

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3 mb-2">
                            ⚙️ Settings
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            Manage your account settings and preferences
                        </p>
                    </div>
                </div>

                {/* Tab Navigation - Only show tabs user has access to */}
                <div className="bg-white p-2 rounded-xl shadow-md mb-6 flex gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-fadeIn">
                    {activeTab === 'profile' && (
                        <div>
                            <ProfileUpdateForm />
                        </div>
                    )}

                    {activeTab === 'permissions' && isAdmin && (
                        <div>
                            <PermissionChangeForm />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
