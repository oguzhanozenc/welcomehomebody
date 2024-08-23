import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import client from "../client";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartQuantity } from "../actions/cartActions";

export const useShopifyCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [checkoutId, setCheckoutId] = useState(
    localStorage.getItem("checkoutId") || null
  );

  const getProductDetailsByVariantId = (variantId) => {
    return cartItems.find((item) => item.variant.id === variantId)?.product;
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const createCheckout = async (lineItems) => {
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
    localStorage.setItem("checkoutId", newCheckoutId);

    return newCheckoutId;
  };

  const addToCartInShopify = async (variantId, quantity = 1) => {
    try {
      let currentCheckoutId = checkoutId;

      // If there's no checkout ID, create a new checkout
      if (!currentCheckoutId) {
        currentCheckoutId = await createCheckout([{ variantId, quantity }]);
      }

      const mutation = gql`
        mutation ($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
          checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
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
        checkoutId: currentCheckoutId,
        lineItems: [
          {
            variantId,
            quantity,
          },
        ],
      };

      const response = await client.request(mutation, variables);
      const checkout = response.checkoutLineItemsAdd.checkout;

      const newItem = checkout.lineItems.edges.find(
        (item) => item.node.variant.id === variantId
      );

      if (newItem) {
        dispatch(
          addToCart({
            product: {
              id: newItem.node.id,
              title: newItem.node.variant.product.title,
              images: [newItem.node.variant.product.images.edges[0].node.src],
            },
            variant: {
              id: newItem.node.variant.id,
              priceV2: newItem.node.variant.priceV2,
            },
            quantity: newItem.node.quantity,
          })
        );
      }

      console.log("Item added to Shopify cart:", checkout);
    } catch (error) {
      console.error("Error adding to Shopify cart:", error);
    }
  };

  const handleAddToCart = (variantId, quantity = 1) => {
    const existingItem = cartItems.find(
      (item) => item.variant.id === variantId
    );

    if (existingItem) {
      dispatch(updateCartQuantity(variantId, existingItem.quantity + quantity));
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

    addToCartInShopify(variantId, quantity);
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
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  return { handleAddToCart, handleCheckout };
};
