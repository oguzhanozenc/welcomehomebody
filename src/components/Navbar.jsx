import React, { useEffect, useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaTrash } from "react-icons/fa";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { useBasket } from "./BasketContext";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);
  const [isBasketOpen, setBasketOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { basket, removeFromBasket } = useBasket();

  const navRef = useRef(null);
  const basketRef = useRef(null);

  const handleMenuToggle = () => {
    setNavOpen((prev) => !prev);
    if (isBasketOpen) {
      setBasketOpen(false);
    }
  };

  const handleBasketToggle = () => {
    setBasketOpen((prev) => !prev);
    if (isNavOpen) {
      setNavOpen(false);
    }
  };

  const closeBasket = () => {
    setBasketOpen(false);
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setNavOpen(false);
    }
    if (basketRef.current && !basketRef.current.contains(event.target)) {
      setBasketOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (basket.length > 0) {
      setBasketOpen(true);
    }
  }, [basket.length]);

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button
          className="menu-toggle"
          onClick={handleMenuToggle}
          aria-expanded={isNavOpen}
        >
          {isNavOpen ? <GiCancel size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
        <Link to="/">
          <img src="/navbarlogo.png" alt="Logo" className="logo" />
        </Link>
        <div ref={navRef} className={`nav-links ${isNavOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className="nav-link"
            onClick={isMobile ? handleMenuToggle : undefined}
          >
            HOME
          </NavLink>
          <a
            href="#about"
            className="nav-link"
            onClick={isMobile ? handleMenuToggle : undefined}
          >
            ABOUT
          </a>
          <NavLink
            to="/products/all"
            className="nav-link"
            onClick={isMobile ? handleMenuToggle : undefined}
          >
            PRODUCTS
          </NavLink>
          <NavLink
            to="/blog"
            className="nav-link"
            onClick={isMobile ? handleMenuToggle : undefined}
          >
            BLOG
          </NavLink>
          <NavLink
            to="/contact"
            className="nav-link"
            onClick={isMobile ? handleMenuToggle : undefined}
          >
            CONTACT
          </NavLink>
        </div>
        <button
          className="basket-toggle"
          onClick={handleBasketToggle}
          aria-label="Basket"
        >
          <img src="/basket.png" alt="Basket" />
          {basket.length > 0 && (
            <div className="basket-count">{basket.length}</div>
          )}
        </button>
      </div>

      <div
        ref={basketRef}
        className={`basket-content ${isBasketOpen ? "open" : ""}`}
      >
        <div className="basket-header">
          <h2>Basket</h2>
          <button className="close-basket" onClick={closeBasket}>
            <GiCancel size={24} />
          </button>
        </div>
        <ul className="basket-list">
          {basket.map((item, index) => (
            <li key={index} className="basket-item">
              <Link to={`/product/${item.id}`} className="basket-item-link">
                <img
                  src={item.image}
                  alt={item.name}
                  className="basket-item-image"
                />
                <div className="basket-item-details">
                  <span className="basket-item-name">{item.name}</span>
                  <span className="basket-item-price">{item.price}</span>
                </div>
              </Link>
              <button
                className="remove-btn"
                onClick={() => removeFromBasket(index)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <Link to="/checkout" className="checkout-link" onClick={closeBasket}>
          Go to Checkout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
