import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import Welcome from "./components/Welcome";
import AddProduct from "./components/AddProduct";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import EditProduct from "./components/EditProduct";
import ProductStock from "./components/ProductStock";
import Orders from "./components/Orders";
import OrderDetails from "./components/OrderDetails";
import Catalogs from "./components/Catalogs";
import Discounts from "./components/Discounts";
import DiscountDetails from "./components/DiscountDetails";
import EditDiscount from "./components/EditDiscount";
import Customers from "./components/Customers";
import CustomerDetails from "./components/CustomerDetails";
import Shop from "./components/Shop";
import Reports from "./components/Reports";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        role={role}
        setRole={setRole}
      />
    </Router>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated, role, setRole }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    const userRole = localStorage.getItem("role") || "User";
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  // Initial redirection after login based on role
  useEffect(() => {
    if (isAuthenticated) {
      if (role === "Customer") {
        navigate("/shop");
      } else if (role === "Admin" && window.location.pathname === "/") {
        navigate("/welcome");
      }
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="App">
      {isAuthenticated && <Header onLogout={handleLogout} />}
      <div className="main-layout">
        {isAuthenticated && role !== "Customer" && (
          <div className="sidebar">
            {(role === "Admin" ||
              role === "Advanced User" ||
              role === "Simple User") && <TabBar />}
          </div>
        )}
        <div className="content">
          <Routes>
            {/* Initial landing page redirection */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  role === "Customer" ? (
                    <Navigate to="/shop" />
                  ) : (
                    <Navigate to="/welcome" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<SignIn onLogin={handleLogin} />} />
            <Route
              path="/register"
              element={<SignUp onSwitchToSignIn={() => navigate("/login")} />}
            />
            <Route
              path="/welcome"
              element={
                isAuthenticated && role !== "Customer" ? (
                  <Welcome onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/shop"
              element={
                isAuthenticated && role === "Customer" ? (
                  <Shop />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/add-product"
              element={
                isAuthenticated &&
                (role === "Admin" || role === "Advanced User") ? (
                  <AddProduct />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/view-products"
              element={
                isAuthenticated ? <Products /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/product-stock/:id"
              element={
                isAuthenticated ? <ProductStock /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/products/view/:id"
              element={
                isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                isAuthenticated &&
                (role === "Admin" || role === "Advanced User") ? (
                  <EditProduct />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/view-orders"
              element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
            />
            <Route
              path="/orders/view/:id"
              element={
                isAuthenticated ? <OrderDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/view-catalogs"
              element={
                isAuthenticated ? <Catalogs /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/view-discounts"
              element={
                isAuthenticated ? <Discounts /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/discounts/view/:id"
              element={
                isAuthenticated ? <DiscountDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/discounts/edit/:id"
              element={
                isAuthenticated &&
                (role === "Admin" || role === "Advanced User") ? (
                  <EditDiscount />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/view-customers"
              element={
                isAuthenticated ? <Customers /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/customers/view/:id"
              element={
                isAuthenticated ? <CustomerDetails /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/view-reports"
              element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
