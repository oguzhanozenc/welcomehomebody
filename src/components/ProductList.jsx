import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../actions/productActions";
import "../styles/ProductList.css";
import Loading from "./Loading";

const ProductList = ({ showRecent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { category, searchTerm } = useParams();

  const { loading, products, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading)
    return (
      <div className="productlist-loading">
        <Loading />
      </div>
    );
  if (error)
    return <div>Error! {error.message || "An unknown error occurred"}</div>;

  // Get unique categories from products
  const categories = [...new Set(products.map((product) => product.category))];

  // Filter products based on category and search term
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Limit to 4 products if showRecent is true
  if (showRecent) {
    filteredProducts = filteredProducts.slice(0, 4);
  }

  return (
    <div className="product-list" id="products">
      {!showRecent && (
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                navigate(`/products/category/${cat.toLowerCase()}`)
              }
              className={`filter-btn ${
                category === cat.toLowerCase() ? "active" : ""
              }`}
            >
              {cat}
            </button>
          ))}
          <button onClick={() => navigate("/products")} className="filter-btn">
            All Products
          </button>
        </div>
      )}
      <div className="products">
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            No products found. Please try a different search or category.
          </div>
        ) : (
          filteredProducts.map((product) => {
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
                  <div className="no-image-placeholder">No Image Available</div>
                )}
                <div className="product-details">
                  <h3 className="product-name">{product.title}</h3>
                  <p className="productlist-description">
                    {product.description.includes(".")
                      ? product.description.split(". ")[0] + "."
                      : product.description}
                  </p>

                  <div className="product-bottom">
                    <p className="product-price">
                      {product.price &&
                      product.price.amount &&
                      product.price.currencyCode
                        ? `${product.price.amount} ${product.price.currencyCode}`
                        : "Price not available"}
                    </p>
                    <NavLink to={`/products/${productId}`} className="btn">
                      View
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showRecent && (
        <div className="see-all-products">
          <button
            className="btn see-all-btn"
            onClick={() => navigate("/products")}
          >
            See All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
