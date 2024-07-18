import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h2 className="footer-heading">Explore</h2>
            <ul className="footer-nav">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Apparel</a>
              </li>
              <li>
                <a href="#">Accessories</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h2 className="footer-heading">Connect</h2>
            <ul className="footer-social">
              <li>
                <a href="#">
                  <i className="fab fa-facebook">Facebook</i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-twitter">Twitter</i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram">Instagram</i>
                </a>
              </li>{" "}
              <li>
                <a href="#">
                  <i className="fab fa-tiktok">Tiktok</i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Homebody. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
