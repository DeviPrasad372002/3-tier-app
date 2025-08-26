import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    full_name: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });

  // Load cart data from backend via Nginx proxy (/api)
  useEffect(() => {
    fetch("/api/cart", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load cart");
        try {
          return await res.json();
        } catch {
          return [];
        }
      })
      .then((data) => {
        if (!data || data.length === 0) {
          alert("Your cart is empty.");
          navigate("/cart");
        } else {
          setCartItems(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching cart:", err);
        alert("Unable to load cart. Please try again.");
      });
  }, [navigate]);

  // Handle form input change
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Submit order to backend via Nginx proxy (/api)
  function handleSubmit(e) {
    e.preventDefault();

    const orderData = {
      ...formData,
      items: cartItems.map(({ product_id, quantity }) => ({
        product_id,
        quantity,
      })),
    };

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(orderData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Checkout failed");
        return await res.json();
      })
      .then((result) => {
        console.log("Checkout response:", result);
        alert("✅ Order placed successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Checkout error:", err);
        alert("❌ Failed to place order. Please try again.");
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-green-100 p-10">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        📦 Checkout
      </h1>

      {/* Order Summary */}
      <div className="max-w-xl mx-auto bg-white p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-bold mb-2">Your Order</h2>
        {cartItems.map((item) => (
          <div
            key={item.product_id || item.name}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        {["full_name", "street", "city", "state", "postal_code", "phone"].map(
          (field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          )
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-800"
        >
          Confirm Purchase
        </button>
      </form>
    </div>
  );
}

export default Checkout;
