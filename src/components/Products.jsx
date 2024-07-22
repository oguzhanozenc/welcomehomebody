import React, { useState } from "react";
import ProductList from "./ProductList";
import { products } from "./ProductData";

const Products = ({ addToBasket }) => {
  const [filter, setFilter] = useState("all");

  const filteredProducts =
    filter === "all"
      ? [...products.apparel, ...products.accessories]
      : products[filter];

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
        filter={filter}
        setFilter={setFilter}
      />
    </div>
  );
};

export default Products;
