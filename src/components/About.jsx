import { useState } from "react";
import { Link } from "react-router-dom";
import { TbHandClick } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/About.css";

const aboutData = [
  {
    id: "story",
    title: "Our Story",
    logoSrc: "/logo-open.webp",
    paragraphs: [
      "Homebody brings the magic of the retro arcade era to your doorstep. Born out of a love for all things nostalgic, we are your go-to destination for unique, high-quality products that celebrate the golden age of gaming.",
      "Homebody began with a simple goal: to create a haven for fans of 8-bit nostalgia and neon vibes. We believe the arcade experience is timeless and deserves a place in today's world. Our dedicated team curates products that bring back those joyful, retro moments.",
    ],
  },
  {
    id: "mission",
    title: "Our Mission",
    paragraphs: [
      "At Homebody, we aim to reignite the joy of the arcade era with quality products that evoke nostalgia and happiness, blending retro magic with modern style.",
      "Whether you're a lifelong gamer or new to retro charm, Homebody has something for you. Join us and explore the best of the past today.",
    ],
    list: [
      {
        title: "Apparel",
        description:
          "Our clothing line is for those who wear their nostalgia proudly. With classic game-inspired graphics, our apparel adds a playful and stylish touch to your wardrobe.",
      },
      {
        title: "Accessories",
        description:
          "From pixelated keychains to retro phone cases, our accessories add a touch of arcade charm to your everyday life.",
      },
    ],
    endingLine: "LET'S MAKE EVERY DAY A BIT MORE RETRO!",
  },
];

const renderContent = (content) => {
  return (
    <>
      <div className="ourstory-content">
        {content.logoSrc && (
          <div className="logo-container">
            <img
              src={content.logoSrc}
              alt="Homebody Logo"
              className="about-logo"
            />
          </div>
        )}{" "}
        <div className="abouttext-container">
          {content.paragraphs &&
            content.paragraphs.map((text, index) => (
              <p className="about-text" key={index}>
                {text}
              </p>
            ))}
        </div>
      </div>
      {content.list && (
        <ul className="about-list">
          {content.list.map((item, index) => (
            <li key={index}>
              <strong>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      )}
      {content.endingLine && (
        <div className="about-ending-line">
          <Link to="/products">
            <p className="about-text">
              {content.endingLine} <TbHandClick />
            </p>
          </Link>
        </div>
      )}
    </>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState("story");

  const activeContent = aboutData.find((window) => window.id === activeTab);

  return (
    <section className="about-section" id="about">
      <div className="tab-buttons">
        {aboutData.map((window) => (
          <button
            key={window.id}
            onClick={() => setActiveTab(window.id)}
            className={activeTab === window.id ? "active-tab" : ""}
          >
            {window.title}
          </button>
        ))}
      </div>
      <motion.div layout className="window">
        <div className="title-bar">
          <div className="title">{activeContent.title}</div>
          <div className="buttons">
            <div className="button minimize"></div>
            <div className="button maximize"></div>
            <div className="button close"></div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="about-retro-window-body"
            style={{ overflowY: "auto", maxHeight: "60vh" }}
          >
            {renderContent(activeContent)}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default About;
