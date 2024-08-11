import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaTrash } from "react-icons/fa";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const navRef = useRef(null);

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button className="menu-toggle" aria-expanded={isNavOpen}>
          {isNavOpen ? <GiCancel size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
        <Link to="/">
          <img src="/navbarlogo.png" alt="Logo" className="logo" />
        </Link>
        <div ref={navRef} className={`nav-links ${isNavOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link">
            HOME
          </NavLink>
          <a href="#about" className="nav-link">
            ABOUT
          </a>
          <NavLink to="/products" className="nav-link">
            PRODUCTS
          </NavLink>
          <NavLink to="/blog" className="nav-link">
            BLOG
          </NavLink>
          <NavLink to="/contact" className="nav-link">
            CONTACT
          </NavLink>
        </div>
        <button className="basket-toggle" aria-label="Basket">
          <img src="/basket.png" alt="Basket" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
