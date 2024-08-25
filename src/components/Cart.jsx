import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectMemoizedCartItems } from "../selectors/cartSelectors";
import { removeFromCart, updateCartQuantity } from "../actions/cartActions";
import "../styles/Cart.css";

const Cart = ({ isOpen, toggleCart }) => {
  const cartItems = useSelector(selectMemoizedCartItems);
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
    toggleCart();
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
    <div className={`cart-container ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Your Cart</h2>
        <button onClick={toggleCart} className="close-cart">
          &times;
        </button>
      </div>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
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
      )}
      <div className="cart-summary">
        <h3>Total: ${calculateTotal()}</h3>
        <button
          className="checkout-button"
          disabled={cartItems.length === 0}
          onClick={handleProceedToCheckout}
        >
          Proceed to Review
        </button>
      </div>
    </div>
  );
};

export default Cart;