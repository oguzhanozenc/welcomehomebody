import React, { useState, useEffect } from "react";
import "../styles/Header.css";

export default function Header() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const imageSources = [
      "./logo-close.webp",
      "./logo-semiclose.webp",
      "./logo-open.webp",
      "./logo.webp",
      "./city.webp",
    ];

    let loadedImages = 0;
    const totalImages = imageSources.length;

    const checkAllImagesLoaded = () => {
      loadedImages += 1;
      if (loadedImages === totalImages) {
        setImagesLoaded(true);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllImagesLoaded;
    });

    if (imagesLoaded) {
      const timers = [
        setTimeout(() => setCurrentImage(1), 1000),
        setTimeout(() => setCurrentImage(2), 2000),
        setTimeout(() => setCurrentImage(3), 3000),
      ];

      setTimeout(() => {
        setShowWelcomeText(true);
      }, 4500);

      return () => timers.forEach(clearTimeout);
    }
  }, [imagesLoaded]);

  return (
    <header className="header" id="home">
      <div className="header-container">
        <img
          src="./logo-close.webp"
          alt="Logo Close"
          className={`image ${currentImage === 0 ? "visible" : "hidden"}`}
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
        <img
          src="./logo.webp"
          alt="Logo Final"
          className={`image ${
            currentImage === 3 ? "falling visible" : "hidden"
          }`}
        />
        <div className="background-overlay"></div>
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
