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
    console.log("Reducer received action:", action); // Debugging log

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

      case SYNC_CART_ITEMS:
        console.log(
          "SYNC_CART_ITEMS - payload received in reducer:",
          action.payload
        ); // Debugging log
        draft.items = action.payload;
        break;

      default:
        return state;
    }
    console.log("Updated cart state:", draft.items); // Log updated state
  });

export default cartReducer;
