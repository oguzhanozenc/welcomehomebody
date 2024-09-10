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
  const productState = useSelector((state) => state.products); // Ensure product details are accessed from state
  const [checkoutId, setCheckoutId] = useState(
    () => sessionStorage.getItem("checkoutId") || null
  );
  const [loading, setLoading] = useState(false);

  const getProductDetailsByVariantId = (variantId) => {
    console.log("Looking for Variant ID in Cart:", variantId);
    console.log("Current Cart Items:", cartItems);

    const foundItem = cartItems.find((item) => item.variant.id === variantId);

    if (foundItem) {
      console.log(`Product found for Variant ID: ${variantId}`, foundItem);
      return foundItem.product;
    } else {
      console.error(`Product not found for Variant ID: ${variantId}`);
      return null;
    }
  };

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

        // Dispatch the action to update Redux state
        dispatch(syncCartItems(shopifyCartItems));
      } else {
        console.log("No items in Shopify cart, clearing Redux cart.");
        dispatch(syncCartItems([])); // Clear the cart if Shopify cart is empty
      }
    } catch (error) {
      console.error("Failed to sync cart with Shopify:", error);
    }
  }, [checkoutId, dispatch]);

  const createCheckout = async (lineItems) => {
    try {
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
    } catch (error) {
      console.error("Error creating checkout:", error);
      throw new Error("Checkout creation failed.");
    }
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
        variantId: item.variantId,
        quantity: item.quantity === 0 ? 0 : item.quantity, // Ensure 0 is passed for removed items
      })),
    };

    try {
      const response = await client.request(mutation, variables);
      const checkout = response.checkoutLineItemsReplace.checkout;

      const updatedCartItems = checkout.lineItems.edges.map((edge) => ({
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

      console.log("Updated cart items after Shopify sync:", updatedCartItems);
      dispatch(syncCartItems(updatedCartItems));
    } catch (error) {
      console.error("Error updating Shopify checkout:", error);
      throw new Error("Updating Shopify checkout failed.");
    }
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    try {
      console.log("Attempting to add to cart - Variant ID:", variantId);
      console.log("Current Cart Items:", cartItems);

      let existingItem = cartItems.find(
        (item) => item.variant.id === variantId
      );

      if (existingItem) {
        console.log("Updating quantity for existing item.");
        dispatch(
          updateCartQuantity(variantId, existingItem.quantity + quantity)
        );
      } else {
        const product = productState.productDetails; // Use product from state

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
          return; // Ensure that we stop execution if the product is not found
        }
      }

      const updatedCartItems = [
        ...cartItems.filter((item) => item.variant.id !== variantId),
        { variant: { id: variantId }, quantity },
      ];

      console.log("Updated Cart Items for Shopify Checkout:", updatedCartItems);

      // Call Shopify API to update the cart
      const response = await updateShopifyCheckout(updatedCartItems);

      console.log("Shopify Checkout Response:", response);

      if (response && response.errors) {
        console.error("Shopify checkout update failed:", response.errors);
        alert("Failed to sync with Shopify. Please try again.");
        return; // Stop further execution if Shopify update fails
      }

      // Sync the cart with Shopify after successful update
      await syncCartWithShopify();
    } catch (error) {
      console.error("Error handling add to cart:", error);

      // Trigger the alert only when a real error is caught
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleRemoveFromCart = async (variantId) => {
    try {
      console.log(`Attempting to remove item with variantId: ${variantId}`);

      // Create updated cart without the removed item
      const updatedCartItems = cartItems
        .filter((item) => item.variant.id !== variantId)
        .map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        }));

      // Log updated cart items to ensure correct data
      console.log("Updated cart items after removal:", updatedCartItems);

      // Update Redux store first to reflect the local cart change
      dispatch(removeFromCart(variantId));

      // Sync updated cart items with Shopify
      await updateShopifyCheckout(updatedCartItems);

      console.log("Cart successfully synced with Shopify after removal.");
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart. Please try again.");
    }
  };

  const handleCheckout = async () => {
    try {
      let currentCheckoutId = checkoutId;

      if (!currentCheckoutId) {
        currentCheckoutId = await createCheckout(
          cartItems.map((item) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
          }))
        );
      }

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

      const variables = { id: currentCheckoutId };
      const response = await client.request(query, variables);
      window.location.href = response.node.webUrl; // Redirect to the checkout URL
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout process failed. Please try again.");
    }
  };

  return { handleAddToCart, handleRemoveFromCart, handleCheckout, loading };
};
