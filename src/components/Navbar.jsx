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
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    dispatch(logoutCustomer());
    setLogoutConfirmOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Top Info Bar */}
      <div className="top-info-bar">
        <div className="promo-message"></div>{" "}
        <div className="contact-info">homebodybiz24@gmail.com</div>
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
            <img src="/cart.png" alt="cart" width="36" />
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <div
              className="account-menu"
              onMouseEnter={toggleDropdown}
              onMouseLeave={toggleDropdown}
            >
              <FaUserCircle size={24} className="account-icon" />
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/account" className="dropdown-item">
                    Account
                  </Link>
                  <button
                    className="dropdown-item nav-logout-btn"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="account-btn">
              <img src="/user.png" alt="user" width="36" />
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

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="logout-confirm-modal">
          <p>Are you sure you want to log out?</p>
          <button onClick={confirmLogout} className="confirm-btn">
            Yes
          </button>
          <button
            onClick={() => setLogoutConfirmOpen(false)}
            className="cancel-btn"
          >
            No
          </button>
        </div>
      )}

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
