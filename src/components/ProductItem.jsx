import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";
import "../styles/ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiArrowGoBackFill } from "react-icons/ri";

const ProductItem = ({
  product,
  settings,
  currentSlide,
  handleSlideClick,
  selectedVariant,
  setSelectedVariant,
  handleAddToCart,
  handleRemoveFromCart,
  slider,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [buttonState, setButtonState] = useState("BAG IT");
  const navigate = useNavigate();

  const handleImageClick = () => {
    if (product?.images && product.images[currentSlide]) {
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

  const hasMultipleImages = product?.images && product.images.length > 1;

  const handleAddToCartClick = async () => {
    console.log("Selected Variant:", selectedVariant);
    if (selectedVariant && selectedVariant.availableForSale) {
      setButtonState("Bagging...");
      await handleAddToCart(selectedVariant.id);
      setButtonState("Bagged!");
    } else {
      console.error("Selected variant is unavailable.");
    }
  };

  const handleRemoveFromCartClick = async () => {
    if (selectedVariant) {
      await handleRemoveFromCart(selectedVariant.id);
      setButtonState("BAG IT");
    } else {
      console.error("Selected variant cannot be removed.");
    }
  };

  const isSoldOut = !selectedVariant || !selectedVariant.availableForSale;

  return (
    <div className="product-page">
      <div>
        <button onClick={() => navigate(-1)} className="btn return-link">
          <RiArrowGoBackFill /> GO BACK
        </button>
      </div>
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
                      onClick={() => slider.current.slickPrev()}
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
                            className={`product-image ${
                              isSoldOut ? "sold-out" : ""
                            }`}
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
                      onClick={() => slider.current.slickNext()}
                    >
                      <GrNext />
                    </button>
                  </div>
                ) : (
                  <div className="single-image-container">
                    <img
                      src={product.images[0]}
                      alt={`${product.title} image`}
                      className={`product-image ${isSoldOut ? "sold-out" : ""}`}
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
                        className={`product-thumbnail ${
                          index === currentSlide ? "active" : ""
                        }`}
                        onClick={() => handleSlideClick(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
            <div className="product-info">
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                {typeof product.price === "object"
                  ? `${product.price.amount} ${product.price.currencyCode}`
                  : `${product.price} USD`}
              </p>
              {product.variants && product.variants.length > 1 && (
                <select
                  onChange={(e) => {
                    const variantId = e.target.value;
                    const selected = product.variants.find(
                      (variant) => variant.id === variantId
                    );
                    setSelectedVariant(selected);
                    setButtonState("BAG IT");
                  }}
                  value={selectedVariant?.id}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.title} - {variant.priceV2.amount}{" "}
                      {variant.priceV2.currencyCode}
                    </option>
                  ))}
                </select>
              )}
              <button
                className="btn"
                onClick={handleAddToCartClick}
                disabled={isSoldOut || buttonState === "Bagging..."}
              >
                {isSoldOut ? "SOLD OUT" : buttonState}
              </button>
              <button
                className="btn"
                onClick={handleRemoveFromCartClick} // Adding a remove button
                disabled={!selectedVariant || buttonState === "Bagging..."}
              >
                Remove
              </button>
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

export default ProductItem;
