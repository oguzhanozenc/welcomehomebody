import React from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ProductPage.css";
import { products } from "./ProductData";
import { useBasket } from "./BasketContext";

const ProductPage = () => {
  const { id } = useParams();
  const allProducts = [...products.apparel, ...products.accessories];
  const product = allProducts.find((p) => p.id.toString() === id);

  const { addToBasket } = useBasket();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToBasket = () => {
    addToBasket(product);
  };

  return (
    <div className="product-page">
      <Link to="/products" className="return-link btn">
        Return to Products
      </Link>
      <div className="retro-window">
        <div className="title-bar">
          <div className="title">Product Details</div>
        </div>
        <div className="content">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-description">{product.description}</p>
          <button onClick={handleAddToBasket} className="bag-it-button btn">
            Bag it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
