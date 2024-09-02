import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Fixed the import for thunk
import rootReducer from "../reducers/rootReducer.js";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
