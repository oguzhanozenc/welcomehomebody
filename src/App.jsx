import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import ProductList from "./components/ProductList";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";
import ScrollToSection from "./components/ScrollToSection";

function App() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.clientHeight;
      const scrollPercentage = scrollTop / (documentHeight - windowHeight);

      const backgroundColor =
        scrollPercentage <= 0.15
          ? "#000"
          : scrollPercentage <= 0.25
          ? "#ffde4d"
          : scrollPercentage <= 0.5
          ? "#ff4c4c"
          : scrollPercentage <= 0.75
          ? "#ffb22c"
          : "#f3feb8";

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
        <Route path="products" element={<ProductList />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
