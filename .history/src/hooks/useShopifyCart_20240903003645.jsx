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
          product: 
