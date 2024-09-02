import { produce } from "immer";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
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
          draft.items[existingItemIndex].quantity += action.payload.quantity;
        } else {
          draft.items.push({
            ...action.payload,
            quantity: action.payload.quantity || 1,
          });
        }
        break;

      case REMOVE_FROM_CART:
        draft.items = draft.items.filter(
          (item) => item.variant.id !== action.payload
        );
        break;

      case UPDATE_CART_QUANTITY:
        const itemToUpdate = draft.items.find(
          (item) => item.variant.id === action.payload.productId
        );
        if (itemToUpdate) {
          itemToUpdate.quantity = action.payload.quantity;
        }
        break;

      case SYNC_CART_ITEMS:
        draft.items = action.payload;
        break;

      default:
        return state;
    }
  });

export default cartReducer;
