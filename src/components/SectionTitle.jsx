import { useEffect, useRef, useState } from "react";
import { ReactTyped } from "react-typed";

const SectionTitle = ({ title, className }) => {
  const sectionTitleRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionTitleRef.current) {
      observer.observe(sectionTitleRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="sectiontitle-container" ref={sectionTitleRef}>
      {isVisible && (
        <ReactTyped
          strings={[title]}
          typeSpeed={50}
          backSpeed={30}
          backDelay={1500}
          loop={false}
          showCursor={true}
          className={`sectiontitle ${className}`} // Adding className for styling
        />
      )}
    </div>
  );
};

export default SectionTitle;
