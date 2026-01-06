import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import adminlogo from "../../assests/images/adminlogo.svg";
import { useAuth } from "../../Context/AuthContext.jsx";
import RoleBadge from "../../pages/Settings/components/RoleBadge";

export default function Navbar({ onMobileSidebarToggle }) {
    const navigate = useNavigate();
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, role } = useAuth();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleProfileClick = () => {
        navigate("/settings");
        setIsProfileDropdownOpen(false);
    };

    const handlePasswordChangeClick = () => {
        navigate("/settings");
        setIsProfileDropdownOpen(false);
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Logout error:", error.message);
            } else {
                setIsProfileDropdownOpen(false);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.full_name) {
            return user.full_name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    return (
        <nav className="bg-white shadow-md px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Left Side - Logo + App Name */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <img
                        src={adminlogo}
                        alt="Admin Logo"
                        className="w-12 h-12 sm:w-16 sm:h-14 md:w-[78px] md:h-[54px] object-contain"
                    />
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>
                </div>

                {/* Desktop - Profile Dropdown */}
                <div className="hidden md:block relative" ref={dropdownRef}>
                    <button
                        onClick={toggleProfileDropdown}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        aria-label="User menu"
                    >
                        {/* User Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                            <span className="text-sm">{getUserInitials()}</span>
                        </div>

                        {/* User Name and Role Badge */}
                        <div className="text-left">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.full_name || user?.email || 'User'}
                            </p>
                            {role && (
                                <div className="mt-1">
                                    <RoleBadge
                                        roleName={role.name}
                                        displayName={role.display_name}
                                        size="small"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Dropdown Arrow */}
                        <svg
                            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isProfileDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                            <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="font-medium">Profile</span>
                            </button>

                            <button
                                onClick={handlePasswordChangeClick}
                                className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span className="font-medium">Change Password</span>
                            </button>

                            <div className="border-t border-gray-200 my-1"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile - Hamburger Menu Icon (Controls Sidebar) */}
                <button
                    onClick={onMobileSidebarToggle}
                    className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                </button>
            </div>
        </nav>
    );
}