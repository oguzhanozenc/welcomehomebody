export const addToCart = (variantId, quantity) => async (dispatch) => {
  try {
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ id: variantId, quantity }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to add item to cart: ${response.statusText}`);
    }

    const data = await response.json();
    dispatch({ type: "ADD_TO_CART_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error adding to cart:", error);
    dispatch({ type: "ADD_TO_CART_FAILURE", payload: error.message });
  }
};

export const updateCart = () => async (dispatch) => {
  try {
    const response = await fetch("/cart.js");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to update cart: ${response.statusText}`);
    }

    const data = await response.json();
    dispatch({ type: "UPDATE_CART_SUCCESS", payload: data });
  } catch (error) {
    console.error("Error updating cart:", error);
    dispatch({ type: "UPDATE_CART_FAILURE", payload: error.message });
  }
};
