import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../styles/ProductDetails.css";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrPrevious, GrNext } from "react-icons/gr";
import { addToCart } from "../actions/cartActions";
import CheckoutButton from "./CheckoutButton";

const ProductDetails = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const slider = useRef(null);
  const location = useLocation();
  const product = location.state?.product;

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  const handlePrev = () => slider.current.slickPrev();
  const handleNext = () => slider.current.slickNext();

  const handleSlideClick = (index) => {
    slider.current.slickGoTo(index);
    setCurrentSlide(index);
  };

  const handleImageClick = () => {
    if (product.images[currentSlide]) {
      setModalImage(product.images[currentSlide]);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage("");
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const handleAddToCart = () => {
    if (product) {
      console.log("Adding to cart:", product);
      fetch("https://quickstart-a4135580.myshopify.com/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: product.variantId, // Ensure this is the correct variant ID
          quantity: 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Update cart state or UI as needed
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="product-details-container">
      <div className="product-page">
        <div className="window retro-window">
          <div className="title-bar">
            <div className="title">{product.title}</div>
            <div className="buttons">
              <div className="button close"></div>
              <div className="button minimize"></div>
              <div className="button maximize"></div>
            </div>
          </div>
          <div className="content">
            <div className="product-details">
              {product.images && product.images.length > 0 && (
                <>
                  {hasMultipleImages ? (
                    <div className="slider-container">
                      <button
                        className="slider-button prev"
                        onClick={handlePrev}
                      >
                        <GrPrevious />
                      </button>
                      <Slider ref={slider} {...settings}>
                        {product.images.map((img, index) => (
                          <motion.div
                            key={index}
                            className="productimg-unit"
                            onClick={() => handleSlideClick(index)}
                            style={{
                              filter:
                                index === currentSlide ? "none" : "blur(4px)",
                              opacity: index === currentSlide ? 1 : 0.5,
                              transform:
                                index === currentSlide
                                  ? "scale(1.05)"
                                  : "scale(1)",
                              zIndex: index === currentSlide ? 1 : 0,
                              transition:
                                "filter 0.5s, opacity 0.5s, transform 0.5s",
                            }}
                            animate={{
                              opacity: index === currentSlide ? 1 : 0.5,
                              scale: index === currentSlide ? 1.05 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            <img
                              src={img}
                              alt={`${product.title} image ${index + 1}`}
                              className="product-image"
                              onClick={
                                index === currentSlide
                                  ? handleImageClick
                                  : undefined
                              }
                            />
                          </motion.div>
                        ))}
                      </Slider>
                      <button
                        className="slider-button next"
                        onClick={handleNext}
                      >
                        <GrNext />
                      </button>
                    </div>
                  ) : (
                    <div className="single-image-container">
                      <img
                        src={product.images[0]}
                        alt={`${product.title} image`}
                        className="product-image"
                        onClick={handleImageClick}
                      />
                    </div>
                  )}
                  {hasMultipleImages && (
                    <div className="thumbnail-preview">
                      {product.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className={`thumbnail ${
                            index === currentSlide ? "active" : ""
                          }`}
                          onClick={() => handleSlideClick(index)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
              {product.videos && product.videos.length > 0 && (
                <div className="product-videos">
                  {product.videos.map((video, index) => (
                    <video
                      key={index}
                      controls
                      src={video}
                      className="product-video"
                    />
                  ))}
                </div>
              )}
              <div className="product-info">
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  {typeof product.price === "object"
                    ? product.price.currencyCode === "USD"
                      ? `${product.price.amount} ${product.price.currencyCode}`
                      : `${product.price.amount} USD`
                    : `${product.price} USD`}
                </p>
                <button className="btn" onClick={handleAddToCart}>
                  BAG IT
                </button>
                {cartItems.length > 0 && <CheckoutButton />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="modal-content">
            <img src={modalImage} alt="Enlarged view" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
