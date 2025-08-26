import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductList from "./ProductList";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Login from "./Login";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setCartItems(data);
      setCartCount(data.reduce((sum, item) => sum + (item.quantity || 0), 0));
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      fetchCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/products"
        element={
          isLoggedIn ? (
            <ProductList
              onAddToCart={handleAddToCart}
              cartCount={cartCount}
              isLoggedIn={isLoggedIn}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/cart"
        element={
          isLoggedIn ? (
            <Cart cartItems={cartItems} onRemove={handleRemoveFromCart} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/checkout"
        element={isLoggedIn ? <Checkout /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
      />
    </Routes>
  );
}

export default App;
