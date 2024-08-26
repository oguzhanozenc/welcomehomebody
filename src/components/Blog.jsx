import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiArrowRightDoubleLine, RiArrowLeftDoubleLine } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import slug from "slug";
import "../styles/Blog.css";
import { FaCircleUser } from "react-icons/fa6";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const postsPerPage = 2;
  const navigate = useNavigate();
  const location = useLocation();

  const getPageNumberFromURL = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page"), 10);
    return page && page > 0 ? page : 1;
  };

  const [currentPage, setCurrentPage] = useState(getPageNumberFromURL());

  useEffect(() => {
    setCurrentPage(getPageNumberFromURL());
  }, [location]);

  useEffect(() => {
    fetch("/data/posts.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error("Failed to fetch posts:", error));
  }, []);

  useEffect(() => {
    navigate(`?page=${currentPage}`);
  }, [currentPage, navigate]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const isLastPage = indexOfLastPost >= posts.length;

  return (
    <section className="blogpage--section">
      <div id="blogsectiontitle">
        <h2 className="section-title">Recent Posts</h2>
      </div>

      <div className="blogpage-postscontainer">
        {currentPosts.map((post, index) => {
          const postUrl = `${window.location.origin}/blog/${slug(post.title, {
            lower: true,
          })}`;
          const postKey = uuidv4();

          return (
            <div className="blogpage-griditem" key={postKey}>
              <Link
                to={`/blog/${slug(post.title, { lower: true })}`}
                className="blogpage-link"
              >
                {" "}
                <div className="window">
                  <div className="title-bar">
                    <div className="buttons">
                      <div className="button close"></div>
                      <div className="button minimize"></div>
                      <div className="button maximize"></div>
                    </div>
                  </div>
                  <div className="blogpage-postunit content">
                    {post.thumbnail && (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        style={{ maxWidth: "100%" }}
                      />
                    )}
                    <div className="blogpage-postcontent">
                      <h2>{post.title}</h2>
                      <div className="blogpage-postinfo">
                        <small id="blogpage-postdate">
                          {new Date(post.date).toLocaleDateString()}
                        </small>
                      </div>
                      <div className="featuredtext">
                        {post.featuredText && (
                          <p>
                            {post.featuredText.length > 150
                              ? `${post.featuredText.substring(0, 150)}...`
                              : post.featuredText}
                          </p>
                        )}
                      </div>
                      <div className="readmorelink">
                        <p className="readmorebtn">
                          Read More
                          <RiArrowRightDoubleLine />
                        </p>
                      </div>
                      <div className="blogpage-bottomcontainer">
                        <div id="blogpage-postauthor">
                          <FaCircleUser />
                          <span>
                            {post?.author
                              ? `${post.author}`
                              : "Offbeat Security"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="pagination" id="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? "disabled" : ""}
        >
          <RiArrowLeftDoubleLine /> Prev
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={isLastPage}
          className={isLastPage ? "disabled" : ""}
        >
          Next <RiArrowRightDoubleLine />
        </button>
      </div>
    </section>
  );
};

export default BlogPage;
