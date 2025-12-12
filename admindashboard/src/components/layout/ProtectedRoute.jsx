import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    console.log(session, 'session')
    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false); // Done loading
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            console.log(_event, 'session1')
            setLoading(false);
        });
        console.log(subscription, 'subscription')
        // Cleanup subscription
        return () => subscription.unsubscribe();
    }, []);

    // Show loading state while checking session
    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }
    // Redirect if no session
    if (!session) {
        return <Navigate to="/" replace={true} />;
    }
    return children;
};

export default ProtectedRoute;