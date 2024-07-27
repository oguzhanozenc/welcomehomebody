import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";
import Products from "./components/Products";
import CheckoutPage from "./components/CheckoutPage";
import ScrollToSection from "./components/ScrollToSection";
import { BasketProvider } from "./components/BasketContext";

function App() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.clientHeight;

      const scrollPercentage = scrollTop / (documentHeight - windowHeight);

      let backgroundColor;
      if (scrollPercentage <= 0.15) {
        backgroundColor = "#000";
      } else if (scrollPercentage <= 0.25) {
        backgroundColor = "#ffde4d";
      } else if (scrollPercentage <= 0.5) {
        backgroundColor = "#ff4c4c";
      } else if (scrollPercentage <= 0.75) {
        backgroundColor = "#ffb22c";
      } else {
        backgroundColor = "#f3feb8";
      }

      document.body.style.backgroundColor = backgroundColor;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen((prev) => !prev);
  };

  return (
    <BasketProvider>
      <BrowserRouter>
        <ScrollToSection />
        <Navbar isOpen={isNavbarOpen} toggleNavbar={toggleNavbar} />
        <Routes>
          <Route
            path="/"
            element={<Home showOrderNavbar={() => setNavbarOpen(true)} />}
          />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="product/:id"
            element={<ProductPage showNavbar={() => setNavbarOpen(true)} />}
          />
          <Route
            path="products/:filter?"
            element={<Products showNavbar={() => setNavbarOpen(true)} />}
          />
          <Route path="checkout" element={<CheckoutPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </BasketProvider>
  );
}

export default App;
