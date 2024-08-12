import client from "../client";

export const CREATE_CHECKOUT_BEGIN = "CREATE_CHECKOUT_BEGIN";
export const CREATE_CHECKOUT_SUCCESS = "CREATE_CHECKOUT_SUCCESS";
export const CREATE_CHECKOUT_FAILURE = "CREATE_CHECKOUT_FAILURE";

export const createCheckout = (items) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_CHECKOUT_BEGIN });
    try {
      const checkout = await client.checkout.create({
        lineItems: items.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
        })),
      });
      dispatch({ type: CREATE_CHECKOUT_SUCCESS, payload: checkout });
      window.location.href = checkout.webUrl;
    } catch (error) {
      dispatch({ type: CREATE_CHECKOUT_FAILURE, payload: error });
    }
  };
};
