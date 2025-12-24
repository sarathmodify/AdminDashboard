/**
 * Pagination Component
 * Handles page navigation for orders list
 */

import React from 'react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    // Don't show pagination if only one page or no pages
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        onPageChange(page);
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show subset with ellipsis
            if (currentPage <= 3) {
                // Near start
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near end
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Middle
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="bg-white rounded-2xl shadow-lg px-6 py-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-gray-800">{currentPage}</span> of{' '}
                    <span className="font-semibold text-gray-800">{totalPages}</span>
                </div>

                {/* Page Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Previous</span>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {pageNumbers.map((page, index) => {
                            if (page === '...') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="px-3 py-2 text-gray-400"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`
                                        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                        ${currentPage === page
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
