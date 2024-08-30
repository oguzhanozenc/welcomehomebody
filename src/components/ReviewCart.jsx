import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCartQuantity, removeFromCart } from "../actions/cartActions";
import "../styles/ReviewCart.css";

const ReviewCart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (variantId) => {
    dispatch(removeFromCart(variantId));
  };

  const handleUpdateQuantity = (variantId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity(variantId, quantity));
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
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-button"
                      onClick={() =>
                        handleUpdateQuantity(item.variant.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.variant.id)}
                      className="remove-button"
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
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewCart;
