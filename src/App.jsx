import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import CheckoutPage from "./components/CheckoutPage";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollToSection from "./components/ScrollToSection";
import NotFound from "./components/NotFound";
import UseScrollToHash from "./hooks/UseScrollToHash";

import "./App.css";

function App() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <UseScrollToHash />
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
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/category/:category" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
