import { useState, useEffect } from "react";
import "../styles/Header.css";

export default function Header() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showPressStart, setShowPressStart] = useState(false);
  const [showMainScene, setShowMainScene] = useState(false);
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backgroundVisible, setBackgroundVisible] = useState(false);

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
        setTimeout(() => {
          setImagesLoaded(true);
          setLoading(false);
          setBackgroundVisible(true);
          setTimeout(() => {
            setShowPressStart(true);
          }, 500);
        }, 2000);
      }
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = checkAllImagesLoaded;
    });
  }, []);

  const handlePressStart = () => {
    setShowPressStart(false);
    setTimeout(() => {
      setShowMainScene(true);
    }, 500);
  };

  useEffect(() => {
    let interval;
    if (showMainScene) {
      const initialSequence = [0, 1, 2, 3, 4];
      const loopSequence = [3, 4];
      const imageDurations = [1000, 1500, 2500, 2000, 2000, 2000];

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
  }, [showMainScene]);

  return (
    <header className="header" id="home">
      <div
        className={`header-container ${loading ? "loading" : ""} ${
          backgroundVisible ? "background-visible" : ""
        }`}
      >
        {loading && (
          <div className="loading-screen fade-out">
            <div className="loading-animation">
              <div className="loading-text">
                <span>Loading</span>
                <span className="dots">...</span>
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
              src="./logo-mascot.webp"
              alt="Logo Mascot"
              className={`image ${currentImage === 3 ? "visible" : "hidden"}`}
            />
            <img
              src="./logo-mascot-2.webp"
              alt="Logo Mascot 2"
              className={`image ${currentImage === 4 ? "visible" : "hidden"}`}
            />
          </>
        )}
      </div>

      {showWelcomeText && (
        <div className="welcome-text fade-in">
          <a href="#about" className="explore-btn">
            EXPLORE»
          </a>
        </div>
      )}
    </header>
  );
}
