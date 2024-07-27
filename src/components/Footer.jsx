import React from "react";
import "../styles/Footer.css";
import { NavLink, Link } from "react-router-dom";
import { IoLogoInstagram, IoLogoTiktok } from "react-icons/io5";
import { FaFacebook } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {" "}
        <div className="footer-section">
          <h2 className="footer-heading">Explore</h2>
          <div className="footer-nav">
            <NavLink to="/">HOME</NavLink>
            <a href="#about">ABOUT</a>
            <NavLink to="/products/all" className="footer-nav-link">
              PRODUCTS
            </NavLink>
            <NavLink to="/blog">BLOG</NavLink>
            <NavLink to="/contact">CONTACT</NavLink>
          </div>
        </div>{" "}
        <div className="footer-section footer-card">
          <div className="footer-logocontainer">
            <img src="./navbarlogo.png" alt="" />
          </div>
          <div>
            <p className="footer-slogan">Retro Arcade Magic at Your Doorstep</p>
          </div>
          <div className="footer-social">
            <a href="#">
              <FaFacebook />
            </a>

            <a href="#">
              <RiTwitterXLine />
            </a>

            <a href="#">
              <IoLogoInstagram />
            </a>

            <a href="#">
              <IoLogoTiktok />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Homebody. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
