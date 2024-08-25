import { useState, useEffect } from "react";
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
      "./logo-mascot.webp",
      "./logo-mascot-2.webp",
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
      const initialSequence = [0, 1, 2, 3, 4];
      const loopSequence = [3, 4];
      const imageDurations = [1500, 1500, 2500, 2000, 2000, 2000];

      let currentIndex = 0;
      let initialCompleted = false;

      interval = setInterval(() => {
        if (!initialCompleted) {
          setCurrentImage(initialSequence[currentIndex]);
          if (currentIndex === initialSequence.length - 1) {
            initialCompleted = true;
            currentIndex = 0;
            setShowWelcomeText(true);
          } else {
            currentIndex++;
          }
        } else {
          setCurrentImage(loopSequence[currentIndex]);
          currentIndex = (currentIndex + 1) % loopSequence.length;
        }
      }, imageDurations[currentIndex]);
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
            <img
              src="./logo-mascot.webp"
              alt="Logo Mascot"
              className={`image ${currentImage === 3 ? "visible" : "hidden"}`}
            />
            <img
              src="./logo-mascot-2.webp"
              alt="Logo Mascot 2"
              className={`image ${currentImage === 4 ? "visible" : "hidden"}`}
            />
            <img
              src="./city.webp"
              alt="City Background"
              className={`image ${currentImage === 5 ? "visible" : "hidden"}`}
            />

            <div className="background-overlay"></div>
          </>
        )}
      </div>
      {showWelcomeText && (
        <div className="welcome-text">
          <a href="#about" className="explore-btn">
            EXPLORE»
          </a>
        </div>
      )}
    </header>
  );
}
