import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { fetchProducts, fetchCategories } from "../actions/productActions";
import { NavLink, useParams } from "react-router-dom";
import "../styles/ProductList.css";

const ProductList = ({ dispatch, loading, products, categories, error }) => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories()); // Fetch categories when component mounts
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
        <div className="content">
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
                    <button
                      className="btn"
                      onClick={() => addToBasket(product)}
                    >
                      Bag it
                    </button>
                    <NavLink
                      to={`/products/${product.id.split("/").pop()}`}
                      className="btn"
                    >
                      View
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
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
