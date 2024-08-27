import { useRef, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/Navbar.css";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const navRef = useRef(null);

  const toggleNav = () => {
    setNavOpen((prev) => !prev);
  };

  const handleCartClick = () => {
    window.location.href = `https://${
      import.meta.env.VITE_SHOPIFY_DOMAIN
    }/cart`;
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
        <div>
          <Link to="/">
            <img src="/navbarlogo.png" alt="Logo" className="logo" />
          </Link>
        </div>
        <div ref={navRef} className={`nav-links ${isNavOpen ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={toggleNav}>
            HOME
          </NavLink>
          <Link to="/#about" className="nav-link" onClick={toggleNav}>
            ABOUT
          </Link>
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
        <div className="cart-icon-container">
          <button className="cart-btn" onClick={handleCartClick}>
            <img src="/basket.png" className="cart-icon" alt="Cart" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
