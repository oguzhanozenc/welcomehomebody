import React from "react";
import { useParams } from "react-router-dom";
import ProductList from "./ProductList";
import { products } from "./ProductData";
import { useBasket } from "./BasketContext";

const Products = () => {
  const { filter } = useParams();
  const { addToBasket } = useBasket();

  const filteredProducts =
    filter === undefined || filter === "all"
      ? [...products.apparel, ...products.accessories]
      : products[filter] || [];

  return (
    <div className="products-page section">
      <ProductList
        title={
          filter === undefined || filter === "all"
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
