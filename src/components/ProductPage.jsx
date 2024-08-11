import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const numericId = id.split("/").pop();

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${numericId}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="product-page">
      {product ? (
        <div className="product-details">
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
            />
          )}
          <h3 className="product-name">{product.title}</h3>
          <p className="product-price">{product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="btn">Add to Cart</button>
        </div>
      ) : (
        <div>Product not found.</div>
      )}
    </div>
  );
};

export default ProductPage;
