import React from 'react';

const SummaryWidget = ({ title, value, icon, gradient, trend, trendValue }) => {
    return (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${gradient}`}></div>

            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            {title}
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-300">
                            {value}
                        </h3>
                    </div>

                    <div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                        <div className="w-5 h-5 sm:w-6 sm:h-6">
                            {icon}
                        </div>
                    </div>
                </div>

                {trend && (
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trend === 'up'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {trend === 'up' ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            <span>{trendValue}</span>
                        </div>
                        <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SummaryWidget;
