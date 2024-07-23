import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="window">
          <div className="abouttitle-bar">
            <div className="title-bar-text">About Homebody</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div className="window-body">
            <h1 className="about-title">Welcome to Homebody!</h1>
            <p className="about-text">
              At Homebody, we bring the magic of the retro arcade era to your
              doorstep. Born out of a love for all things nostalgic, we are your
              go-to destination for unique, high-quality products that celebrate
              the golden age of gaming. From pixel-perfect apparel to
              vintage-inspired accessories, Homebody is here to turn your home
              into a classic arcade wonderland.
            </p>

            <h2 className="about-subtitle">Our Story</h2>
            <p className="about-text">
              Homebody started with a simple idea: to create a haven for those
              who cherish the 8-bit memories and neon-lit vibes of the past. We
              believe that the essence of the arcade experience is timeless, and
              it deserves a special place in today's world. Our team, passionate
              about retro culture and dedicated to excellence, works tirelessly
              to curate products that bring back those joyful moments of
              yesteryear.
            </p>

            <h2 className="about-subtitle">What We Offer</h2>
            <ul className="about-list">
              <li>
                <strong>Apparel:</strong> Our clothing line is designed for
                those who wear their nostalgia on their sleeves. Featuring
                classic game-inspired graphics, our apparel brings a playful yet
                stylish touch to your wardrobe.
              </li>
              <li>
                <strong>Accessories:</strong> From pixelated keychains to
                retro-styled phone cases, our accessories collection adds a
                splash of arcade charm to your everyday life.
              </li>
            </ul>

            <h2 className="about-subtitle">Our Mission</h2>
            <p className="about-text">
              At Homebody, we are on a mission to rekindle the joy and
              excitement of the arcade era. We strive to provide our customers
              with products that not only look great but also evoke a sense of
              nostalgia and happiness. Our commitment to quality ensures that
              every item you purchase is crafted with care and precision,
              bringing a touch of retro magic into the modern world.
            </p>

            <h2 className="about-subtitle">Join the Homebody Family</h2>
            <p className="about-text">
              Whether you are a lifelong gamer or just discovering the charm of
              retro aesthetics, Homebody has something for everyone. Join our
              community of like-minded enthusiasts and embark on a journey
              through the best of the past, today.
            </p>

            <p className="about-text">
              Thank you for visiting Homebody. Let's make every day a bit more
              retro!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
