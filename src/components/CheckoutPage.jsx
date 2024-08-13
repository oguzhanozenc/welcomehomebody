import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/");
    }
  }, [cartItems, navigate]);

  const handleCheckout = () => {
    const checkoutId = localStorage.getItem("checkoutId");
    if (checkoutId) {
      client.checkout
        .fetch(checkoutId)
        .then((checkout) => {
          window.location.href = checkout.webUrl;
        })
        .catch((error) => {
          console.error("Error fetching checkout URL:", error);
        });
    }
  };

  return (
    <div className="checkout-page">
      <button onClick={handleCheckout} className="btn">
        Proceed to Shopify Checkout
      </button>
    </div>
  );
};

export default CheckoutPage;
