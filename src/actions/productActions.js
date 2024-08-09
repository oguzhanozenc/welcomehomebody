import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "cc0986-23.myshopify.com",
  storefrontAccessToken: "6705ab9698d1069f9c71f9575e27183d",
});

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BEGIN });
    try {
      const products = await client.product.fetchAll();
      const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.variants[0].price, // Adjust based on your product structure
        image: product.images[0]?.src, // Adjust based on your product structure
      }));
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: formattedProducts });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error });
    }
  };
};
