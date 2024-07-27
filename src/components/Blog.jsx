import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BlogData } from "./BlogData";
import "../styles/Blog.css";

const POSTS_PER_PAGE = 5;

const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(BlogData.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = BlogData.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="blog-page">
      <h2 className="section-title">Latest Posts from HomeBody Blog</h2>
      <div className="blogposts-container">
        {currentPosts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="post-link">
            <div className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <button className="blog-read-more-btn">Read More</button>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <div className="subscription">
        <h2 className="subscription-title">Stay Updated on HomeBody Blog</h2>
        <form className="subscription-form">
          <input
            type="email"
            placeholder="Enter your email for updates"
            className="subscription-input"
            required
          />
          <button type="submit" className="subscription-btn">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Blog;
