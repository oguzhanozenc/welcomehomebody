import React from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import "../styles/ProductList.css";

const ProductList = ({ title, products, addToBasket }) => {
  const location = useLocation();
  const isProductsPage = location.pathname.startsWith("/products");

  return (
    <div
      className={`product-list ${title.toLowerCase()}`}
      id={title.toLowerCase()}
    >
      <h1 className="product-type section-title">{title}</h1>
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
              <NavLink to="/products" className="filter-btn btn" end>
                All Products
              </NavLink>
              <NavLink to="/products/apparel" className="filter-btn btn">
                Apparel
              </NavLink>
              <NavLink to="/products/accessories" className="filter-btn btn">
                Accessories
              </NavLink>
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
                    <button
                      className="btn"
                      onClick={() => addToBasket(product)}
                    >
                      Bag it
                    </button>
                    <NavLink to={`/product/${product.id}`} className="btn">
                      View
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isProductsPage && (
        <div className="see-all-products">
          <Link to="/products" className="btn">
            SEE ALL PRODUCTS
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;
