import React from "react";
import "../styles/OrderConfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="order-completed-page">
      <div className="window retro-window">
        <div className="title-bar">
          <div className="title">Order Completed</div>
        </div>
        <div className="content">
          <div className="order-summary">
            <h1>Thank You for Your Order!</h1>
            <p>
              Your order has been successfully processed. We will send you a
              confirmation email with the details.
            </p>
            <button
              className="btn"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
