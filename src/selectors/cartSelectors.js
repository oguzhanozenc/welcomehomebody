import { createSelector } from "reselect";

const selectCartItems = (state) => state.cart.items;

export const selectMemoizedCartItems = createSelector(
  [selectCartItems],
  (cartItems) => {
    const itemMap = new Map();

    cartItems.forEach((item) => {
      const existingItem = itemMap.get(item.variant.id);

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        itemMap.set(item.variant.id, { ...item });
      }
    });

    return Array.from(itemMap.values());
  }
);
