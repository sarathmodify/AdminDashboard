import React from 'react';

/**
 * PermissionCard Component
 * Displays a permission with icon, name, and description using Tailwind CSS
 * 
 * @param {object} permission - Permission object { name, description, category }
 * @param {boolean} isGranted - Whether the permission is granted
 * @param {function} onToggle - Callback when permission is toggled (optional)
 * @param {boolean} disabled - Whether the card is disabled (default: false)
 */
const PermissionCard = ({ permission, isGranted = false, onToggle = null, disabled = false }) => {
    // Map permission categories to icons
    const getCategoryIcon = (category) => {
        const categoryIcons = {
            products: '📦',
            orders: '🛒',
            customers: '👥',
            settings: '⚙️',
            reports: '📊',
            default: '🔐'
        };
        return categoryIcons[category?.toLowerCase()] || categoryIcons.default;
    };

    // Format permission name for display
    const formatPermissionName = (name) => {
        if (!name) return '';
        // Convert "can_view_products" to "View Products"
        return name
            .replace('can_', '')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const icon = getCategoryIcon(permission.category);
    const displayName = formatPermissionName(permission.name);

    const handleClick = () => {
        if (!disabled && onToggle) {
            onToggle(permission);
        }
    };

    // Base classes
    const baseClasses = "flex gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden border-2";

    // State-based classes
    const stateClasses = isGranted
        ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50"
        : "border-gray-200 bg-white hover:border-gray-300";

    // Interactive classes
    const interactiveClasses = onToggle && !disabled
        ? "cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
        : "";

    // Disabled classes
    const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";

    // Left border accent
    const borderAccentClasses = isGranted
        ? "before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-green-500"
        : "before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gray-200";

    return (
        <div
            className={`${baseClasses} ${stateClasses} ${interactiveClasses} ${disabledClasses} ${borderAccentClasses}`}
            onClick={handleClick}
        >
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg text-2xl transition-transform duration-300 ${isGranted
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200'
                } ${onToggle && !disabled ? 'group-hover:scale-110' : ''}`}>
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 mb-2">
                    <h4 className="text-base font-semibold text-gray-900">
                        {displayName}
                    </h4>
                    {isGranted && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-semibold rounded-full whitespace-nowrap">
                            ✓ Granted
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                    {permission.description || 'No description available'}
                </p>

                {/* Category Badge */}
                <span className={`inline-block px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded ${isGranted
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {permission.category}
                </span>
            </div>
        </div>
    );
};

export default PermissionCard;
