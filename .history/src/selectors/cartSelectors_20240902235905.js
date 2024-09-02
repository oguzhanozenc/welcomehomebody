import { createSelector } from "reselect";

const selectCartItems = (state) => state.cart.items;

export const selectMemoizedCartItems = createSelector(
  [selectCartItems],
  (cartItems) => cartItems // Simply return the items without aggregation
);
