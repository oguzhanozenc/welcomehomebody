import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
} from "../actions/actionTypes";

// Named Export
export const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // List of cart actions to persist
  const cartActions = [
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    SYNC_CART_ITEMS,
  ];

  if (cartActions.includes(action.type)) {
    const state = store.getState();
    localStorage.setItem("cartItems", JSON.stringify(state.cart.items));
  }

  return result;
};
