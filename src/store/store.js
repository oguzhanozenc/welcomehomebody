import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/rootReducer.js";
import { thunk } from "redux-thunk";
import { cartMiddleware } from "../middleware/cartMiddleware.js";

const store = createStore(rootReducer, applyMiddleware(thunk, cartMiddleware));

export default store;
