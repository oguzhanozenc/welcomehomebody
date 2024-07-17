import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import BlogPage from "./components/BlogPage";
import BlogPost from "./components/BlogPost.jsx";
import Navbar from "./components/Navbar";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
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
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
