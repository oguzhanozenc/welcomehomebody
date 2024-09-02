// productActions.js
import { gql } from "graphql-request";
import client from "../client";

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_PRODUCT_DETAILS_BEGIN = "FETCH_PRODUCT_DETAILS_BEGIN";
export const FETCH_PRODUCT_DETAILS_SUCCESS = "FETCH_PRODUCT_DETAILS_SUCCESS";
export const FETCH_PRODUCT_DETAILS_FAILURE = "FETCH_PRODUCT_DETAILS_FAILURE";

export const fetchProducts =
  (limit = 50) =>
  async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BEGIN });
    try {
      const query = gql`
        query getProducts($first: Int!) {
          products(first: $first) {
            edges {
              node {
                id
                title
                description
                productType
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
                    }
                  }
                }
                images(first: 5) {
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
      `;

      const variables = { first: limit };
      const response = await client.request(query, variables);
      const products = response.products.edges.map((edge) => edge.node);

      const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.variants.edges[0]?.node.priceV2.amount || "N/A",
        images: product.images.edges.map((edge) => edge.node.src),
        category: product.productType || "Uncategorized",
        description: product.description || "",
        variants: product.variants.edges.map((edge) => edge.node),
      }));

      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: formattedProducts });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
    }
  };

export const fetchProductDetails = (productId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCT_DETAILS_BEGIN });
  try {
    const query = gql`
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          productType
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
              }
            }
          }
          images(first: 5) {
            edges {
              node {
                src
              }
            }
          }
        }
      }
    `;

    const variables = { id: productId };
    const response = await client.request(query, variables);
    const product = response.product;

    const formattedProduct = {
      id: product.id,
      title: product.title,
      price: product.variants.edges[0]?.node.priceV2.amount || "N/A",
      images: product.images.edges.map((edge) => edge.node.src),
      category: product.productType || "Uncategorized",
      description: product.description || "",
      variants: product.variants.edges.map((edge) => edge.node),
    };

    dispatch({
      type: FETCH_PRODUCT_DETAILS_SUCCESS,
      payload: formattedProduct,
    });
  } catch (error) {
    dispatch({ type: FETCH_PRODUCT_DETAILS_FAILURE, payload: error.message });
  }
};
