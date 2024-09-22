import { useState, useEffect } from "react";
import "../styles/Header.css";
import Loading from "./Loading";

// Custom hook to handle the image sequence logic
function useImageSequence(showMainScene, setShowWelcomeText) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (showMainScene) {
      const sequence = [0, 1, 2, 3, 4];
      const imageDurations = [600, 900, 1000, 1000, 1000];
      let currentIndex = 0;

      const interval = setInterval(() => {
        setCurrentImage(sequence[currentIndex]);
        if (currentIndex === 2) {
          setShowWelcomeText(true); // Show welcome text after the third image
        }
        currentIndex = (currentIndex + 1) % sequence.length;
      }, imageDurations[currentIndex]);

      return () => clearInterval(interval);
    }
  }, [showMainScene]);

  return currentImage;
}

export default function Header() {
  const [showPressStart, setShowPressStart] = useState(false);
  const [showMainScene, setShowMainScene] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [loading, setLoading] = useState(true);

  const imageSources = [
    "./logo-close.webp",
    "./logo-semiclose.webp",
    "./logo-open.webp",
    "./logo-mascot.webp",
    "./logo-mascot-2.webp",
    "./city.webp",
  ];

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = imageSources.length;

    const handleImageLoad = () => {
      loadedImages += 1;
      if (loadedImages === totalImages) {
        setLoading(false);
        setTimeout(() => setShowPressStart(true), 500);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleImageLoad;
    });
  }, []);

  const handlePressStart = () => {
    setShowPressStart(false);
    setTimeout(() => setShowMainScene(true), 500);
  };

  const currentImage = useImageSequence(showMainScene, setShowWelcomeText);

  return (
    <header className="header" id="home">
      <div
        className={`header-container ${loading ? "loading" : ""} ${
          showMainScene ? "main-scene" : ""
        }`}
      >
        {loading && (
          <div className="loading-screen fade-out">
            <div className="loading-animation">
              <div className="loading-text">
                <Loading />
              </div>
              <div className="arcade-animation"></div>
            </div>
          </div>
        )}

        {showPressStart && (
          <div className="press-start-screen fade-in">
            <button className="press-start-btn" onClick={handlePressStart}>
              Press Start
            </button>
          </div>
        )}

        {showMainScene && (
          <>
            <div className="background-overlay"></div>
            {imageSources.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Logo Image ${index}`}
                className={`image ${
                  currentImage === index ? "visible" : "hidden"
                }`}
              />
            ))}
            {showWelcomeText && (
              <div className="welcome-text fade-in">
                <a href="/#featuredproducts" className="explore-btn">
                  EXPLORE»
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
}
