import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import BlogPage from "./components/BlogPage";
import BlogPost from "./components/BlogPost"; // Import BlogPost
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProductPage from "./components/ProductPage";
import OrderNavbar from "./components/OrderNavbar";
import CheckoutPage from "./components/CheckoutPage";
import Products from "./components/Products";

function App() {
  const [basket, setBasket] = useState([]);
  const [isOrderNavbarOpen, setOrderNavbarOpen] = useState(false);

  const addToBasket = (product) => {
    setBasket((prevBasket) => [...prevBasket, product]);
    setOrderNavbarOpen(true);
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const toggleOrderNavbar = () => {
    setOrderNavbarOpen(!isOrderNavbarOpen);
  };

  return (
    <BrowserRouter>
      <Navbar basket={basket} toggleOrderNavbar={toggleOrderNavbar} />
      <AppContent
        addToBasket={addToBasket}
        basket={basket}
        clearBasket={clearBasket}
        setBasket={setBasket}
        toggleOrderNavbar={toggleOrderNavbar}
      />
      {basket.length > 0 && (
        <OrderNavbar
          basket={basket}
          setBasket={setBasket}
          isOpen={isOrderNavbarOpen}
          toggleNavbar={toggleOrderNavbar}
        />
      )}
    </BrowserRouter>
  );
}

function AppContent({
  addToBasket,
  basket,
  clearBasket,
  setBasket,
  toggleOrderNavbar,
}) {
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.clientHeight;

      const scrollPercentage = scrollTop / (documentHeight - windowHeight);

      let backgroundColor;
      if (scrollPercentage <= 0.25) {
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
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home addToBasket={addToBasket} />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPost />} />{" "}
        <Route path="contact" element={<Contact />} />
        <Route
          path="product/:id"
          element={<ProductPage addToBasket={addToBasket} />}
        />
        <Route
          path="products"
          element={<Products addToBasket={addToBasket} />}
        />
        <Route
          path="checkout"
          element={
            <CheckoutPage
              basket={basket}
              setBasket={setBasket}
              clearBasket={clearBasket}
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
