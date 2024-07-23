import React from "react";
import { Link } from "react-router-dom";
import "../styles/MobileNavbar.css";

export default function MobileNavbar({ basket, toggleOrderNavbar }) {
  const handleNavClick = (hash) => {
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="mobile-navbar">
      <div id="mobile-navbarlogo" key="mobile-navbarlogo">
        <Link to="/" key="mobile-navbarlink">
          <img src="/navbarlogo.png" alt="Logo" />
        </Link>
      </div>
      <div>
        <a
          href="#about"
          className="mobile-nav-link"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("about");
          }}
        >
          ABOUT{" "}
        </a>
      </div>
      <div className="mobile-nav-menu">
        <div>
          <Link to="/products" key="mobile-navbarlink">
            PRODUCTS
          </Link>
        </div>

        <div>
          <a
            href="#blog"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("blog");
            }}
          >
            BLOG
          </a>
        </div>

        <div id="mobile-contactbtn" className="mobile-navbutton">
          <a
            href="#contact"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("contact");
            }}
          >
            CONTACT
          </a>
        </div>
      </div>
      <div className="mobile-basket" onClick={toggleOrderNavbar}>
        <img src="./basket.png" alt="Basket" />
        <span>{basket.length}</span>
      </div>
    </nav>
  );
}
