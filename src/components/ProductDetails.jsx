import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../client"; // Ensure client is properly imported

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("ProductDetails component rendered"); // Basic log to verify rendering

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id); // Log the ID being fetched
        const response = await client.product.fetchById(id);
        console.log("Product fetched:", response); // Log the response from API
        setProduct(response);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err); // Log the error
        setError(err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    console.log("Loading product details..."); // Log when loading
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error occurred:", error); // Log the error
    return <div>Error! {error.message}</div>;
  }

  if (!product) {
    console.log("No product found"); // Log when no product is found
    return <div>No product found</div>;
  }

  console.log("Product details:", product); // Log product details before rendering

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} />
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  );
};

export default ProductDetails;
