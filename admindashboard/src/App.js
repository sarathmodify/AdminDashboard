import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "./lib/supabaseClient";
import { setSession, setLoading, loadUserData, logout } from "./store/slices/authSlice";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProductList from "./pages/Products/ProductList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";
// Customers imports
import CustomerList from "./pages/Customers/CustomerList";
// Orders imports (Phase 1)
import OrderList from "./pages/Orders/OrderList";
import OrderDetails from "./pages/Orders/OrderDetails";
import OrderServiceTest from "./pages/Orders/OrderServiceTest";
import ComponentsShowcase from "./pages/Orders/ComponentsShowcase";
import SupabaseDebugger from "./pages/SupabaseDebugger";
import RLSDebugger from "./pages/RLSDebugger";
import GuardDemo from "./pages/GuardDemo";
import ServiceTester from "./pages/ServiceTester";
// Settings page (Phase 5)
import Settings from "./pages/Settings/Settings";

function App() {
    const dispatch = useDispatch();

    // Initialize auth on mount
    useEffect(() => {
        console.log('🔧 Initializing Redux auth...');

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log('✅ Current session:', session);
            dispatch(setSession(session));

            if (session?.user) {
                dispatch(loadUserData({
                    userId: session.user.id,
                    userEmail: session.user.email
                }));
            } else {
                dispatch(setLoading(false));
            }
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                console.log('🔄 Auth state changed:', _event);
                dispatch(setSession(session));

                if (session?.user) {
                    dispatch(loadUserData({
                        userId: session.user.id,
                        userEmail: session.user.email
                    }));
                } else {
                    dispatch(logout());
                    dispatch(setLoading(false));
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [dispatch]);

    console.log('Rendering components...');
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />

                {/* Protected routes with shared layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Products routes - Protected by permissions */}
                    <Route path="/products" element={<ProductList />} />
                    <Route
                        path="/products/add"
                        element={
                            <ProtectedRoute requiredPermissions={['can_create_products']}>
                                <ProductAdd />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/products/edit/:id"
                        element={
                            <ProtectedRoute requiredPermissions={['can_edit_products']}>
                                <ProductEdit />
                            </ProtectedRoute>
                        }
                    />

                    {/* Customers routes - Protected by permissions */}
                    <Route path="/customers" element={<CustomerList />} />

                    {/* Orders routes - Protected by permissions */}
                    <Route path="/orders-test" element={<OrderServiceTest />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route
                        path="/orders/:id"
                        element={
                            <ProtectedRoute requiredPermissions={['can_view_orders']}>
                                <OrderDetails />
                            </ProtectedRoute>
                        }
                    />

                    {/* Phase 2 - Components Showcase */}
                    <Route path="/components-showcase" element={<ComponentsShowcase />} />

                    {/* Supabase Connection Debugger */}
                    <Route path="/supabase-debug" element={<SupabaseDebugger />} />

                    {/* RLS Policy Debugger */}
                    <Route path="/rls-debug" element={<RLSDebugger />} />

                    {/* Phase 3 - Service Tester */}
                    <Route path="/service-test" element={<ServiceTester />} />

                    {/* Phase 4 - Guard Demo */}
                    <Route path="/guard-demo" element={<GuardDemo />} />

                    {/* Phase 5 - Settings Page */}
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
