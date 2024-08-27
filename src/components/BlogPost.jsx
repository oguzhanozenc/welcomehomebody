import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import slugify from "slug";
import "../styles/BlogPost.css";
import ShareComponent from "./ShareComponent";
import RecentPosts from "./RecentPosts";

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleNavClick = (hash) => {
    if (!isHomePage) {
      navigate(`/#${hash}`);
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    fetch("/data/posts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const foundPost = data.find(
          (post) => slugify(post.title, { lower: true }) === slug
        );

        if (foundPost) {
          setPost(foundPost);
        } else {
          console.error("Post not found.");
        }
      })
      .catch((error) => console.error("Failed to fetch posts:", error));
  }, [slug]);

  return (
    <article className="postpage">
      <section className="blogpost--section">
        <div className="returnlinkcontainer">
          <button id="returnlink" onClick={() => navigate(-1)}>
            Return
          </button>
        </div>
        <div className="blogpost--container">
          <div className="blogpost-contentcontainer">
            {post ? (
              <div>
                <h1 id="blogpost--title">{post.title}</h1>

                {post.featuredText && (
                  <div>
                    <p id="featuredtextpart">{post.featuredText}</p>
                  </div>
                )}

                <div className="blogpost-info">
                  <div className="blogpost-author">
                    <div id="author-avatar">
                      <img src="/logo-open.webp" alt="" />
                    </div>
                    <div id="infotext">
                      <small id="authorname">
                        {post.author ? `${post.author}` : "Offbeat Security"}{" "}
                        <span>
                          <a
                            href="#blog"
                            id="followlink"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick("blog");
                            }}
                          >
                            · Follow
                          </a>
                        </span>
                      </small>

                      {post.date && (
                        <small id="blogpost-date">
                          {new Date(post.date).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {post.thumbnail && (
                  <div className="blogpost--thumbnail">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="thumbnail"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}

            {post?.content && (
              <section
                className="blogpost-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
            <div className="blogpost-bottom">
              <div className="blogpost--meta">
                {post?.tags && (
                  <ul>
                    {post.tags.map((tag, index) => (
                      <li key={index}>{tag}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="share-container">
                {post && (
                  <ShareComponent
                    url={window.location.href}
                    title={post.title}
                  />
                )}
              </div>
            </div>
            {post && (
              <>
                <meta
                  name="description"
                  content={post.featuredText || post.title}
                />
                <meta name="author" content={post.author} />
                <meta name="keywords" content={post.tags.join(",")} />
              </>
            )}
          </div>
        </div>
      </section>
      <div className="recentpostscontainer">
        <RecentPosts />
      </div>
    </article>
  );
};

export default BlogPost;
