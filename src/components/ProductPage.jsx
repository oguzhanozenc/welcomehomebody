import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchProductById } from "../actions/productActions";
import { useParams } from "react-router-dom";
import "../styles/ProductPage.css";

const ProductPage = ({ dispatch, loading, product, error }) => {
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  // Add a check to ensure product is not null or undefined
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="product-page">
      <div className="product-details">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />
        )}
        <h3 className="product-name">{product.title}</h3>
        <p className="product-price">
          {typeof product.price === "object" &&
          product.price.currencyCode === "USD"
            ? `${product.price.amount} ${product.price.currencyCode}`
            : typeof product.price === "object"
            ? `${product.price.amount} USD`
            : `${product.price} USD`}
        </p>
        <p className="product-description">{product.description}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  loading: state.products.loading,
  product: state.products.product,
  error: state.products.error,
});

export default connect(mapStateToProps)(ProductPage);
