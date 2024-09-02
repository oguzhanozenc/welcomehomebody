// ReviewCart.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useShopifyCart } from "../hooks/useShopifyCart";
import "../styles/ReviewCart.css";

const ReviewCart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  useEffect(() => {
    console.log("Cart items in ReviewCart component:", cartItems);
  }, [cartItems]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleRemoveFromCart, handleAddToCart, loading } = useShopifyCart();

  const handleRemoveItem = async (variantId) => {
    try {
      await handleRemoveFromCart(variantId);
    } catch (error) {
      console.error("Failed to remove item:", error);
      alert("Failed to remove item from the cart. Please try again.");
    }
  };

  const handleUpdateQuantity = async (variantId, quantity) => {
    if (quantity < 1) return;
    try {
      await handleAddToCart(variantId, quantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Failed to update item quantity. Please try again.");
    }
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + item.quantity * item.variant.priceV2.amount,
        0
      )
      .toFixed(2);
  };

  return (
    <div className="review-cart-container">
      <h2>Review Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.variant.id} className="cart-item">
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product.title}</h3>
                  <p>Price: ${item.variant.priceV2.amount}</p>
                  <div className="cart-item-actions">
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleUpdateQuantity(item.variant.id, item.quantity - 1)
                      }
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleUpdateQuantity(item.variant.id, item.quantity + 1)
                      }
                      disabled={loading}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.variant.id)}
                      className="remove-button"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>Total: ${calculateTotal()}</h3>
            <button
              className="checkout-button"
              onClick={handleProceedToCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Loading..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCart;
