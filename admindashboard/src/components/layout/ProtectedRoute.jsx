import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AccessDenied from "../../pages/AccessDenied";
import Spinner from "../common/Spinner";

/**
 * Enhanced ProtectedRoute Component
 * Protects routes based on authentication, roles, and permissions
 * 
 * @param {React.ReactNode} children - The protected content
 * @param {string[]} allowedRoles - Optional: Array of role names that can access (e.g., ['admin', 'manager'])
 * @param {string[]} requiredPermissions - Optional: Array of permission names required (e.g., ['can_edit_products'])
 * @param {boolean} requireAllPermissions - If true, user must have ALL permissions. If false, needs ANY (default: true)
 */
const ProtectedRoute = ({
    children,
    allowedRoles = null,
    requiredPermissions = null,
    requireAllPermissions = true
}) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const { role, hasAllPermissions, hasAnyPermission, loading: authLoading } = useAuth();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Show loading state while checking session or auth context
    if (loading || authLoading) {
        return <Spinner message="Loading..." />;
    }

    // Redirect if no session (not authenticated)
    if (!session) {
        return <Navigate to="/" replace={true} />;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0) {
        if (!role) {
            // User has no role assigned
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