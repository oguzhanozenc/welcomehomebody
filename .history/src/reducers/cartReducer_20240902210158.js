import { produce } from "immer";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
} from "../actions/actionTypes";

const initialState = {
  items: [],
};

const cartReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_TO_CART:
        const existingItemIndex = draft.items.findIndex(
          (item) => item.variant.id === action.payload.variant.id
        );

        if (existingItemIndex !== -1) {
          // If the item exists in the cart, increase its quantity
          draft.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          // Otherwise, add it to the cart with the initial quantity
          draft.items.push({
            ...action.payload,
            quantity: action.payload.quantity || 1,
          });
        }
        break;

      case REMOVE_FROM_CART:
        // Remove the item from the cart entirely
        draft.items = draft.items.filter(
          (item) => item.variant.id !== action.payload
        );
        break;

      case UPDATE_CART_QUANTITY:
        const itemToUpdate = draft.items.find(
          (item) => item.variant.id === action.payload.productId
        );
        if (itemToUpdate) {
          // Update the quantity of the item if it's already in the cart
          itemToUpdate.quantity = action.payload.quantity;
        }
        break;

      default:
        return state;
    }
  });

export default cartReducer;
