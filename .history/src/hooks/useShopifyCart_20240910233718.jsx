import { useState, useEffect, useCallback } from "react";
import { gql } from "graphql-request";
import client from "../client";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
  syncCartItems,
} from "../actions/cartActions";

export const useShopifyCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const productState = useSelector((state) => state.products);
  const [checkoutId, setCheckoutId] = useState(
    () => sessionStorage.getItem("checkoutId") || null
  );
  const [loading, setLoading] = useState(false);

  const syncCartWithShopify = useCallback(async () => {
    if (!checkoutId) return;

    try {
      const query = gql`
        query getCheckout($id: ID!) {
          node(id: $id) {
            ... on Checkout {
              id
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
          }
        }
      `;

      const variables = { id: checkoutId };
      const response = await client.request(query, variables);

      const lineItems = response?.node?.lineItems?.edges;

      if (lineItems?.length > 0) {
        const shopifyCartItems = lineItems.map((edge) => ({
          product: {
            id: edge.node.variant.product.id,
            title: edge.node.variant.product.title,
            images: [edge.node.variant.product.images.edges[0].node.src],
          },
          variant: {
            id: edge.node.variant.id,
            priceV2: edge.node.variant.priceV2,
          },
          quantity: edge.node.quantity,
        }));

        dispatch(syncCartItems(shopifyCartItems));
      } else {
        dispatch(syncCartItems([])); // Clear cart if no items in Shopify
      }
    } catch (error) {
      console.error("Failed to sync cart with Shopify:", error);
    }
  }, [checkoutId, dispatch]);

  const createCheckout = async (lineItems) => {
    if (!lineItems.length) return null;

    const mutation = gql`
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
          }
        }
      }
    `;

    const variables = { input: { lineItems } };
    const response = await client.request(mutation, variables);
    const newCheckoutId = response.checkoutCreate.checkout.id;

    setCheckoutId(newCheckoutId);
    sessionStorage.setItem("checkoutId", newCheckoutId);
    return newCheckoutId;
  };

  const updateShopifyCheckout = async (lineItems) => {
    if (!checkoutId) return;

    const mutation = gql`
      mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsReplace(
          checkoutId: $checkoutId
          lineItems: $lineItems
        ) {
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
        }
      }
    `;

    const variables = {
      checkoutId,
      lineItems: lineItems.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await client.request(mutation, variables);
      const updatedCartItems =
        response.checkoutLineItemsReplace.checkout.lineItems.edges.map(
          (edge) => ({
            product: {
              id: edge.node.variant.product.id,
              title: edge.node.variant.product.title,
              images: [edge.node.variant.product.images.edges[0].node.src],
            },
            variant: {
              id: edge.node.variant.id,
              priceV2: edge.node.variant.priceV2,
            },
            quantity: edge.node.quantity,
          })
        );

      dispatch(syncCartItems(updatedCartItems));
    } catch (error) {
      console.error("Error updating Shopify checkout:", error);
    }
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) => item.variant.id === variantId
    );

    if (existingItem) {
      dispatch(updateCartQuantity(variantId, existingItem.quantity + quantity));
    } else {
      const product = productState.productDetails;
      if (product) {
        const newItem = {
          product,
          variant: product.variants.find((v) => v.id === variantId),
          quantity,
        };
        dispatch(addToCart(newItem));
      } else {
        console.error("Product not found.");
        return;
      }
    }

    const updatedCartItems = [
      ...cartItems.filter((item) => item.variant.id !== variantId),
      { variant: { id: variantId }, quantity },
    ];

    await updateShopifyCheckout(updatedCartItems);
    await syncCartWithShopify();
  };

  const handleRemoveFromCart = async (variantId) => {
    dispatch(removeFromCart(variantId));

    const updatedCartItems = cartItems.filter(
      (item) => item.variant.id !== variantId
    );

    await updateShopifyCheckout(updatedCartItems);
    await syncCartWithShopify();
  };

  const handleCheckout = async () => {
    if (!checkoutId) {
      await createCheckout(
        cartItems.map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        }))
      );
    }
  };

  return { handleAddToCart, handleRemoveFromCart, handleCheckout, loading };
};
