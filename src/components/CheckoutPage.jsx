import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/CheckoutPage.css"; // Include your styling

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const handleCheckout = () => {
    // Redirect to Shopify checkout
    window.location.href = "/checkout-url"; // Replace with Shopify checkout URL
  };

  return (
    <div className="checkout-page">
      <div className="window retro-window">
        <div className="title-bar">
          <div className="title">Checkout</div>
        </div>
        <div className="content">
          <div className="checkout-summary">
            <h2>Your Cart</h2>
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <p>
                      Price: {item.price.amount} {item.price.currencyCode}
                    </p>
                    <p>Quantity: 1</p>
                  </div>
                </li>
              ))}
            </ul>
            <button onClick={handleCheckout} className="btn">
              Proceed to Shopify Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
