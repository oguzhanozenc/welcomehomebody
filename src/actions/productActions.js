import client from "../client";

export const FETCH_PRODUCTS_BEGIN = "FETCH_PRODUCTS_BEGIN";
export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";
export const FETCH_PRODUCTS_FAILURE = "FETCH_PRODUCTS_FAILURE";
export const FETCH_PRODUCT_BY_ID_BEGIN = "FETCH_PRODUCT_BY_ID_BEGIN";
export const FETCH_PRODUCT_BY_ID_SUCCESS = "FETCH_PRODUCT_BY_ID_SUCCESS";
export const FETCH_PRODUCT_BY_ID_FAILURE = "FETCH_PRODUCT_BY_ID_FAILURE";

export const FETCH_CATEGORIES_BEGIN = "FETCH_CATEGORIES_BEGIN";
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS";
export const FETCH_CATEGORIES_FAILURE = "FETCH_CATEGORIES_FAILURE";

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BEGIN });
    try {
      const products = await client.product.fetchAll();
      const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        image: product.images[0]?.src,
        category: product.category,
      }));
      dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: formattedProducts });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error });
    }
  };
};

export const fetchProductById = (id) => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PRODUCT_BY_ID_BEGIN });
    try {
      const product = await client.product.fetchById(id);
      const formattedProduct = {
        id: product.id,
        title: product.title,
        price: product.variants[0].price,
        image: product.images[0]?.src,
        description: product.description,
        category: product.category,
      };
      dispatch({
        type: FETCH_PRODUCT_BY_ID_SUCCESS,
        payload: formattedProduct,
      });
    } catch (error) {
      dispatch({ type: FETCH_PRODUCT_BY_ID_FAILURE, payload: error });
    }
  };
};

export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_BEGIN });
    try {
      const collections = await client.collection.fetchAll();

      console.log(collections);

      const formattedCollections = collections.map((collection) => ({
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
      }));
      dispatch({
        type: FETCH_CATEGORIES_SUCCESS,
        payload: formattedCollections,
      });
    } catch (error) {
      dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error });
    }
  };
};
