import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { handleCheckout } from "../actions/cartActions";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/CheckoutPage.css";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redirect to Shopify checkout if user logs in successfully
  useEffect(() => {
    if (isAuthenticated && cartItems.length > 0) {
      handleProceedToCheckout();
    }
  }, [isAuthenticated, cartItems.length]);

  const handleProceedToCheckout = () => {
    setProcessing(true);
    dispatch(handleCheckout())
      .then(() => {
        setProcessing(false);
        // Optionally, navigate to a confirmation page or Shopify checkout happens automatically
      })
      .catch((error) => {
        console.error("Checkout failed:", error);
        setProcessing(false);
        toast.error("Failed to proceed to checkout.");
      });
  };

  const handleBackToCart = () => {
    navigate("/cart");
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
    <div className="checkout-container">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="checkout-items">
            {cartItems.map((item) => {
              const productId = item?.product?.id
                ? item.product.id.replace("gid://shopify/Product/", "")
                : null;
              const productImage =
                item?.product?.images?.[0] || "/placeholder-image.jpg";
              const productTitle = item?.product?.title || "Unknown Product";
              const variantTitle = item?.variant?.title || "N/A";

              return (
                <li key={item.variant?.id} className="checkout-item">
                  <div className="checkout-item-image">
                    {productId ? (
                      <Link to={`/products/${productId}`}>
                        <img src={productImage} alt={productTitle} />
                      </Link>
                    ) : (
                      <img src={productImage} alt={productTitle} />
                    )}
                  </div>
                  <div className="checkout-item-details">
                    {productId ? (
                      <Link to={`/products/${productId}`}>
                        <h3>{productTitle}</h3>
                      </Link>
                    ) : (
                      <h3>{productTitle}</h3>
                    )}
                    <p>
                      {item?.product?.description || "No description available"}
                    </p>
                    <p>
                      <strong>Variant:</strong> {variantTitle}
                    </p>
                    <p>
                      <strong>Price:</strong> $
                      {item?.variant?.priceV2?.amount || "N/A"}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="checkout-summary">
            <h3>Total: ${calculateTotal()}</h3>
          </div>

          {!isAuthenticated && (
            <div className="authentication-prompt">
              <p>
                You can proceed as a guest or{" "}
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="auth-link"
                >
                  login
                </Link>{" "}
                to access your account benefits.
              </p>
              <div className="auth-buttons">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="auth-btn"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  state={{ from: location }}
                  className="auth-btn"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          <div className="checkout-actions">
            <button onClick={handleBackToCart} className="btn back-to-cart-btn">
              Back to Cart
            </button>
            <button
              onClick={handleProceedToCheckout}
              disabled={processing || cartItems.length === 0}
              className="btn checkout-btn"
            >
              {processing
                ? "Processing..."
                : isAuthenticated
                ? "Proceed to Payment"
                : "Continue without login"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
