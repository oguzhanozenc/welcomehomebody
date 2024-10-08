import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import slugify from "slug";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import SectionTitle from "./SectionTitle";
import "../styles/RecentPosts.css";

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const slider = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/data/posts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRecentPosts(data.map((post) => ({ ...post, uuid: uuidv4() })));
        slider.current.slickGoTo(0);
      })
      .catch((error) => console.error("Failed to fetch recent posts:", error));
  }, []);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 765,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handlePrev = () => {
    slider.current.slickPrev();
  };

  const handleNext = () => {
    slider.current.slickNext();
  };

  return (
    <section className="recentposts--section">
      <SectionTitle title="Recent Posts" />
      <div className="window">
        <div className="title-bar">
          <div className="title"></div>
          <div className="window-controls">
            <button>-</button>
            <button>x</button>
          </div>
        </div>
        <div className="recentposts-content">
          <div className="recentposts-container">
            <div className="recent-posts" id="blog">
              <div className="recent-posts-slider">
                <Slider ref={slider} {...settings}>
                  {recentPosts.map((post, index) => (
                    <motion.div
                      key={post.uuid}
                      className="recentpost-unit"
                      style={{
                        filter: index === currentSlide ? "none" : "blur(4px)",
                        opacity: index === currentSlide ? 1 : 0.5,
                        transform:
                          index === currentSlide ? "scale(1.05)" : "scale(1)",
                        zIndex: index === currentSlide ? 1 : 0,
                        transition: "filter 0.5s, opacity 0.5s, transform 0.5s",
                      }}
                      animate={{
                        opacity: index === currentSlide ? 1 : 0.5,
                        scale: index === currentSlide ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Link
                        to={`/blog/${slugify(post.title, { lower: true })}`}
                      >
                        <div className="recentpost-content">
                          <div className="post-thumbnail">
                            <img src={post.thumbnail} alt={post.title} />
                          </div>
                          <div className="post-info">
                            <p>{post.title}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </Slider>
                <div className="custom-arrows">
                  <button
                    className="custom-arrow custom-prev"
                    onClick={handlePrev}
                  >
                    <BsArrowLeftCircleFill />
                  </button>
                  <button
                    className="custom-arrow custom-next"
                    onClick={handleNext}
                  >
                    <BsArrowRightCircleFill />
                  </button>
                </div>
              </div>
              <div className="linktoblog">
                <Link to="/blog" className="btn">
                  View all Posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentPosts;
