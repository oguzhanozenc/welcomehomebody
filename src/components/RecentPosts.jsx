import React from "react";
import { Link } from "react-router-dom";
import { BlogData } from "./BlogData";
import "../styles/RecentPosts.css";

const RecentPosts = () => {
  return (
    <div className="recent-posts">
      <h2 className="section-title">Latest Posts from HomeBody Blog</h2>
      <div className="posts-container">
        {BlogData.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post.id} className="post-link">
            <div className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <div className="post-content">
                <h3 className="recentpost-title">{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <button className="read-more-btn">Read More</button>
              </div>
            </div>
          </Link>
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

export default RecentPosts;
