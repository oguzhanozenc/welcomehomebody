import React, { useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const navRef = useRef(null);
  const navigate = useNavigate();

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/products/search/${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="top-info-bar">
        <div className="contact-info">
          <span>info@homebody.com</span> | <span>+91-9876543210</span>
        </div>
        <div className="promo-message">
          Free shipping on total of $99 of all products
        </div>
      </div>

      <div className="top-bar">
        <Link to="/" className="logo-link">
          <img src="/navbarlogo-white.png" alt="Logo" className="logo" />
        </Link>
        <div className="search-bar">
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
        <div className="navbar-actions">
          <Link to="review-cart" className="cart-btn">
            <FaShoppingCart size={24} />
          </Link>

          <Link to="/account" className="account-btn">
            <FaUserCircle size={24} />
          </Link>
        </div>
      </div>

      <div className="nav-toggle">
        <button
          className="menu-toggle"
          aria-expanded={isNavOpen}
          onClick={toggleNav}
        >
          {isNavOpen ? <GiCancel size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
      </div>

      <div ref={navRef} className={`nav-links ${isNavOpen ? "open" : ""}`}>
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
