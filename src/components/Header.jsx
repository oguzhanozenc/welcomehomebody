import React, { useState } from "react";
import "../styles/Header.css";
import SectionTitle from "./SectionTitle";

export default function Header() {
  return (
    <header className="header" id="home">
      <div className="header-content">
        <div className="background-overlay" aria-hidden="true"></div>
        <div className="logo-container">
          <picture>
            <source srcSet="./logo.webp" type="image/webp" />
            <img src="./logo.gif" alt="Company Logo" className="logo-image" />
          </picture>
        </div>
        <div className="main-statement">
          <SectionTitle
            title="We got that, we do that, we are that."
            className="white-text"
          />
        </div>
        <div className="explorebtn-container">
          <a href="/#featuredproducts" className="explore-btn">
            Explore »
          </a>
        </div>
      </div>
    </header>
  );
}
