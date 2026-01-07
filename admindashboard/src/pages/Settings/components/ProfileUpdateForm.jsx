import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../Context/AuthContext.jsx';
import { updateUserProfile, uploadAvatar, changePassword } from '../../../services/authService';

/**
 * ProfileUpdateForm Component
 * Allows users to update their profile information using Tailwind CSS
 */
const ProfileUpdateForm = () => {
    const { user, refreshUser } = useAuth();

    const [formData, setFormData] = useState({
        full_name: '',
        phone: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    // Initialize form with current user data
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: user.phone || ''
            });
            setAvatarPreview(user.avatar_url);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Please select an image file' });
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let avatarUrl = user?.avatar_url;

            if (avatarFile) {
                const { data: uploadedUrl, error: uploadError } = await uploadAvatar(user.id, avatarFile);
                if (uploadError) {
                    throw new Error('Failed to upload avatar: ' + uploadError.message);
                }
                avatarUrl = uploadedUrl;
            }

            const updates = {
                ...formData,
                avatar_url: avatarUrl
            };

            console.log(updates, ':updates', user.id)

            const { error: updateError } = await updateUserProfile(user.id, updates);
            if (updateError) {
                throw new Error('Failed to update profile: ' + updateError.message);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            await refreshUser();
            setAvatarFile(null);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await changePassword(passwordData.newPassword);
            if (error) {
                throw new Error(error.message);
            }

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setShowPasswordModal(false);
            setPasswordData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Information</h2>
                <p className="text-sm text-gray-600">Update your personal information and avatar</p>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                {/* Avatar Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 pb-8 border-b-2 border-gray-100">
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg flex-shrink-0">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl md:text-4xl font-bold">
                                {formData.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <label htmlFor="avatar-upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold cursor-pointer shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                            📷 Change Avatar
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                        <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF (max 2MB)</p>
                    </div>
                </div>

                {/* Email (Read-only) */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                {/* Full Name */}
                <div className="mb-6">
                    <label htmlFor="full_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <input
                        id="full_name"
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Phone */}
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        placeholder="+1-555-1234"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t-2 border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-md shadow-green-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? 'Saving...' : '💾 Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                        🔒 Change Password
                    </button>
                </div>
            </form>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 md:p-6"
                    onClick={() => setShowPasswordModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors duration-200"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    New Password *
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileUpdateForm;
