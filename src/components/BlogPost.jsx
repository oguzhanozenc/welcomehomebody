import React from "react";
import { useParams } from "react-router-dom";
import { BlogData } from "./BlogData";
import "../styles/BlogPost.css";

const BlogPost = () => {
  const { slug } = useParams();
  const post = BlogData.find((p) => p.slug === slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="blog-post">
      <h1 className="blogpost-post-title">{post.title}</h1>
      <img src={post.image} alt={post.title} className="blogpost-post-image" />
      <div
        className="blogpost-post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default BlogPost;
