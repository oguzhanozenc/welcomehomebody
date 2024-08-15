import React, { useEffect } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { fetchProducts } from "../actions/productActions";
import "../styles/ProductList.css";

const ProductList = ({ dispatch, loading, products, error }) => {
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div>Error! {error.message || "An unknown error occurred"}</div>;

  return (
    <div className="product-list" id="products">
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
            {products.map((product) => {
              const productId = product.id.split("/").pop();
              console.log("Product ID in ProductList:", productId);
              return (
                <div className="product" key={productId}>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product Image"}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      No Image Available
                    </div>
                  )}
                  <div className="product-details">
                    <h3 className="product-name">{product.title}</h3>
                    <p className="product-price">
                      {typeof product.price === "object"
                        ? `${product.price.amount} ${product.price.currencyCode}`
                        : `${product.price} USD`}
                    </p>
                    <div className="product-btns">
                      <NavLink to={`/products/${productId}`} className="btn">
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
  error: state.products.error,
});

export default connect(mapStateToProps)(ProductList);
