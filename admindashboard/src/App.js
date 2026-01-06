import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
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
