import { useState } from "react";
import adminlogo from "../../assests/images/adminlogo.svg";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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

                {/* Desktop - Login/Logout Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="px-4 lg:px-6 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200">
                        Login
                    </button>
                    <button className="px-4 lg:px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                        Logout
                    </button>
                </div>

                {/* Mobile - Hamburger Menu Icon */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Menu - Dropdown */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col gap-3 pb-4">
                    <button className="w-full px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200 text-center">
                        Login
                    </button>
                    <button className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}