import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useShopifyCart } from "../hooks/useShopifyCart";
import { useNavigate, Link } from "react-router-dom";
import "../styles/CheckoutPage.css";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { handleCheckout, handleRemoveFromCart, loading } = useShopifyCart();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart items in CheckoutPage component:", cartItems);
  }, [cartItems]);

  const handleProceedToCheckout = async () => {
    setProcessing(true);
    try {
      await handleCheckout(); // Calls the handleCheckout function from the hook
    } catch (error) {
      console.error("Checkout failed:", error);
      setProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/review-cart");
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <ul className="checkout-items">
        {cartItems.map((item) => {
          // Ensure the product and its ID are available before attempting to use them
          const productId = item?.product?.id
            ? item.product.id.replace("gid://shopify/Product/", "")
            : null;

          const productImage =
            item?.product?.images?.[0] || "/placeholder-image.jpg";
          const productTitle = item?.product?.title || "Unknown Product";

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
                <p>Price: ${item?.variant?.priceV2?.amount || "N/A"}</p>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => handleRemoveFromCart(item.variant.id)}
                  disabled={loading || processing}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="checkout-actions">
        <button onClick={handleBackToCart} className="checkout-button">
          Back to Cart
        </button>
        <button
          onClick={handleProceedToCheckout}
          disabled={loading || processing || cartItems.length === 0}
          className="checkout-button"
        >
          {processing
            ? "Processing..."
            : loading
            ? "Syncing..."
            : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
