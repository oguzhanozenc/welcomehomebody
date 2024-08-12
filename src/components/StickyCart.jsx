import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../actions/cartActions";

const StickyCart = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(updateCart());
  }, [dispatch]);

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
