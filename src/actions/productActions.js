import { gql } from "graphql-request";
import client from "../client";

export const FETCH_PRODUCTS_REQUEST = "FETCH_PRODUCTS_REQUEST";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

export const FETCH_PRODUCT_DETAILS_REQUEST = "FETCH_PRODUCT_DETAILS_REQUEST";
export const FETCH_PRODUCT_DETAILS_SUCCESS = "FETCH_PRODUCT_DETAILS_SUCCESS";
export const FETCH_PRODUCT_DETAILS_FAILURE = "FETCH_PRODUCT_DETAILS_FAILURE";

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_REQUEST });
  const query = gql`
    {
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            tags
          }
        }
      }
    }
  `;
  try {
    const data = await client.request(query);
    const products = data.products.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      images: node.images.edges.map(({ node }) => node.src),
      price:
        node.variants.edges.length > 0 && node.variants.edges[0].node.priceV2
          ? node.variants.edges[0].node.priceV2
          : null,
      category: node.tags[0], // Assuming the first tag is the category
    }));
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
  }
};

export const fetchProductDetails = (productId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_DETAILS_REQUEST });
  const query = gql`
    query ($id: ID!) {
      node(id: $id) {
        ... on Product {
          id
          title
          description
          images(first: 10) {
            edges {
              node {
                src
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                priceV2 {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { id: productId };
  try {
    const data = await client.request(query, variables);
    const product = data.node;
    product.images = product.images.edges.map(({ node }) => node.src);
    product.variants = product.variants.edges.map(({ node }) => node);
    // Optionally set the default price to the first variant's price
    product.price =
      product.variants.length > 0 && product.variants[0].priceV2
        ? product.variants[0].priceV2
        : null;
    dispatch({ type: FETCH_PRODUCT_DETAILS_SUCCESS, payload: product });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCT_DETAILS_FAILURE, payload: error.message });
  }
};
