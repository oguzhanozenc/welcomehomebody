import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/ProductList.css";

const ProductList = ({ title, products, addToBasket, filter, setFilter }) => {
  const location = useLocation();
  const isProductsPage = location.pathname === "/products";

  return (
    <div
      className={`product-list ${title.toLowerCase()}`}
      id={title.toLowerCase()}
    >
      {" "}
      <h1 className="product-type">{title}</h1>
      <div className="window">
        <div className="title-bar">
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
          <div className="title">{title}</div>
        </div>
        <div className="content">
          {isProductsPage && (
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All Products
              </button>
              <button
                className={`filter-btn ${filter === "apparel" ? "active" : ""}`}
                onClick={() => setFilter("apparel")}
              >
                Apparel
              </button>
              <button
                className={`filter-btn ${
                  filter === "accessories" ? "active" : ""
                }`}
                onClick={() => setFilter("accessories")}
              >
                Accessories
              </button>
            </div>
          )}
          <div className="products">
            {products.map((product) => (
              <div className="product" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-details">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                  <div className="productbtns">
                    <Link to={`/product/${product.id}`}>
                      <button className="btn">VIEW</button>
                    </Link>
                    <button
                      className="btn"
                      onClick={() => addToBasket(product)}
                    >
                      BAG IT
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isProductsPage && (
        <div className="see-all-products">
          <Link to="/products">
            <button className="btn see-all-btn">See All Products</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
