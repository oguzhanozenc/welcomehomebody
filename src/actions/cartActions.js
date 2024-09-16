import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  SYNC_CART_ITEMS,
} from "./actionTypes";
import { gql } from "graphql-request";
import client from "../client";

// Action Creators
export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (variantId) => ({
  type: REMOVE_FROM_CART,
  payload: variantId,
});

export const updateCartQuantity = (variantId, quantity) => ({
  type: UPDATE_CART_QUANTITY,
  payload: { variantId, quantity },
});

export const syncCartItems = (items) => ({
  type: SYNC_CART_ITEMS,
  payload: items,
});

// Asynchronous Actions with Shopify Synchronization
export const addToCartAndUpdateShopify =
  (item) => async (dispatch, getState) => {
    try {
      dispatch(addToCart(item));
      await updateShopifyCheckout(dispatch, getState);
    } catch (error) {
      console.error("Failed to add to cart and update Shopify:", error);
      throw error;
    }
  };

export const removeFromCartAndUpdateShopify =
  (variantId) => async (dispatch, getState) => {
    try {
      dispatch(removeFromCart(variantId));
      await updateShopifyCheckout(dispatch, getState);
    } catch (error) {
      console.error("Failed to remove from cart and update Shopify:", error);
      throw error;
    }
  };

export const updateCartQuantityAndUpdateShopify =
  (variantId, quantity) => async (dispatch, getState) => {
    try {
      dispatch(updateCartQuantity(variantId, quantity));
      await updateShopifyCheckout(dispatch, getState);
    } catch (error) {
      console.error(
        "Failed to update cart quantity and update Shopify:",
        error
      );
      throw error;
    }
  };

// Shopify Checkout ID
let checkoutId = sessionStorage.getItem("checkoutId") || null;

// Create Shopify Checkout
const createCheckout = async (lineItems, customerAccessToken = null) => {
  const mutation = gql`
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      })),
      ...(customerAccessToken && { customerAccessToken }),
    },
  };

  try {
    const response = await client.request(mutation, variables);
    const checkout = response.checkoutCreate.checkout;
    const checkoutErrors = response.checkoutCreate.userErrors;

    if (checkoutErrors.length > 0) {
      throw new Error(checkoutErrors[0].message);
    }

    checkoutId = checkout.id;
    sessionStorage.setItem("checkoutId", checkout.id);
    return checkout.webUrl;
  } catch (error) {
    console.error("Error creating Shopify checkout:", error);
    throw new Error("Checkout creation failed.");
  }
};

// Update Shopify Checkout
const updateShopifyCheckout = async (dispatch, getState) => {
  const cartItems = getState().cart.items;
  const { auth } = getState();
  const customerAccessToken = auth.isAuthenticated ? auth.token : null;

  if (!checkoutId) {
    await createCheckout(cartItems, customerAccessToken);
    return;
  }

  const mutation = gql`
    mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
          lineItems(first: 10) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    images(first: 1) {
                      edges {
                        node {
                          src
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    checkoutId,
    lineItems: cartItems.map((item) => ({
      variantId: item.variant.id,
      quantity: item.quantity,
    })),
  };

  try {
    const response = await client.request(mutation, variables);
    const checkout = response.checkoutLineItemsReplace.checkout;
    const checkoutErrors = response.checkoutLineItemsReplace.userErrors;

    if (checkoutErrors && checkoutErrors.length > 0) {
      throw new Error(checkoutErrors[0].message);
    }

    // Update the cart items in Redux store
    const updatedCartItems = checkout.lineItems.edges.map((edge) => ({
      product: {
        id: edge.node.variant.product.id,
        title: edge.node.variant.product.title,
        images: [edge.node.variant.product.images.edges[0]?.node.src],
      },
      variant: {
        id: edge.node.variant.id,
        priceV2: edge.node.variant.priceV2,
      },
      quantity: edge.node.quantity,
    }));

    dispatch(syncCartItems(updatedCartItems));
  } catch (error) {
    console.error("Error updating Shopify checkout:", error);
    throw error; // Throw the error to be caught by the calling function
  }
};

// Handle Checkout
export const handleCheckout = () => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    let checkoutId = sessionStorage.getItem("checkoutId") || null;

    if (!checkoutId) {
      await updateShopifyCheckout(dispatch, getState);
      checkoutId = sessionStorage.getItem("checkoutId");
    }

    // If customer is authenticated, associate the checkout with the customer
    if (auth.isAuthenticated && auth.token) {
      const mutation = gql`
        mutation checkoutCustomerAssociateV2(
          $checkoutId: ID!
          $customerAccessToken: String!
        ) {
          checkoutCustomerAssociateV2(
            checkoutId: $checkoutId
            customerAccessToken: $customerAccessToken
          ) {
            checkout {
              id
              webUrl
            }
            customer {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        checkoutId,
        customerAccessToken: auth.token,
      };

      await client.request(mutation, variables);
    }

    // Fetch the checkout URL
    const query = gql`
      query getCheckout($id: ID!) {
        node(id: $id) {
          ... on Checkout {
            id
            webUrl
          }
        }
      }
    `;

    const variables = { id: checkoutId };

    const response = await client.request(query, variables);
    const checkoutUrl = response.node.webUrl;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      throw new Error("No checkout URL found.");
    }
  } catch (error) {
    console.error("Checkout failed:", error);
    throw error;
  }
};
