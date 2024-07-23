import React, { useState, useEffect } from "react";
import "../styles/Header.css";

export default function Header() {
  const [currentImage, setCurrentImage] = useState(0);
  const [showWelcomeText, setShowWelcomeText] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setCurrentImage(1), 1500),
      setTimeout(() => setCurrentImage(2), 3000),
      setTimeout(() => setCurrentImage(3), 5000),
    ];

    setTimeout(() => {
      setShowWelcomeText(true);
    }, 4500);

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <header className="header" id="home">
      <div className="header-container">
        <img
          src="./logo-close.png"
          alt="Logo Close"
          className={`image ${currentImage === 0 ? "visible" : "hidden"}`}
        />
        <img
          src="./logo-semiclose.png"
          alt="Logo Semi Close"
          className={`image ${currentImage === 1 ? "visible" : "hidden"}`}
        />
        <img
          src="./logo-open.png"
          alt="Logo Open"
          className={`image ${currentImage === 2 ? "visible" : "hidden"}`}
        />
        <img
          src="./logo.png"
          alt="Logo Final"
          className={`image ${
            currentImage === 3 ? "falling visible" : "hidden"
          }`}
        />
        <div className="background-overlay"></div>
      </div>
      {showWelcomeText && (
        <div className="welcome-text">
          <a href="#apparel" className="btn">
            EXPLORE»
          </a>
        </div>
      )}
    </header>
  );
}
