import React, { createContext, useContext, useState } from "react";

// Create the context
const BasketContext = createContext();

// Create the provider component
export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  // Add an item to the basket
  const addToBasket = (item) => {
    // Check if the item is already in the basket
    const itemIndex = basket.findIndex(
      (basketItem) => basketItem.id === item.id
    );
    if (itemIndex === -1) {
      setBasket((prevBasket) => [...prevBasket, item]);
    } else {
      console.warn("Item already in the basket");
    }
  };

  // Remove an item from the basket by index
  const removeFromBasket = (index) => {
    setBasket((prevBasket) => prevBasket.filter((_, i) => i !== index));
  };

  // Clear all items from the basket
  const clearBasket = () => {
    setBasket([]);
  };

  // Provide the basket state and functions to the context consumers
  return (
    <BasketContext.Provider
      value={{ basket, addToBasket, removeFromBasket, clearBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
};

// Create a custom hook to use the context
export const useBasket = () => useContext(BasketContext);
