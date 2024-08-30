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
        const existingItem = draft.items.find(
          (item) => item.variant.id === action.payload.variant.id
        );

        if (existingItem) {
          existingItem.quantity += action.payload.quantity;
        } else {
          draft.items.push(action.payload);
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

      default:
        return state;
    }
  });

export default cartReducer;
