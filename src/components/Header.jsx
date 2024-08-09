import React, { useState, useEffect } from "react";
import "../styles/Header.css";

export default function Header() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    const imageSources = [
      "./logo-close.webp",
      "./logo-semiclose.webp",
      "./logo-open.webp",
      "./city.webp",
    ];

    let loadedImages = 0;
    const totalImages = imageSources.length;

    const checkAllImagesLoaded = () => {
      loadedImages += 1;
      if (loadedImages === totalImages) {
        setImagesLoaded(true);
        setLoading(false);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllImagesLoaded;
    });
  }, []);

  useEffect(() => {
    let interval;
    if (imagesLoaded) {
      const imageDurations = [1500, 1500, 2500, 1000, 1000];
      const imageSequence = [0, 1, 2, 1, 0];

      let currentIndex = 0;

      interval = setInterval(() => {
        setCurrentImage(imageSequence[currentIndex]);
        currentIndex = (currentIndex + 1) % imageSequence.length;
      }, imageDurations[currentIndex]);

      setTimeout(() => {
        setShowWelcomeText(true);
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  useEffect(() => {
    if (isFirstRender) {
      const timer = setTimeout(() => {
        setIsFirstRender(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isFirstRender]);

  return (
    <header className="header" id="home">
      <div className="header-container">
        {loading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <>
            <img
              src="./logo-close.webp"
              alt="Logo Close"
              className={`image ${currentImage === 0 ? "visible" : "hidden"} ${
                isFirstRender ? "falling" : ""
              }`}
            />
            <img
              src="./logo-semiclose.webp"
              alt="Logo Semi Close"
              className={`image ${currentImage === 1 ? "visible" : "hidden"}`}
            />
            <img
              src="./logo-open.webp"
              alt="Logo Open"
              className={`image ${currentImage === 2 ? "visible" : "hidden"}`}
            />

            <div className="background-overlay"></div>
          </>
        )}
      </div>
      {showWelcomeText && (
        <div className="welcome-text">
          <a href="#apparel" className="explore-btn">
            EXPLORE»
          </a>
        </div>
      )}
    </header>
  );
}
