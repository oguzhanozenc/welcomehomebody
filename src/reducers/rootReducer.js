import { combineReducers } from "redux";
import productReducer from "./productReducer";
import cartReducer from "./cartReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  products: productReducer,
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
