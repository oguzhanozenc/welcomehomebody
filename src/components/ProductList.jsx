import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProducts } from "../actions/productActions";
import Loading from "./Loading";
import "../styles/ProductList.css";
import { AiOutlineExpand, AiOutlineLine } from "react-icons/ai"; // Icon for expand functionality

const ProductList = () => {
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

  return (
    <div className="product-list" id="products">
      <div className="filter-buttons">
        <button
          onClick={() => navigate("/products")}
          className={`filter-btn ${!category ? "active" : ""}`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            // If the category is already selected, remove the filter by navigating to "/products"
            onClick={() =>
              category === cat.toLowerCase()
                ? navigate("/products")
                : navigate(`/products/category/${cat.toLowerCase()}`)
            }
            className={`filter-btn ${
              category === cat.toLowerCase() ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="productlist-windows-container">
        {filteredProducts.length === 0 ? (
          <div className="no-products-found">
            No products found. Please try a different search or category.
          </div>
        ) : (
          filteredProducts.map((product) => {
            const productId = product.id.split("/").pop();
            return (
              <div className="xp-window" key={productId}>
                <div className="window-header">
                  <span className="window-title">{product.title}</span>
                  <div className="window-controls"></div>
                </div>
                <div className="window-content">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title || "Product Image"}
                      className="product-image window-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">
                      No Image Available
                    </div>
                  )}
                  <p className="productlist-description">
                    {product.description.includes(".")
                      ? product.description.split(". ")[0] + "."
                      : product.description}
                  </p>
                  <div className="product-bottom">
                    <p className="product-price featuredproducts-price">
                      {product.price &&
                      product.price.amount &&
                      product.price.currencyCode
                        ? `${product.price.amount} ${product.price.currencyCode}`
                        : "Price not available"}
                    </p>
                    <NavLink
                      to={`/products/${productId}`}
                      className="btn view-link"
                    >
                      View
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductList;
