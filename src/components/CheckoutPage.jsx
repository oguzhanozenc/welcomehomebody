import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useShopifyCart } from "../hooks/useShopifyCart";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleCheckout } = useShopifyCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProceedToCheckout = async () => {
    setLoading(true);
    try {
      await handleCheckout();
    } catch (error) {
      console.error("Checkout failed:", error);
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/review-cart");
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <ul className="checkout-items">
        {cartItems.map((item, index) => (
          <li key={index} className="checkout-item">
            <div className="checkout-item-image">
              <img src={item.product.images[0]} alt={item.product.title} />
            </div>
            <div className="checkout-item-details">
              <h3>{item.product.title}</h3>
              <p>{item.product.description}</p>
              <p>Price: ${item.variant.priceV2.amount}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="checkout-actions">
        <button onClick={handleBackToCart} className="btn">
          Back to Cart
        </button>
        <button
          onClick={handleProceedToCheckout}
          disabled={loading || cartItems.length === 0}
          className="checkout-button"
        >
          {loading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;