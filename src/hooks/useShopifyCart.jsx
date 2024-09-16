import { useDispatch } from "react-redux";
import {
  addToCartAndUpdateShopify,
  removeFromCartAndUpdateShopify,
  handleCheckout,
} from "../actions/cartActions";
import { useSelector } from "react-redux";

export const useShopifyCart = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.cart.loading);

  const handleAddToCart = (item) => {
    dispatch(addToCartAndUpdateShopify(item));
  };

  const handleRemoveFromCart = (variantId) => {
    dispatch(removeFromCartAndUpdateShopify(variantId));
  };

  const handleProceedToCheckout = () => {
    dispatch(handleCheckout());
  };

  return {
    handleAddToCart,
    handleRemoveFromCart,
    handleProceedToCheckout,
    loading,
  };
};
