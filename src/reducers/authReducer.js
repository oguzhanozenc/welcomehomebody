import {
  CUSTOMER_LOGIN_SUCCESS,
  CUSTOMER_LOGOUT,
  CUSTOMER_LOGIN_FAILURE,
  CUSTOMER_SIGNUP_SUCCESS,
  CUSTOMER_SIGNUP_FAILURE,
} from "../actions/actionTypes";

const initialState = {
  isAuthenticated: !!localStorage.getItem("customerAccessToken"),
  token: localStorage.getItem("customerAccessToken") || null,
  expiresAt: localStorage.getItem("customerAccessTokenExpiresAt") || null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case CUSTOMER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        error: null,
      };
    case CUSTOMER_LOGIN_FAILURE:
    case CUSTOMER_SIGNUP_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        expiresAt: null,
        error: action.payload,
      };
    case CUSTOMER_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        expiresAt: null,
        error: null,
      };
    case CUSTOMER_SIGNUP_SUCCESS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;
