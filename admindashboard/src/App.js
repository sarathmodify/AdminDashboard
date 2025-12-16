import Login from "./pages/Login/Login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ManageProducts from "./pages/Products/manage/manage";
import ProductList from "./pages/Products/ProductList";
import ProductAdd from "./pages/Products/ProductAdd";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <ProductAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/manage"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
