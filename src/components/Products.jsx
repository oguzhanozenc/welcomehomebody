import React from "react";
import { useParams, Link } from "react-router-dom";
import ProductList from "./ProductList";
import { products } from "./ProductData";

const Products = ({ addToBasket }) => {
  const { filter = "all" } = useParams();

  const filteredProducts =
    filter === "all"
      ? [...products.apparel, ...products.accessories]
      : products[filter] || [];

  return (
    <div className="products-page">
      <ProductList
        title={
          filter === "all"
            ? "All Products"
            : filter.charAt(0).toUpperCase() + filter.slice(1)
        }
        products={filteredProducts}
        addToBasket={addToBasket}
      />
    </div>
  );
};

export default Products;
