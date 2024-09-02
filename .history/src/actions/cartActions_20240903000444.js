import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
} from "./actionTypes";

export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item,  // Ensure 'item' contains a product and variant structured as expected
});

export const removeFromCart = (variantId) => ({
  type: REMOVE_FROM_CART,
  payload: variantId,
});

export const updateCartQuantity = (variantId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { variantId, quantity },
});

export const syncCartItems = (items) => ({
  type: SYNC_CART_ITEMS,
  payload: items,