import client from "../client";

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BEGIN });
    try {
      const products = await client.product.fetchAll();
      console.log("Fetched products:", products);
      const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        images: product.images ? product.images.map((img) => img.src) : [],
        videos: product.videos ? product.videos.map((vid) => vid.src) : [],
        category: product.category,
        description: product.description || "",
      }));
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: formattedProducts });
    } catch (error) {
      console.error("Error fetching products:", error);
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error });
    }
  };
};
