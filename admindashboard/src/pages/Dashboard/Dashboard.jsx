import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import SummaryWidget from '../../components/dashboard/SummaryWidget';
import SalesChart from '../../components/dashboard/SalesChart';
import RecentOrdersTable from '../../components/dashboard/RecentOrdersTable';

export default function Dashboard() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    // Summary widget data
    const summaryData = [
        {
            title: 'Total Orders',
            value: '1,234',
            gradient: 'from-blue-500 to-blue-600',
            trend: 'up',
            trendValue: '+12.5%',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            title: 'Total Customers',
            value: '856',
            gradient: 'from-purple-500 to-purple-600',
            trend: 'up',
            trendValue: '+8.2%',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            title: "Today's Sales",
            value: '$12,450',
            gradient: 'from-green-500 to-green-600',
            trend: 'up',
            trendValue: '+15.3%',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Out of Stock',
            value: '23',
            gradient: 'from-orange-500 to-red-500',
            trend: 'down',
            trendValue: '-5.1%',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        }
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}

            {/* Sidebar - Hidden on mobile, slide-in when toggled */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                transform transition-transform duration-300 ease-in-out
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Navbar with sidebar toggle function passed as prop */}
                <Navbar onMobileSidebarToggle={toggleMobileSidebar} />

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
                        {/* Page Header */}
                        <div className="mb-6 sm:mb-8 animate-fadeIn">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Dashboard</h1>
                            <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your store today.</p>
                        </div>

                        {/* Summary Widgets Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fadeIn">
                            {summaryData.map((widget, index) => (
                                <div
                                    key={widget.title}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className="animate-fadeIn"
                                >
                                    <SummaryWidget {...widget} />
                                </div>
                            ))}
                        </div>

                        {/* Sales Chart */}
                        <div className="mb-6 sm:mb-8 animate-fadeIn" style={{ animationDelay: '400ms' }}>
                            <SalesChart />
                        </div>

                        {/* Recent Orders Table */}
                        <div className="animate-fadeIn mb-6" style={{ animationDelay: '500ms' }}>
                            <RecentOrdersTable />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}