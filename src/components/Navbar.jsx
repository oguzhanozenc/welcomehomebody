import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaTrash } from "react-icons/fa";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { useBasket } from "./BasketContext";

const Navbar = ({ isOpen, toggleNavbar }) => {
  const [isBasketOpen, setBasketOpen] = React.useState(false);
  const { basket, removeFromBasket } = useBasket();

  const handleMenuToggle = () => {
    toggleNavbar();
  };

  const handleBasketToggle = () => {
    setBasketOpen((prev) => !prev);
  };

  const closeBasket = () => {
    setBasketOpen(false);
  };

  React.useEffect(() => {
    if (basket.length > 0) {
      setBasketOpen(true);
    }
  }, [basket.length]);

  React.useEffect(() => {
    if (isOpen) {
      setBasketOpen(true);
    }
  }, [isOpen]);

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <button
          className="menu-toggle"
          onClick={handleMenuToggle}
          aria-expanded={isOpen}
        >
          {isOpen ? <GiCancel size={24} /> : <GiHamburgerMenu size={24} />}
        </button>
        <Link to="/">
          <img src="/navbarlogo.png" alt="Logo" className="logo" />
        </Link>
        <div className="nav-links">
          <NavLink to="/" className="nav-link" onClick={toggleNavbar}>
            HOME
          </NavLink>
          <NavLink
            to="/products/all"
            className="nav-link"
            onClick={toggleNavbar}
          >
            PRODUCTS
          </NavLink>
          <NavLink to="/blog" className="nav-link" onClick={toggleNavbar}>
            BLOG
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={toggleNavbar}>
            CONTACT
          </NavLink>
          <a href="#about" className="nav-link" onClick={toggleNavbar}>
            ABOUT
          </a>
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

      <div className={`basket-content ${isBasketOpen ? "open" : ""}`}>
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
