import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart, FaUserCircle, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutCustomer } from "../actions/authActions";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const { isAuthenticated } = useSelector((state) => state.auth);

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/products/search/${searchTerm}`);
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutCustomer());
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Top Info Bar */}
      <div className="top-info-bar">
        <div className="contact-info">
          <span>info@homebody.com</span> | <span>+91-9876543210</span>
        </div>
        <div className="promo-message">Free shipping on orders over $99</div>
      </div>

      {/* Main Navbar */}
      <div className="main-nav">
        <Link to="/" className="logo-link">
          <img src="/navbarlogo-white.png" alt="Logo" className="logo" />
        </Link>

        {/* Desktop Search Bar */}
        <div className="search-bar-desktop">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          {/* Mobile Search Icon */}
          <button className="search-toggle" onClick={toggleSearch}>
            <FaSearch size={20} />
          </button>

          <Link to="/cart" className="cart-btn">
            <FaShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              {" "}
              <Link to="/account" className="account-btn">
                <FaUserCircle size={24} />
              </Link>
              <button onClick={handleLogout} className="btn logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="account-btn">
              <FaUserCircle size={24} />
            </Link>
          )}

          <button
            className="menu-toggle"
            aria-expanded={isNavOpen}
            onClick={toggleNav}
          >
            <GiHamburgerMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="search-bar-mobile">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Navigation Links */}
      <div className={`nav-links ${isNavOpen ? "open" : ""}`}>
        <NavLink to="/" className="nav-link" onClick={toggleNav}>
          Home
        </NavLink>
        <NavLink to="/products" className="nav-link" onClick={toggleNav}>
          Products
        </NavLink>
        <NavLink to="/about" className="nav-link" onClick={toggleNav}>
          About
        </NavLink>
        <NavLink to="/blog" className="nav-link" onClick={toggleNav}>
          Blog
        </NavLink>
        <NavLink to="/contact" className="nav-link" onClick={toggleNav}>
          Contact
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
