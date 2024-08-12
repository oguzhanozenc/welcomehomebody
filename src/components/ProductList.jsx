import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchProducts } from "../actions/productActions";
import "../styles/ProductList.css";

const ProductList = ({ dispatch, loading, products, error }) => {
  const [productsById, setProductsById] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const productsObject = products.reduce((acc, product) => {
        const productId = product.id.split("/").pop();
        acc[productId] = product;
        return acc;
      }, {});
      setProductsById(productsObject);
    }
  }, [products]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div>Error! {error.message || "An unknown error occurred"}</div>;

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
        <div className="content">
          <div className="products">
            {Object.keys(productsById).map((productId) => {
              const product = productsById[productId];
              return (
                <div className="product" key={productId}>
                  {product.images && product.images.length > 0 && (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="product-image"
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
                    <div className="product-btns">
                      <NavLink
                        to={`/products/${productId}`}
                        state={{ product }}
                        className="btn"
                      >
                        View
                      </NavLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.products.loading,
  products: state.products.products,
  categories: state.products.categories,
  error: state.products.error,
});

export default connect(mapStateToProps)(ProductList);
