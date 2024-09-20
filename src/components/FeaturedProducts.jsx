import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../actions/productActions";
import "../styles/FeaturedProducts.css";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.products);
  const [openWindows, setOpenWindows] = useState([]);
  const [closedWindows, setClosedWindows] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setOpenWindows(
        products.slice(0, 4).map((product) => product.id.split("/").pop())
      );
    }
  }, [products]);

  const closeWindow = (productId) => {
    setOpenWindows(openWindows.filter((id) => id !== productId));
    setClosedWindows([...closedWindows, productId]);
  };

  const reopenWindow = (productId) => {
    setOpenWindows([...openWindows, productId]);
    setClosedWindows(closedWindows.filter((id) => id !== productId));
  };

  const isSmallScreen = window.innerWidth <= 768;

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (error)
    return <div>Error! {error.message || "An unknown error occurred"}</div>;

  return (
    <div className="windows-xp-desktop">
      <div className="product-windows-container">
        {openWindows.map((productId) => {
          const product = products.find((p) => p.id.includes(productId));

          return (
            <div className="xp-window" key={productId}>
              <div className="window-header">
                <span className="window-title">{product.title}</span>
                <div className="window-controls">
                  <button onClick={() => closeWindow(productId)}>x</button>
                </div>
              </div>
              <div className="window-content">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="window-image"
                />
                <p>{product.description}</p>
                <div className="viewlinkcontainer">
                  <p className="featuredproducts-price">
                    {product.price.amount} {product.price.currencyCode}
                  </p>
                  <NavLink to={`/products/${productId}`} className="view-link">
                    View
                  </NavLink>
                </div>
              </div>
            </div>
          );
        })}

        {closedWindows.map((productId) => {
          const product = products.find((p) => p.id.includes(productId));

          return (
            <div className="reopen-icon-container" key={productId}>
              <img
                src={product.images[0]}
                alt="Reopen"
                className="reopen-icon"
                onClick={() => reopenWindow(productId)}
              />
              <p>{product.title}</p>
            </div>
          );
        })}
      </div>

      <div className="view-all-container">
        <NavLink to="/products" className="btn view-link" id="view-all-link">
          View All Products
        </NavLink>
      </div>
    </div>
  );
};

export default FeaturedProducts;
