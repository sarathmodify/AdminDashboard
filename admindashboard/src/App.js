import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ManageProducts from "./pages/Products/manage/manage";
import ProductList from "./pages/Products/ProductList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";
// Orders imports (Phase 1)
import OrderList from "./pages/Orders/OrderList";
import OrderDetails from "./pages/Orders/OrderDetails";
import OrderServiceTest from "./pages/Orders/OrderServiceTest";
import ComponentsShowcase from "./pages/Orders/ComponentsShowcase";

function App() {
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
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductAdd />} />
          <Route path="/products/edit/:id" element={<ProductEdit />} />
          <Route path="/products/manage" element={<ManageProducts />} />

          {/* Orders routes (Phase 1 - Testing) */}
          <Route path="/orders-test" element={<OrderServiceTest />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Phase 2 - Components Showcase */}
          <Route path="/components-showcase" element={<ComponentsShowcase />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
