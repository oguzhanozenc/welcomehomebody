import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails } from "../actions/productActions";
import ProductItem from "./ProductItem";
import Loading from "./Loading";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const {
    productDetails: product,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const slider = useRef(null);

  useEffect(() => {
    if (productId) {
      const fullProductId = `gid://shopify/Product/${productId}`;
      dispatch(fetchProductDetails(fullProductId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
  };

  const handleSlideClick = (index) => {
    slider.current.slickGoTo(index);
    setCurrentSlide(index);
  };

  if (loading)
    return (
      <div className="product-page">
        <Loading />
      </div>
    );
  if (error) return <div className="product-page">Error: {error}</div>;
  if (!product) return <div className="product-page">Product not found.</div>;

  return (
    <div className="product-details-container">
      <ProductItem
        product={product}
        settings={settings}
        currentSlide={currentSlide}
        handleSlideClick={handleSlideClick}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        slider={slider}
      />
    </div>
  );
};

export default ProductDetails;
