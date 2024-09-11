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
import { toast } from "react-toastify";

export const useShopifyCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const productState = useSelector((state) => state.products);
  const [checkoutId, setCheckoutId] = useState(
    () => sessionStorage.getItem("checkoutId") || null
  );
  const [loading, setLoading] = useState(false);

  const createCheckout = async (lineItems) => {
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
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    };

    try {
      const response = await client.request(mutation, variables);
      const checkout = response.checkoutCreate.checkout;
      const checkoutErrors = response.checkoutCreate.userErrors;

      if (checkoutErrors.length > 0) {
        throw new Error(checkoutErrors[0].message);
      }

      setCheckoutId(checkout.id);
      sessionStorage.setItem("checkoutId", checkout.id);
      return checkout.webUrl;
    } catch (error) {
      toast.error("Failed to create checkout. Please try again.");
      console.error("Error creating Shopify checkout:", error);
      throw new Error("Checkout creation failed.");
    }
  };

  const handleCheckout = async () => {
    try {
      if (!checkoutId) {
        const checkoutUrl = await createCheckout(
          cartItems.map((item) => ({
            variantId: item.variant.id,
            quantity: item.quantity,
          }))
        );
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      } else {
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
      }
    } catch (error) {
      toast.error("Failed to proceed to checkout.");
      console.error("Checkout failed:", error);
    }
  };

  const handleAddToCart = async (variantId, quantity = 1) => {
    setLoading(true);
    try {
      if (!variantId) {
        toast.error("Invalid product variant. Please try again.");
        return; // Prevent adding invalid variant to the cart
      }

      let existingItem = cartItems.find(
        (item) => item.variant.id === variantId
      );

      if (existingItem) {
        dispatch(
          updateCartQuantity(variantId, existingItem.quantity + quantity)
        );
      } else {
        const product = productState.productDetails;
        if (product) {
          dispatch(
            addToCart({
              product,
              variant: product.variants.find((v) => v.id === variantId),
              quantity,
            })
          );
        } else {
          toast.error("Product not found. Please try again.");
          return;
        }
      }

      const updatedCartItems = [
        ...cartItems.filter((item) => item.variant.id !== variantId),
        { variant: { id: variantId }, quantity },
      ];

      await updateShopifyCheckout(updatedCartItems);

      toast.success("Item added to cart.");
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (variantId) => {
    setLoading(true);
    try {
      const updatedCartItems = cartItems
        .filter((item) => item.variant.id !== variantId)
        .map((item) => ({
          variantId: item.variant.id,
          quantity: item.quantity,
        }));

      dispatch(removeFromCart(variantId));

      await updateShopifyCheckout(updatedCartItems);

      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart. Please try again later.");
    } finally {
      setLoading(false);
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
      lineItems: lineItems.map((item) => {
        if (!item.variantId) {
          throw new Error("Invalid variantId"); // Extra check for invalid variant
        }
        return {
          variantId: item.variantId,
          quantity: item.quantity === 0 ? 0 : item.quantity,
        };
      }),
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

      dispatch(syncCartItems(updatedCartItems));
    } catch (error) {
      console.error("Error updating Shopify checkout:", error);
      throw new Error("Updating Shopify checkout failed.");
    }
  };

  return {
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    loading,
  };
};
