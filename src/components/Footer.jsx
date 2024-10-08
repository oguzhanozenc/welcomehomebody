import "../styles/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h2 className="footer-heading">Explore</h2>
          <div className="footer-nav">
            <Link to="/">HOME</Link>
            <Link to="/about">ABOUT</Link>
            <Link to="/products" className="footer-nav-link">
              PRODUCTS
            </Link>
            <Link to="/blog">BLOG</Link>
            <Link to="/contact">CONTACT</Link>
          </div>
        </div>
        <div className="footer-section footer-card">
          <div className="footer-logocontainer">
            <img src="./navbarlogo.png" alt="" />
          </div>
          <div>
            <p className="footer-slogan">
              we got that, we do that, <br />
              we are that.
            </p>
          </div>
          <small className="mail">homebodybiz24@gmail.com</small>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Homebody. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
