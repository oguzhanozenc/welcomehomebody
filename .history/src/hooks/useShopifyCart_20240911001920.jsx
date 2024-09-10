import { useState, useCallback } from "react";
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

  const syncCartWithShopify = useCallback(async () => {
    if (!checkoutId) {
      console.log("No checkout ID found, skipping sync.");
      return;
    }

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

      console.log("Raw response from Shopify:", response);

      const lineItems = response?.node?.lineItems?.edges;

      if (lineItems && lineItems.length > 0) {
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

        console.log("Parsed cart items from Shopify:", shopifyCartItems);
        dispatch(syncCartItems(shopifyCartItems));
      } else {
        console.log("No items in Shopify cart, clearing Redux cart.");
        dispatch(syncCartItems([])); // Clear the cart if Shopify cart is empty
      }
    } catch (error) {
      console.error("Failed to sync cart with Shopify:", error);
    }
  }, [checkoutId, dispatch]);

  const updateShopifyCheckout = async (lineItems) => {
    if (!checkoutId) return;

    try {
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
          variantId: item.variantId,
          quantity: item.quantity === 0 ? 0 : item.quantity,
        })),
      };

      console.log("Updating Shopify Checkout with lineItems:", variables);
      const response = await client.request(mutation, variables);
      console.log("Response from Shopify API:", response);

      return response;
    } catch (error) {
      console.error("Error updating Shopify checkout:", error);
      throw new Error("Updating Shopify checkout failed.");
    }
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    try {
      console.log("Attempting to add to cart - Variant ID:", variantId);
      let existingItem = cartItems.find(
        (item) => item.variant.id === variantId
      );

      if (existingItem) {
        console.log("Updating quantity for existing item.");
        dispatch(
          updateCartQuantity(variantId, existingItem.quantity + quantity)
        );
      } else {
        const product = productState.productDetails;

        if (product) {
          console.log("Adding new product to cart:", product);
          dispatch(
            addToCart({
              product,
              variant: product.variants.find((v) => v.id === variantId),
              quantity,
            })
          );
        } else {
          console.error("Product not found for variant ID:", variantId);
          alert("Product not found. Please try again.");
          return;
        }
      }

      const updatedCartItems = [
        ...cartItems.filter((item) => item.variant.id !== variantId),
        { variant: { id: variantId }, quantity },
      ];

      console.log("Updating Shopify checkout with items:", updatedCartItems);
      const response = await updateShopifyCheckout(updatedCartItems);

      if (response && response.errors) {
        console.error("Shopify checkout update failed", response.errors);
        alert("Failed to sync with Shopify. Please try again.");
        return;
      }

      await syncCartWithShopify();
    } catch (error) {
      console.error("Error handling add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleRemoveFromCart = async (variantId) => {
    try {
      console.log(`Attempting to remove item with variantId: ${variantId}`);
      const updatedCartItems = cartItems
        .filter((item) => item.variant.id !== variantId)
        .map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        }));

      dispatch(removeFromCart(variantId));
      await updateShopifyCheckout(updatedCartItems);
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  return { handleAddToCart, handleRemoveFromCart };
};
