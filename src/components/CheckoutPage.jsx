import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CheckoutPage.css";
import { FaTrash } from "react-icons/fa";

const CheckoutPage = ({ basket, setBasket, clearBasket }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCheckout = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    clearBasket();
    navigate("/");
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const removeItem = (index) => {
    setBasket(basket.filter((_, i) => i !== index));
  };

  return (
    <div className="checkout-page">
      <h1 className="section-title">Checkout</h1>
      <div className="basket-items">
        {basket.length === 0 ? (
          <h1>Your basket is empty</h1>
        ) : (
          <ul>
            {basket.map((item, index) => (
              <li key={index} className="basket-item">
                <Link to={`/product/${item.id}`} className="basket-item-link">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="basket-item-image"
                  />
                  <div className="basket-item-details">
                    <span className="basket-item-name">{item.name}</span>
                    <span className="basket-item-price">{item.price}</span>
                  </div>
                </Link>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(index)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {basket.length > 0 && (
        <>
          <button onClick={handleCheckout} className="checkout-button btn">
            Proceed to Checkout
          </button>
          {showConfirmation && (
            <div className="confirmation-dialog">
              <h2>Thank you for your purchase!</h2>
              <p>Your order has been successfully processed.</p>
              <button onClick={handleConfirm} className="confirm-button btn">
                Go to Home
              </button>
              <button onClick={handleCancel} className="cancel-button btn">
                Go Back
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
