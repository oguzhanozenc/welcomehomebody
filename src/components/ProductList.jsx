import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchProducts } from "../actions/productActions";
import { NavLink, useLocation, Link } from "react-router-dom";
import "../styles/ProductList.css";

const ProductList = ({ dispatch, loading, products, error }) => {
  const location = useLocation();
  const isProductsPage = location.pathname.startsWith("/products");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="product-list">
      <div className="window">
        <div className="title-bar">
          <div className="title">Product List</div>
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
        </div>
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
              {product.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                  style={{ maxWidth: "200px", height: "auto" }}
                />
              )}
              <div className="product-details">
                <h3 className="product-name">{product.title}</h3>
                <p className="product-price">
                  {typeof product.price === "object" &&
                  product.price.currencyCode === "USD"
                    ? `${product.price.amount} ${product.price.currencyCode}`
                    : typeof product.price === "object"
                    ? `${product.price.amount} USD`
                    : `${product.price} USD`}
                </p>
                <div className="productbtns">
                  <button className="btn" onClick={() => addToBasket(product)}>
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

const mapStateToProps = (state) => ({
  loading: state.products.loading,
  products: state.products.products,
  error: state.products.error,
});

export default connect(mapStateToProps)(ProductList);
