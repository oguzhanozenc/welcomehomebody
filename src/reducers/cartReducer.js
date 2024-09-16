// src/reducers/cartReducer.js

import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
} from "../actions/actionTypes";

// Initialize state from localStorage
const persistedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

const initialState = {
  items: persistedCart,
};

const cartReducer = (state = initialState, action) => {
  let updatedItems;
  switch (action.type) {
    case ADD_TO_CART:
      // Check if the item already exists in the cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.variant.id === action.payload.variant.id
      );
      if (existingItemIndex !== -1) {
        // Update the quantity if it exists
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item to the cart
        updatedItems = [...state.items, action.payload];
      }
      return {
        ...state,
        items: updatedItems,
      };

    case REMOVE_FROM_CART:
      updatedItems = state.items.filter(
        (item) => item.variant.id !== action.payload
      );
      return {
        ...state,
        items: updatedItems,
      };

    case UPDATE_CART_QUANTITY:
      updatedItems = state.items.map((item) =>
        item.variant.id === action.payload.variantId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
      };

    case SYNC_CART_ITEMS:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
