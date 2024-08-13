import client from "../client";
import { useState, useEffect } from "react";

const StickyCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      const checkoutId = localStorage.getItem("checkoutId");
      if (checkoutId) {
        const checkout = await client.checkout.fetch(checkoutId);
        setCart(checkout.lineItems);
      }
    };
    fetchCart();
  }, []);

  if (!cart.length) return <div>Your cart is empty</div>;

  return (
    <div className="sticky-cart">
      <h2>Cart</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.title} - {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => (window.location.href = "/checkout")}>
        Checkout
      </button>
    </div>
  );
};

export default StickyCart;
