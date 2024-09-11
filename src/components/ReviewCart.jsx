import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useShopifyCart } from "../hooks/useShopifyCart";
import "../styles/ReviewCart.css";

const ReviewCart = () => {
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    console.log("Cart items in ReviewCart component:", cartItems); // Ensure correct data flow
  }, [cartItems]);

  const { handleRemoveFromCart, handleAddToCart, loading } = useShopifyCart();
  const navigate = useNavigate();

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
        (total, item) =>
          total + item.quantity * item.variant?.priceV2?.amount || 0,
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
              // Full product ID for Shopify API interactions
              const originalProductId = item?.product?.id;

              // Restructured product ID for URLs
              const restructuredProductId = originalProductId
                ? originalProductId.replace("gid://shopify/Product/", "")
                : null;

              const productImage =
                item?.product?.images?.[0] || "/placeholder-image.jpg";
              const productTitle = item?.product?.title || "Unknown Product";

              return (
                <li key={item.variant?.id} className="cart-item">
                  {/* Show image and link to product if productId is available */}
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
                        <p>Price: ${item.variant?.priceV2?.amount || 0}</p>
                        <div className="cart-item-actions">
                          <button
                            className="quantity-button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.variant.id,
                                item.quantity - 1
                              )
                            }
                            disabled={loading}
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
