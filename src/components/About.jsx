import React from "react";
import { Link } from "react-router-dom";
import "../styles/About.css";
import { TbHandClick } from "react-icons/tb";

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="window">
          <div className="title-bar">
            <div className="title">About Homebody</div>
            <div className="buttons">
              <div className="button close"></div>
              <div className="button minimize"></div>
              <div className="button maximize"></div>
            </div>
          </div>
          <div className="window-body">
            <h1 className="about-title">Welcome to Homebody!</h1>
            <p className="about-text">
              At Homebody, we bring the magic of the retro arcade era to your
              doorstep. Born out of a love for all things nostalgic, we are your
              go-to destination for unique, high-quality products that celebrate
              the golden age of gaming.
            </p>

            <h2 className="about-subtitle">Our Story</h2>
            <p className="about-text">
              Homebody began with a simple goal: to create a haven for fans of
              8-bit nostalgia and neon vibes. We believe the arcade experience
              is timeless and deserves a place in today's world. Our dedicated
              team curates products that bring back those joyful, retro moments.
            </p>

            <h2 className="about-subtitle">What We Offer</h2>
            <ul className="about-list">
              <li>
                <strong>Apparel:</strong> Our clothing line is for those who
                wear their nostalgia proudly. With classic game-inspired
                graphics, our apparel adds a playful and stylish touch to your
                wardrobe.
              </li>
              <li>
                <strong>Accessories:</strong> From pixelated keychains to retro
                phone cases, our accessories add a touch of arcade charm to your
                everyday life.
              </li>
            </ul>

            <h2 className="about-subtitle">Our Mission</h2>
            <p className="about-text">
              At Homebody, we aim to reignite the joy of the arcade era with
              quality products that evoke nostalgia and happiness, blending
              retro magic with modern style.
            </p>

            <h2 className="about-subtitle">Join the Homebody Family</h2>
            <p className="about-text">
              Whether you're a lifelong gamer or new to retro charm, Homebody
              has something for you. Join us and explore the best of the past
              today.
            </p>
            <div className="ending-line">
              <Link to="/products">
                <p className="about-text ">
                  <strong>
                    THANK YOU FOR VISITING HOMEBODY. LET'S MAKE EVERY DAY A BIT
                    MORE RETRO! <TbHandClick />
                  </strong>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
