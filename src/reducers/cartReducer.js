const cartReducer = (state = { items: [] }, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return { ...state, items: [...state.items, action.payload] };
    // Other cases for removing items etc.
    default:
      return state;
  }
};

export default cartReducer;
