import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AccessDenied from "../../pages/AccessDenied";
import Spinner from "../common/Spinner";

/**
 * Enhanced ProtectedRoute Component
 * Protects routes based on authentication, roles, and permissions
 * 
 * NOTE: Auth initialization happens in App.js (once)
 * ProtectedRoute only CHECKS the Redux state
 * 
 * @param {React.ReactNode} children - The protected content
 * @param {string[]} allowedRoles - Optional: Array of role names that can access
 * @param {string[]} requiredPermissions - Optional: Array of permission names required
 * @param {boolean} requireAllPermissions - If true, user must have ALL permissions
 */
const ProtectedRoute = ({
    children,
    allowedRoles = null,
    requiredPermissions = null,
    requireAllPermissions = true
}) => {
    // Get auth state from Redux (managed by App.js)
    const { session, role, hasAllPermissions, hasAnyPermission, loading } = useAuth();

    // Show loading spinner only during initial auth (App.js)
    if (loading) {
        return <Spinner message="Loading..." />;
    }

    // Redirect if not authenticated
    if (!session) {
        return <Navigate to="/" replace={true} />;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        if (!role) {
            return <AccessDenied />;
        }

        const hasAllowedRole = allowedRoles.includes(role.name);
        if (!hasAllowedRole) {
            return <AccessDenied />;
        }
    }

    // Check permission-based access
    if (requiredPermissions && requiredPermissions.length > 0) {
        const hasRequiredPermissions = requireAllPermissions
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions);

        if (!hasRequiredPermissions) {
            return <AccessDenied />;
        }
    }

    // User is authenticated and authorized
    return children;
};

export default ProtectedRoute;