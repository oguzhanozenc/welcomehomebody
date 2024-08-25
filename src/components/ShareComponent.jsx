import React, { useState, useEffect, useRef } from "react";
import "../styles/ShareComponent.css";

import { MdOutlineSms } from "react-icons/md";
import { IoCopyOutline, IoLogoReddit, IoLogoWhatsapp } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { FiLinkedin } from "react-icons/fi";
import { PiShareFatFill, PiShareFat } from "react-icons/pi";
import { HiOutlineMail } from "react-icons/hi";

export default function ShareComponent({ url, title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareIconsVisible, setIsShareIconsVisible] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsShareIconsVisible(false);
  };

  const showShareIcons = () => {
    setIsShareIconsVisible(true);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsShareIconsVisible(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopyButtonText("Copied!");
    setTimeout(() => setCopyButtonText("Copy"), 1500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsShareIconsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="share-component" ref={menuRef}>
      <button onClick={toggleMenu} className="share-button">
        <p>
          Share Post <PiShareFatFill />
        </p>
      </button>
      {isMenuOpen && (
        <div className="share-menu">
          <div className="share-menu-top">
            <p onClick={showShareIcons} className="share-post">
              <PiShareFat /> Share
            </p>
            <button id="copylinkbtn" onClick={handleCopyUrl}>
              <IoCopyOutline /> {copyButtonText}
            </button>
          </div>
          {isShareIconsVisible && (
            <div className="share-icons">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  url
                )}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                <RiTwitterXLine /> Twitter
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                <FiLinkedin /> LinkedIn
              </a>
              <a
                className="mobile-only"
                href={`whatsapp://send?text=${encodeURIComponent(
                  title + " - " + url
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                <IoLogoWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://www.reddit.com/submit?url=${encodeURIComponent(
                  url
                )}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
              >
                <IoLogoReddit /> Reddit
              </a>
              <a
                className="mobile-only"
                href={`sms:?&body=${encodeURIComponent(title + " - " + url)}`}
                onClick={handleLinkClick}
              >
                <MdOutlineSms /> SMS
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  title
                )}&body=${encodeURIComponent(url)}`}
                onClick={handleLinkClick}
              >
                <HiOutlineMail /> Email
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
