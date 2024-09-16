import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  updateCartQuantityAndUpdateShopify,
  removeFromCartAndUpdateShopify,
} from "../actions/cartActions";
import "../styles/ReviewCart.css";
import { toast } from "react-toastify";

const ReviewCart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveItem = (variantId) => {
    dispatch(removeFromCartAndUpdateShopify(variantId))
      .then(() => {
        toast.success("Item removed from cart.");
      })
      .catch((error) => {
        console.error("Failed to remove item:", error);
        toast.error("Failed to remove item from the cart. Please try again.");
      });
  };

  const handleUpdateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(variantId);
      return;
    }
    dispatch(updateCartQuantityAndUpdateShopify(variantId, newQuantity))
      .then(() => {
        toast.success("Cart updated.");
      })
      .catch((error) => {
        console.error("Failed to update quantity:", error);
        toast.error("Failed to update item quantity. Please try again.");
      });
  };

  const handleProceedToCheckout = () => {
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total +
          item.quantity * parseFloat(item.variant?.priceV2?.amount || 0),
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
            {cartItems.map((item) => {
              const originalProductId = item?.product?.id;
              const restructuredProductId = originalProductId
                ? originalProductId.replace("gid://shopify/Product/", "")
                : null;
              const productImage =
                item?.product?.images?.[0] || "/placeholder-image.jpg";
              const productTitle = item?.product?.title || "Unknown Product";
              const variantTitle = item?.variant?.title || "N/A";

              return (
                <li key={item.variant?.id} className="cart-item">
                  {restructuredProductId ? (
                    <Link to={`/products/${restructuredProductId}`}>
                      <img
                        src={productImage}
                        alt={productTitle}
                        className="cart-item-image"
                      />
                    </Link>
                  ) : (
                    <img
                      src={productImage}
                      alt={productTitle}
                      className="cart-item-image"
                    />
                  )}
                  <div className="cart-item-details">
                    {item.product ? (
                      <>
                        {restructuredProductId ? (
                          <Link to={`/products/${restructuredProductId}`}>
                            <h3>{productTitle}</h3>
                          </Link>
                        ) : (
                          <h3>{productTitle}</h3>
                        )}
                        {/* Display Variant Title if available */}
                        <p>
                          <strong>Variant:</strong> {variantTitle}
                        </p>
                        <p>
                          <strong>Price:</strong> $
                          {item.variant?.priceV2?.amount || 0}
                        </p>
                        <div className="cart-item-actions">
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.variant.id,
                                item.quantity - 1
                              )
                            }
                          >
                            -
                          </button>
                          <span className="quantity">{item.quantity}</span>
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.variant.id,
                                item.quantity + 1
                              )
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
                      </>
                    ) : (
                      <p>Product details unavailable</p>
                    )}
                  </div>
                </li>
              );
            })}
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
