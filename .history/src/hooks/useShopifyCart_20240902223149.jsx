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
  const [checkoutId, setCheckoutId] = useState(
    () => sessionStorage.getItem("checkoutId") || null
  );

  // Function to get product details by variant ID
  const getProductDetailsByVariantId = (variantId) => {
    return cartItems.find((item) => item.variant.id === variantId)?.product;
  };

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

      if (response.node.lineItems.edges.length > 0) {
        const shopifyCartItems = response.node.lineItems.edges.map((edge) => ({
          product: {
            id: edge.node.id,
            title: edge.node.variant.product.title,
            images: [edge.node.variant.product.images.edges[0].node.src],
          },
          variant: {
            id: edge.node.variant.id,
            priceV2: edge.node.variant.priceV2,
          },
          quantity: edge.node.quantity,
        }));

        // Sync with Redux store
        dispatch(syncCartItems(shopifyCartItems));
      } else {
        dispatch(syncCartItems([])); // Clear the cart in Redux if Shopify cart is empty
      }
    } catch (error) {
      console.error("Failed to sync cart with Shopify:", error);
    }
  }, [checkoutId, dispatch]);

  const useCartSync = () => {
    const [loading, setLoading] = useState(false);

    const syncCart = useCallback(async () => {
      setLoading(true);
      try {
        await syncCartWithShopify();
      } catch (error) {
        console.error("Failed to sync cart:", error);
      } finally {
        setLoading(false);
      }
    }, [syncCartWithShopify]);

    useEffect(() => {
      syncCart();
    }, [syncCart]);

    return { loading };
  };

  const { loading } = useCartSync();

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

      const variables = {
        input: {
          lineItems,
        },
      };

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
      lineItems,
    };

    try {
      const response = await client.request(mutation, variables);
      console.log("Shopify checkout updated:", response);

      const checkout = response.checkoutLineItemsReplace.checkout;

      if (!checkout.lineItems || !checkout.lineItems.edges) {
        throw new Error("Line items are undefined in the response");
      }

      // Sync with Redux after updating Shopify
      const updatedCartItems = checkout.lineItems.edges.map((edge) => ({
        product: {
          id: edge.node.id,
          title: edge.node.variant.product.title,
          images: [edge.node.variant.product.images.edges[0].node.src],
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
      throw new Error("Updating Shopify checkout failed.");
    }
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    try {
      const existingItem = cartItems.find(
        (item) => item.variant.id === variantId
      );

      if (existingItem) {
        dispatch(
          updateCartQuantity(variantId, existingItem.quantity + quantity)
        );
      } else {
        const product = getProductDetailsByVariantId(variantId);

        if (product) {
          dispatch(
            addToCart({
              product,
              variant: product.variants.find((v) => v.id === variantId),
              quantity,
            })
          );
        }
      }

      const updatedCartItems = cartItems.map((item) => ({
        variantId: item.variant.id,
        quantity: item.quantity,
      }));

      await updateShopifyCheckout(updatedCartItems);
      await syncCartWithShopify(); // Sync the cart with Shopify after updating
    } catch (error) {
      console.error("Error handling add to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const handleRemoveFromCart = async (variantId) => {
    try {
      dispatch(removeFromCart(variantId));

      const updatedCartItems = cartItems
        .filter((item) => item.variant.id !== variantId)
        .map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        }));

      await updateShopifyCheckout(updatedCartItems);
      await syncCartWithShopify(); // Sync the cart with Shopify after removing an item
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

      const checkoutUrl = response.node.webUrl;
      window.location.href = checkoutUrl; // Redirecting only at the final step
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout process failed. Please try again.");
    }
  };

  return { handleAddToCart, handleRemoveFromCart, handleCheckout, loading };
};
