// src/Cart.jsx
import { useNavigate } from "react-router-dom";

function Cart({ cartItems, setCartItems, onRemove }) {
  const navigate = useNavigate();

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to modify your cart.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to remove product: ${productId}`);
      }

      // Update UI
      setCartItems((prev) => prev.filter((item) => item.product_id !== productId));
      if (onRemove) onRemove(productId);
    } catch (err) {
      console.error(err);
      alert("Error removing item from cart.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 to-orange-100 p-10">
      <h1 className="text-3xl font-bold text-center text-orange-700 mb-6">
        🛒 Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md">
          {cartItems.map((item) => (
            <div
              key={item.product_id}
              className="mb-4 border-b pb-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name || "Product"}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="text-lg font-medium">{item.name || "Unnamed Product"}</p>
                  <p className="text-gray-600">
                    Quantity: {item.quantity || 0}
                  </p>
                </div>
              </div>
              <button
                className="text-red-600 font-bold hover:underline"
                onClick={() => handleRemove(item.product_id)}
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-700 transition duration-200"
          >
            Proceed to Buy
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
