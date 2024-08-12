import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../actions/cartActions";

const AddToCartButton = ({ productId, quantity }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addToCart(productId, quantity));
  };

  return <button onClick={handleClick}>Add to Cart</button>;
};

export default AddToCartButton;
