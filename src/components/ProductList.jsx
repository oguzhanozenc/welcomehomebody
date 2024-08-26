import React, { useEffect } from "react";
import { connect } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../actions/productActions";
import "../styles/ProductList.css";

const ProductList = ({ dispatch, loading, products, error, showRecent }) => {
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div className="productlist-loading">Loading...</div>;
  if (error)
    return <div>Error! {error.message || "An unknown error occurred"}</div>;

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))];

  // Filter products based on the category from the URL
  const filteredProducts = category
    ? products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      )
    : products;

  const productsToDisplay = showRecent
    ? filteredProducts.slice(-4)
    : filteredProducts;

  const handleSeeAllProducts = () => {
    navigate("/products");
  };

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
          {!showRecent && (
            <div className="filter-buttons">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    navigate(`/products/category/${cat.toLowerCase()}`)
                  }
                  className="btn"
                >
                  {cat}
                </button>
              ))}
              <button onClick={() => navigate("/products")} className="btn">
                All Products
              </button>
            </div>
          )}
          <div className="products">
            {productsToDisplay.map((product) => {
              const productId = product.id.split("/").pop();
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

          {showRecent && (
            <div className="see-all-products">
              <button onClick={handleSeeAllProducts} className="btn">
                See All Products
              </button>
            </div>
          )}
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
