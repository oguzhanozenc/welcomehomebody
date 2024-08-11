import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import {
  fetchProducts,
  fetchCategories,
  fetchProductById,
} from "../actions/productActions";
import "../styles/ProductList.css";

const ProductList = ({
  dispatch,
  loading,
  products,
  categories,
  error,
  product,
}) => {
  const { category, id } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      if (category) {
        setFilteredProducts(
          products.filter((product) => product.category === category)
        );
      } else {
        setFilteredProducts(products);
      }
    }
  }, [products, category]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

  return (
    <div className="product-list">
      <div className="window">
        <div className="title-bar">
          <div className="title">{id ? product?.title : "Product List"}</div>
          <div className="buttons">
            <div className="button close"></div>
            <div className="button minimize"></div>
            <div className="button maximize"></div>
          </div>
        </div>
        <div className="content">
          {id ? (
            <div className="product-details">
              {product?.image && (
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />
              )}
              <h3 className="product-name">{product?.title}</h3>
              <p className="product-price">
                {typeof product?.price === "object" &&
                product?.price.currencyCode === "USD"
                  ? `${product.price.amount} ${product.price.currencyCode}`
                  : typeof product?.price === "object"
                  ? `${product.price.amount} USD`
                  : `${product?.price} USD`}
              </p>
              <p className="product-description">{product?.description}</p>
              <div className="product-btns">
                <button className="btn">Bag it</button>
                <NavLink to="/products" className="btn">
                  Back to Products
                </NavLink>
              </div>
            </div>
          ) : (
            <>
              <div className="filter-buttons">
                <NavLink to="/products" className="filter-btn btn" end>
                  All Products
                </NavLink>
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/products/${category.handle}`}
                    className="filter-btn btn"
                  >
                    {category.title}
                  </NavLink>
                ))}
              </div>

              <div className="products">
                {filteredProducts.map((product) => (
                  <div className="product" key={product.id}>
                    {product.image && (
                      <img
                        src={product.image}
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
                      <div className="productbtns">
                        <NavLink
                          to={`/products/${product.id}`}
                          className="btn"
                          onClick={() => console.log(product.id)}
                        >
                          View
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
  product: state.products.product,
});

export default connect(mapStateToProps)(ProductList);
