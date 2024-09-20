import { gql } from "graphql-request";
import client from "../client";
import {
  CUSTOMER_LOGIN_SUCCESS,
  CUSTOMER_LOGOUT,
  CUSTOMER_LOGIN_FAILURE,
  CUSTOMER_SIGNUP_SUCCESS,
  CUSTOMER_SIGNUP_FAILURE,
} from "./actionTypes";

export const loginCustomer = (email, password) => async (dispatch) => {
  const mutation = gql`
    mutation customerAccessTokenCreate(
      $input: CustomerAccessTokenCreateInput!
    ) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email,
      password,
    },
  };

  try {
    const response = await client.request(mutation, variables);
    const data = response.customerAccessTokenCreate;

    if (data.customerUserErrors.length > 0) {
      const error = data.customerUserErrors[0];
      dispatch({ type: CUSTOMER_LOGIN_FAILURE, payload: error.message });
      throw new Error(error.message);
    }

    const token = data.customerAccessToken.accessToken;
    const expiresAt = data.customerAccessToken.expiresAt;

    // Store token in localStorage
    localStorage.setItem("customerAccessToken", token);
    localStorage.setItem("customerAccessTokenExpiresAt", expiresAt);

    // Clear existing checkoutId
    sessionStorage.removeItem("checkoutId");

    dispatch({ type: CUSTOMER_LOGIN_SUCCESS, payload: { token, expiresAt } });
  } catch (error) {
    console.error("Customer login failed:", error);
    dispatch({ type: CUSTOMER_LOGIN_FAILURE, payload: error.message });
    throw error;
  }
};

export const logoutCustomer = () => {
  // Remove tokens from localStorage
  localStorage.removeItem("customerAccessToken");
  localStorage.removeItem("customerAccessTokenExpiresAt");

  // Remove checkoutId from sessionStorage
  sessionStorage.removeItem("checkoutId");

  return {
    type: CUSTOMER_LOGOUT,
  };
};

export const signUpCustomer =
  (firstName, lastName, email, password) => async (dispatch) => {
    const mutation = gql`
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        firstName,
        lastName,
        email,
        password,
      },
    };

    try {
      const response = await client.request(mutation, variables);
      const data = response.customerCreate;

      if (data.customerUserErrors.length > 0) {
        const error = data.customerUserErrors[0];
        dispatch({ type: CUSTOMER_SIGNUP_FAILURE, payload: error.message });
        throw new Error(error.message);
      }

      dispatch({ type: CUSTOMER_SIGNUP_SUCCESS });

      // Automatically log in the user after successful sign-up
      await dispatch(loginCustomer(email, password));
    } catch (error) {
      console.error("Customer sign-up failed:", error);
      dispatch({ type: CUSTOMER_SIGNUP_FAILURE, payload: error.message });
      throw error;
    }
  };
