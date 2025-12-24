import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Navbar */}
                <Navbar onMobileSidebarToggle={toggleMobileSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
