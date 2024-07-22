import React from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductPage.css";
import { products } from "./ProductData";

const ProductPage = ({ addToBasket }) => {
  const { id } = useParams();
  const allProducts = [...products.apparel, ...products.accessories];
  const product = allProducts.find((p) => p.id.toString() === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-page">
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
          <button
            onClick={() => addToBasket(product)}
            className="bag-it-button btn"
          >
            Bag it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
