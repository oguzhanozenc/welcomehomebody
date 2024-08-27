import { useDispatch } from "react-redux";

export const useShopifyCart = () => {
  const dispatch = useDispatch();

  const extractNumericVariantId = (variantId) => {
    // If the variantId is in the Shopify Global ID format, extract the numeric ID
    if (variantId.startsWith("gid://shopify/ProductVariant/")) {
      return variantId.split("/").pop(); // This gets the numeric part of the ID
    }
    return variantId; // Otherwise, return the ID as is
  };

  const addToCartInShopify = async (variantId, quantity = 1) => {
    try {
      const numericVariantId = extractNumericVariantId(variantId);

      // Ensure the variant ID is in numeric format
      if (!numericVariantId || isNaN(numericVariantId)) {
        throw new Error("Invalid numeric variant ID");
      }

      // Replace with your actual Shopify store domain
      const shopifyDomain = import.meta.env.VITE_SHOPIFY_DOMAIN;

      // Construct the cart URL
      const cartUrl = `https://${shopifyDomain}/cart/add?id=${numericVariantId}&quantity=${quantity}`;

      // Redirect to Shopify cart page
      window.location.href = cartUrl;
    } catch (error) {
      console.error("Error adding to Shopify cart:", error.message);
    }
  };

  const handleAddToCart = (variantId, quantity = 1) => {
    if (!variantId) {
      console.error("Variant ID is required to add to cart");
      return;
    }

    addToCartInShopify(variantId, quantity);
  };

  return { handleAddToCart };
};
