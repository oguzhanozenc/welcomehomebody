import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import UseScrollToHash from "./hooks/UseScrollToHash";
import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

import Blog from "./components/Blog";
import BlogPost from "./components/BlogPost";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import CheckoutPage from "./components/CheckoutPage";
import Contact from "./components/Contact";
import About from "./components/About";
import ReviewCart from "./components/ReviewCart";

import NotFound from "./components/NotFound";

import PrivateRoute from "./components/PrivateRoute";
import Account from "./components/Account";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { syncCartItems } from "./actions/cartActions";

function App() {
  const dispatch = useDispatch();

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

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "cartItems") {
        const updatedCart = JSON.parse(event.newValue) || [];
        dispatch(syncCartItems(updatedCart));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <UseScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/category/:category" element={<ProductList />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route
          path="/products/search/:searchTerm"
          element={<ProductList showRecent={false} />}
        />
        <Route path="/cart" element={<ReviewCart />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/account" element={<PrivateRoute element={Account} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
