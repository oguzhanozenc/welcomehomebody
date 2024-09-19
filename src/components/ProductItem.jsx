import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";
import "../styles/ProductItem.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiArrowGoBackFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAndUpdateShopify } from "../actions/cartActions";
import { toast } from "react-toastify";

const ProductItem = ({
  product,
  settings,
  currentSlide,
  handleSlideClick,
  selectedVariant,
  setSelectedVariant,
  slider,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [buttonState, setButtonState] = useState("BAG IT");
  const [isInCart, setIsInCart] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Check if the selected variant is already in the cart
  useEffect(() => {
    if (selectedVariant) {
      const inCart = cartItems.some(
        (item) => item.variant.id === selectedVariant.id
      );
      setIsInCart(inCart);
      setButtonState(inCart ? "In Cart" : "BAG IT");
    }
  }, [cartItems, selectedVariant]);

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

  const handleAddToCartClick = () => {
    if (selectedVariant && selectedVariant.availableForSale) {
      setButtonState("Bagging...");
      dispatch(
        addToCartAndUpdateShopify({
          product,
          variant: selectedVariant,
          quantity: 1,
        })
      )
        .then(() => {
          setButtonState("In Cart");
          setIsInCart(true);
          toast.success("Item added to cart.");
        })
        .catch(() => {
          setButtonState("BAG IT");
          toast.error("Failed to add item to cart. Please try again.");
        });
    } else {
      console.error("Selected variant is unavailable.");
      toast.error("Selected variant is unavailable.");
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
                {product.images.length > 1 ? (
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
              </>
            )}
            <div className="product-info">
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                {selectedVariant && selectedVariant.priceV2
                  ? `${selectedVariant.priceV2.amount} ${selectedVariant.priceV2.currencyCode}`
                  : "Price not available"}
              </p>
              {product.variants && product.variants.length > 1 && (
                <select
                  onChange={(e) => {
                    const variantId = e.target.value;
                    const selected = product.variants.find(
                      (variant) => variant.id === variantId
                    );
                    setSelectedVariant(selected);
                    const inCart = cartItems.some(
                      (item) => item.variant.id === selected.id
                    );
                    setIsInCart(inCart);
                    setButtonState(inCart ? "In Cart" : "BAG IT");
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
                disabled={isSoldOut || buttonState === "Bagging..." || isInCart}
              >
                {isSoldOut ? "SOLD OUT" : buttonState}
              </button>
              {isInCart && (
                <Link to="/cart" className="btn view-cart-button">
                  View Cart
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Enlarged view" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
