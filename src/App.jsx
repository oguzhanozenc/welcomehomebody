import { , useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";

import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";

import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToSection from "./components/ScrollToSection";
import NotFound from "./components/NotFound";
import UseScrollToHash from "./hooks/UseScrollToHash";

import "./App.css";

function App() {
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

  return (
    <BrowserRouter>
      <UseScrollToHash />
      <ScrollToSection />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/category/:category" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
