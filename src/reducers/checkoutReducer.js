import {
  CREATE_CHECKOUT_BEGIN,
  CREATE_CHECKOUT_SUCCESS,
  CREATE_CHECKOUT_FAILURE,
} from "../actions/checkoutActions";

const initialState = {
  checkout: null,
  loading: false,
  error: null,
};

const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CHECKOUT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_CHECKOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        checkout: action.payload,
      };
    case CREATE_CHECKOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default checkoutReducer;
