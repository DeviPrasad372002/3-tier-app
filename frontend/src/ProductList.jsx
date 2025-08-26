// src/Products.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductList({ onAddToCart, cartCount, isLoggedIn }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/products", {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-10">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">
        🛍️ Shopping Store
      </h1>

      <div className="flex justify-between mb-4">
        {!isLoggedIn && (
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-800 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-900 transition"
          >
            🔐 Login
          </button>
        )}
        <button
          onClick={() => navigate("/cart")}
          className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          🛒 Cart: {cartCount}
        </button>
      </div>

      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {!loading && !error && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition"
            >
              <img
                src={product.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-purple-800">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold mt-2">
                ₹{product.price}
              </p>
              <button
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          !loading &&
          !error && (
            <p className="col-span-full text-center text-gray-500">
              No products available
            </p>
          )
        )}
      </div>
    </div>
  );
}

export default ProductList;
