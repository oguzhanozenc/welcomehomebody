import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
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
            href="#apparel"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("apparel");
            }}
          >
            APPAREL
          </a>
        </div>

        <div>
          <a
            href="#accessories"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("accessories");
            }}
          >
            ACCESSORIES
          </a>
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
    </nav>
  );
}
