import React from "react";
import client from "./shopifyClient";

const AddToCartButton = ({ productId }) => {
  const handleAddToCart = async () => {
    const checkout = await client.checkout.create();
    const lineItemsToAdd = [
      {
        variantId: productId,
        quantity: 1,
      },
    ];

    const checkoutWithLineItems = await client.checkout.addLineItems(
      checkout.id,
      lineItemsToAdd
    );
    console.log(checkoutWithLineItems);
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
};

export default AddToCartButton;
