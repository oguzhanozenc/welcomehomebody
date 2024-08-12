import React from "react";
import { useDispatch } from "react-redux";
import { createCheckout } from "../actions/checkoutActions";

const CheckoutButton = () => {
  const dispatch = useDispatch();

  const handleCheckout = async () => {
    await dispatch(createCheckout());
    window.location.href = "/checkout";
  };

  return <button onClick={handleCheckout}>Proceed to Checkout</button>;
};

export default CheckoutButton;
