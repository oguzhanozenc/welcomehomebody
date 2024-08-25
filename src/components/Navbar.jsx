import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import Cart from "./Cart"; // Import the Cart component here

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false); // State to toggle cart
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const toggleCart = () => {
    setCartOpen((prev) => !prev); // Toggle cart drawer
  };

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button
          className="menu-toggle"
          aria-expanded={isNavOpen}
          onClick={toggleNav}
        >
          {isNavOpen ? <GiCancel size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
        <Link to="/">
          <img src="/navbarlogo.png" alt="Logo" className="logo" />
        </Link>
        <div ref={navRef} className={`nav-links ${isNavOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={toggleNav}>
            HOME
          </NavLink>
          <a href="#about" className="nav-link" onClick={toggleNav}>
            ABOUT
          </a>
          <NavLink to="/products" className="nav-link" onClick={toggleNav}>
            PRODUCTS
          </NavLink>
          <NavLink to="/blog" className="nav-link" onClick={toggleNav}>
            BLOG
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={toggleNav}>
            CONTACT
          </NavLink>
        </div>
        <div>
          {" "}
          <button className="cart-toggle" onClick={toggleCart}>
            <FaShoppingCart size={24} />
          </button>
        </div>
      </div>
      <Cart isOpen={isCartOpen} toggleCart={toggleCart} />{" "}
    </nav>
  );
};

export default Navbar;
