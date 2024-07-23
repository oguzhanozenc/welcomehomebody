import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ basket, toggleOrderNavbar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const handleNavClick = (hash) => {
    if (!isHomePage) {
      navigate(`/#${hash}`);
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const basketCount = basket.length;

  return (
    <nav className="navbar">
      <div id="navbarlogo" key="navbarlogo">
        <Link to="/" key="navbarlink">
          <img src="/navbarlogo.png" alt="Logo" />
        </Link>
      </div>
      <div className="navbarmenu">
        <div>
          {isHomePage ? (
            <a
              href="#home"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("home");
              }}
            >
              HOME
            </a>
          ) : (
            <Link to="/" className="nav-link">
              HOME
            </Link>
          )}
        </div>

        <div>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("about");
            }}
          >
            ABOUT
          </a>
        </div>

        <div>
          <Link to="/products/all" className="nav-link">
            PRODUCTS
          </Link>
        </div>

        <div>
          <a
            href="#blog"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("blog");
            }}
          >
            BLOG
          </a>
        </div>

        <div id="contactbtn" className="navbutton nav--contactbtn">
          <a
            href="#contact"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("contact");
            }}
          >
            CONTACT
          </a>
        </div>
      </div>
      <div className="basket" onClick={toggleOrderNavbar}>
        <img src="/basket.png" alt="Basket" />
        {basketCount > 0 && <div className="basket-count">{basketCount}</div>}
      </div>
    </nav>
  );
}
