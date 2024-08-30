const CheckoutButton = () => {
  const handleCheckout = async () => {
    try {
      const checkoutId = localStorage.getItem("checkoutId");
      const checkout = await client.checkout.fetch(checkoutId);
      window.location.href = checkout.webUrl;
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return <button onClick={handleCheckout}>Proceed to Checkout</button>;
};

export default CheckoutButton;