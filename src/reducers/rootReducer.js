import { combineReducers } from "redux";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import checkoutReducer from "./checkoutReducer";

const rootReducer = combineReducers({
  products: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
});

export default rootReducer;
