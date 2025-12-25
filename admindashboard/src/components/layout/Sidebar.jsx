import { computeHeadingLevel } from "@testing-library/dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState("Dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            name: "Administration",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            subItems: [
                {
                    name: "Profile", path: "/admin/profile", icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )
                },
                {
                    name: "Employee", path: "/admin/emp", icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    )
                },
                {
                    name: "Permission", path: "/admin/permission", icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    )
                }
            ]
        },
        {
            name: "Customer",
            path: "/customers",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            name: "Products",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            subItems: [
                {
                    name: "Product List", path: "/products", icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    )
                }
            ]
        },
        {
            name: "Orders",
            path: "/orders",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            name: "Transaction Details",
            path: "/transactions",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            )
        }
    ];

    const handleMenuClick = (itemName, itemPath) => {
        setActiveItem(itemName);
        if (itemPath) {
            navigate(itemPath);
        }
    };
    console.log(expandedMenus, "expandedMenus")
    const toggleSubmenu = (menuName) => {
        console.log(menuName, "menuname")
        setExpandedMenus(prev => (
            console.log(prev[menuName], "prev"),
            {
                ...prev,
                [menuName]: !prev[menuName]
            }));
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        // Close all submenus when collapsing
        if (!isCollapsed) {
            setExpandedMenus({});
        }
    };

    return (
        <aside
            className={`${isCollapsed ? "w-20" : "w-64"
                } bg-white h-screen shadow-lg flex flex-col transition-all duration-300 ease-in-out`}
        >
            {/* Logo Section with Collapse Button */}
            <div className="p-6 flex items-center justify-between border-b border-gray-100 relative">
                {!isCollapsed && (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                        <span className="text-white text-3xl font-bold">M</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg mx-auto">
                        <span className="text-white text-xl font-bold">M</span>
                    </div>
                )}

                {/* Collapse/Expand Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            {/* Main Menu Item */}
                            <button
                                onClick={() => {
                                    if (item.subItems) {
                                        toggleSubmenu(item.name);
                                    } else {
                                        handleMenuClick(item.name, item.path);
                                    }
                                }}
                                className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-between"
                                    } px-4 py-3 rounded-xl transition-all duration-200 ${activeItem === item.name && !item.subItems
                                        ? "bg-purple-100 text-purple-700 font-semibold shadow-sm"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                title={isCollapsed ? item.name : ""}
                            >
                                <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
                                    <span className="text-gray-700">{item.icon}</span>
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium">{item.name}</span>
                                    )}
                                </div>

                                {/* Chevron for items with submenus */}
                                {!isCollapsed && item.subItems && (
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.name] ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </button>

                            {/* Submenu Items */}
                            {!isCollapsed && item.subItems && (
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus[item.name] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <ul className="mt-1 ml-4 space-y-1">
                                        {item.subItems.map((subItem) => (
                                            <li key={subItem.name}>
                                                <button
                                                    onClick={() => handleMenuClick(subItem.name, subItem.path)}
                                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${activeItem === subItem.name
                                                        ? "bg-purple-50 text-purple-700 font-medium"
                                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                        }`}
                                                >
                                                    <span className="text-gray-500">{subItem.icon}</span>
                                                    <span className="text-sm">{subItem.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section with Dropdown - MOBILE ONLY */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-100 lg:hidden">
                    <button
                        onClick={() => toggleSubmenu('UserProfile')}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">
                            AD
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-sm font-semibold">Admin User</p>
                            <p className="text-xs text-purple-100">admin@dashboard.com</p>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${expandedMenus['UserProfile'] ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Profile Dropdown Menu */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedMenus['UserProfile'] ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div className="space-y-1">
                            <button
                                onClick={() => console.log('Navigate to Profile')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm font-medium">Profile</span>
                            </button>

                            <button
                                onClick={() => console.log('Navigate to Change Password')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <span className="text-sm font-medium">Change Password</span>
                            </button>

                            <div className="border-t border-gray-200 my-1"></div>

                            <button
                                onClick={() => console.log('Logout')}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Collapsed User Avatar - MOBILE ONLY */}
            {isCollapsed && (
                <div className="p-4 border-t border-gray-100 flex justify-center lg:hidden">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md">
                        AD
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;