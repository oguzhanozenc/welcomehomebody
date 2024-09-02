import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
} from "./actionTypes";

export const addToCart = (item) => {
  console.log("Dispatching ADD_TO_CART with item:", item); // Debugging log
  return {
    type: ADD_TO_CART,
    payload: item,
  };
};

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const updateCartQuantity = (productId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { productId, quantity },
});

export const syncCartItems = (items) => {
  console.log("Dispatching SYNC_CART_ITEMS with items:", items); // Debugging log
  return {
    type: SYNC_CART_ITEMS,
    payload: items,
  };
};
